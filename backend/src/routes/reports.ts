import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticateToken, AuthRequest, logAudit } from '../middleware/auth.js';
import { evaluateIncidentReport, checkAndAwardBadges } from '../services/evaluationService.js';

const router = Router();

// GET /api/reports
router.get('/', authenticateToken, (req: AuthRequest, res): any => {
  const userId = req.user?.id;
  const reports = db.prepare(`
    SELECT r.*, rs.total_score, rs.feedback_md
    FROM reports r
    LEFT JOIN report_scores rs ON r.id = rs.report_id
    WHERE r.user_id = ?
    ORDER BY r.submitted_at DESC
  `).all(userId);

  return res.json({ reports });
});

// GET /api/reports/template/guide
router.get('/template/guide', authenticateToken, (req, res): any => {
  return res.json({
    guide: {
      title: 'SOC L1 Incident Report Writing Standard Operating Procedure',
      overview: 'An Incident Report communicates technical investigation findings to engineering teams, management, and regulatory bodies. Every report must adhere strictly to evidence-backed statements without speculation.',
      sections: [
        { name: '1. Incident Title', rule: 'Clear, concise summary including threat type and target host (e.g. "RDP Brute Force & Credential Compromise on CORP-DC-01").' },
        { name: '2. Date & Time', rule: 'Exact UTC timestamp of initial detection and attack timeline.' },
        { name: '3. Severity', rule: 'Critical, High, Medium, or Low based on asset criticality and confirmed compromise.' },
        { name: '4. Affected Asset', rule: 'Hostnames, internal IP addresses, and operational role (e.g., Domain Controller).' },
        { name: '5. Alert Description', rule: 'SIEM alert name, rule ID, and trigger condition.' },
        { name: '6. Evidence', rule: 'Exact Windows/Linux event IDs, timestamps, source IPs, and command line arguments.' },
        { name: '7. Indicators of Compromise (IOC)', rule: 'Malicious IP addresses, malicious domains, SHA256 hashes, and rogue process names.' },
        { name: '8. Investigation Findings', rule: 'Chronological summary of what the adversary did step-by-step.' },
        { name: '9. MITRE ATT&CK Technique', rule: 'Standard MITRE ATT&CK techniques (e.g. T1110.001 Brute Force, T1059.001 PowerShell).' },
        { name: '10. Impact', rule: 'Business and security impact (e.g., elevated admin access gained, potential persistence).' },
        { name: '11. Root Cause', rule: 'The vulnerability or misconfiguration that enabled the attack (e.g., RDP port 3389 exposed to internet with weak password).' },
        { name: '12. Recommended Actions', rule: 'Containment (isolate host), Remediation (reset admin password, close port 3389, enforce MFA), and Long-term Hardening.' },
        { name: '13. Conclusion', rule: 'Executive sign-off summary confirming containment status and next steps.' }
      ],
      sampleReport: {
        title: 'Unauthorized RDP Brute Force & Malicious Script Execution on CORP-DC-01',
        incident_date: '2026-08-26 03:14:00 UTC',
        severity: 'HIGH',
        affected_asset: 'CORP-DC-01 (10.0.0.15 - Windows Server 2022 Domain Controller)',
        alert_description: 'SIEM Correlation Alert LMCYS-4821: Repeated failed logon attempts followed by elevated RDP interactive session.',
        evidence: 'Event ID 4625 recorded 4 consecutive times between 03:14:02 and 03:14:12 UTC from IP 185.220.101.7. Event ID 4624 (LogonType 10) confirmed at 03:14:18 UTC. Event ID 4688 logged powershell.exe executing base64 encoded download cradle.',
        ioc_list: 'Attacker IP: 185.220.101.7, C2 Domain: c2-beacon.darkops-gateway.xyz, Script SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        findings: 'Adversary automated dictionary attack against RDP port 3389, guessed the domain administrator password, established an interactive session, and executed a PowerShell stager.',
        mitre_technique: 'T1110.001 (Password Guessing), T1078.002 (Domain Accounts), T1059.001 (PowerShell)',
        impact: 'Full domain administrator compromise on primary Domain Controller, active C2 network beaconing.',
        root_cause: 'TCP port 3389 (RDP) was inadvertently exposed to the public internet on perimeter firewall without Multi-Factor Authentication (MFA).',
        recommended_actions: '1. Immediately isolate CORP-DC-01 from network. 2. Block IP 185.220.101.7 at perimeter firewall. 3. Force enterprise-wide password reset for Administrator and revoke active Kerberos tickets. 4. Enforce Duo MFA and restrict RDP via IPsec VPN.',
        conclusion: 'Host isolated within 15 minutes of detection. No evidence of lateral spread detected. Remediation in progress.'
      }
    }
  });
});

// POST /api/reports
router.post('/', authenticateToken, (req: AuthRequest, res): any => {
  const userId = req.user?.id;
  const {
    investigation_id,
    title,
    incident_date,
    severity,
    affected_asset,
    alert_description,
    evidence,
    ioc_list,
    findings,
    mitre_technique,
    impact,
    root_cause,
    recommended_actions,
    conclusion
  } = req.body;

  if (!title || !evidence || !findings || !root_cause || !recommended_actions) {
    return res.status(400).json({ error: 'Please fill in all required incident report fields.' });
  }

  const reportId = 'rep-' + Math.random().toString(36).substring(2, 9) + Date.now();

  db.prepare(`
    INSERT INTO reports (
      id, user_id, investigation_id, title, incident_date, severity, affected_asset,
      alert_description, evidence, ioc_list, findings, mitre_technique, impact,
      root_cause, recommended_actions, conclusion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    reportId,
    userId,
    investigation_id || null,
    title,
    incident_date || new Date().toISOString(),
    severity || 'HIGH',
    affected_asset || 'Unknown Asset',
    alert_description || '',
    evidence,
    ioc_list || '',
    findings,
    mitre_technique || '',
    impact || '',
    root_cause,
    recommended_actions,
    conclusion || ''
  );

  // Evaluate Report using the rubric engine
  const evaluation = evaluateIncidentReport({
    title,
    incident_date: incident_date || new Date().toISOString(),
    severity: severity || 'HIGH',
    affected_asset: affected_asset || 'Unknown Asset',
    alert_description: alert_description || '',
    evidence,
    ioc_list: ioc_list || '',
    findings,
    mitre_technique: mitre_technique || '',
    impact: impact || '',
    root_cause,
    recommended_actions,
    conclusion: conclusion || ''
  });

  const scoreId = 'rs-' + Math.random().toString(36).substring(2, 9) + Date.now();
  db.prepare(`
    INSERT INTO report_scores (
      id, report_id, total_score, completeness_score, technical_accuracy_score,
      evidence_score, root_cause_score, remediation_score, feedback_md
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    scoreId,
    reportId,
    evaluation.totalScore,
    evaluation.completenessScore,
    evaluation.technicalAccuracyScore,
    evaluation.evidenceScore,
    evaluation.rootCauseScore,
    evaluation.remediationScore,
    evaluation.feedbackMd
  );

  // Award XP based on score
  const xpReward = Math.round(evaluation.totalScore * 50);
  db.prepare('UPDATE users SET xp = xp + ? WHERE id = ?').run(xpReward, userId);

  const newBadges = checkAndAwardBadges(userId || '');
  logAudit(userId || null, 'REPORT_SUBMITTED', `report-${reportId}`, req.ip, req.headers['user-agent']);

  return res.status(201).json({
    reportId,
    score: evaluation.totalScore,
    evaluation,
    xpAwarded: xpReward,
    newBadges
  });
});

// GET /api/reports/:id
router.get('/:id', authenticateToken, (req: AuthRequest, res): any => {
  const report = db.prepare(`
    SELECT r.*, rs.total_score, rs.completeness_score, rs.technical_accuracy_score, rs.evidence_score, rs.root_cause_score, rs.remediation_score, rs.feedback_md
    FROM reports r
    LEFT JOIN report_scores rs ON r.id = rs.report_id
    WHERE r.id = ?
  `).get(req.params.id) as any;

  // Prevent IDOR: Return 404 (not 403) if report doesn't exist or doesn't belong to the requester (unless admin)
  if (!report || (report.user_id !== req.user?.id && req.user?.role !== 'admin')) {
    return res.status(404).json({ error: 'Report not found' });
  }

  return res.json({ report });
});

export default router;
