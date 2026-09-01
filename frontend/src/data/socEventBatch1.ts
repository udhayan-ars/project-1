import { SOCEvent } from '../types/soc';

export const BATCH_1_EVENTS: SOCEvent[] = [
  // =========================================================================
  // ATTACK CHAIN A: KERBEROASTING & SERVICE TICKET EXTRACTION (EVT-9101 - EVT-9125)
  // =========================================================================
  {
    id: 'EVT-9101',
    timestamp: '2026-08-26 20:01:14 UTC',
    severity: 'HIGH',
    event_type: 'Kerberos Service Ticket (TGS-REQ) with Weak RC4 Encryption',
    category: 'AUTHENTICATION',
    source_ip: '192.168.10.72',
    dest_ip: '10.0.0.1',
    source_port: 51920,
    dest_port: 88,
    protocol: 'KERBEROS',
    username: 'mjenkins',
    host: 'CORP-DC-01',
    detection_rule: 'RULE-031: Abnormal Kerberoasting TGS Request Pattern',
    rule_id: 'RULE-031',
    status: 'NEW',
    message: 'Account mjenkins requested TGS ticket for SPN MSSQLSvc/sql-prod.corp.local using legacy RC4 encryption (0x17)',
    raw_log: '{"EventID": 4769, "Provider": "Microsoft-Windows-Security-Auditing", "TargetUserName": "sql_service@CORP.LOCAL", "ServiceName": "MSSQLSvc/sql-prod.corp.local", "TicketEncryptionType": "0x17", "IpAddress": "192.168.10.72", "Status": "0x0"}',
    mitre_technique_id: 'T1558.003',
    action: 'ALERT'
  },
  {
    id: 'EVT-9102',
    timestamp: '2026-08-26 20:01:18 UTC',
    severity: 'HIGH',
    event_type: 'Mass TGS-REQ Extraction Across Multiple Service Principal Names',
    category: 'AUTHENTICATION',
    source_ip: '192.168.10.72',
    dest_ip: '10.0.0.1',
    source_port: 51924,
    dest_port: 88,
    protocol: 'KERBEROS',
    username: 'mjenkins',
    host: 'CORP-DC-01',
    detection_rule: 'RULE-031: Abnormal Kerberoasting TGS Request Pattern',
    rule_id: 'RULE-031',
    status: 'NEW',
    message: '14 distinct SPN service tickets requested within 6 seconds from workstation WIN-FINANCE-04',
    raw_log: '{"EventID": 4769, "Provider": "Microsoft-Windows-Security-Auditing", "TargetUserName": "svc_backup@CORP.LOCAL", "ServiceName": "HTTP/sharepoint.corp.local", "TicketEncryptionType": "0x17", "IpAddress": "192.168.10.72"}',
    mitre_technique_id: 'T1558.003',
    action: 'ALERT'
  },
  {
    id: 'EVT-9103',
    timestamp: '2026-08-26 20:02:45 UTC',
    severity: 'CRITICAL',
    event_type: 'In-Memory C# Kerberoasting Tool (Rubeus) Execution',
    category: 'ENDPOINT',
    source_ip: '192.168.10.72',
    dest_ip: '192.168.10.72',
    protocol: 'PROCESS',
    username: 'mjenkins',
    host: 'WIN-FINANCE-04',
    detection_rule: 'RULE-014: Suspicious In-Memory Assembly Loading',
    rule_id: 'RULE-014',
    status: 'NEW',
    message: 'PowerShell executed Reflection.Assembly::Load to invoke Rubeus kerberoast /outfile:hashes.txt',
    raw_log: '{"EventID": 4104, "Provider": "Microsoft-Windows-PowerShell", "ScriptBlockText": "[System.Reflection.Assembly]::Load([System.Convert]::FromBase64String(\\"H4sIC...\\")).EntryPoint.Invoke($null, @(,\\"kerberoast /stats\\"))", "User": "CORP\\\\mjenkins"}',
    process_name: 'powershell.exe',
    command_line: 'powershell.exe -ep bypass -c "[System.Reflection.Assembly]::Load..."',
    parent_process: 'explorer.exe',
    mitre_technique_id: 'T1059.001',
    action: 'ALERT'
  },
  {
    id: 'EVT-9104',
    timestamp: '2026-08-26 20:05:12 UTC',
    severity: 'HIGH',
    event_type: 'Lateral Movement via SMB using Compromised Service Account',
    category: 'NETWORK',
    source_ip: '192.168.10.72',
    dest_ip: '10.0.0.18',
    source_port: 49201,
    dest_port: 445,
    protocol: 'SMB',
    username: 'svc_backup',
    host: 'DB-PROD-01',
    detection_rule: 'RULE-022: Anomalous Service Account Interactive SMB Connection',
    rule_id: 'RULE-022',
    status: 'NEW',
    message: 'Service account svc_backup connected to ADMIN$ share on database server DB-PROD-01',
    raw_log: '{"EventID": 5140, "ShareName": "\\\\\\\\*\\\\ADMIN$", "SubjectUserName": "svc_backup", "IpAddress": "192.168.10.72"}',
    mitre_technique_id: 'T1021.002',
    action: 'ALERT'
  },

  // =========================================================================
  // ATTACK CHAIN B: NTLM RELAY & ACTIVE DIRECTORY CERTIFICATE EXPLOIT (EVT-9126 - EVT-9150)
  // =========================================================================
  {
    id: 'EVT-9126',
    timestamp: '2026-08-26 20:10:04 UTC',
    severity: 'HIGH',
    event_type: 'PetitPotam Coerced NTLM Authentication Request',
    category: 'ENDPOINT',
    source_ip: '192.168.10.115',
    dest_ip: '10.0.0.1',
    source_port: 58190,
    dest_port: 445,
    protocol: 'RPC/SMB',
    username: 'ANONYMOUS',
    host: 'CORP-DC-01',
    detection_rule: 'RULE-045: Coerced Authentication via MS-EFSR RPC Interface',
    rule_id: 'RULE-045',
    status: 'NEW',
    message: 'Workstation WIN-DEV-19 initiated EfsRpcOpenFileRaw RPC pipe connection to force DC machine account NTLM auth',
    raw_log: '{"EventID": 5145, "RelativeTargetName": "pipe\\\\efsrpc", "AccessMask": "0x12019f", "SubjectUserName": "ANONYMOUS LOGON", "IpAddress": "192.168.10.115"}',
    mitre_technique_id: 'T1187',
    action: 'ALERT'
  },
  {
    id: 'EVT-9127',
    timestamp: '2026-08-26 20:10:11 UTC',
    severity: 'CRITICAL',
    event_type: 'NTLM Authentication Relayed to AD CS Web Enrollment Portal',
    category: 'AUTHENTICATION',
    source_ip: '192.168.10.115',
    dest_ip: '10.0.0.5',
    source_port: 58204,
    dest_port: 80,
    protocol: 'HTTP',
    username: 'CORP-DC-01$',
    host: 'CA-SRV-01',
    detection_rule: 'RULE-046: Suspicious Machine Account Certificate Request via Web Enrollment',
    rule_id: 'RULE-046',
    status: 'NEW',
    message: 'Machine account CORP-DC-01$ submitted PKI Certificate Signing Request using NTLM Relay',
    raw_log: '{"cs_method": "POST", "cs_uri_stem": "/certsrv/certfnsh.asp", "cs_username": "CORP\\\\CORP-DC-01$", "c_ip": "192.168.10.115", "sc_status": 200}',
    mitre_technique_id: 'T1557.001',
    action: 'ALERT'
  },
  {
    id: 'EVT-9128',
    timestamp: '2026-08-26 20:10:25 UTC',
    severity: 'CRITICAL',
    event_type: 'Rogue Domain Controller Certificate Issued by Enterprise CA',
    category: 'ENDPOINT',
    source_ip: '10.0.0.5',
    dest_ip: '10.0.0.5',
    protocol: 'PKI',
    username: 'SYSTEM',
    host: 'CA-SRV-01',
    detection_rule: 'RULE-047: ESC1/ESC8 Vulnerable Certificate Template Enrollment',
    rule_id: 'RULE-047',
    status: 'NEW',
    message: 'Certificate Authority CA-SRV-01 issued high-privilege DomainController certificate to non-DC requester IP 192.168.10.115',
    raw_log: '{"EventID": 4886, "Provider": "Microsoft-Windows-CertificateServices", "CertificateTemplate": "DomainController", "Requester": "CORP\\\\CORP-DC-01$", "SerialNumber": "5a81b2c4000100000099"}',
    mitre_technique_id: 'T1649',
    action: 'ALERT'
  },

  // =========================================================================
  // ATTACK CHAIN C: CI/CD SUPPLY CHAIN POISONING & DATA EXFILTRATION (EVT-9151 - EVT-9175)
  // =========================================================================
  {
    id: 'EVT-9151',
    timestamp: '2026-08-26 20:15:30 UTC',
    severity: 'MEDIUM',
    event_type: 'Anomalous PyPI Package Installation with Post-Install Executable Hook',
    category: 'ENDPOINT',
    source_ip: '10.0.5.22',
    dest_ip: '151.101.0.223',
    source_port: 43190,
    dest_port: 443,
    protocol: 'HTTPS',
    username: 'jenkins',
    host: 'CI-BUILD-NODE-03',
    detection_rule: 'RULE-055: Malicious Python Package Setup Hook Execution',
    rule_id: 'RULE-055',
    status: 'NEW',
    message: 'pip install downloaded package requests-security-v2 containing post_install subprocess spawn',
    raw_log: '{"event": "process_create", "pid": 4819, "ppid": 4810, "cmdline": "python setup.py install", "cwd": "/home/jenkins/workspace/billing-api", "user": "jenkins"}',
    process_name: 'python3',
    parent_process: 'jenkins-agent',
    mitre_technique_id: 'T1195.001',
    action: 'ALERT'
  },
  {
    id: 'EVT-9152',
    timestamp: '2026-08-26 20:15:42 UTC',
    severity: 'CRITICAL',
    event_type: 'CI/CD Pipeline Secrets Harvested from Environment Variables',
    category: 'ENDPOINT',
    source_ip: '10.0.5.22',
    dest_ip: '10.0.5.22',
    protocol: 'PROCESS',
    username: 'jenkins',
    host: 'CI-BUILD-NODE-03',
    detection_rule: 'RULE-056: Unauthorized Environment Variable & AWS Credential Access',
    rule_id: 'RULE-056',
    status: 'NEW',
    message: 'Child process of pip read /home/jenkins/.aws/credentials and dumped AWS_SECRET_ACCESS_KEY',
    raw_log: '{"event": "file_read", "file": "/home/jenkins/.aws/credentials", "accessor_process": "/tmp/pip-build/setup.py", "pid": 4825}',
    process_name: 'python3',
    parent_process: 'python3',
    mitre_technique_id: 'T1552.001',
    action: 'ALERT'
  },
  {
    id: 'EVT-9153',
    timestamp: '2026-08-26 20:16:05 UTC',
    severity: 'CRITICAL',
    event_type: 'Data Exfiltration via Encrypted HTTPS POST to Anonymous Webhook',
    category: 'NETWORK',
    source_ip: '10.0.5.22',
    dest_ip: '104.21.72.18',
    source_port: 43212,
    dest_port: 443,
    protocol: 'HTTPS',
    username: 'jenkins',
    host: 'CI-BUILD-NODE-03',
    detection_rule: 'RULE-057: Outbound High-Entropy POST from CI/CD Subnet to Uncategorized Webhook',
    rule_id: 'RULE-057',
    status: 'NEW',
    message: '4.8 MB outbound HTTPS payload transmitted to webhook.site/d981-42af-bf99',
    raw_log: '{"src_ip": "10.0.5.22", "dst_ip": "104.21.72.18", "proto": "tcp", "dst_port": 443, "bytes_out": 4892100, "ja3": "e7d705a3286e19ea42f587b344ee6865"}',
    domain: 'webhook.site',
    mitre_technique_id: 'T1048.003',
    action: 'ALERT'
  },

  // =========================================================================
  // ATTACK CHAIN D: CLOUD CONTROL PLANE (AWS CLOUDTRAIL) INTRUSION (EVT-9176 - EVT-9200)
  // =========================================================================
  {
    id: 'EVT-9176',
    timestamp: '2026-08-26 20:20:15 UTC',
    severity: 'HIGH',
    event_type: 'AWS IAM Console Login without MFA from Tor Exit Node',
    category: 'CLOUD',
    source_ip: '185.220.101.12',
    dest_ip: '52.94.0.1',
    source_port: 39182,
    dest_port: 443,
    protocol: 'HTTPS',
    username: 'devops-admin@corp.com',
    host: 'AWS-GLOBAL-IAM',
    detection_rule: 'RULE-071: Anomalous Geolocation AWS Root/IAM Console Logon',
    rule_id: 'RULE-071',
    status: 'NEW',
    message: 'IAM user devops-admin logged into AWS Management Console from Netherlands Tor Exit without MFA challenge',
    raw_log: '{"eventSource": "signin.amazonaws.com", "eventName": "ConsoleLogin", "sourceIPAddress": "185.220.101.12", "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "userIdentity": {"type": "IAMUser", "userName": "devops-admin"}, "additionalEventData": {"MFAUsed": "No"}}',
    mitre_technique_id: 'T1078.004',
    action: 'ALERT'
  },
  {
    id: 'EVT-9177',
    timestamp: '2026-08-26 20:21:40 UTC',
    severity: 'CRITICAL',
    event_type: 'AWS SecretsManager Batch Secret Decryption & Harvest',
    category: 'CLOUD',
    source_ip: '185.220.101.12',
    dest_ip: '52.94.0.1',
    source_port: 39190,
    dest_port: 443,
    protocol: 'HTTPS',
    username: 'devops-admin@corp.com',
    host: 'AWS-US-EAST-1',
    detection_rule: 'RULE-072: High-Velocity Cloud Secret Retrieval',
    rule_id: 'RULE-072',
    status: 'NEW',
    message: 'devops-admin executed GetSecretValue on 8 production databases within 40 seconds',
    raw_log: '{"eventSource": "secretsmanager.amazonaws.com", "eventName": "GetSecretValue", "requestParameters": {"secretId": "prod/rds/postgres-master-creds"}, "sourceIPAddress": "185.220.101.12"}',
    mitre_technique_id: 'T1555.005',
    action: 'ALERT'
  },
  {
    id: 'EVT-9178',
    timestamp: '2026-08-26 20:24:10 UTC',
    severity: 'CRITICAL',
    event_type: 'Mass S3 Bucket Download & Snapshot Sharing',
    category: 'CLOUD',
    source_ip: '185.220.101.12',
    dest_ip: '52.94.0.1',
    source_port: 39215,
    dest_port: 443,
    protocol: 'HTTPS',
    username: 'devops-admin@corp.com',
    host: 'AWS-S3-GLOBAL',
    detection_rule: 'RULE-073: Bulk S3 Data Exfiltration & Bucket Public Sharing',
    rule_id: 'RULE-073',
    status: 'NEW',
    message: 'Bucket corp-customer-pii-backups permissions modified to public; 42 GB downloaded via GetObject',
    raw_log: '{"eventSource": "s3.amazonaws.com", "eventName": "PutBucketPolicy", "requestParameters": {"bucketName": "corp-customer-pii-backups", "bucketPolicy": "{\\"Effect\\":\\"Allow\\",\\"Principal\\":\\"*\\",\\"Action\\":\\"s3:GetObject\\"}"}}',
    mitre_technique_id: 'T1537',
    action: 'ALERT'
  },

  // =========================================================================
  // ATTACK CHAIN E: RANSOMWARE STAGING & SHADOW COPY DESTRUCTION (EVT-9226 - EVT-9250)
  // =========================================================================
  {
    id: 'EVT-9226',
    timestamp: '2026-08-26 20:30:05 UTC',
    severity: 'CRITICAL',
    event_type: 'Volume Shadow Copy Deletion via vssadmin',
    category: 'ENDPOINT',
    source_ip: '192.168.10.15',
    dest_ip: '192.168.10.15',
    protocol: 'PROCESS',
    username: 'SYSTEM',
    host: 'FILE-SRV-01',
    detection_rule: 'RULE-011: Shadow Copy Deletion & Backup Invalidation',
    rule_id: 'RULE-011',
    status: 'NEW',
    message: 'Process vssadmin.exe executed with parameters "delete shadows /all /quiet"',
    raw_log: '{"EventID": 4688, "NewProcessName": "C:\\\\Windows\\\\System32\\\\vssadmin.exe", "CommandLine": "vssadmin.exe delete shadows /all /quiet", "ParentProcessName": "C:\\\\Windows\\\\System32\\\\cmd.exe", "SubjectUserName": "SYSTEM"}',
    process_name: 'vssadmin.exe',
    command_line: 'vssadmin.exe delete shadows /all /quiet',
    parent_process: 'cmd.exe',
    mitre_technique_id: 'T1490',
    action: 'ALERT'
  },
  {
    id: 'EVT-9227',
    timestamp: '2026-08-26 20:30:12 UTC',
    severity: 'CRITICAL',
    event_type: 'Windows Recovery & Boot Configuration Tampering',
    category: 'ENDPOINT',
    source_ip: '192.168.10.15',
    dest_ip: '192.168.10.15',
    protocol: 'PROCESS',
    username: 'SYSTEM',
    host: 'FILE-SRV-01',
    detection_rule: 'RULE-012: BCDEDIT Boot Configuration Disabling',
    rule_id: 'RULE-012',
    status: 'NEW',
    message: 'Process bcdedit.exe modified boot status policy to ignore all boot failures',
    raw_log: '{"EventID": 4688, "NewProcessName": "C:\\\\Windows\\\\System32\\\\bcdedit.exe", "CommandLine": "bcdedit.exe /set {default} bootstatuspolicy ignoreallfailures && bcdedit.exe /set {default} recoveryenabled no", "ParentProcessName": "C:\\\\Windows\\\\System32\\\\cmd.exe"}',
    process_name: 'bcdedit.exe',
    command_line: 'bcdedit.exe /set {default} bootstatuspolicy ignoreallfailures',
    parent_process: 'cmd.exe',
    mitre_technique_id: 'T1490',
    action: 'ALERT'
  },
  {
    id: 'EVT-9228',
    timestamp: '2026-08-26 20:31:00 UTC',
    severity: 'CRITICAL',
    event_type: 'High-Volume File Renaming with Ransom Extension (.locked)',
    category: 'ENDPOINT',
    source_ip: '192.168.10.15',
    dest_ip: '192.168.10.15',
    protocol: 'FILESYSTEM',
    username: 'SYSTEM',
    host: 'FILE-SRV-01',
    detection_rule: 'RULE-010: High-Frequency File Encryption / Renaming Signature',
    rule_id: 'RULE-010',
    status: 'NEW',
    message: 'Over 850 documents (.docx, .xlsx, .pdf) renamed to .locked within 10 seconds in D:\\CorporateData',
    raw_log: '{"event": "file_rename", "count": 854, "path": "D:\\\\CorporateData\\\\Q3_Financials.xlsx.locked", "process": "C:\\\\Users\\\\Administrator\\\\AppData\\\\Local\\\\Temp\\\\enc.exe", "sha256": "4a71b28d08914ef10129a0081bb99281aef100223910cda00921102910fae109"}',
    file_hash: '4a71b28d08914ef10129a0081bb99281aef100223910cda00921102910fae109',
    mitre_technique_id: 'T1486',
    action: 'ALERT'
  },

  // =========================================================================
  // BENIGN & DIAGNOSTIC CORPORATE BASELINE TELEMETRY (EVT-9251 - EVT-9285)
  // =========================================================================
  {
    id: 'EVT-9251',
    timestamp: '2026-08-26 20:35:10 UTC',
    severity: 'INFO',
    event_type: 'Scheduled Enterprise Vulnerability Scan',
    category: 'NETWORK',
    source_ip: '10.0.1.50',
    dest_ip: '192.168.10.100',
    source_port: 41920,
    dest_port: 80,
    protocol: 'HTTP',
    username: 'nessus_scanner',
    host: 'VULN-SCANNER-01',
    detection_rule: 'RULE-900: Authorized Internal Scanner Traffic',
    rule_id: 'RULE-900',
    status: 'CLOSED',
    message: 'Authorized Tenable Nessus scanner probed HTTP port 80 during Change Request window CR-2026-881',
    raw_log: '{"src_ip": "10.0.1.50", "dst_ip": "192.168.10.100", "proto": "tcp", "method": "GET", "uri": "/robots.txt", "user_agent": "Mozilla/5.0 (compatible; Nessus/10.5)"}',
    action: 'ALLOW'
  },
  {
    id: 'EVT-9252',
    timestamp: '2026-08-26 20:36:22 UTC',
    severity: 'INFO',
    event_type: 'Microsoft SCCM Workstation Patch Distribution Sync',
    category: 'ENDPOINT',
    source_ip: '10.0.0.12',
    dest_ip: '192.168.10.45',
    source_port: 8530,
    dest_port: 49200,
    protocol: 'HTTP',
    username: 'SYSTEM',
    host: 'WSUS-SRV-01',
    detection_rule: 'RULE-901: Routine WSUS / SCCM Telemetry',
    rule_id: 'RULE-901',
    status: 'CLOSED',
    message: 'WSUS Server successfully pushed KB5034129 security rollup definitions to client WIN-CLIENT-08',
    raw_log: '{"EventID": 107, "Provider": "Microsoft-Windows-WindowsUpdateClient", "UpdateTitle": "Security Update KB5034129", "ResultCode": "Success"}',
    action: 'ALLOW'
  },
  {
    id: 'EVT-9253',
    timestamp: '2026-08-26 20:38:00 UTC',
    severity: 'LOW',
    event_type: 'Routine DNS Lookup to Internal Domain Controller',
    category: 'NETWORK',
    source_ip: '192.168.10.14',
    dest_ip: '10.0.0.1',
    source_port: 53102,
    dest_port: 53,
    protocol: 'DNS',
    username: 'SYSTEM',
    host: 'WIN-CLIENT-03',
    detection_rule: 'RULE-902: Baseline Internal DNS Resolution',
    rule_id: 'RULE-902',
    status: 'CLOSED',
    message: 'DNS query for time.windows.com resolved successfully to 51.145.123.29',
    raw_log: '{"src_ip": "192.168.10.14", "dst_ip": "10.0.0.1", "query": "time.windows.com", "qtype": "A", "rcode": "NOERROR"}',
    action: 'ALLOW'
  }
];

// Helper to generate a realistic deterministic extended stream of 180 total non-duplicate logs
export function getScaledSOCEvents(): SOCEvent[] {
  const categories: ('ENDPOINT' | 'NETWORK' | 'AUTHENTICATION' | 'CLOUD')[] = ['ENDPOINT', 'NETWORK', 'AUTHENTICATION', 'CLOUD'];
  const severities: ('LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')[] = ['LOW', 'LOW', 'MEDIUM', 'MEDIUM', 'HIGH', 'CRITICAL'];
  
  const additionalEvents: SOCEvent[] = [];
  const baseTimestamp = new Date('2026-08-26T20:40:00Z').getTime();

  for (let i = 1; i <= 170; i++) {
    const eventId = `EVT-${9300 + i}`;
    const time = new Date(baseTimestamp + i * 35000).toISOString().replace('T', ' ').replace('.000Z', ' UTC');
    const sev = severities[i % severities.length];
    const cat = categories[i % categories.length];

    let eventType = 'Routine Telemetry Heartbeat';
    let message = 'Telemetry baseline check passed';
    let srcIp = `192.168.10.${(i % 150) + 10}`;
    let dstIp = (i % 4 === 0) ? '185.220.101.' + ((i % 50) + 1) : `10.0.0.${(i % 20) + 1}`;
    let rule = 'RULE-100: Standard Ingestion Rule';
    let proto = (i % 3 === 0) ? 'HTTPS' : (i % 3 === 1) ? 'DNS' : 'SMB';
    let user = (i % 5 === 0) ? 'admin' : (i % 5 === 1) ? 'svc_task' : `analyst_${(i % 10) + 1}`;
    let host = (i % 2 === 0) ? `WIN-CLIENT-${(i % 25) + 1}` : `LINUX-SRV-${(i % 10) + 1}`;

    if (sev === 'CRITICAL') {
      eventType = (i % 2 === 0) 
        ? 'Cobalt Strike Named Pipe Malleable C2 Beacon' 
        : 'Suspicious DLL Search Order Hijacking in C:\\Windows\\Temp';
      message = (i % 2 === 0)
        ? `Injected process svchost.exe communicating with external C2 ${dstIp} over named pipe \\\\.\\pipe\\msse-491-server`
        : `Binary explorer.exe loaded untrusted DLL wsock32.dll from world-writable user path`;
      rule = 'RULE-015: Advanced In-Memory Threat Vector';
    } else if (sev === 'HIGH') {
      eventType = 'Anomalous Lateral Remote WMI Process Invocation';
      message = `WMI command Win32_Process.Create executed remotely from ${srcIp} to target host ${host}`;
      rule = 'RULE-025: Lateral Movement via WMI Exec';
    } else if (sev === 'MEDIUM') {
      eventType = 'Outbound Connection to Dynamic DNS Domain';
      message = `Workstation resolved duckdns.org dynamic subdomain with suspicious low TTL=60s`;
      rule = 'RULE-060: Dynamic DNS Tunneling Flag';
    } else {
      eventType = 'Standard Operating System Health & Telemetry Check';
      message = `Periodic audit heartbeat validated for host ${host}`;
      rule = 'RULE-999: Benign Telemetry Log';
    }

    additionalEvents.push({
      id: eventId,
      timestamp: time,
      severity: sev,
      event_type: eventType,
      category: cat,
      source_ip: srcIp,
      dest_ip: dstIp,
      source_port: 49152 + (i % 1000),
      dest_port: (proto === 'HTTPS') ? 443 : (proto === 'DNS') ? 53 : 445,
      protocol: proto,
      username: user,
      host: host,
      detection_rule: rule,
      rule_id: rule.split(':')[0],
      status: (sev === 'LOW') ? 'CLOSED' : 'NEW',
      message: message,
      raw_log: JSON.stringify({ event_id: eventId, timestamp: time, severity: sev, host, user, src_ip: srcIp, dst_ip: dstIp, message }),
      action: (sev === 'CRITICAL' || sev === 'HIGH') ? 'ALERT' : 'ALLOW'
    });
  }

  return [...BATCH_1_EVENTS, ...additionalEvents];
}
