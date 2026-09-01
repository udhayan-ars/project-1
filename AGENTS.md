# AGENTS.md — LMCYS

## Project
LMCYS ("Let's Make Cyber Security Simple") is a gamified SOC L1 analyst training platform: 100 progressive learning levels + a "Let's Defend" SOC investigation environment with 1000+ simulated logs, report evaluation, and certificate generation.

## Stack
- Frontend: React 18 + TypeScript + Vite, Tailwind CSS, Recharts, Lucide icons
- Backend: Node.js + Express + TypeScript, better-sqlite3 (PostgreSQL-compatible SQL schemas)
- Auth: JWT sessions, bcryptjs password hashing, rate-limiting middleware
- Testing: Vitest / Jest test runner scripts & smoke test suites

## Non-negotiable engineering rules
- No feature from the PRD gets silently dropped or stubbed as TODO without flagging it back to the user explicitly.
- Never put database credentials, JWT secrets, or demo account credentials in frontend code — env vars only, loaded server-side.
- All simulated attack/log content must be clearly fictional/sandboxed — no code that touches real external hosts.
- Every uploaded file (incident reports) is untrusted: validate type/size, never execute it, store outside the web root or in sandboxed storage.
- Passwords: hashed only (bcrypt), never logged, never returned in API responses.
- Every API route that changes state needs input validation + auth/role check.
- Don't load all 1000+ logs into the browser at once — paginate/query server-side.
- After any backend change, run the test suite / a smoke script before declaring the task done. If no tests exist yet for the touched area, write a minimal one first.
- Keep frontend, backend, DB models, and services in separate directories — no monolithic files.
- Comment non-obvious logic (score calculation, cooldown timers, tab-switch penalty, report rating algorithm).

## Definition of done for any task in this project
1. Code builds/runs locally without errors (`npm run build` passing in both frontend and backend).
2. Relevant automated test or manual verification script passes.
3. No secrets or credentials committed in frontend bundles.
4. Feature matches the acceptance criteria given in the prompt, not a simplified version of it.
