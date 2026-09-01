import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/mentor/ask
router.post('/ask', authenticateToken, (req: AuthRequest, res): any => {
  const { question, contextType, contextId, hintLevel = 1 } = req.body;

  if (!question && !contextId) {
    return res.status(400).json({ error: 'Question or context is required' });
  }

  const query = (question || '').toLowerCase();

  // If in assessment context, enforce anti-spoiler rule
  if (contextType === 'assessment') {
    const levelId = parseInt(contextId, 10) || 1;
    let hintResponse = '';

    if (hintLevel === 1) {
      hintResponse = `💡 **SOC Mentor Hint 1**: Think about the core protocol mechanics of Level ${levelId}. Check whether the indicator relates to Layer 3 (IP routing), Layer 4 (Ports/TCP handshakes), or Windows authentication event IDs (e.g. 4625/4624).`;
    } else if (hintLevel === 2) {
      hintResponse = `🔍 **SOC Mentor Hint 2**: Look at the pattern. In cybersecurity triage, repeated failures followed by single success denote dictionary attacks. For network questions, recall that port 53 is DNS, port 443 is HTTPS, and port 3389 is RDP.`;
    } else {
      hintResponse = `📚 **SOC Mentor Concept Review**: The goal in this assessment is to understand why certain logs trigger alerts. Review the difference between interactive logons (LogonType 10) and network logons (LogonType 3). Re-read the Lesson overview before your final attempt.`;
    }

    return res.json({
      answer: hintResponse,
      hintLevel: Math.min(3, hintLevel + 1),
      antiCheatEnforced: true
    });
  }

  // If in alert triage / SOC arena context
  if (contextType === 'alert' || query.includes('4821') || query.includes('brute') || query.includes('rdp')) {
    let answer = '';
    if (query.includes('tp') || query.includes('true positive') || query.includes('false positive')) {
      answer = `🔎 **Alert Triage Guidance**: To determine if an alert is a True Positive or False Positive:
1. Examine if the source IP is external or internal.
2. Check if the failed authentication count is unusually high.
3. Check if an Event ID 4624 (success) immediately follows.
4. If an external IP successfully accesses an administrator account after failures and runs PowerShell, this is a **True Positive High-Severity Breach**.`;
    } else {
      answer = `🛡️ **SOC Telemetry Analysis**: When reviewing Windows authentication logs, **Event ID 4625** indicates a logon failure (sub-status 0xC000006A = bad password). When an external IP tries multiple passwords and subsequently generates **Event ID 4624 (LogonType 10 - Remote Desktop)**, you must immediately recommend host containment and IP blocking.`;
    }

    return res.json({
      answer,
      hintLevel: hintLevel,
      antiCheatEnforced: false
    });
  }

  // General concept mentorship
  let generalAnswer = `🤖 **SOC Mentor**: `;
  if (query.includes('report') || query.includes('incident report')) {
    generalAnswer += `A professional SOC Incident Report must contain 13 mandatory sections. The most critical sections are **Evidence** (exact Event IDs & IPs), **MITRE ATT&CK Mapping** (e.g. T1110.001), **Root Cause** (why the vulnerability existed), and **Recommended Actions** (Containment -> Remediation -> Hardening).`;
  } else if (query.includes('osi') || query.includes('tcp') || query.includes('udp')) {
    generalAnswer += `Remember: **TCP** uses a 3-way handshake (SYN -> SYN-ACK -> ACK) and ensures reliable ordered transmission. **UDP** is connectionless, fast, and commonly used for DNS (port 53), DHCP, and streaming.`;
  } else if (query.includes('event id') || query.includes('4625') || query.includes('4624') || query.includes('4688')) {
    generalAnswer += `Core Windows Event IDs: **4624** (Successful Logon), **4625** (Failed Logon), **4688** (Process Creation / Command Line), **7045** (Service Installed). Memorizing these is crucial for SOC L1 interviews!`;
  } else {
    generalAnswer += `In SOC Level 1 operations, always rely on concrete telemetry: correlate timestamps, source/destination IPs, process parent-child relationships, and MITRE ATT&CK techniques. How can I help you understand the current exercise?`;
  }

  return res.json({
    answer: generalAnswer,
    hintLevel: hintLevel,
    antiCheatEnforced: false
  });
});

export default router;
