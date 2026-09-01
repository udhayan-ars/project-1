import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/progress/dashboard
router.get('/dashboard', authenticateToken, (req: AuthRequest, res): any => {
  const userId = req.user?.id;

  const user = db.prepare('SELECT id, full_name, username, email, role, xp, current_level, streak_days, soc_readiness, mindset_completed FROM users WHERE id = ?').get(userId) as any;

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Count completed levels
  const completedProgress = db.prepare("SELECT COUNT(*) as count, AVG(highest_score) as avg_score FROM user_progress WHERE user_id = ? AND status = 'completed'").get(userId) as any;
  const completedLevels = completedProgress?.count || 0;
  const avgExamScore = Math.round(completedProgress?.avg_score || 0);

  // Weak Topics
  const weakTopics = db.prepare('SELECT topic_tag, accuracy_percentage, needs_revision, attempts_count FROM weak_topics WHERE user_id = ? ORDER BY accuracy_percentage ASC').all(userId) as any[];

  // Badges
  const userBadges = db.prepare(`
    SELECT b.*, ub.awarded_at
    FROM badges b
    JOIN user_badges ub ON b.id = ub.badge_id
    WHERE ub.user_id = ?
    ORDER BY ub.awarded_at DESC
  `).all(userId);

  const allBadges = db.prepare('SELECT * FROM badges').all();

  // Recent Assessment attempts
  const recentAttempts = db.prepare(`
    SELECT aa.*, l.level_number, l.title as level_title
    FROM assessment_attempts aa
    JOIN assessments a ON aa.assessment_id = a.id
    JOIN levels l ON a.level_id = l.id
    WHERE aa.user_id = ?
    ORDER BY aa.started_at DESC
    LIMIT 5
  `).all(userId);

  // Practical performance
  const labAttemptsCount = db.prepare('SELECT COUNT(*) as count FROM lab_attempts WHERE user_id = ?').get(userId) as any;
  const investigationsCount = db.prepare('SELECT COUNT(*) as count FROM investigations WHERE user_id = ?').get(userId) as any;
  const reportsCount = db.prepare('SELECT COUNT(*) as count, AVG(total_score) as avg_score FROM report_scores rs JOIN reports r ON rs.report_id = r.id WHERE r.user_id = ?').get(userId) as any;

  return res.json({
    user,
    stats: {
      currentLevel: user.current_level,
      completedLevels,
      remainingLevels: Math.max(0, 100 - completedLevels),
      xp: user.xp,
      avgExamScore,
      socReadiness: user.soc_readiness,
      labAttempts: labAttemptsCount?.count || 0,
      investigationsCount: investigationsCount?.count || 0,
      reportsCount: reportsCount?.count || 0,
      avgReportScore: Number((reportsCount?.avg_score || 0).toFixed(2))
    },
    weakTopics: weakTopics.map(wt => ({
      ...wt,
      statusLabel: wt.accuracy_percentage >= 95 ? 'Mastered' : wt.accuracy_percentage >= 80 ? 'Passed' : wt.accuracy_percentage >= 60 ? 'Review Recommended' : 'Needs Revision'
    })),
    badges: {
      earned: userBadges,
      all: allBadges,
      earnedCount: userBadges.length,
      totalCount: allBadges.length
    },
    recentAttempts
  });
});

export default router;
