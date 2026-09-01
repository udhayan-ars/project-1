import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === '') {
    throw new Error('FATAL: JWT_SECRET environment variable is not defined.');
  }
  return secret;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { id: string; username: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Access denied: Administrator privileges required' });
    return;
  }
  next();
}

export function logAudit(userId: string | null, action: string, resource: string, ip?: string, userAgent?: string) {
  try {
    const id = 'audit-' + Math.random().toString(36).substring(2, 9) + Date.now();
    db.prepare('INSERT INTO audit_logs (id, user_id, action, resource, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)').run(
      id,
      userId,
      action,
      resource,
      ip || '127.0.0.1',
      userAgent || 'Internal API'
    );
  } catch (err) {
    console.error('Audit log failure:', err);
  }
}
