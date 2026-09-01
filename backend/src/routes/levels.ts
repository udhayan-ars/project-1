import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/levels (and /api/levels/modules)
router.get('/modules', authenticateToken, (req: AuthRequest, res): any => {
  const modules = db.prepare('SELECT * FROM modules ORDER BY order_index ASC').all();
  return res.json({ modules });
});

// GET /api/levels
router.get('/', authenticateToken, (req: AuthRequest, res): any => {
  const userId = req.user?.id;

  const levels = db.prepare(`
    SELECT 
      l.*,
      m.title as module_title,
      m.slug as module_slug,
      m.zone_name,
      COALESCE(up.status, 'locked') as user_status,
      COALESCE(up.highest_score, 0) as highest_score
    FROM levels l
    JOIN modules m ON l.module_id = m.id
    LEFT JOIN user_progress up ON l.id = up.level_id AND up.user_id = ?
    ORDER BY l.level_number ASC
  `).all(userId) as any[];

  // Ensure level 1 is accessible if no user progress row
  const processedLevels = levels.map((lvl, index) => {
    let status = lvl.user_status;
    if (lvl.level_number === 1 && status === 'locked') {
      status = 'current';
    }
    return {
      ...lvl,
      user_status: status,
      is_locked: status === 'locked'
    };
  });

  return res.json({ levels: processedLevels });
});

// GET /api/levels/:id
router.get('/:id', authenticateToken, (req: AuthRequest, res): any => {
  const levelId = parseInt(req.params.id as string, 10);
  const userId = req.user?.id;

  const level = db.prepare(`
    SELECT 
      l.*,
      m.title as module_title,
      m.slug as module_slug,
      m.zone_name,
      COALESCE(up.status, 'locked') as user_status,
      COALESCE(up.highest_score, 0) as highest_score
    FROM levels l
    JOIN modules m ON l.module_id = m.id
    LEFT JOIN user_progress up ON l.id = up.level_id AND up.user_id = ?
    WHERE l.id = ?
  `).get(userId, levelId) as any;

  if (!level) {
    return res.status(404).json({ error: 'Level not found' });
  }

  // Fetch lesson
  let lesson = db.prepare('SELECT * FROM lessons WHERE level_id = ?').get(levelId) as any;
  if (lesson) {
    lesson.key_takeaways = JSON.parse(lesson.key_takeaways_json || '[]');
  } else {
    // Scaffold default lesson markdown if beyond level 3
    lesson = {
      overview_md: `### ${level.title}\n\nThis level covers in-depth operational concepts for **${level.summary}**.\n\n#### Core Learning Objectives:\n1. Understand underlying attack and defense mechanics.\n2. Analyze relevant event telemetry and network indicators.\n3. Execute standard containment and validation playbooks.`,
      key_takeaways: [
        'Analyze system indicators and alert telemetry carefully.',
        'Follow structured SOC L1 triage workflows to avoid false negatives.',
        'Document all indicators of compromise (IOCs) with precise timestamps.'
      ],
      practical_brief_md: `#### Practical Lab:\nExecute the inspection tasks in the terminal lab to verify your findings for ${level.title}.`,
      diagram_svg: 'default-cyber'
    };
  }

  // Fetch practical lab
  let lab = db.prepare('SELECT * FROM practical_labs WHERE level_id = ?').get(levelId) as any;
  if (lab) {
    lab.initial_state = JSON.parse(lab.initial_state_json || '{}');
    lab.validation_rules = JSON.parse(lab.validation_rules_json || '{}');
  }

  // Check assessment metadata
  const assessment = db.prepare('SELECT id, passing_score, time_limit_seconds FROM assessments WHERE level_id = ?').get(levelId) as any;

  return res.json({
    level,
    lesson,
    lab,
    assessment: assessment || { id: `asm-${levelId}`, passing_score: 70, time_limit_seconds: 600 }
  });
});

export default router;
