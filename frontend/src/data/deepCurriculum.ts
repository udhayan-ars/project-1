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
  }
};
