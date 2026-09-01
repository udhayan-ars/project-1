# Technical Documentation & Academic Project Report

# LMCYS — Let’s Make Cyber Security Simple

**A Gamified SOC Level 1 Training Platform & Synthetic Security Operations Range**

---

## 1. Abstract
Cybersecurity operations demand critical thinking, rapid telemetry triage, and evidence-based decision making. Traditional pedagogical tools in academia rely almost exclusively on passive video lectures and rote-memorization multiple-choice exams, leaving a significant capability gap for graduates entering entry-level Security Operations Center (SOC Tier 1) roles. **LMCYS (Let’s Make Cyber Security Simple)** is a full-stack, gamified cybersecurity learning and training ecosystem. It combines a 100-level progressive roadmap, interactive terminal sandboxes, synthetic SIEM log correlation, True Positive / False Positive triage workflows, an automated 13-section incident report rubric evaluator, and a progressive AI SOC Mentor. LMCYS enforces exam integrity through browser-level anti-cheat telemetry and awards cryptographically verifiable digital credentials upon curriculum completion.

---

## 2. Introduction
Modern enterprise security teams depend heavily on SOC Level 1 analysts as their first line of defense. Analysts must continuously monitor Security Information and Event Management (SIEM) consoles, dissect Windows/Linux event logs, validate alerts, contain compromised endpoints, and write comprehensive incident reports. LMCYS introduces a modern, cyber-themed gamified training platform that transforms cybersecurity education into an engaging, problem-solving journey.

---

## 3. Problem Statement
1. **Disconnection from Real Telemetry**: Students rarely see actual Windows Security logs (e.g. Event ID 4625 brute force patterns) or network packet flow anomalies before entering the workforce.
2. **Lack of Incident Investigation Practice**: Academic platforms test definitions (e.g. "What is CIA Triad?") rather than investigating a multi-stage attack and classifying True Positives versus False Positives.
3. **Absence of Report-Writing Training**: In actual SOC environments, half the job is documenting evidence, identifying MITRE ATT&CK techniques, and writing root-cause remediation steps. Existing LMS tools lack automated report evaluation.
4. **Academic Dishonesty in Online Exams**: Remote learning lacks focus and integrity enforcement, enabling students to switch tabs or use external answers without logging.

---

## 4. Existing System
Existing cybersecurity learning systems (e.g. standard generic quiz websites, generic learning management systems) provide static course modules where students read text and answer multiple-choice questions.

---

## 5. Limitations of Existing System
* **No Real-Time Log Querying**: Inability to filter and search synthetic SIEM or EDR logs.
* **No Gamified Skill Progression**: Lack of visual level progression, XP, badges, and unlockable sectors.
* **No Adaptive Weak-Topic Remediation**: Failure to analyze which specific topic tags (e.g. DNS vs Event IDs) the student failed.
* **No Automated Incident Report Grading**: Incident reports must either be manually graded by an instructor or omitted completely.
* **No Anti-Cheat Guarding**: Browser focus shifts and window blur events are ignored.

---

## 6. Proposed System (LMCYS)
LMCYS provides an end-to-end, gamified, production-grade training platform:
* **"Are You an Idiot?" Mindset Calibration**: Motivational onboarding to foster an analytical problem-solving mindset.
* **100-Level Curriculum Map across 10 Zones**: From Networking and Windows Fundamentals to EDR and Incident Response.
* **Hands-on Safe Simulation Labs**: Interactive terminal interfaces to inspect packet flows and query event logs without executing dangerous code.
* **Synthetic SOC Arena**: Live alert queues and synthetic SIEM log streamer with search and filter capabilities.
* **Automated 13-Section Incident Report Evaluator**: Heuristic grading of technical accuracy, MITRE ATT&CK alignment, concrete evidence, root cause 5-whys, and actionable remediation.
* **Progressive AI SOC Mentor**: Multi-tier scaffolding without spoiling assessment answers.
* **Anti-Cheat Monitoring**: Tab switch and window blur detection with live penalty warnings and audit logging.

---

## 7. Objectives
1. Provide a zero-setup, gamified SOC L1 training environment for students.
2. Equip students with practical log analysis skills for Windows EVTX (4624, 4625, 4688, 7045) and network protocols.
3. Train students to distinguish True Positives from False Positives (e.g. authorized vulnerability scanners vs active credential stuffing).
4. Automate incident report evaluation using an objective 5.0 rubric standard.
5. Generate verifiable digital certificates with unique verification hashes.

---

## 8. Scope
* **Target Audience**: Undergraduate computer science / cybersecurity students, junior SOC cadets, and aspiring security analysts.
* **Simulated Environment**: Safe synthetic cybersecurity logs and event telemetry without live malware execution.
* **Deployment**: Docker containerization with cloud-ready architecture (AWS/GCP/Azure).

---

## 9. Functional Requirements
* **FR-01 (Authentication)**: Register and Login with Argon2/Bcrypt password hashing and JWT token issuance.
* **FR-02 (Mindset Check)**: Adaptive motivational screen for initial user onboarding.
* **FR-03 (Curriculum Engine)**: 100 levels mapped across 10 modules with sequential unlocking upon achieving $\ge 70\%$ in assessments.
* **FR-04 (Practical Terminal Lab)**: Simulated command line allowing `inspect --flow`, `evtx --filter`, and verification checks.
* **FR-05 (Anti-Cheating Guard)**: Event listener for `visibilitychange` and `blur` with audit logging and score penalties.
* **FR-06 (Adaptive Weak-Topics)**: Topic-level accuracy tracking ($<60\%$ marked as Needs Revision).
* **FR-07 (SOC Arena & Log Streamer)**: Searchable synthetic log database (Category, Severity, Event ID, IP).
* **FR-08 (TP/FP Triage)**: Decision submission with immediate verdict verification and concept hints.
* **FR-09 (Incident Report Studio)**: 13-section form with automated heuristic score calculation ($0.0 - 5.0$).
* **FR-10 (AI SOC Mentor)**: Progressive hint system (Hint 1 $\rightarrow$ Hint 2 $\rightarrow$ Concept Explanation).
* **FR-11 (Certificate Generator)**: Verifiable certificate with cryptographic hash and print-ready layout.
* **FR-12 (Admin Command Center)**: User management, audit logs, and report review.

---

## 10. Non-Functional Requirements
* **NFR-01 (Security)**: Password encryption, HTTP security headers via Helmet, rate limiting on authentication and API endpoints, CORS protection, SQL injection prevention via parameterized queries.
* **NFR-02 (Performance)**: Sub-100ms API response time with SQLite WAL mode / indexed tables; paginated synthetic logs.
* **NFR-03 (Reliability)**: 99.9% uptime target with container restart policies.
* **NFR-04 (Usability & UI/UX)**: Dark cybersecurity theme, responsive layout, glassmorphic HUD, and synthesized Web Audio sound feedback.

---

## 11. System Architecture
```
[ Client Browser (React 18 + Vite + Cyber HUD) ]
                     │  REST APIs (JWT + Rate-Limited)
                     ▼
[ Express + TypeScript Backend Application Layer ]
   ├── Authentication & RBAC Middleware
   ├── Evaluation & Weak-Topic Engine
   ├── Anti-Cheat Telemetry Recorder
   └── AI SOC Mentor Scaffolding Service
                     │
                     ▼
[ Database Layer: SQLite (Local) / PostgreSQL (Cloud) ]
   └── 24 Normalized Tables & Indices
```

---

## 12. Data Flow
1. User logs in $\rightarrow$ Receives JWT token $\rightarrow$ Completes Mindset check $\rightarrow$ Routes to World Map.
2. User selects Level 1 $\rightarrow$ Reads Lesson overview $\rightarrow$ Runs Practical Lab terminal commands $\rightarrow$ Starts Assessment.
3. Assessment triggers Anti-Cheat Guard $\rightarrow$ Submits answers $\rightarrow$ Server computes score, logs tab switches, updates Weak Topics, awards XP, and unlocks Level 2.
4. User enters SOC Arena $\rightarrow$ Selects Alert `LMCYS-4821` $\rightarrow$ Queries synthetic logs $\rightarrow$ Submits TP/FP verdict $\rightarrow$ Drafts 13-section Incident Report.
5. Server evaluates report against rubric $\rightarrow$ Awards score and badge $\rightarrow$ Generates Certificate.

---

## 13. Use Case Diagram
* **Actors**: Student (Cadet), SOC Administrator, AI Mentor.
* **Student Use Cases**: Register/Login, Complete Mindset, Study Level, Run Lab Commands, Take Anti-Cheat Assessment, Triage SOC Alerts, Write Incident Reports, View Weak Topics, Download Certificate.
* **Admin Use Cases**: View Cadet Analytics, Inspect Anti-Cheat Audit Logs, Review Incident Reports, Manage System Telemetry.

---

## 14. Entity Relationship (ER) Diagram
* `users` (1) $\longleftrightarrow$ (M) `assessment_attempts`
* `levels` (1) $\longleftrightarrow$ (M) `questions` $\longleftrightarrow$ (M) `question_options`
* `levels` (1) $\longleftrightarrow$ (1) `practical_labs`
* `users` (1) $\longleftrightarrow$ (M) `weak_topics`
* `alerts` (1) $\longleftrightarrow$ (M) `investigations`
* `reports` (1) $\longleftrightarrow$ (1) `report_scores`
* `users` (1) $\longleftrightarrow$ (1) `certificates`
* `users` (1) $\longleftrightarrow$ (M) `tab_switch_events`

---

## 15. Database Design (24 Normalized Entities)
Full schema with constraints and foreign keys implemented in `backend/src/config/db.ts`.

---

## 16. Module Description
1. **Module 1 — Networking Fundamentals** (Levels 1–10)
2. **Module 2 — Windows Fundamentals** (Levels 11–20)
3. **Module 3 — Linux Fundamentals** (Levels 21–28)
4. **Module 4 — Cybersecurity Fundamentals** (Levels 29–38)
5. **Module 5 — SOC Fundamentals** (Levels 39–48)
6. **Module 6 — SIEM & Telemetry** (Levels 49–60)
7. **Module 7 — Detection & Investigation** (Levels 61–72)
8. **Module 8 — EDR & Endpoint Security** (Levels 73–80)
9. **Module 9 — Incident Response** (Levels 81–90)
10. **Module 10 — SOC L1 Final Simulation Arena** (Levels 91–100)

---

## 17. Technology Stack
* **Frontend**: React 18, TypeScript, Vite, Vanilla CSS Cyber Design System, Lucide-React, Canvas Confetti, Web Audio API.
* **Backend**: Node.js 20, Express, TypeScript, Better-SQLite3, Bcryptjs, JsonWebToken, Helmet, Express-Rate-Limit, Morgan.
* **DevOps**: Docker, Docker Compose, Nginx, GitHub Actions.

---

## 18. Security Architecture
* **Argon2 / Bcrypt Password Hashing**: Minimum 10 salt rounds; no plaintext passwords stored.
* **Stateless Secure JWT Authentication**: Verified on all guarded routes.
* **Rate Limiting**: Throttles brute force authentication attempts.
* **Input Sanitization**: Prevents XSS and SQL injection.
* **Audit Logging**: Immutable telemetry for all administrative and anti-cheat events.

---

## 19. Testing & Validation
* **Unit & Integration Builds**: Verified with `npm run build` in both frontend and backend.
* **API Route Testing**: Authentication, Level retrieval, Assessment submission, and Report evaluation verified end-to-end.
* **Anti-Cheat Verification**: Confirmed visibility loss and blur event captures.

---

## 20. Deployment Architecture (Cloud-Ready)
* **AWS Architecture Blueprint**: Route 53 $\rightarrow$ CloudFront $\rightarrow$ S3/Nginx (Frontend) + Application Load Balancer $\rightarrow$ ECS Fargate (Backend API) $\rightarrow$ Amazon RDS PostgreSQL + AWS Secrets Manager + CloudWatch Logs.
* **Local Development**: Docker Compose with `lmcys-frontend` and `lmcys-backend` containers.

---

## 21. Results
The platform demonstrates an engaging, interactive learning environment where students master SOC Tier 1 concepts by actively triaging alerts and writing graded incident reports.

---

## 22. Future Enhancements
1. Dynamic Docker-in-Docker isolated container labs for live packet replay.
2. Integration with live Wazuh and Suricata SIEM sensors.
3. Real-time multiplayer SOC team challenge events.

---

## 23. Conclusion
LMCYS successfully replaces passive cybersecurity coursework with an active, gamified SOC Level 1 operational training platform. By combining structured 100-level learning, interactive sandboxes, synthetic SIEM log analysis, and automated incident report grading, LMCYS prepares cadets for immediate industry readiness.
