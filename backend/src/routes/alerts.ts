import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticateToken, AuthRequest, logAudit } from '../middleware/auth.js';
import { checkAndAwardBadges } from '../services/evaluationService.js';

const router = Router();

// Middleware: Enforce that Practical SOC Arena unlocks ONLY after completing all 100 learning levels
function requireCompletedAllLevels(req: AuthRequest, res: any, next: any) {
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (userRole === 'admin') {
    return next();
  }

  const progressRow = db.prepare(`
    SELECT COUNT(DISTINCT level_id) as completed_count 
    FROM user_progress 
    WHERE user_id = ? AND status = 'completed'
  `).get(userId) as { completed_count: number };

  const completedCount = progressRow?.completed_count || 0;

  if (completedCount < 100) {
    return res.status(403).json({
      error: 'Practical SOC Arena is locked',
      message: `Complete all 100 levels to unlock the Practical SOC Arena (Let's Defend). Current progress: ${completedCount}/100 levels completed.`,
      completedCount,
      requiredLevels: 100,
      isLocked: true
    });
  }

  next();
}

// GET /api/alerts/access-status (Check eligibility without 403)
router.get('/access-status', authenticateToken, (req: AuthRequest, res): any => {
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (userRole === 'admin') {
    return res.json({ isUnlocked: true, completedCount: 100, requiredLevels: 100, role: 'admin' });
  }

  const progressRow = db.prepare(`
    SELECT COUNT(DISTINCT level_id) as completed_count 
    FROM user_progress 
    WHERE user_id = ? AND status = 'completed'
  `).get(userId) as { completed_count: number };

  const completedCount = progressRow?.completed_count || 0;

  return res.json({
    isUnlocked: completedCount >= 100,
    completedCount,
    requiredLevels: 100
  });
});

// GET /api/alerts (Protected by level completion gate)
router.get('/', authenticateToken, requireCompletedAllLevels, (req: AuthRequest, res): any => {
  const alerts = db.prepare('SELECT id, alert_code, title, severity, category, source_ip, dest_ip, description, mitre_technique FROM alerts').all();
  return res.json({ alerts });
});

// GET /api/alerts/:id (Protected by level completion gate)
router.get('/:id', authenticateToken, requireCompletedAllLevels, (req: AuthRequest, res): any => {
  const alert = db.prepare('SELECT * FROM alerts WHERE id = ? OR alert_code = ?').get(req.params.id, req.params.id) as any;

  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }

  return res.json({
    alert: {
      ...alert,
      evidence_required: JSON.parse(alert.evidence_required_json || '[]'),
      hints: JSON.parse(alert.hints_json || '[]')
    }
  });
});

// GET /api/logs (Paginated & Filterable - Protected by level completion gate)
router.get('/data/logs', authenticateToken, requireCompletedAllLevels, (req: AuthRequest, res): any => {
  const { category, severity, event_id, search, limit = 50, offset = 0 } = req.query;

  let query = 'SELECT * FROM logs WHERE 1=1';
  const params: any[] = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (severity) {
    query += ' AND severity = ?';
    params.push(severity);
  }

  if (event_id) {
    query += ' AND event_id = ?';
    params.push(event_id);
  }

  if (search) {
    query += ' AND (message LIKE ? OR source_ip LIKE ? OR dest_ip LIKE ? OR hostname LIKE ? OR username LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s, s, s);
  }

  const countQuery = query.replace('SELECT * FROM logs', 'SELECT COUNT(*) as total FROM logs');
  const countResult = db.prepare(countQuery).get(...params) as { total: number };

  query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit as string, 10) || 50, parseInt(offset as string, 10) || 0);

  const logs = db.prepare(query).all(...params) as any[];

  return res.json({
    total: countResult ? countResult.total : 0,
    limit: parseInt(limit as string, 10) || 50,
    offset: parseInt(offset as string, 10) || 0,
    logs: logs.map(l => ({
      ...l,
      raw_payload: l.raw_payload_json ? JSON.parse(l.raw_payload_json) : null
    }))
  });
});

// POST /api/alerts/investigate (Protected by level completion gate)
router.post('/investigate', authenticateToken, requireCompletedAllLevels, (req: AuthRequest, res): any => {
  const userId = req.user?.id;
  const { alertId, decision, reasoning, evidenceSelected = [], recommendedAction } = req.body;

  if (!alertId || !decision || !reasoning) {
    return res.status(400).json({ error: 'Alert ID, decision (True Positive/False Positive), and reasoning are required' });
  }

  const alert = db.prepare('SELECT * FROM alerts WHERE id = ? OR alert_code = ?').get(alertId, alertId) as any;
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }

  const isDecisionCorrect = decision.trim().toLowerCase() === alert.expected_decision.trim().toLowerCase();
  const reasoningQuality = reasoning.length > 30 ? 1 : 0.5;

  let score = 0;
  if (isDecisionCorrect) {
    score = reasoningQuality === 1 ? 100 : 75;
  } else {
    score = 25;
  }

  const investigationId = 'inv-' + Math.random().toString(36).substring(2, 9) + Date.now();
  db.prepare(`
    INSERT INTO investigations (id, user_id, alert_id, decision, reasoning_text, evidence_selected_json, recommended_action, score, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).run(
    investigationId,
    userId,
    alert.id,
    decision,
    reasoning,
    JSON.stringify(evidenceSelected),
    recommendedAction || 'Escalate to Tier 2 Incident Response',
    score
  );

  const newBadges = checkAndAwardBadges(userId!);
  logAudit(userId!, 'ALERT_INVESTIGATION_SUBMITTED', `alert-${alert.alert_code}`, req.ip, req.headers['user-agent']);

  return res.json({
    investigationId,
    isCorrect: isDecisionCorrect,
    score,
    expectedDecision: alert.expected_decision,
    conceptExplanation: alert.concept_explanation_md,
    attackNarrative: alert.attack_narrative,
    newBadges
  });
});

export default router;
