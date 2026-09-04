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
- **AI:** LLM provider with native tool/function calling — implemented behind a provider abstraction (`LLM_PROVIDER=openai|groq`, both via the OpenAI-compatible chat-completions API). Verified live with Groq `openai/gpt-oss-120b`; OpenAI `gpt-4o-mini` supported but unverified (account had no credits).
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
- **Task 9 — Frontend Foundation:** Initialized Next.js 16 (App Router, TypeScript, Tailwind CSS v4) at the repository root with shadcn/ui (radix-nova style). Implemented design tokens from `docs/frontend-uiux.md` in `src/app/globals.css` (brand, surface, status, AI, and domain colors with light/dark values), Inter typography, responsive app shell (`src/components/layout/`: sticky desktop sidebar ≥lg, mobile header + sheet drawer <lg), all 7 routes (`/dashboard`, `/schedule`, `/rooms`, `/events`, `/announcements`, `/assignments`, `/ai` — `/` redirects to `/dashboard`), shared `PageHeader`/`EmptyState`/`ErrorState` components, `error.tsx` + `not-found.tsx` boundaries, and shadcn/ui primitives (button, card, badge, input, select, dialog, table, skeleton, sheet, separator, label). Pages show honest empty states — no fake data, no backend logic, no AI logic.
- **Task 5 — AI Agent Foundation (T2):** Provider-agnostic agent core with native tool calling, `POST /api/chat`, server-injected campus clock, safety system prompt, tool registry, 13 passing unit tests (mock provider), and a live smoke test against Groq. Files: `src/lib/ai/{agent,prompt,datetime,errors}.ts`, `src/lib/ai/provider/{types,openai,index}.ts`, `src/lib/ai/tools/{registry,index,get-current-datetime}.ts`, `src/lib/ai/__tests__/*.test.ts`, `src/app/api/chat/route.ts`, `src/types/ai.ts`, `scripts/ai-smoke.ts`, `vitest.config.ts`. Deps added: `openai`, `zod@^4`; dev `vitest@^3`, `tsx`, `dotenv`. Scripts: `npm test`, `npm run ai:smoke`. None of the 9 campus tools yet (Tasks 6–7).

### In Progress
- N/A

### Blocked
- **Tasks 6–7 (AI tools)** wait on Teammate 1's services (Tasks 2–4). T1's work is on branch `Supabase-Foundation`, not yet on `main`; it was branched before Task 9 so it needs a rebase onto `main` before merging.

### Known Issues
- Groq model IDs rotate; `llama-3.3-70b-versatile` is gone from the free tier. Default is `openai/gpt-oss-120b`; override via `GROQ_MODEL`.
- The OpenAI provider path is code-complete but unverified live (test account returned `insufficient_quota`).

### Decisions
- Supabase PostgreSQL chosen as persistent database.
- JSON files are seed data only.
- AI uses native tool calling.
- Backend services are shared by dashboard and AI.
- Frontend follows `docs/frontend-uiux.md`.
- Next.js app lives at the repository root (single app for frontend, backend API/server actions, and AI agent).
- shadcn/ui initialized with the radix-nova style; components live in `src/components/ui/`.
- **AI (Task 5):** One `OpenAICompatibleProvider` class serves OpenAI and Groq (`baseURL` override); switch with `LLM_PROVIDER`. `/api/chat` is non-streaming JSON; `toolEvents` are returned post-hoc so the UI can render Checking/Booking/Completed/Failed states (streaming can be added in Task 16/18 without touching the tool layer). Student identity is passed as `ChatRequest.user` (no auth yet); if absent the agent asks, never guesses. Tool calls execute sequentially. Campus clock uses `CAMPUS_TIMEZONE` (default `Asia/Dhaka`) and is injected into the system prompt on every request — never hardcoded. Tool failures return to the model as `{ ok: false, error }` (never thrown) so it explains them honestly. `vitest` is the shared test runner — add tests under `src/**/*.test.ts`, don't introduce another runner.

## 6. Task Status System
Statuses: NOT STARTED, IN PROGRESS, BLOCKED, READY FOR INTEGRATION, COMPLETED, NEEDS FIX.

| Task | Area | Owner | Status |
|------|------|-------|--------|
| Task 1: Project + Supabase Foundation | Backend | T1 | NOT STARTED |
| Task 2: Backend CRUD | Backend | T1 | NOT STARTED |
| Task 3: Room Booking | Backend | T1 | NOT STARTED |
| Task 4: Event Registration | Backend | T1 | NOT STARTED |
| Task 5: AI Agent Foundation | AI | T2 | COMPLETED |
| Task 6: AI Read Tools | AI | T2 | NOT STARTED |
| Task 7: AI Action Tools | AI | T2 | NOT STARTED |
| Task 8: AI Reasoning & Safety | AI | T2 | NOT STARTED |
| Task 9: Frontend Foundation | Frontend| T3 | COMPLETED |
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
*Pending Implementation (Task 1)*
- **Tables:** `schedules`, `rooms`, `room_bookings`, `events`, `event_registrations`, `announcements`, `assignments`
- **Migration Location:** TBD
- **Seed Location:** `data/` (JSON files to be imported)

## 8. API / Service Contract
*Pending Implementation (Tasks 2-4)*

## 9. AI Tool Contract

### Agent API (implemented — Task 5)
`POST /api/chat` (Node runtime, non-streaming). Types live in `src/types/ai.ts`.

```ts
// Request
{ messages: { role: "user" | "assistant"; content: string }[];   // 1–40 msgs, ≤4000 chars each, last must be "user"
  user?: { student_id: string; name: string } }                    // optional identity; agent asks if missing

// 200 Response
{ reply: string;
  toolEvents: { id; name; args; status: "completed" | "failed"; summary }[];
  now: { date; time; weekday; timezone; timestamp; weekStart; weekEnd } }

// 400 / 500 / 502 Response
{ error: { code: string; message: string } }   // sanitized; never leaks keys/stack traces
```

### Adding a tool (Tasks 6–7)
1. Create `src/lib/ai/tools/<tool-name>.ts` exporting a `ToolDefinition` (`name`, `description`, zod `schema`, `execute(params, ctx)`, optional `progressLabel`).
2. `execute` must call the backend service layer (`src/services/*`) and map its `ServiceResponse` to `toolOk(data)` / `toolError(code, message)`. Never query Supabase directly from a tool.
3. Register it in `createDefaultRegistry()` in `src/lib/ai/tools/index.ts`.
4. `ctx.now` gives the campus clock; `ctx.user` may be undefined.
5. Add a mock-provider test in `src/lib/ai/__tests__/`.

### Tools
| Tool | Owner | Status | Backend Dependency |
|------|-------|--------|--------------------|
| get_current_datetime *(utility, not one of the 9)* | T2 | COMPLETED | none |
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
- **Framework:** Next.js 16 (App Router, TypeScript, Tailwind CSS v4, shadcn/ui) initialized at repo root. `npm run dev` starts the app.
- **Routes (created, placeholder empty states pending data integration):** `/` (redirects to `/dashboard`), `/dashboard`, `/schedule`, `/rooms`, `/events`, `/announcements`, `/assignments`, `/ai`.
- **Shell:** `src/components/layout/` — `AppShell`, `AppSidebar` (desktop ≥lg), `AppHeader` + sheet drawer (mobile), `SidebarNav` with active-route highlighting.
- **Shared components:** `src/components/` — `PageHeader`, `EmptyState`, `ErrorState`; shadcn/ui primitives in `src/components/ui/` (button, card, badge, input, select, dialog, table, skeleton, sheet, separator, label).
- **Design tokens:** `src/app/globals.css` per `docs/frontend-uiux.md` (light + dark values; Tailwind utilities like `text-ai-accent`, `bg-danger/10`, `text-schedule` available).
- **Pending:** Tasks 10–16 (dashboard widgets with real data, per-system CRUD UIs, AI chat interface).

## 10a. Environment Variables (AI)
See `.env.example`. All server-only.
- `LLM_PROVIDER` — `openai` (default) or `groq`
- `OPENAI_API_KEY`, `OPENAI_MODEL` (default `gpt-4o-mini`)
- `GROQ_API_KEY`, `GROQ_MODEL` (default `openai/gpt-oss-120b`)
- `CAMPUS_TIMEZONE` — IANA zone used to resolve today/tomorrow (default `Asia/Dhaka`)

## 10b. Current Next Step
- **T2:** Task 6 (read tools) once T1's `src/services/*` land on `main`; tool schemas can be pre-written from `AGENTS.md` §7.
- **T1:** Rebase `Supabase-Foundation` onto `main` (keep Task 9 files), merge, push Tasks 2–4.
- **T3:** Task 10+; build Task 16 against the `/api/chat` contract in §9.

## 11. Git / Collaboration Rules
- `git pull origin main` before starting work.
- Never blindly overwrite teammate work.
- Run tests and verify changes before pushing.
- Commit messages should clearly describe the work (e.g., `feat(db): add Supabase schema`).
- Update `project-context.md` after pushing.
