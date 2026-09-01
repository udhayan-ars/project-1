export interface User {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: 'student' | 'admin';
  age?: number;
  referred_by?: string;
  studying?: string;
  academic_year?: string;
  college_name?: string;
  profile_file?: string;
  xp: number;
  current_level: number;
  streak_days: number;
  soc_readiness: number;
  mindset_completed: number;
  created_at?: string;
}

export interface Module {
  id: number;
  order_index: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  zone_name: string;
  level_start: number;
  level_end: number;
}

export interface Level {
  id: number;
  module_id: number;
  level_number: number;
  title: string;
  slug: string;
  summary: string;
  xp_reward: number;
  estimated_minutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  user_status?: 'locked' | 'current' | 'completed';
  is_locked?: boolean;
  highest_score?: number;
  module_title?: string;
  zone_name?: string;
}

export interface Lesson {
  id: string;
  level_id: number;
  overview_md: string;
  key_takeaways: string[];
  practical_brief_md: string;
  diagram_svg?: string;
}

export interface PracticalLab {
  id: string;
  level_id: number;
  title: string;
  scenario_md: string;
  lab_type: string;
  initial_state: any;
  validation_rules: any;
}

export interface QuestionOption {
  id: string;
  option_text: string;
  explanation?: string;
}

export interface Question {
  id: string;
  level_id: number;
  type: string;
  question_text: string;
  points: number;
  topic_tag: string;
  options: QuestionOption[];
}

export interface Assessment {
  id: string;
  level_id: number;
  passing_score: number;
  time_limit_seconds: number;
}

export interface WeakTopic {
  topic_tag: string;
  accuracy_percentage: number;
  needs_revision: number;
  attempts_count: number;
  statusLabel: string;
}

export interface Badge {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  criteria_type: string;
  threshold_value: number;
  awarded_at?: string;
}

export interface Alert {
  id: string;
  alert_code: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  source_ip: string;
  dest_ip: string;
  description: string;
  mitre_technique: string;
  attack_narrative?: string;
  evidence_required?: string[];
  hints?: string[];
}

export interface SyntheticLog {
  id: string;
  category: string;
  severity: string;
  timestamp: string;
  source_ip: string;
  dest_ip: string;
  event_id: string;
  hostname: string;
  username: string;
  message: string;
  raw_payload?: any;
}

export interface IncidentReport {
  id?: string;
  title: string;
  incident_date: string;
  severity: string;
  affected_asset: string;
  alert_description: string;
  evidence: string;
  ioc_list: string;
  findings: string;
  mitre_technique: string;
  impact: string;
  root_cause: string;
  recommended_actions: string;
  conclusion: string;
  total_score?: number;
  feedback_md?: string;
  submitted_at?: string;
}

export interface Certificate {
  id: string;
  certificate_code: string;
  title: string;
  student_name: string;
  username: string;
  issue_date: string;
  final_score: number;
  verification_hash: string;
  verification_url: string;
}
