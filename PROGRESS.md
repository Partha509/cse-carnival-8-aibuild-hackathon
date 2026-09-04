# CampusOS — Development Progress

## 1. Status Legend

- `[x]` Completed
- `[~]` In Progress
- `[ ]` Not Started
- `[!]` Blocked

## 2. Project Status
**Overall State:** Foundation Phase.
The repository holds the official problem statement, seed data schemas, architecture documentation, the initialized Next.js frontend foundation (Task 9), and the AI agent foundation (Task 5: provider abstraction, native tool-calling loop, `/api/chat`). Backend services (Tasks 1–4) are in progress on Teammate 1's `Supabase-Foundation` branch and not yet merged; the 9 campus AI tools and data-driven UI are not started.

## 3. Completed Work
- `[x]` Project structure and schema analysis.
- `[x]` `docs/frontend-uiux.md` created (Frontend design system and UI/UX guidelines).
- `[x]` `project-context.md` created (Team task distribution and project tracker).
- `[x]` `AGENTS.md` and `claude.md` created (AI agent development rules and workflows).
- `[x]` `projectdetails.md` created (Technical architecture).
- `[x]` `FEATURES.md` created (Authoritative feature inventory).
- `[x]` Task 9 — Frontend foundation: Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui initialized at repo root; design tokens, app shell (sidebar + mobile drawer), 7 routes with empty states, reusable UI components (Button, Card, Badge, Input, Select, Dialog, Table, Skeleton, EmptyState, ErrorState). Verified with production build and manual route/responsiveness testing.
- `[x]` Task 5 — AI agent foundation: provider abstraction (`LLM_PROVIDER=openai|groq`, single OpenAI-compatible class), native tool-calling agent loop with zod-validated tool registry, safety system prompt with server-injected campus clock (Sun–Thu week, `Asia/Dhaka`), sanitized error handling, `POST /api/chat` (request validation, 400/500/502), shared types in `src/types/ai.ts`. Verified: `tsc`, `next build`, `eslint`, 13 vitest unit tests (mock provider), live smoke test on Groq (`openai/gpt-oss-120b`) — tool round-trip works and the agent refuses to invent schedule data / fake a booking when no tool exists.

## 4. 29-Task Roadmap

### Phase 1 — Backend & Database
- `[ ]` **1. Supabase/backend foundation** (T1)
  - Objective: Establish Supabase project, schema, and import seed data.
  - Dependencies: None
  - Completion: Schema matches official requirements, seed data imported.
- `[ ]` **2. Backend CRUD** (T1)
  - Objective: Implement CRUD APIs for all 5 systems.
  - Dependencies: T1
  - Completion: Endpoints exist and persist data successfully.
- `[ ]` **3. Room booking** (T1)
  - Objective: Implement overlap-safe room booking.
  - Dependencies: T2
  - Completion: Overlapping bookings are rejected, valid bookings persist.
- `[ ]` **4. Event registration** (T1)
  - Objective: Implement safe event registration.
  - Dependencies: T2
  - Completion: Capacity checks work, duplicates prevented.

### Phase 2 — AI Agent
- `[x]` **5. AI agent foundation** (T2)
  - Objective: Configure LLM and basic agent architecture.
  - Dependencies: Task 9 scaffold (done). Backend contracts only needed from Task 6 onward.
  - Completion: Agent receives messages, calls tools natively, and replies via `/api/chat`. Verified live on Groq.
- `[ ]` **6. AI read tools** (T2)
  - Objective: Implement the 6 read/query tools.
  - Dependencies: T5
  - Completion: Agent successfully fetches live data.
- `[ ]` **7. AI action tools** (T2)
  - Objective: Implement the 3 action tools (book/register/cancel).
  - Dependencies: T6
  - Completion: Agent successfully mutates live data.
- `[ ]` **8. AI reasoning/safety** (T2)
  - Objective: Implement clarification, refusal, and multi-tool logic.
  - Dependencies: T7
  - Completion: Vague requests trigger clarification, unauthorized actions are refused.

### Phase 3 — Frontend
- `[x]` **9. Frontend foundation** (T3)
  - Objective: Initialize Next.js, Tailwind, and shadcn/ui.
  - Dependencies: None
  - Completion: App runs, layout shell and navigation exist.
- `[ ]` **10. Dashboard** (T3)
  - Objective: Create overview widgets.
  - Dependencies: T9
  - Completion: Dashboard renders correctly.
- `[ ]` **11. Schedule UI** (T3)
  - Objective: Schedule views and CRUD forms.
  - Dependencies: T10
  - Completion: Schedule data can be managed.
- `[ ]` **12. Rooms UI** (T3)
  - Objective: Room directory and booking interface.
  - Dependencies: T10
  - Completion: Rooms and bookings can be managed.
- `[ ]` **13. Events UI** (T3)
  - Objective: Event directory and registration interface.
  - Dependencies: T10
  - Completion: Events and registrations can be managed.
- `[ ]` **14. Announcements UI** (T3)
  - Objective: Noticeboard and CRUD interface.
  - Dependencies: T10
  - Completion: Announcements can be managed.
- `[ ]` **15. Assignments UI** (T3)
  - Objective: Deadline tracker and CRUD interface.
  - Dependencies: T10
  - Completion: Assignments can be managed.
- `[ ]` **16. AI Agent UI** (T3)
  - Objective: Chat interface and tool states.
  - Dependencies: T10
  - Completion: Chat interface supports conversation and loading states.

### Phase 4 — Integration
- `[ ]` **17. Frontend-backend integration** (ALL)
  - Objective: Connect UI components to live backend APIs.
  - Dependencies: T1-T4, T11-T16
  - Completion: UI reflects live DB state.
- `[ ]` **18. AI-backend integration** (T1+T2)
  - Objective: Ensure AI tools use production endpoints.
  - Dependencies: T5-T8, T1-T4
  - Completion: AI actions hit the live database.
- `[ ]` **19. Full E2E** (ALL)
  - Objective: Test Dashboard edit → AI response cycle.
  - Dependencies: T17, T18
  - Completion: UI and AI share synchronized state instantly.

### Phase 5 — Quality
- `[ ]` **20. Backend testing** (T1)
  - Objective: Verify CRUD and validation.
  - Dependencies: T19
  - Completion: All APIs robust.
- `[ ]` **21. AI testing** (T2)
  - Objective: Verify edge cases and tool reliability.
  - Dependencies: T19
  - Completion: No hallucinations.
- `[ ]` **22. Frontend testing** (T3)
  - Objective: Verify states and accessibility.
  - Dependencies: T19
  - Completion: UI is bug-free.
- `[ ]` **23. Judge demo testing** (ALL)
  - Objective: Run through official 10 sample queries.
  - Dependencies: T19
  - Completion: All 10 queries succeed flawlessly.
- `[ ]` **24. Security review** (ALL)
  - Objective: Ensure no secrets are exposed.
  - Dependencies: T19
  - Completion: Codebase is secure.
- `[ ]` **25. Data consistency** (T1+T2)
  - Objective: Ensure no duplicate or stale data sources exist.
  - Dependencies: T19
  - Completion: Single source of truth maintained.
- `[ ]` **26. UI polish** (T3)
  - Objective: Final design review.
  - Dependencies: T19
  - Completion: UI feels premium.

### Phase 6 — Delivery
- `[ ]` **27. README** (ALL)
  - Objective: Write setup instructions.
  - Dependencies: T26
  - Completion: App can be started from scratch by a judge.
- `[ ]` **28. Deployment** (ALL)
  - Objective: Push to production (Vercel/etc).
  - Dependencies: T27
  - Completion: Live URL works.
- `[ ]` **29. Final hackathon review** (ALL)
  - Objective: Score against the rubric.
  - Dependencies: T28
  - Completion: Ready to submit.

## 5. Team Progress

### Teammate 1 — Backend + Database
- `[ ]` Supabase
- `[ ]` Schema
- `[ ]` Migrations
- `[ ]` Seed data
- `[ ]` Backend services
- `[ ]` CRUD
- `[ ]` Booking logic
- `[ ]` Registration logic
- `[ ]` Testing

### Teammate 2 — AI Agent
- `[x]` LLM integration
- `[x]` Native tool calling (loop + registry; 0/9 campus tools yet)
- `[ ]` Read tools
- `[ ]` Action tools
- `[ ]` Reasoning
- `[ ]` Safety logic
- `[ ]` Live backend integration
- `[ ]` AI tests

### Teammate 3 — Frontend + UI/UX
- `[ ]` Next.js initialized
- `[ ]` Tailwind configured
- `[ ]` shadcn/ui configured
- `[x]` Design system defined (`docs/frontend-uiux.md`)
- `[ ]` Dashboard
- `[ ]` Pages (Schedules, Rooms, etc.)
- `[ ]` AI UI
- `[ ]` API integration
- `[ ]` Responsive/accessibility

## 6. Dependencies
**Backend Flow:**
`T1` → `T2` → `T3 + T4` → `T5` → `T6` → `T7` → `T8`

**Frontend Flow (Parallelizable):**
`T9` → `T10` → `T11–T16`

**Integration & Delivery Flow:**
`T17` → `T18` → `T19` → `T20–T26` → `T27` → `T28` → `T29`

*Parallel Development:* Tasks 9–16 (Frontend) can be developed concurrently with Tasks 1–8 (Backend & AI), provided API contracts are agreed upon.

## 7. Current Sprint / Next Actions
- **T1:** Rebase `Supabase-Foundation` onto `main`, merge, and push Tasks 1–4 so AI tools and data pages can integrate.
- **T2:** Task 6 (read tools) as soon as `src/services/*` land on `main`.
- **T3:** Task 10 (dashboard) and onward; Task 16 can target the `/api/chat` contract in `project-context.md` §9.

## 8. Blockers
- Tasks 6–7 blocked until Teammate 1's services are on `main`.

## 9. Recent Changes
- [2026-09-04] Task 5: AI agent foundation — `src/lib/ai/**`, `src/app/api/chat/route.ts`, `src/types/ai.ts`, `scripts/ai-smoke.ts`, `vitest.config.ts`; `.env.example` gained `LLM_PROVIDER`/`GROQ_*`/`OPENAI_MODEL`/`CAMPUS_TIMEZONE`; `npm test` and `npm run ai:smoke` scripts.
- [2026-09-04] Created initial repository documentation suite (`AGENTS.md`, `claude.md`, `FEATURES.md`, `PROGRESS.md`, `projectdetails.md`, `project-context.md`, `docs/frontend-uiux.md`).

## 10. Testing Status
- `[ ]` Backend tests
- `[~]` AI tests (13 unit tests for agent loop/datetime pass; tool tests pending Tasks 6–7)
- `[ ]` Frontend tests
- `[ ]` Integration tests
- `[ ]` E2E
- `[ ]` Judge scenarios

## 11. Deployment Status
- `[x]` Local development works (`npm run dev`; AI needs `.env` with an LLM key)
- `[~]` Environment configuration mapped (AI vars in `.env.example`; Supabase vars pending T1 merge)
- `[ ]` Deployed to cloud
- `[ ]` Production verification

## 12. Final Readiness Checklist
- `[ ]` CRUD works
- `[ ]` Database persistence works
- `[ ]` AI uses live data
- `[ ]` All 9 required tools work
- `[ ]` Booking works (prevents overlaps)
- `[ ]` Registration works
- `[ ]` Clarification/refusal works
- `[ ]` UI polished and responsive
- `[ ]` Tests pass
- `[ ]` Security checked (no secrets in Git)
- `[ ]` README complete with setup instructions
- `[ ]` Deployment verified
