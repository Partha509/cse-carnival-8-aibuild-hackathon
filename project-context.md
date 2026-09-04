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
- **Backend CRUD Services:** Implemented unified validation (using Zod) and pure async service functions for all core entities (schedules, rooms, events, announcements, assignments).
- **Room Booking Service:** Full booking lifecycle with mandatory overlap detection, availability search (capacity + equipment filters), and DB-level `EXCLUDE` constraint safety net.
- **Event Registration Service:** Full registration lifecycle with capacity enforcement, duplicate prevention, and automatic `registered` count + `status` synchronization.
- **Task 9 — Frontend Foundation:** Initialized Next.js 16 (App Router, TypeScript, Tailwind CSS v4) at the repository root with shadcn/ui (radix-nova style). Implemented design tokens from `docs/frontend-uiux.md` in `src/app/globals.css` (brand, surface, status, AI, and domain colors with light/dark values), Inter typography, responsive app shell (`src/components/layout/`: sticky desktop sidebar ≥lg, mobile header + sheet drawer <lg), all 7 routes (`/dashboard`, `/schedule`, `/rooms`, `/events`, `/announcements`, `/assignments`, `/ai` — `/` redirects to `/dashboard`), shared `PageHeader`/`EmptyState`/`ErrorState` components, `error.tsx` + `not-found.tsx` boundaries, and shadcn/ui primitives (button, card, badge, input, select, dialog, table, skeleton, sheet, separator, label). Pages show honest empty states — no fake data, no backend logic, no AI logic.
- **Task 10 — Dashboard:** Built the CampusOS dashboard at `/dashboard`. Added domain types (`src/lib/types.ts`, mirrors `schema/schema.md`), date/time helpers (`src/lib/datetime.ts`, Sunday–Thursday week aware), dashboard selectors (`src/lib/dashboard-selectors.ts`: today's classes, next class, active announcements, upcoming events, upcoming deadlines, room-availability with the AGENTS.md overlap rule, summary stats), and a backend-ready data service (`src/lib/data/dashboard.ts`) that fetches `GET /api/dashboard`. Widgets in `src/components/dashboard/`: stat cards, Today's Schedule (highlights next class), Assignment Deadlines (proximity badges), Announcements (priority-sorted), Upcoming Events, Rooms Available Now. All wired through a client component (`dashboard-content.tsx`) handling four states — loading (skeletons), ready (populated), empty (backend not connected → 404), error (retryable). No runtime JSON/seed data or fake permanent data; Supabase remains the single source of truth. Verified populated + empty + error states across desktop/tablet/mobile using a throwaway local API route (since deleted).
- **Task 11 — Schedule UI:** Built full schedule management at `/schedule` wired to **live backend CRUD**. Added HTTP API routes (`src/app/api/schedules/route.ts` GET+POST, `src/app/api/schedules/[id]/route.ts` PATCH+DELETE) that call the existing Zod-validated service layer (`src/services/schedules.ts`) → Supabase. Client data layer `src/lib/data/schedules.ts`. Components in `src/components/schedule/`: `schedule-content.tsx` (list with desktop table / mobile card list, day + course/title filters, sorted by weekday then time, readable 12h times, loading skeleton / empty / no-match / error states), `schedule-form-dialog.tsx` (create + edit with client-side validation reusing the backend `ScheduleSchema` plus an end-time-after-start rule), `delete-schedule-dialog.tsx` (confirmation for destructive delete), `feedback-toaster.tsx` (scoped success/error toasts). Verified full CRUD end-to-end against live Supabase (create/edit/delete persist + live UI update, duplicate & invalid input rejected with 400) across desktop/tablet/mobile. No fake data.
- **Task 12 — Rooms UI:** Built full room management at `/rooms` wired to **live backend services**. Added HTTP API routes: `src/app/api/rooms/route.ts` (GET+POST), `src/app/api/rooms/[id]/route.ts` (PATCH+DELETE), `src/app/api/rooms/[id]/bookings/route.ts` (GET), `src/app/api/bookings/route.ts` (GET+POST), `src/app/api/bookings/[id]/route.ts` (DELETE) — all thin handlers over `src/services/rooms.ts` and `src/services/room_bookings.ts`. Client data layer `src/lib/data/rooms.ts`. Components in `src/components/rooms/`: `rooms-content.tsx` (responsive card grid, search + type + status filters, booking counts, loading/empty/no-match/error states), `room-form-dialog.tsx` (create+edit with Zod `RoomSchema` validation, equipment as comma list), `delete-room-dialog.tsx` (confirmation), `book-room-dialog.tsx` (booking interface — basic field validation only; conflicts/overlap enforced by backend and surfaced inline), `room-details-dialog.tsx` (room info + per-room booking list with cancel), `room-status-badge.tsx`. Shared `src/components/feedback-toaster.tsx` (success/failure toasts). **No booking business logic duplicated in the frontend** — `createBooking` calls the backend which owns conflict detection (application check + DB EXCLUDE constraint). Verified via live backend: overlapping booking rejected (400), adjacent booking allowed (201), full room CRUD, cancel; conflict message surfaces in the booking dialog. Tested desktop/tablet/mobile. No fake data.
- **Task 13 — Events UI:** Built full event management at `/events` wired to **live backend data**. Added HTTP API routes: `src/app/api/events/route.ts` (GET+POST), `src/app/api/events/[id]/route.ts` (PATCH+DELETE), `src/app/api/events/[id]/registrations/route.ts` (GET+POST register), `src/app/api/events/[id]/registrations/[studentId]/route.ts` (DELETE cancel) — thin handlers over `src/services/events.ts` and `src/services/event_registrations.ts`. Client data layer `src/lib/data/events.ts`. Components in `src/components/events/`: `events-content.tsx` (responsive card grid with status filter + search, capacity/registration-count progress bar, loading/empty/no-match/error states), `event-form-dialog.tsx` (create+edit with Zod `EventSchema`, description textarea, status select), `delete-event-dialog.tsx` (confirmation), `register-dialog.tsx` (registration interface), `event-details-dialog.tsx` (event info + registration information list with cancel), `event-status-badge.tsx` (upcoming/ongoing/completed/cancelled/full). **No registration logic duplicated** — backend enforces capacity/full, cancelled, completed and duplicate rules; Register button disabled for full/cancelled/completed as UX affordance only. Verified via live backend: duplicate rejected (400), capacity fill auto-sets status `full`, over-capacity rejected (400), cancel decrements + reverts `full`→`upcoming`; full event's Register disabled in UI; register/cancel surface toasts. Tested desktop/tablet/mobile. No fake data.

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
- Next.js app lives at the repository root (single app for frontend, backend API/server actions, and AI agent).
- shadcn/ui initialized with the radix-nova style; components live in `src/components/ui/`.

## 6. Task Status System
Statuses: NOT STARTED, IN PROGRESS, BLOCKED, READY FOR INTEGRATION, COMPLETED, NEEDS FIX.

| Task | Area | Owner | Status |
|------|------|-------|--------|
| Task 1: Project + Supabase Foundation | Backend | T1 | COMPLETED |
| Task 2: Backend CRUD | Backend | T1 | COMPLETED |
| Task 3: Room Booking | Backend | T1 | COMPLETED |
| Task 4: Event Registration | Backend | T1 | COMPLETED |
| Task 5: AI Agent Foundation | AI | T2 | NOT STARTED |
| Task 6: AI Read Tools | AI | T2 | NOT STARTED |
| Task 7: AI Action Tools | AI | T2 | NOT STARTED |
| Task 8: AI Reasoning & Safety | AI | T2 | NOT STARTED |
| Task 9: Frontend Foundation | Frontend| T3 | COMPLETED |
| Task 10: Dashboard | Frontend| T3 | COMPLETED |
| Task 11: Schedule UI | Frontend| T3 | COMPLETED |
| Task 12: Rooms UI | Frontend| T3 | COMPLETED |
| Task 13: Events UI | Frontend| T3 | COMPLETED |
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
*Service layer implemented (Task 2). HTTP/API routes and frontend wiring pending (Task 17).*
- **Service Layer (`src/services/`)**: `schedules.ts`, `rooms.ts`, `events.ts`, `announcements.ts`, `assignments.ts`.
- **Validation**: Strict Zod schemas in `src/lib/validations/`.
- **Response Format**: `Promise<{ data: T | null, error: string | null }>`
- **Room Booking Service (`src/services/room_bookings.ts`)**: `createBooking`, `cancelBooking`, `getBookings`, `getBookingsByRoom`, `checkRoomAvailability`, `getAvailableRooms`. Overlap rule enforced at application and DB constraint level.
- **Availability Logic**: Filters by `status=available`, optional `min_capacity`, optional `required_equipment[]`, and no overlapping booking for the requested time slot.
- **Event Registration Service (`src/services/event_registrations.ts`)**: `registerForEvent`, `cancelRegistration`, `getRegistrationsByEvent`, `getRegistrationStatus`. Capacity enforcement, duplicate prevention (by `student_id`), and `registered` count kept consistent on every mutation.
- **Validation scripts**: `npm run verify` — 26/26 tests passed against live Supabase.
- **Frontend expectation (Task 17):** the dashboard data layer (`src/lib/data/dashboard.ts`) fetches `GET /api/dashboard` returning `{ schedules, rooms, events, announcements, assignments }`; until that route exists a 404 surfaces as an empty state.
- **HTTP API routes (implemented):** `GET/POST /api/schedules` and `PATCH/DELETE /api/schedules/[id]` (Task 11); `GET/POST /api/rooms`, `PATCH/DELETE /api/rooms/[id]`, `GET /api/rooms/[id]/bookings`, `GET/POST /api/bookings`, `DELETE /api/bookings/[id]` (Task 12); `GET/POST /api/events`, `PATCH/DELETE /api/events/[id]`, `GET/POST /api/events/[id]/registrations`, `DELETE /api/events/[id]/registrations/[studentId]` (Task 13) — thin handlers over the service layer, returning `{ data }` or `{ error }` with appropriate status codes. Booking conflicts and registration rules are enforced by the backend services, not the frontend. Remaining entity routes (announcements, assignments) pending with their UIs.

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
- **Framework:** Next.js 16 (App Router, TypeScript, Tailwind CSS v4, shadcn/ui) initialized at repo root. `npm run dev` starts the app.
- **Routes (created, placeholder empty states pending data integration):** `/` (redirects to `/dashboard`), `/dashboard`, `/schedule`, `/rooms`, `/events`, `/announcements`, `/assignments`, `/ai`.
- **Shell:** `src/components/layout/` — `AppShell`, `AppSidebar` (desktop ≥lg), `AppHeader` + sheet drawer (mobile), `SidebarNav` with active-route highlighting.
- **Shared components:** `src/components/` — `PageHeader`, `EmptyState`, `ErrorState`; shadcn/ui primitives in `src/components/ui/` (button, card, badge, input, select, dialog, table, skeleton, sheet, separator, label).
- **Design tokens:** `src/app/globals.css` per `docs/frontend-uiux.md` (light + dark values; Tailwind utilities like `text-ai-accent`, `bg-danger/10`, `text-schedule` available).
- **Dashboard (Task 10):** `/dashboard` renders live widgets (stat cards, Today's Schedule, Assignment Deadlines, Announcements, Upcoming Events, Rooms Available Now) with loading/empty/error states. Data layer: `src/lib/types.ts`, `src/lib/datetime.ts`, `src/lib/dashboard-selectors.ts`, `src/lib/data/dashboard.ts`. Widgets in `src/components/dashboard/`. Shared `src/components/status-badges.tsx`.
- **Schedule UI (Task 11):** `/schedule` full CRUD wired to live Supabase via `/api/schedules` routes. Data layer `src/lib/data/schedules.ts`; components in `src/components/schedule/` (content/list+filters, form dialog with validation, delete confirmation, feedback toaster). Desktop table + mobile card list, day/course filters, readable 12h times, loading/empty/error/success states.
- **Rooms UI (Task 12):** `/rooms` full room CRUD + booking interface wired to live Supabase via `/api/rooms` and `/api/bookings` routes. Data layer `src/lib/data/rooms.ts`; components in `src/components/rooms/` (card grid + filters, room form, delete confirm, book dialog, details dialog with per-room bookings + cancel, status badge). Shared `src/components/feedback-toaster.tsx`. Booking conflict validation is backend-only.
- **Events UI (Task 13):** `/events` full event CRUD + registration interface wired to live Supabase via `/api/events` routes. Data layer `src/lib/data/events.ts`; components in `src/components/events/` (card grid + status filter, event form, delete confirm, register dialog, details dialog with registrations + cancel, status badge). Registration rules (full/cancelled/completed/duplicate) are backend-only; Register disabled in UI for full/cancelled/completed.
- **Pending:** Tasks 14–16 (announcements, assignments UIs, AI chat interface) and Task 17 (wire the dashboard to the real backend API).

## 11. Git / Collaboration Rules
- `git pull origin main` before starting work.
- Never blindly overwrite teammate work.
- Run tests and verify changes before pushing.
- Commit messages should clearly describe the work (e.g., `feat(db): add Supabase schema`).
- Update `project-context.md` after pushing.
