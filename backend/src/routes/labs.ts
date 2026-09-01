import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticateToken, AuthRequest, logAudit } from '../middleware/auth.js';

const router = Router();

// GET /api/labs/:levelId
router.get('/:levelId', authenticateToken, (req: AuthRequest, res): any => {
  const levelId = parseInt(req.params.levelId as string, 10);
  const lab = db.prepare('SELECT * FROM practical_labs WHERE level_id = ?').get(levelId) as any;

  if (!lab) {
    return res.status(404).json({ error: 'Practical lab not found for this level' });
  }

  return res.json({
    lab: {
      ...lab,
      initial_state: JSON.parse(lab.initial_state_json || '{}'),
      validation_rules: JSON.parse(lab.validation_rules_json || '{}')
    }
  });
});

// POST /api/labs/:levelId/submit
router.post('/:levelId/submit', authenticateToken, (req: AuthRequest, res): any => {
  const levelId = parseInt(req.params.levelId as string, 10);
  const userId = req.user?.id;
  const { commandHistory = [], finalOutput = '' } = req.body;

  const lab = db.prepare('SELECT * FROM practical_labs WHERE level_id = ?').get(levelId) as any;
  if (!lab) {
    return res.status(404).json({ error: 'Lab not found' });
  }

  const id = 'lab-att-' + Math.random().toString(36).substring(2, 9) + Date.now();
  db.prepare('INSERT INTO lab_attempts (id, user_id, lab_id, completed, history_json) VALUES (?, ?, ?, 1, ?)').run(
    id,
    userId,
    lab.id,
    JSON.stringify({ commandHistory, finalOutput })
  );

  logAudit(userId || null, 'LAB_COMPLETED', `level-${levelId}-lab`, req.ip, req.headers['user-agent']);

  return res.json({
    message: 'Lab mission completed successfully!',
    xpBonus: 50,
    labId: lab.id
  });
});

export default router;
