export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type IncidentStatus = 
  | 'NEW' 
  | 'TRIAGED' 
  | 'INVESTIGATING' 
  | 'CONTAINED' 
  | 'ERADICATED' 
  | 'RECOVERED' 
  | 'CLOSED';

export type AlertStatus = 'NEW' | 'TRIAGED' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED' | 'FALSE_POSITIVE';

export type IOCType = 'IP' | 'DOMAIN' | 'URL' | 'HASH' | 'EMAIL' | 'USERNAME';

export type IOCReputation = 'MALICIOUS' | 'SUSPICIOUS' | 'CLEAN' | 'UNKNOWN';

export type ProtocolType = 'TCP' | 'UDP' | 'ICMP' | 'DNS' | 'HTTP' | 'HTTPS' | 'SSH' | 'RDP' | 'PROCESS' | 'ENDPOINT' | 'KERBEROS' | 'NTLM';

export interface SOCEvent {
  id: string;
  timestamp: string;
  severity: SeverityLevel;
  event_type: string;
  category: 'AUTHENTICATION' | 'NETWORK' | 'ENDPOINT' | 'DNS' | 'MALWARE' | 'CLOUD' | 'PROCESS';
  source_ip: string;
  dest_ip: string;
  source_port?: number;
  dest_port?: number;
  port?: number;
  protocol: ProtocolType | string;
  username: string;
  host: string;
  detection_rule?: string;
  rule_id?: string;
  status: 'NEW' | 'TRIAGED' | 'ANALYZING' | 'CLOSED';
  message: string;
  raw_log?: string;
  process_name?: string;
  command_line?: string;
  parent_process?: string;
  file_hash?: string;
  domain?: string;
  url?: string;
  mitre_technique_id?: string;
  bytes?: number;
  action?: 'ALLOW' | 'DROP' | 'ALERT' | 'BLOCK' | 'SUCCESS' | 'FAILURE';
}

export interface TimelineEvent {
  step: number;
  time_offset: string;
  timestamp: string;
  title: string;
  description: string;
  evidence_type: 'NETWORK' | 'PROCESS' | 'AUTH' | 'FILE' | 'C2';
  severity: SeverityLevel;
  is_trigger?: boolean;
}

export interface SOCAlert {
  id: string;
  alert_id: string;
  timestamp: string;
  title: string;
  severity: SeverityLevel;
  category: string;
  detection_rule: string;
  rule_id: string;
  source_ip: string;
  dest_ip: string;
  source_port: number;
  dest_port: number;
  protocol: string;
  username: string;
  hostname: string;
  process: string;
  command_line: string;
  parent_process: string;
  file_hash: string;
  domain: string;
  url: string;
  status: AlertStatus;
  mitre_tactic: string;
  mitre_technique: string;
  mitre_technique_id: string;
  risk_score: number;
  why_suspicious: string[];
  recommended_actions: string[];
  timeline: TimelineEvent[];
  assigned_analyst?: string;
  false_positive_reason?: string;
  related_event_ids: string[];
  notes?: string;
}

export interface SOCIncident {
  id: string;
  incident_id: string;
  title: string;
  severity: SeverityLevel;
  detection_time: string;
  affected_host: string;
  affected_user: string;
  source_ip: string;
  current_status: IncidentStatus;
  assigned_analyst: string;
  summary: string;
  related_alert_ids: string[];
  mitre_tactics: string[];
  mitre_techniques: string[];
  containment_actions_taken: string[];
  containment_status: {
    host_isolated: boolean;
    ip_blocked: boolean;
    credentials_reset: boolean;
    process_killed: boolean;
  };
  impact_scope: string;
  root_cause: string;
}

export interface IOCItem {
  id: string;
  type: IOCType;
  value: string;
  reputation: IOCReputation;
  risk_score: number;
  first_seen: string;
  last_seen: string;
  associated_alerts: string[];
  related_hosts: string[];
  related_users: string[];
  country?: string;
  asn?: string;
  registrar?: string;
  threat_actor?: string;
  tags: string[];
  detection_notes: string;
}

export interface MitreTechnique {
  id: string;
  tactic: string;
  technique_id: string;
  technique_name: string;
  description: string;
  evidence_example: string;
  detection_logic: string;
  mitigation: string;
  phase_order: number;
  color_code: string;
  mapped_alerts_count: number;
}

export interface NetworkFlow {
  id: string;
  timestamp: string;
  source_ip: string;
  dest_ip: string;
  source_port: number;
  dest_port: number;
  protocol: ProtocolType;
  bytes: number;
  packets: number;
  action: 'ALLOW' | 'DROP' | 'ALERT' | 'REJECT';
  country: string;
  risk_score: number;
  anomaly_flag?: string;
  process_associated?: string;
}

export interface AuthRecord {
  id: string;
  timestamp: string;
  username: string;
  source_ip: string;
  dest_host: string;
  auth_status: 'SUCCESS' | 'FAILURE' | 'LOCKOUT' | 'PRIV_ESC';
  auth_type: 'SSH' | 'RDP' | 'KERBEROS' | 'NTLM' | 'SUDO' | 'WEB_PORTAL';
  failure_reason?: string;
  location: string;
  user_agent?: string;
  is_anomaly: boolean;
  anomaly_description?: string;
}

export interface DetectionRule {
  id: string;
  rule_id: string;
  name: string;
  severity: SeverityLevel;
  description: string;
  detection_logic: string;
  sigma_yaml: string;
  mitre_technique: string;
  mitre_technique_id: string;
  category: string;
  status: 'ENABLED' | 'DISABLED';
  trigger_count: number;
  false_positive_rate: string;
  author: string;
}

export interface Asset {
  id: string;
  hostname: string;
  ip_address: string;
  os: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  owner: string;
  last_seen: string;
  risk_score: number;
  status: 'ONLINE' | 'OFFLINE' | 'QUARANTINED' | 'UNDER_INVESTIGATION';
  open_ports: number[];
  vulnerabilities_count: number;
  active_alerts_count: number;
  services: string[];
}

export interface AttackScenario {
  id: string;
  key: string;
  title: string;
  severity: SeverityLevel;
  category: string;
  description: string;
  target_asset: string;
  attacker_ip: string;
  compromised_user: string;
  mitre_chain: {
    tactic: string;
    technique: string;
    technique_id: string;
  }[];
  scenario_flow_steps: {
    step_number: number;
    phase: string;
    description: string;
    analyst_action: string;
    expected_findings: string;
  }[];
  injected_events: SOCEvent[];
  injected_alert: SOCAlert;
  injected_incident: SOCIncident;
}

export interface SOCReport13Section {
  id?: string;
  incident_id?: string;
  report_title: string;
  prepared_by: string;
  date_of_incident: string;
  date_of_report: string;
  classification: 'RESTRICTED' | 'CONFIDENTIAL' | 'INTERNAL' | 'PUBLIC';
  
  sec1_executive_summary: string;
  sec2_detection_mechanism: string;
  sec3_chronological_timeline: string;
  sec4_technical_evidence: string;
  sec5_extracted_iocs: string;
  sec6_mitre_mapping: string;
  sec7_impact_assessment: string;
  sec8_root_cause_analysis: string;
  sec9_containment_actions: string;
  sec10_eradication_steps: string;
  sec11_recovery_verification: string;
  sec12_lessons_learned_detections: string;
  sec13_analyst_signoff: string;
  
  score_completeness?: number;
  score_technical_accuracy?: number;
  score_evidence_quality?: number;
  score_root_cause_depth?: number;
  score_remediation_actionability?: number;
  total_rubric_score?: number;
  evaluator_feedback?: string;
}

export interface AnalystNote {
  id: string;
  timestamp: string;
  title: string;
  category: 'OBSERVATION' | 'EVIDENCE' | 'HYPOTHESIS' | 'CONTAINMENT' | 'CONCLUSION';
  content: string;
  related_entity_id?: string;
  author: string;
}

export interface ThreatHealthMetrics {
  overall_score: number;
  endpoint_security: number;
  network_security: number;
  identity_security: number;
  detection_coverage: number;
  incident_response_velocity: number;
  active_threat_level: 'DEFCON 5 - NORMAL' | 'DEFCON 4 - GUARDED' | 'DEFCON 3 - ELEVATED' | 'DEFCON 2 - HIGH' | 'DEFCON 1 - CRITICAL';
}
