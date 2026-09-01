import { db } from '../config/db.js';

export function updateWeakTopics(userId: string, questionResults: { topic: string; isCorrect: boolean }[]) {
  const topicMap: { [key: string]: { correct: number; total: number } } = {};

  questionResults.forEach(r => {
    if (!topicMap[r.topic]) {
      topicMap[r.topic] = { correct: 0, total: 0 };
    }
    topicMap[r.topic].total += 1;
    if (r.isCorrect) {
      topicMap[r.topic].correct += 1;
    }
  });

  const getExisting = db.prepare('SELECT * FROM weak_topics WHERE user_id = ? AND topic_tag = ?');
  const insertTopic = db.prepare(`
    INSERT INTO weak_topics (id, user_id, topic_tag, accuracy_percentage, attempts_count, needs_revision, last_updated)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);
  const updateTopic = db.prepare(`
    UPDATE weak_topics 
    SET accuracy_percentage = ?, attempts_count = attempts_count + 1, needs_revision = ?, last_updated = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  Object.entries(topicMap).forEach(([topic, stats]) => {
    const accuracy = (stats.correct / stats.total) * 100;
    const existing = getExisting.get(userId, topic) as any;

    if (existing) {
      const blendedAccuracy = ((existing.accuracy_percentage * existing.attempts_count) + accuracy) / (existing.attempts_count + 1);
      const needsRevision = blendedAccuracy < 70 ? 1 : 0;
      updateTopic.run(blendedAccuracy, needsRevision, existing.id);
    } else {
      const id = 'wt-' + Math.random().toString(36).substring(2, 9) + Date.now();
      const needsRevision = accuracy < 70 ? 1 : 0;
      insertTopic.run(id, userId, topic, accuracy, 1, needsRevision);
    }
  });
}

export function checkAndAwardBadges(userId: string) {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
  if (!user) return [];

  const completedLevelsCount = db.prepare("SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND status = 'completed'").get(userId) as { count: number };
  const userBadges = db.prepare('SELECT badge_id FROM user_badges WHERE user_id = ?').all(userId) as { badge_id: string }[];
  const ownedBadgeIds = new Set(userBadges.map(b => b.badge_id));

  const allBadges = db.prepare('SELECT * FROM badges').all() as any[];
  const newBadges: any[] = [];

  const insertUserBadge = db.prepare('INSERT INTO user_badges (id, user_id, badge_id, awarded_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)');

  allBadges.forEach(badge => {
    if (ownedBadgeIds.has(badge.id)) return;

    let earned = false;
    if (badge.criteria_type === 'level_complete') {
      if (completedLevelsCount.count >= badge.threshold_value) {
        earned = true;
      }
    } else if (badge.criteria_type === 'report_score') {
      const bestReport = db.prepare('SELECT MAX(total_score) as best FROM report_scores rs JOIN reports r ON rs.report_id = r.id WHERE r.user_id = ?').get(userId) as any;
      if (bestReport && bestReport.best >= badge.threshold_value) {
        earned = true;
      }
    }

    if (earned) {
      const ubId = 'ub-' + Math.random().toString(36).substring(2, 9) + Date.now();
      insertUserBadge.run(ubId, userId, badge.id);
      newBadges.push(badge);
    }
  });

  // Recalculate SOC readiness
  recalculateSocReadiness(userId);

  return newBadges;
}

export function recalculateSocReadiness(userId: string) {
  const completedLevels = db.prepare("SELECT COUNT(*) as count, AVG(highest_score) as avg_score FROM user_progress WHERE user_id = ? AND status = 'completed'").get(userId) as any;
  const investigations = db.prepare('SELECT COUNT(*) as count, AVG(score) as avg_score FROM investigations WHERE user_id = ?').get(userId) as any;
  const reports = db.prepare('SELECT COUNT(*) as count, AVG(total_score) as avg_score FROM report_scores rs JOIN reports r ON rs.report_id = r.id WHERE r.user_id = ?').get(userId) as any;

  const levelFactor = Math.min(100, ((completedLevels?.count || 0) / 10) * 100) * 0.40;
  const examFactor = ((completedLevels?.avg_score || 0) / 100) * 100 * 0.20;
  const arenaFactor = Math.min(100, ((investigations?.count || 0) / 2) * 100) * 0.20;
  const reportFactor = Math.min(100, (((reports?.avg_score || 0) / 5) * 100)) * 0.20;

  const readiness = Math.min(100, Math.round(levelFactor + examFactor + arenaFactor + reportFactor));

  db.prepare('UPDATE users SET soc_readiness = ? WHERE id = ?').run(readiness, userId);
  return readiness;
}

export function evaluateIncidentReport(reportData: {
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
}) {
  let completeness = 0;
  let technicalAccuracy = 0;
  let evidenceScore = 0;
  let rootCauseScore = 0;
  let remediationScore = 0;
  const feedbackItems: string[] = [];

  // 1. Completeness Evaluation (Are all required fields detailed?)
  const fields = [
    reportData.title, reportData.incident_date, reportData.severity, reportData.affected_asset,
    reportData.alert_description, reportData.evidence, reportData.ioc_list, reportData.findings,
    reportData.mitre_technique, reportData.impact, reportData.root_cause, reportData.recommended_actions,
    reportData.conclusion
  ];

  const filledCount = fields.filter(f => f && f.trim().length >= 10).length;
  completeness = (filledCount / 13) * 5.0;

  if (filledCount === 13) {
    feedbackItems.push('✓ All 13 mandatory incident report sections populated thoroughly.');
  } else {
    feedbackItems.push(`⚠ ${13 - filledCount} sections contain insufficient detail or are too brief.`);
  }

  // 2. Technical Accuracy & MITRE Technique
  if (/T1110|T1078|T1059|T1046|brute|credential|powershell|rdp/i.test(reportData.mitre_technique + ' ' + reportData.findings)) {
    technicalAccuracy = 4.8;
    feedbackItems.push('✓ Excellent MITRE ATT&CK technique alignment and attack narrative description.');
  } else {
    technicalAccuracy = 2.5;
    feedbackItems.push('⚠ MITRE ATT&CK mapping is generic. Ensure technique ID (e.g. T1110.001) is cited.');
  }

  // 3. Evidence & IOCs
  if (/4625|4624|185\.220|ip|hash|event|log/i.test(reportData.evidence + ' ' + reportData.ioc_list)) {
    evidenceScore = 4.9;
    feedbackItems.push('✓ Strong concrete log evidence (Event IDs & Source IP IOCs) referenced.');
  } else {
    evidenceScore = 2.0;
    feedbackItems.push('⚠ Evidence lacks explicit log timestamps, Event IDs (e.g. 4625/4624), or IP addresses.');
  }

  // 4. Root Cause Analysis
  if (reportData.root_cause && reportData.root_cause.length > 30 && /password|exposed|port|policy|weak/i.test(reportData.root_cause)) {
    rootCauseScore = 4.7;
    feedbackItems.push('✓ Accurate root cause identification explaining how the vulnerability was exploited.');
  } else {
    rootCauseScore = 2.8;
    feedbackItems.push('⚠ Root cause needs improvement: Explain why the exposed port or weak credential existed.');
  }

  // 5. Remediation & Actionable Recommendations
  if (reportData.recommended_actions && /isolate|block|mfa|firewall|reset|rotate/i.test(reportData.recommended_actions)) {
    remediationScore = 4.8;
    feedbackItems.push('✓ Actionable, multi-tiered containment and remediation recommendations provided.');
  } else {
    remediationScore = 2.5;
    feedbackItems.push('⚠ Remediation is too generic. Specify firewall IP blocking, MFA enforcement, and host isolation.');
  }

  const totalScore = Number(((completeness * 0.20) + (technicalAccuracy * 0.25) + (evidenceScore * 0.20) + (rootCauseScore * 0.15) + (remediationScore * 0.20)).toFixed(2));

  let gradeLabel = 'Needs Improvement';
  if (totalScore >= 4.5) gradeLabel = 'Excellent (SOC Ready)';
  else if (totalScore >= 3.5) gradeLabel = 'Good / Proficient';
  else if (totalScore >= 2.5) gradeLabel = 'Developing';

  const feedbackMd = `### Report Score: ${totalScore} / 5.0 (${gradeLabel})\n\n` + feedbackItems.join('\n\n');

  return {
    totalScore,
    completenessScore: Number(completeness.toFixed(2)),
    technicalAccuracyScore: Number(technicalAccuracy.toFixed(2)),
    evidenceScore: Number(evidenceScore.toFixed(2)),
    rootCauseScore: Number(rootCauseScore.toFixed(2)),
    remediationScore: Number(remediationScore.toFixed(2)),
    feedbackMd
  };
}
