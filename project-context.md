# CampusOS Project Context

This is a **LIVING DOCUMENT**. Every teammate must read it before starting a task and update it after completing a task. Never delete useful information written by another teammate. It must always represent the current state of the repository.

## 1. Project Overview
CampusOS is an intelligent university operating system powered by an AI agent that understands and acts on real-time campus data.

- **Frontend:** Next.js (Dashboard & AI Agent)
- **Backend Services:** Next.js Server Actions / API Layer
- **Database:** Supabase PostgreSQL (Single Source of Truth)
- **AI Agent:** LLM provider with native tool/function calling

## 2. Technology Stack
- **Frontend:** Next.js, App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js server/API architecture, TypeScript, Service layer
- **Database:** Supabase PostgreSQL
- **AI:** LLM provider with native tool/function calling (e.g., Groq or OpenAI)
- **Data:** Repository JSON files are seed data ONLY.

## 3. Core Architecture
```text
Frontend (Dashboard & AI Agent)
   ↓
API / Server Actions
   ↓
Service Layer
   ↓
Supabase PostgreSQL (Single Source of Truth)
```

## 4. Team Ownership
- **Teammate 1 (Backend & Database):** Supabase, PostgreSQL schema, migrations, seed data, backend validation, CRUD, room booking, event registration, backend testing.
- **Teammate 2 (AI Agent):** LLM integration, agent architecture, native tool calling, backend integration, multi-tool reasoning, date/time reasoning.
- **Teammate 3 (Frontend & UI/UX):** Next.js, Tailwind, shadcn/ui, design system, dashboard, AI UI, loading/empty/error states. Must follow `docs/frontend-uiux.md`.

## 5. Current Implementation Summary

### Completed
- **Frontend Design System Guidelines:** Created `docs/frontend-uiux.md` outlining typography, colors, layout, and UI state conventions.
- **Project Structure Analysis:** Audited seed data and schemas.
- **Next.js & Supabase Foundation:** Initialized Next.js, Tailwind, TypeScript, Supabase client/server utilities, database schema, types, and seed scripts.

### In Progress
- N/A

### Blocked
- N/A

### Known Issues
- N/A

### Decisions
- Supabase PostgreSQL chosen as persistent database.
- JSON files are seed data only.
- AI uses native tool calling.
- Backend services are shared by dashboard and AI.
- Frontend follows `docs/frontend-uiux.md`.
- Next.js framework initialized in the root directory.

## 6. Task Status System
Statuses: NOT STARTED, IN PROGRESS, BLOCKED, READY FOR INTEGRATION, COMPLETED, NEEDS FIX.

| Task | Area | Owner | Status |
|------|------|-------|--------|
| Task 1: Project + Supabase Foundation | Backend | T1 | COMPLETED |
| Task 2: Backend CRUD | Backend | T1 | NOT STARTED |
| Task 3: Room Booking | Backend | T1 | NOT STARTED |
| Task 4: Event Registration | Backend | T1 | NOT STARTED |
| Task 5: AI Agent Foundation | AI | T2 | NOT STARTED |
| Task 6: AI Read Tools | AI | T2 | NOT STARTED |
| Task 7: AI Action Tools | AI | T2 | NOT STARTED |
| Task 8: AI Reasoning & Safety | AI | T2 | NOT STARTED |
| Task 9: Frontend Foundation | Frontend| T3 | NOT STARTED |
| Task 10: Dashboard | Frontend| T3 | NOT STARTED |
| Task 11: Schedule UI | Frontend| T3 | NOT STARTED |
| Task 12: Rooms UI | Frontend| T3 | NOT STARTED |
| Task 13: Events UI | Frontend| T3 | NOT STARTED |
| Task 14: Announcements UI | Frontend| T3 | NOT STARTED |
| Task 15: Assignments UI | Frontend| T3 | NOT STARTED |
| Task 16: AI Agent UI | Frontend| T3 | NOT STARTED |
| Task 17: Frontend ↔ Backend Integration | Integration | ALL | NOT STARTED |
| Task 18: AI ↔ Backend Integration | Integration | T1+T2 | NOT STARTED |
| Task 19: Full End-to-End Integration | Integration | ALL | NOT STARTED |
| Task 20: Backend Testing | Testing | T1 | NOT STARTED |
| Task 21: AI Testing | Testing | T2 | NOT STARTED |
| Task 22: Frontend Testing | Testing | T3 | NOT STARTED |
| Task 23: Judge Demo Testing | Testing | ALL | NOT STARTED |
| Task 24: Security Review | Hardening | ALL | NOT STARTED |
| Task 25: Data Consistency Review | Hardening | T1+T2 | NOT STARTED |
| Task 26: UI Polish | Hardening | T3 | NOT STARTED |
| Task 27: README | Finalization | ALL | NOT STARTED |
| Task 28: Deployment | Finalization | ALL | NOT STARTED |
| Task 29: Final Hackathon Review | Finalization | ALL | NOT STARTED |

## 7. Database Contract
*Implemented (Task 1)*
- **Tables:** `schedules`, `rooms`, `room_bookings`, `events`, `event_registrations`, `announcements`, `assignments`
- **Migration Location:** `supabase/migrations/0001_initial_schema.sql`
- **Seed Location:** `scripts/seed.ts` (Parses from `data/`)

## 8. API / Service Contract
*Pending Implementation (Tasks 2-4)*

## 9. AI Tool Contract
| Tool | Owner | Status | Backend Dependency |
|------|-------|--------|--------------------|
| get_schedule | T2 | NOT STARTED | schedules |
| get_next_class | T2 | NOT STARTED | schedules |
| get_assignments | T2 | NOT STARTED | assignments |
| get_announcements | T2 | NOT STARTED | announcements |
| get_events | T2 | NOT STARTED | events |
| check_room_availability | T2 | NOT STARTED | rooms/bookings |
| book_room | T2 | NOT STARTED | room booking |
| register_for_event | T2 | NOT STARTED | event registration |
| cancel_registration | T2 | NOT STARTED | event registration |

## 10. Frontend Status
*Pending Implementation (Tasks 9-16)*
- **Routes:** `/dashboard`, `/schedule`, `/rooms`, `/events`, `/announcements`, `/assignments`, `/ai` (To be created)

## 11. Git / Collaboration Rules
- `git pull origin main` before starting work.
- Never blindly overwrite teammate work.
- Run tests and verify changes before pushing.
- Commit messages should clearly describe the work (e.g., `feat(db): add Supabase schema`).
- Update `project-context.md` after pushing.
