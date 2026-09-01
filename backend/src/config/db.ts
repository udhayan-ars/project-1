import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH ? path.resolve(process.cwd(), process.env.DATABASE_PATH) : path.join(dbDir, 'lmcys.sqlite');
export const db = new Database(dbPath);

// Enable WAL mode for better concurrency and foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      permissions TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      age INTEGER DEFAULT 20,
      referred_by TEXT DEFAULT 'Direct',
      studying TEXT DEFAULT 'Cyber Security',
      academic_year TEXT DEFAULT '3rd Year',
      college_name TEXT DEFAULT 'Cyber Defense Academy',
      profile_file TEXT,
      xp INTEGER NOT NULL DEFAULT 0,
      current_level INTEGER NOT NULL DEFAULT 1,
      streak_days INTEGER NOT NULL DEFAULT 1,
      soc_readiness REAL NOT NULL DEFAULT 0,
      mindset_completed INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS modules (
      id INTEGER PRIMARY KEY,
      order_index INTEGER NOT NULL UNIQUE,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      zone_name TEXT NOT NULL,
      level_start INTEGER NOT NULL,
      level_end INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS levels (
      id INTEGER PRIMARY KEY,
      module_id INTEGER NOT NULL,
      level_number INTEGER NOT NULL UNIQUE,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      summary TEXT NOT NULL,
      xp_reward INTEGER NOT NULL DEFAULT 100,
      estimated_minutes INTEGER NOT NULL DEFAULT 15,
      difficulty TEXT NOT NULL DEFAULT 'Beginner',
      is_locked_by_default INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      level_id INTEGER NOT NULL UNIQUE,
      overview_md TEXT NOT NULL,
      key_takeaways_json TEXT NOT NULL,
      practical_brief_md TEXT NOT NULL,
      diagram_svg TEXT,
      FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      level_id INTEGER NOT NULL,
      type TEXT NOT NULL DEFAULT 'mcq',
      question_text TEXT NOT NULL,
      explanation TEXT NOT NULL,
      points INTEGER NOT NULL DEFAULT 20,
      topic_tag TEXT NOT NULL,
      FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS question_options (
      id TEXT PRIMARY KEY,
      question_id TEXT NOT NULL,
      option_text TEXT NOT NULL,
      is_correct INTEGER NOT NULL DEFAULT 0,
      explanation TEXT,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS assessments (
      id TEXT PRIMARY KEY,
      level_id INTEGER NOT NULL UNIQUE,
      passing_score INTEGER NOT NULL DEFAULT 70,
      time_limit_seconds INTEGER NOT NULL DEFAULT 600,
      FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS assessment_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      assessment_id TEXT NOT NULL,
      score REAL NOT NULL,
      passed INTEGER NOT NULL DEFAULT 0,
      tab_violations_count INTEGER NOT NULL DEFAULT 0,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS answers (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      selected_options_json TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      time_taken_seconds INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS weak_topics (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      topic_tag TEXT NOT NULL,
      accuracy_percentage REAL NOT NULL,
      attempts_count INTEGER NOT NULL DEFAULT 1,
      needs_revision INTEGER NOT NULL DEFAULT 0,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, topic_tag),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS practical_labs (
      id TEXT PRIMARY KEY,
      level_id INTEGER NOT NULL UNIQUE,
      title TEXT NOT NULL,
      scenario_md TEXT NOT NULL,
      lab_type TEXT NOT NULL,
      initial_state_json TEXT NOT NULL,
      validation_rules_json TEXT NOT NULL,
      FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS lab_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      lab_id TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      history_json TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (lab_id) REFERENCES practical_labs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      severity TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      source_ip TEXT,
      dest_ip TEXT,
      event_id TEXT,
      hostname TEXT,
      username TEXT,
      message TEXT NOT NULL,
      raw_payload_json TEXT
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      alert_code TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      severity TEXT NOT NULL,
      category TEXT NOT NULL,
      source_ip TEXT,
      dest_ip TEXT,
      description TEXT NOT NULL,
      expected_decision TEXT NOT NULL,
      mitre_technique TEXT NOT NULL,
      attack_narrative TEXT NOT NULL,
      evidence_required_json TEXT NOT NULL,
      hints_json TEXT NOT NULL,
      concept_explanation_md TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS investigations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      alert_id TEXT NOT NULL,
      decision TEXT NOT NULL,
      reasoning_text TEXT NOT NULL,
      evidence_selected_json TEXT,
      recommended_action TEXT NOT NULL,
      score REAL NOT NULL DEFAULT 0,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (alert_id) REFERENCES alerts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      investigation_id TEXT,
      title TEXT NOT NULL,
      incident_date TEXT NOT NULL,
      severity TEXT NOT NULL,
      affected_asset TEXT NOT NULL,
      alert_description TEXT NOT NULL,
      evidence TEXT NOT NULL,
      ioc_list TEXT NOT NULL,
      findings TEXT NOT NULL,
      mitre_technique TEXT NOT NULL,
      impact TEXT NOT NULL,
      root_cause TEXT NOT NULL,
      recommended_actions TEXT NOT NULL,
      conclusion TEXT NOT NULL,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS report_scores (
      id TEXT PRIMARY KEY,
      report_id TEXT NOT NULL UNIQUE,
      total_score REAL NOT NULL,
      completeness_score REAL NOT NULL,
      technical_accuracy_score REAL NOT NULL,
      evidence_score REAL NOT NULL,
      root_cause_score REAL NOT NULL,
      remediation_score REAL NOT NULL,
      feedback_md TEXT NOT NULL,
      scored_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS badges (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      criteria_type TEXT NOT NULL,
      threshold_value INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_badges (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      badge_id TEXT NOT NULL,
      awarded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, badge_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      level_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'locked',
      highest_score REAL NOT NULL DEFAULT 0,
      completed_at DATETIME,
      UNIQUE(user_id, level_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      certificate_code TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      issue_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      final_score REAL NOT NULL,
      verification_hash TEXT NOT NULL UNIQUE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tab_switch_events (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      assessment_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      penalty_applied INTEGER NOT NULL DEFAULT 0,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Create helpful indexes
    CREATE INDEX IF NOT EXISTS idx_levels_module_id ON levels(module_id);
    CREATE INDEX IF NOT EXISTS idx_questions_level_id ON questions(level_id);
    CREATE INDEX IF NOT EXISTS idx_logs_event_id ON logs(event_id);
    CREATE INDEX IF NOT EXISTS idx_logs_source_ip ON logs(source_ip);
    CREATE INDEX IF NOT EXISTS idx_logs_category ON logs(category);
    CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_weak_topics_user ON weak_topics(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
  `);

  // Ensure new columns exist on legacy tables
  const userColumns = db.prepare(`PRAGMA table_info(users)`).all() as { name: string }[];
  const existingColNames = userColumns.map(c => c.name);

  if (!existingColNames.includes('age')) {
    db.exec(`ALTER TABLE users ADD COLUMN age INTEGER DEFAULT 20;`);
  }
  if (!existingColNames.includes('referred_by')) {
    db.exec(`ALTER TABLE users ADD COLUMN referred_by TEXT DEFAULT 'Direct';`);
  }
  if (!existingColNames.includes('studying')) {
    db.exec(`ALTER TABLE users ADD COLUMN studying TEXT DEFAULT 'Cyber Security';`);
  }
  if (!existingColNames.includes('academic_year')) {
    db.exec(`ALTER TABLE users ADD COLUMN academic_year TEXT DEFAULT '3rd Year';`);
  }
  if (!existingColNames.includes('college_name')) {
    db.exec(`ALTER TABLE users ADD COLUMN college_name TEXT DEFAULT 'Cyber Defense Academy';`);
  }
  if (!existingColNames.includes('profile_file')) {
    db.exec(`ALTER TABLE users ADD COLUMN profile_file TEXT;`);
  }
}
