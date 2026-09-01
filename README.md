# LMCYS — Let’s Make Cyber Security Simple

> **A Production-Quality Gamified Cybersecurity Training & SOC Level 1 Simulation Platform**
> *Final-Year Engineering Project*

---

## 🌟 Executive Overview & USP

**LMCYS** bridges the gap between theoretical classroom cybersecurity and frontline industry operations. Traditional cybersecurity education relies heavily on static multiple-choice quizzes without exposing students to actual SIEM telemetry, Windows Event Viewer IDs, or NIST incident investigation procedures.

LMCYS implements a complete, hands-on operational paradigm:
$$\text{Learn} \longrightarrow \text{Practice} \longrightarrow \text{Investigate} \longrightarrow \text{Analyze} \longrightarrow \text{Report} \longrightarrow \text{Prove SOC Skills}$$

---

## 🚀 Key Platform Features

1. **Cyberpunk HUD & Gamified World Map**:
   - 10 Progressive Cyber Zones (Networking, Windows, Linux, CIA Triad, SOC Triage, SIEM, Detection, EDR, Incident Response, Battle Arena)
   - 100-Level structured curriculum with real-time level unlocking and XP gain.
2. **"Are You an Idiot?" Mindset Onboarding**:
   - Motivational cognitive calibration screen that transforms self-doubt into analytical problem solving.
3. **Interactive 3-Tier Level Studio**:
   - **Learn**: Rich architectural guides, diagrams, and SOC analyst takeaways.
   - **Practice**: Interactive terminal sandbox simulating packet dissections, Windows Event log filtering, and port checks.
   - **Assessment**: Anti-cheat guarded quiz with countdown timer and score evaluation.
4. **Anti-Cheating Integrity Engine**:
   - Browser visibility change, tab-switching, and window blur detection with live penalty warnings and immutable audit logging.
5. **Adaptive Learning & Weak-Topic Radar**:
   - Tracks per-topic accuracy (e.g. *OSI Model*, *DNS*, *Event IDs 4625/4624*, *Brute Force*) into classification brackets (*Mastered $\ge 95\%$*, *Passed $80-94\%$*, *Review Recommended $60-79\%$*, *Needs Revision $<60\%$*).
6. **SOC Practical Arena & Synthetic SIEM Telemetry**:
   - Filterable, searchable synthetic log stream (Windows Security, EDR, Firewall, DNS, Linux auth).
   - Real-time Alert Triages (e.g. `LMCYS-4821` RDP Brute Force, `LMCYS-1044` Nessus Scanner).
   - Multi-step investigation: Evidence selection, MITRE technique alignment, True Positive vs False Positive decision.
7. **13-Section Incident Report Studio & Auto-Evaluator**:
   - Complete NIST/SANS compliant incident report builder.
   - Instant heuristic rubric evaluator scoring reports from `0.0` to `5.0` across 5 dimensions (Completeness, Technical Accuracy, Evidence, Root Cause 5-Whys, and Actionable Remediation).
8. **Verifiable Digital Certificate**:
   - Cryptographically verifiable credential with verification hash and public validator.
9. **Progressive AI SOC Mentor**:
   - Socratic assistant offering multi-tier hints (*Hint 1 $\rightarrow$ Hint 2 $\rightarrow$ Concept Review*) while strictly preventing assessment answer leakage.
10. **Admin Command Center**:
    - Cadet progress tracking, cheating flag audits, report grading overview, and immutable system telemetry logs.

---

## 🔑 Access & Enrollment
- **Cadet Registration**: Join the Academy via the registration form (Full Name, Email, Password, Age, Referrer, Course, Academic Year, College). Profile is automatically written to `/database/<FullName>.txt` and indexed in `_email_index.txt`.
- **SOC Administrator**: `admin@lmcys.cyber` / `Admin@12345` (Full System & Audit Access).

---

## 💻 Local Development Setup (Quick Start)

### Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **npm**: v9+

### 1. Backend Launch
```bash
cd backend
npm install
npm run dev
```
*The backend API server will initialize the SQLite database, seed all 100 levels, synthetic logs, alerts, and badges, and listen on `http://localhost:5000`.*

### 2. Frontend Launch
In a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The Vite development server will launch on `http://localhost:5173`.*

---

## 🐳 Docker Deployment (One-Command)

## ⚙️ Development Setup & Port Alignment

### Standard Port Configuration
- **Backend API Server**: Port `5001` (`PORT=5001` in `backend/.env`)
- **Frontend Dev Server**: Port `5173` (`http://localhost:5173`)
- **Vite Proxy**: Dynamically proxies all `/api/*` requests from `5173` to `5001` (reads `PORT` / `VITE_API_PORT` / `BACKEND_PORT` / `VITE_API_URL`).

> **Note on Port Alignment**: The backend defaults to port `5001` and Vite dynamically forwards `/api` requests to `http://localhost:5001`. To customize the backend port, set `PORT=<custom_port>` in `backend/.env` or `VITE_API_PORT=<custom_port>` in `frontend/.env`.

### Quick Start (Local)

1. **Start Backend**:
   ```bash
   cd backend
   cp .env.example .env   # Uses PORT=5001 out-of-the-box
   npm install
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Open Application**: Navigate to `http://localhost:5173`

---

## 🐳 Docker Deployment

To spin up the entire production container stack:
```bash
docker compose up --build
```
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api/health`

---

## 🏛️ Repository Architecture

```
project 1/
├── docker-compose.yml           # Multi-container orchestration
├── README.md                    # Quick start & feature guide
├── DOCUMENTATION.md             # 33-section academic project report
├── .github/workflows/ci.yml     # Automated CI/CD pipeline
├── backend/                     # Express + TypeScript + SQLite DB Engine
│   ├── Dockerfile
│   ├── src/
│   │   ├── config/db.ts         # Database init (24 normalized entities)
│   │   ├── services/seedData.ts # 100-level roadmap + synthetic logs seed
│   │   ├── services/evaluationService.ts # Weak topic & report rubric evaluator
│   │   ├── middleware/auth.ts   # JWT & RBAC
│   │   ├── routes/              # Modular REST endpoints
│   │   └── server.ts
└── frontend/                    # React 18 + Vite + Cyberpunk Design System
    ├── Dockerfile
    ├── src/
    │   ├── context/             # AuthContext & Web Audio SoundContext
    │   ├── components/          # Navbar, CyberParticles, AntiCheatGuard, AIMentor, Certificate
    │   └── pages/               # Landing, Mindset, WorldMap, LevelStudy, SocArena, ReportStudio, Dashboard, Admin
```
