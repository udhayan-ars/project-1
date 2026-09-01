import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { authenticateToken, AuthRequest, logAudit } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { 
  saveCadetProfile, 
  findCadetByEmail, 
  CadetProfile, 
  ensureDatabaseDir 
} from '../services/fileDatabaseService.js';

const router = Router();

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === '') {
    throw new Error('FATAL: JWT_SECRET environment variable is not defined.');
  }
  return secret;
}

// Email format regex validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Collision-safe username generation helper
export function generateUniqueUsername(email: string): string {
  const base = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
  let candidate = base;
  let counter = 1;
  while (db.prepare('SELECT id FROM users WHERE LOWER(username) = ?').get(candidate)) {
    counter++;
    candidate = `${base}_${counter}`;
  }
  return candidate;
}

// POST /api/auth/register - Join Academy
router.post('/register', authLimiter, async (req, res): Promise<any> => {
  const { 
    full_name, 
    email, 
    password, 
    age, 
    referred_by, 
    studying, 
    academic_year, 
    college_name 
  } = req.body;

  // 1. Required Fields Validation (Full Name, Email, Password)
  if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
    return res.status(400).json({ error: 'Full Name is required.' });
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (!password || typeof password !== 'string' || password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain at least 8 characters, including at least one letter and one number.' });
  }

  // 2. Optional Fields Validation (Validate if provided; if absent/blank, use column defaults)
  let validatedAge = 20;
  if (age !== undefined && age !== null && age !== '') {
    const parsed = parseInt(String(age), 10);
    if (isNaN(parsed) || parsed < 10 || parsed > 120) {
      return res.status(400).json({ error: 'Age must be a valid positive number between 10 and 120.' });
    }
    validatedAge = parsed;
  }

  const validatedReferredBy = (referred_by && typeof referred_by === 'string' && referred_by.trim()) ? referred_by.trim() : 'Direct';
  const validatedStudying = (studying && typeof studying === 'string' && studying.trim()) ? studying.trim() : 'Cyber Security';
  const validatedAcademicYear = (academic_year && typeof academic_year === 'string' && academic_year.trim()) ? academic_year.trim() : '3rd Year';
  const validatedCollegeName = (college_name && typeof college_name === 'string' && college_name.trim()) ? college_name.trim() : 'Cyber Defense Academy';

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = full_name.trim();

  // 3. Case-insensitive Email Uniqueness Check (File Database & SQLite)
  const existingCadet = findCadetByEmail(normalizedEmail);
  const existingDbUser = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  
  if (existingCadet || existingDbUser) {
    return res.status(409).json({ error: 'This email is already registered. Please login instead.' });
  }

  try {
    // 4. Hash Password with bcrypt
    const passwordHash = bcrypt.hashSync(password, 10);

    // 5. Save Cadet Profile to File-Based Database in /database/<FullName>.txt and sync _email_index.txt
    const cadetProfile: CadetProfile = {
      name: trimmedName,
      email: normalizedEmail,
      passwordHash,
      age: validatedAge,
      referredBy: validatedReferredBy,
      studying: validatedStudying,
      academicYear: validatedAcademicYear,
      college: validatedCollegeName
    };

    const { filename } = await saveCadetProfile(cadetProfile);

    // 6. Synchronize with SQLite database for level progression, XP and relational queries
    const userId = 'usr-' + Math.random().toString(36).substring(2, 9) + Date.now();
    const username = generateUniqueUsername(normalizedEmail);

    db.prepare(`
      INSERT INTO users (
        id, full_name, username, email, password_hash, role, 
        age, referred_by, studying, academic_year, college_name, profile_file,
        xp, current_level, streak_days, soc_readiness, mindset_completed
      )
      VALUES (?, ?, ?, ?, ?, 'student', ?, ?, ?, ?, ?, ?, 0, 1, 1, 0.0, 0)
    `).run(
      userId,
      trimmedName,
      username,
      normalizedEmail,
      passwordHash,
      validatedAge,
      validatedReferredBy,
      validatedStudying,
      validatedAcademicYear,
      validatedCollegeName,
      filename
    );

    // Initialize Level 1 Progress
    db.prepare(`
      INSERT INTO user_progress (id, user_id, level_id, status, highest_score)
      VALUES (?, ?, 1, 'current', 0.0)
    `).run('prog-' + Math.random().toString(36).substring(2, 9), userId);

    logAudit(userId, 'CADET_REGISTERED', `file:${filename}`, req.ip, req.headers['user-agent']);

    // 7. Issue JWT Session Token
    const token = jwt.sign(
      { id: userId, username, email: normalizedEmail, role: 'student' },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    const safeUser = {
      id: userId,
      full_name: trimmedName,
      username,
      email: normalizedEmail,
      role: 'student',
      age: validatedAge,
      referred_by: validatedReferredBy,
      studying: validatedStudying,
      academic_year: validatedAcademicYear,
      college_name: validatedCollegeName,
      profile_file: filename,
      xp: 0,
      current_level: 1,
      streak_days: 1,
      soc_readiness: 0,
      mindset_completed: 0
    };

    return res.status(201).json({
      message: 'Cadet registration successful',
      token,
      user: safeUser,
      fileStored: filename
    });
  } catch (err: any) {
    if (err.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ error: 'This email is already registered. Please login instead.' });
    }
    console.error('Cadet registration error:', err);
    return res.status(500).json({ error: 'Failed to process cadet registration. Please try again.' });
  }
});

// POST /api/auth/login - Cadet Login (Email/Username + Password)
router.post('/login', authLimiter, (req, res): any => {
  const identifier = req.body.email || req.body.username || req.body.identifier;
  const password = req.body.password;

  if (!identifier || !password || typeof identifier !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Please enter your username/email and password.' });
  }

  const rawIdent = identifier.trim();
  const normalizedIdent = rawIdent.toLowerCase();

  // 1. Check file-based storage in /database/_email_index.txt
  const cadetFromFile = findCadetByEmail(normalizedIdent);
  
  // 2. Check SQLite database (supports email OR username lookup)
  const dbUser = db.prepare('SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(username) = ?').get(normalizedIdent, normalizedIdent) as any;

  // Determine password hash from file storage or database
  const targetPasswordHash = cadetFromFile?.passwordHash || dbUser?.password_hash;

  // If user does not exist in file database or db
  if (!targetPasswordHash) {
    return res.status(401).json({ error: 'Incorrect username or password.' });
  }

  // 3. Compare password with bcrypt hash
  const isPasswordValid = bcrypt.compareSync(password, targetPasswordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Incorrect username or password.' });
  }

  // 4. Resolve or create user record in SQLite if logging in via file record
  let user = dbUser;
  if (!user && cadetFromFile) {
    const userId = 'usr-' + Math.random().toString(36).substring(2, 9) + Date.now();
    const username = generateUniqueUsername(cadetFromFile.email);

    db.prepare(`
      INSERT INTO users (
        id, full_name, username, email, password_hash, role,
        age, referred_by, studying, academic_year, college_name, profile_file,
        xp, current_level, streak_days, soc_readiness, mindset_completed
      )
      VALUES (?, ?, ?, ?, ?, 'student', ?, ?, ?, ?, ?, ?, 0, 1, 1, 0.0, 0)
    `).run(
      userId,
      cadetFromFile.name,
      username,
      cadetFromFile.email,
      cadetFromFile.passwordHash,
      cadetFromFile.age,
      cadetFromFile.referredBy,
      cadetFromFile.studying,
      cadetFromFile.academicYear,
      cadetFromFile.college,
      cadetFromFile.filename
    );

    user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  }

  logAudit(user.id, 'USER_LOGIN', 'auth', req.ip, req.headers['user-agent']);

  // 5. Issue JWT Token
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: '7d' }
  );

  const { password_hash, ...safeUser } = user;

  // Enrich with file-based fields if present
  if (cadetFromFile) {
    safeUser.full_name = cadetFromFile.name;
    safeUser.age = cadetFromFile.age;
    safeUser.referred_by = cadetFromFile.referredBy;
    safeUser.studying = cadetFromFile.studying;
    safeUser.academic_year = cadetFromFile.academicYear;
    safeUser.college_name = cadetFromFile.college;
    safeUser.profile_file = cadetFromFile.filename;
  }

  return res.json({
    message: 'Login successful',
    token,
    user: safeUser
  });
});

// GET /api/auth/me - Retrieve Authenticated Cadet Profile
router.get('/me', authenticateToken, (req: AuthRequest, res): any => {
  const user = db.prepare(`
    SELECT id, full_name, username, email, role, age, referred_by, studying, academic_year, college_name, profile_file, xp, current_level, streak_days, soc_readiness, mindset_completed, created_at 
    FROM users WHERE id = ?
  `).get(req.user?.id) as any;

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Look up file record for latest details
  const fileCadet = findCadetByEmail(user.email);
  if (fileCadet) {
    user.full_name = fileCadet.name;
    user.age = fileCadet.age;
    user.referred_by = fileCadet.referredBy;
    user.studying = fileCadet.studying;
    user.academic_year = fileCadet.academicYear;
    user.college_name = fileCadet.college;
    user.profile_file = fileCadet.filename;
  }

  return res.json({ user });
});

// POST /api/auth/mindset
router.post('/mindset', authenticateToken, (req: AuthRequest, res): any => {
  db.prepare('UPDATE users SET mindset_completed = 1 WHERE id = ?').run(req.user?.id);
  return res.json({ message: 'Mindset check completed', mindset_completed: 1 });
});

export default router;
