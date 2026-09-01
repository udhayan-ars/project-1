import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../config/db.js';
import { authenticateToken, AuthRequest, logAudit } from '../middleware/auth.js';

const router = Router();

// GET /api/certificates (User certificate or generate if eligible)
router.get('/', authenticateToken, (req: AuthRequest, res): any => {
  const userId = req.user?.id;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if certificate already exists
  let certificate = db.prepare('SELECT * FROM certificates WHERE user_id = ?').get(userId) as any;

  if (!certificate) {
    // Check eligibility (completed levels count and average score or readiness)
    const completedProgress = db.prepare("SELECT COUNT(*) as count, AVG(highest_score) as avg_score FROM user_progress WHERE user_id = ? AND status = 'completed'").get(userId) as any;
    const completedCount = completedProgress ? completedProgress.count : 0;

    // Generate certificate if completed at least 3 MVP levels or readiness > 50
    if (completedCount >= 3 || user.soc_readiness >= 50 || user.role === 'admin') {
      const certCode = 'LMCYS-CERT-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + (1000 + Math.floor(Math.random() * 9000));
      const hash = crypto.createHash('sha256').update(user.id + certCode + Date.now()).digest('hex').substring(0, 16);
      const score = Math.max(85, Math.round(completedProgress?.avg_score || 90));

      const certId = 'cert-' + Math.random().toString(36).substring(2, 9);
      db.prepare(`
        INSERT INTO certificates (id, user_id, certificate_code, title, issue_date, final_score, verification_hash)
        VALUES (?, ?, ?, 'Certified SOC Level 1 Cyber Defender', CURRENT_TIMESTAMP, ?, ?)
      `).run(certId, userId, certCode, score, hash);

      certificate = db.prepare('SELECT * FROM certificates WHERE id = ?').get(certId);
      logAudit(userId || null, 'CERTIFICATE_GENERATED', certCode, req.ip, req.headers['user-agent']);
    }
  }

  return res.json({
    eligible: !!certificate,
    certificate: certificate ? {
      ...certificate,
      student_name: user.full_name,
      username: user.username,
      verification_url: `${req.protocol}://${req.get('host')}/verify/${certificate.certificate_code}`
    } : null,
    requirements: {
      completedLevels: db.prepare("SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND status = 'completed'").get(userId),
      requiredLevels: 3,
      socReadiness: user.soc_readiness
    }
  });
});

// GET /api/certificates/verify/:code (Public verification endpoint)
router.get('/verify/:code', (req, res): any => {
  const { code } = req.params;
  const certificate = db.prepare(`
    SELECT c.*, u.full_name as student_name, u.username
    FROM certificates c
    JOIN users u ON c.user_id = u.id
    WHERE c.certificate_code = ? OR c.verification_hash = ?
  `).get(code, code) as any;

  if (!certificate) {
    return res.status(404).json({ valid: false, error: 'Certificate not found or invalid verification code.' });
  }

  return res.json({
    valid: true,
    certificate: {
      code: certificate.certificate_code,
      student_name: certificate.student_name,
      title: certificate.title,
      score: certificate.final_score,
      issue_date: certificate.issue_date,
      verification_hash: certificate.verification_hash,
      issuer: 'LMCYS Cyber Defense Training Directorate'
    }
  });
});

export default router;
