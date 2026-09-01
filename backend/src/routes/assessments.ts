import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticateToken, AuthRequest, logAudit } from '../middleware/auth.js';
import { updateWeakTopics, checkAndAwardBadges } from '../services/evaluationService.js';

const router = Router();

// GET /api/assessments/:levelId
router.get('/:levelId', authenticateToken, (req: AuthRequest, res): any => {
  const levelId = parseInt(req.params.levelId as string, 10);

  const questions = db.prepare('SELECT id, level_id, type, question_text, points, topic_tag FROM questions WHERE level_id = ?').all(levelId) as any[];

  if (questions.length === 0) {
    // If no questions in DB for later levels, provide standard quiz questions
    return res.json({
      assessment: {
        id: `asm-${levelId}`,
        level_id: levelId,
        passing_score: 70,
        time_limit_seconds: 600
      },
      questions: [
        {
          id: `q-${levelId}-1`,
          type: 'mcq',
          question_text: `What is the primary indicator of compromise associated with Level ${levelId} concepts?`,
          points: 50,
          topic_tag: 'Detection & Analysis',
          options: [
            { id: `opt-${levelId}-1-1`, option_text: 'Anomalous telemetry spikes outside baseline operating hours' },
            { id: `opt-${levelId}-1-2`, option_text: 'Expected administrative maintenance scripts' },
            { id: `opt-${levelId}-1-3`, option_text: 'Standard DNS queries to internal domain controllers' }
          ]
        },
        {
          id: `q-${levelId}-2`,
          type: 'mcq',
          question_text: 'What should a SOC L1 analyst do immediately upon identifying a confirmed high-severity True Positive?',
          points: 50,
          topic_tag: 'SOC Triage',
          options: [
            { id: `opt-${levelId}-2-1`, option_text: 'Initiate host containment, isolate the endpoint, and escalate to Tier 2 IR' },
            { id: `opt-${levelId}-2-2`, option_text: 'Ignore the alert and let the host continue communicating' },
            { id: `opt-${levelId}-2-3`, option_text: 'Delete the audit log files immediately' }
          ]
        }
      ]
    });
  }

  const getOptions = db.prepare('SELECT id, question_id, option_text FROM question_options WHERE question_id = ?');

  const questionsWithOptions = questions.map(q => {
    const options = getOptions.all(q.id);
    return {
      ...q,
      options
    };
  });

  const assessment = db.prepare('SELECT * FROM assessments WHERE level_id = ?').get(levelId) || {
    id: `asm-${levelId}`,
    level_id: levelId,
    passing_score: 70,
    time_limit_seconds: 600
  };

  return res.json({ assessment, questions: questionsWithOptions });
});

// POST /api/assessments/:levelId/submit
router.post('/:levelId/submit', authenticateToken, (req: AuthRequest, res): any => {
  const levelId = parseInt(req.params.levelId as string, 10);
  const userId = req.user?.id;
  const { answers, tabViolations = 0, timeTakenSeconds = 0 } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let totalPoints = 0;
  let earnedPoints = 0;
  const questionResults: { id: string; topic: string; isCorrect: boolean; explanation: string }[] = [];

  // Check DB questions
  const dbQuestions = db.prepare('SELECT * FROM questions WHERE level_id = ?').all(levelId) as any[];

  if (dbQuestions.length > 0) {
    dbQuestions.forEach(q => {
      totalPoints += q.points;
      const userSelectedOptionId = answers ? answers[q.id] : null;

      const correctOption = db.prepare('SELECT id, option_text, explanation FROM question_options WHERE question_id = ? AND is_correct = 1').get(q.id) as any;
      const isCorrect = correctOption && userSelectedOptionId === correctOption.id;

      if (isCorrect) {
        earnedPoints += q.points;
      }

      questionResults.push({
        id: q.id,
        topic: q.topic_tag,
        isCorrect: !!isCorrect,
        explanation: q.explanation || (correctOption ? correctOption.explanation : '')
      });
    });
  } else {
    // Dynamic grading for fallback questions
    totalPoints = 100;
    const q1Ans = answers ? answers[`q-${levelId}-1`] : null;
    const q2Ans = answers ? answers[`q-${levelId}-2`] : null;

    const isQ1Correct = q1Ans === `opt-${levelId}-1-1`;
    const isQ2Correct = q2Ans === `opt-${levelId}-2-1`;

    if (isQ1Correct) earnedPoints += 50;
    if (isQ2Correct) earnedPoints += 50;

    questionResults.push(
      { id: `q-${levelId}-1`, topic: 'Detection & Analysis', isCorrect: isQ1Correct, explanation: 'Anomalous spikes indicate suspicious adversarial behavior.' },
      { id: `q-${levelId}-2`, topic: 'SOC Triage', isCorrect: isQ2Correct, explanation: 'Host isolation and escalation prevents lateral movement.' }
    );
  }

  // Calculate score with anti-cheat penalty (-10 marks per tab violation per PRD spec)
  let rawScore = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  const penalty = tabViolations * 10;
  if (penalty > 0) {
    rawScore = Math.max(0, rawScore - penalty);
  }

  const finalScore = Number(rawScore.toFixed(1));
  const passed = finalScore >= 95; // 95% Pass Requirement per PRD Section 10

  // Record attempt
  const attemptId = 'att-' + Math.random().toString(36).substring(2, 9) + Date.now();
  db.prepare(`
    INSERT INTO assessment_attempts (id, user_id, assessment_id, score, passed, tab_violations_count, started_at, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-' || ? || ' seconds'), CURRENT_TIMESTAMP)
  `).run(attemptId, userId, `asm-${levelId}`, finalScore, passed ? 1 : 0, tabViolations, timeTakenSeconds);

  // Update Weak Topics
  updateWeakTopics(userId, questionResults);

  // If passed, award XP, unlock next level, and check badges
  let xpAwarded = 0;
  if (passed) {
    const levelRow = db.prepare('SELECT xp_reward FROM levels WHERE id = ?').get(levelId) as any;
    xpAwarded = levelRow ? levelRow.xp_reward : 100;

    // Update user progress for this level
    const existingProgress = db.prepare('SELECT * FROM user_progress WHERE user_id = ? AND level_id = ?').get(userId, levelId) as any;
    if (existingProgress) {
      const highest = Math.max(existingProgress.highest_score, finalScore);
      db.prepare("UPDATE user_progress SET status = 'completed', highest_score = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?").run(highest, existingProgress.id);
    } else {
      const progId = 'prog-' + Math.random().toString(36).substring(2, 9);
      db.prepare("INSERT INTO user_progress (id, user_id, level_id, status, highest_score, completed_at) VALUES (?, ?, ?, 'completed', ?, CURRENT_TIMESTAMP)").run(progId, userId, levelId, finalScore);
    }

    // Unlock next level (levelId + 1)
    const nextLevelId = levelId + 1;
    if (nextLevelId <= 100) {
      const nextProgress = db.prepare('SELECT * FROM user_progress WHERE user_id = ? AND level_id = ?').get(userId, nextLevelId) as any;
      if (!nextProgress) {
        const nextProgId = 'prog-' + Math.random().toString(36).substring(2, 9);
        db.prepare("INSERT INTO user_progress (id, user_id, level_id, status, highest_score) VALUES (?, ?, ?, 'current', 0.0)").run(nextProgId, userId, nextLevelId);
      } else if (nextProgress.status === 'locked') {
        db.prepare("UPDATE user_progress SET status = 'current' WHERE id = ?").run(nextProgress.id);
      }

      // Update current_level in users table
      db.prepare('UPDATE users SET current_level = MAX(current_level, ?) WHERE id = ?').run(nextLevelId, userId);
    }

    // Add XP to user
    db.prepare('UPDATE users SET xp = xp + ? WHERE id = ?').run(xpAwarded, userId);
  }

  const newBadges = checkAndAwardBadges(userId);
  const updatedUser = db.prepare('SELECT id, xp, current_level, soc_readiness FROM users WHERE id = ?').get(userId);

  logAudit(userId, 'ASSESSMENT_SUBMITTED', `level-${levelId}`, req.ip, req.headers['user-agent']);

  return res.json({
    attemptId,
    finalScore,
    percentageScore: finalScore,
    score: finalScore,
    passed,
    penaltyApplied: penalty,
    tabViolations,
    xpAwarded: passed ? xpAwarded : 0,
    newBadges,
    questionResults,
    user: updatedUser
  });
});

// POST /api/assessments/tab-switch
router.post('/tab-switch', authenticateToken, (req: AuthRequest, res): any => {
  const { assessmentId, eventType } = req.body;
  const userId = req.user?.id;

  if (userId && assessmentId) {
    const id = 'ts-' + Math.random().toString(36).substring(2, 9) + Date.now();
    db.prepare('INSERT INTO tab_switch_events (id, user_id, assessment_id, event_type) VALUES (?, ?, ?, ?)').run(
      id,
      userId,
      assessmentId,
      eventType || 'tab_switch'
    );
  }

  return res.json({ recorded: true });
});

export default router;
