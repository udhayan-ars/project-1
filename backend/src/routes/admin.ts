import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Require Admin authorization for all subroutes
router.use(authenticateToken, requireAdmin);

// GET /api/admin/overview
router.get('/overview', (req: AuthRequest, res): any => {
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  const totalAttempts = db.prepare('SELECT COUNT(*) as count FROM assessment_attempts').get() as { count: number };
  const totalReports = db.prepare('SELECT COUNT(*) as count FROM reports').get() as { count: number };
  const avgReadiness = db.prepare('SELECT AVG(soc_readiness) as avg_readiness FROM users').get() as { avg_readiness: number };
  const tabSwitchEvents = db.prepare('SELECT COUNT(*) as count FROM tab_switch_events').get() as { count: number };

  const recentUsers = db.prepare('SELECT id, full_name, username, email, role, xp, current_level, soc_readiness, created_at FROM users ORDER BY created_at DESC LIMIT 10').all();
  const recentAudits = db.prepare('SELECT a.*, u.username FROM audit_logs a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.timestamp DESC LIMIT 15').all();

  return res.json({
    metrics: {
      totalUsers: totalUsers.count,
      totalAttempts: totalAttempts.count,
      totalReports: totalReports.count,
      avgReadiness: Math.round(avgReadiness?.avg_readiness || 0),
      tabSwitchEvents: tabSwitchEvents.count
    },
    recentUsers,
    recentAudits
  });
});

// GET /api/admin/users
router.get('/users', (req: AuthRequest, res): any => {
  const users = db.prepare(`
    SELECT 
      u.id, u.full_name, u.username, u.email, u.role, u.xp, u.current_level, u.soc_readiness, u.created_at,
      (SELECT COUNT(*) FROM user_progress WHERE user_id = u.id AND status = 'completed') as completed_levels_count,
      (SELECT COUNT(*) FROM tab_switch_events WHERE user_id = u.id) as cheating_flags_count
    FROM users u
    ORDER BY u.created_at DESC
  `).all();

  return res.json({ users });
});

// GET /api/admin/audit-logs
router.get('/audit-logs', (req: AuthRequest, res): any => {
  const { limit = 50 } = req.query;
  const logs = db.prepare(`
    SELECT a.*, u.username, u.email
    FROM audit_logs a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.timestamp DESC
    LIMIT ?
  `).all(parseInt(limit as string, 10) || 50);

  return res.json({ logs });
});

// GET /api/admin/reports
router.get('/reports', (req: AuthRequest, res): any => {
  const reports = db.prepare(`
    SELECT r.*, rs.total_score, rs.feedback_md, u.full_name as author_name, u.username
    FROM reports r
    LEFT JOIN report_scores rs ON r.id = rs.report_id
    JOIN users u ON r.user_id = u.id
    ORDER BY r.submitted_at DESC
  `).all();

  return res.json({ reports });
});

export default router;
