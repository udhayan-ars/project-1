import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// Absolute path to the database directory at workspace root
const DATABASE_DIR = path.resolve(process.cwd(), '../database');
const INDEX_FILE = path.join(DATABASE_DIR, '_email_index.txt');

// Ensure database directory exists
export function ensureDatabaseDir() {
  if (!fs.existsSync(DATABASE_DIR)) {
    fs.mkdirSync(DATABASE_DIR, { recursive: true });
  }
  if (!fs.existsSync(INDEX_FILE)) {
    fs.writeFileSync(INDEX_FILE, '', 'utf8');
  }
}

export interface CadetProfile {
  name: string;
  email: string;
  passwordHash: string;
  age: number;
  referredBy: string;
  studying: string;
  academicYear: string;
  college: string;
  filename?: string;
}

// Simple mutex mechanism for atomic file operations
let isWriting = false;
async function acquireLock(timeoutMs = 5000): Promise<void> {
  const start = Date.now();
  while (isWriting) {
    if (Date.now() - start > timeoutMs) {
      throw new Error('Database file lock acquisition timeout');
    }
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  isWriting = true;
}

function releaseLock() {
  isWriting = false;
}

/**
 * Sanitize Full Name for safe filesystem usage (prevents path traversal)
 */
export function sanitizeFilename(name: string): string {
  // Strip path traversal sequences, slashes, backslashes, colons, and illegal chars
  const sanitized = name
    .replace(/[/\\?%*:|"<>.]/g, '')
    .replace(/\s+/g, '_')
    .trim();
  return sanitized || 'Cadet';
}

/**
 * Read the email index file into a Map (case-insensitive email -> filename)
 */
export function readEmailIndex(): Map<string, string> {
  ensureDatabaseDir();
  const indexMap = new Map<string, string>();
  const content = fs.readFileSync(INDEX_FILE, 'utf8');
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split('->');
    if (parts.length === 2) {
      const email = parts[0].trim().toLowerCase();
      const filename = parts[1].trim();
      indexMap.set(email, filename);
    }
  }

  return indexMap;
}

/**
 * Disambiguate filename if a file with the same name already exists
 * Strategy: Append _2, _3, etc. so no cadet profile is overwritten
 */
export function getUniqueFilename(baseName: string, targetEmail: string, indexMap: Map<string, string>): string {
  let candidate = `${baseName}.txt`;
  let counter = 2;

  // Check if filename already exists on disk
  while (fs.existsSync(path.join(DATABASE_DIR, candidate))) {
    // If the file exists and is already indexed to this exact email, reuse it
    const existingFileForEmail = indexMap.get(targetEmail.toLowerCase());
    if (existingFileForEmail === candidate) {
      return candidate;
    }
    candidate = `${baseName}_${counter}.txt`;
    counter++;
  }

  return candidate;
}

/**
 * Parse a cadet profile .txt file into structured data
 */
export function parseCadetFile(filePath: string): CadetProfile | null {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const data: any = {};
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();

    if (key === 'Name') data.name = value;
    else if (key === 'Email') data.email = value;
    else if (key === 'PasswordHash') data.passwordHash = value;
    else if (key === 'Age') data.age = parseInt(value, 10);
    else if (key === 'Referred By') data.referredBy = value;
    else if (key === 'Studying') data.studying = value;
    else if (key === 'Academic Year') data.academicYear = value;
    else if (key === 'College') data.college = value;
  }

  if (!data.name || !data.email || !data.passwordHash) {
    return null;
  }

  return {
    name: data.name,
    email: data.email,
    passwordHash: data.passwordHash,
    age: data.age || 0,
    referredBy: data.referredBy || 'Direct Registration',
    studying: data.studying || 'N/A',
    academicYear: data.academicYear || 'N/A',
    college: data.college || 'N/A',
    filename: path.basename(filePath)
  };
}

/**
 * Save Cadet Profile to database/<FullName>.txt and sync _email_index.txt atomically
 */
export async function saveCadetProfile(profile: CadetProfile): Promise<{ filename: string; filePath: string }> {
  ensureDatabaseDir();
  await acquireLock();

  let createdFilePath: string | null = null;

  try {
    const normalizedEmail = profile.email.trim().toLowerCase();
    const indexMap = readEmailIndex();

    // 1. Email Uniqueness Check
    if (indexMap.has(normalizedEmail)) {
      throw new Error('EMAIL_EXISTS');
    }

    // 2. Disambiguate filename safely
    const baseSanitized = sanitizeFilename(profile.name);
    const filename = getUniqueFilename(baseSanitized, normalizedEmail, indexMap);
    const filePath = path.join(DATABASE_DIR, filename);

    // 3. Format file content according to PRD specification
    const fileContent = [
      `Name: ${profile.name}`,
      `Email: ${profile.email}`,
      `PasswordHash: ${profile.passwordHash}`,
      `Age: ${profile.age}`,
      `Referred By: ${profile.referredBy}`,
      `Studying: ${profile.studying}`,
      `Academic Year: ${profile.academicYear}`,
      `College: ${profile.college}`
    ].join('\n') + '\n';

    // 4. Write profile file
    fs.writeFileSync(filePath, fileContent, 'utf8');
    createdFilePath = filePath;

    // 5. Update index file atomically
    indexMap.set(normalizedEmail, filename);
    const indexContent = Array.from(indexMap.entries())
      .map(([em, fn]) => `${em} -> ${fn}`)
      .join('\n') + '\n';

    const tempIndexFile = path.join(DATABASE_DIR, '_email_index.tmp');
    fs.writeFileSync(tempIndexFile, indexContent, 'utf8');
    fs.renameSync(tempIndexFile, INDEX_FILE);

    return { filename, filePath };
  } catch (err) {
    // Rollback profile file if index update failed
    if (createdFilePath && fs.existsSync(createdFilePath)) {
      try { fs.unlinkSync(createdFilePath); } catch (_) {}
    }
    throw err;
  } finally {
    releaseLock();
  }
}

/**
 * Find cadet by email from the file-based database
 */
export function findCadetByEmail(email: string): CadetProfile | null {
  ensureDatabaseDir();
  const normalizedEmail = email.trim().toLowerCase();
  const indexMap = readEmailIndex();
  const filename = indexMap.get(normalizedEmail);

  if (!filename) {
    return null;
  }

  const filePath = path.join(DATABASE_DIR, filename);
  return parseCadetFile(filePath);
}
