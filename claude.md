# CampusOS — Claude Development Guide

This file is the primary workflow guide for Claude and any AI coding agents working on the CampusOS AI Build Hackathon project. It defines the operational rules to ensure correct architecture, live data integration, and safe collaboration.

## 1. Required Reading Order
Before writing any code or making architectural changes, you **must** read the following documentation in this exact order:
1. `PROBLEM_STATEMENT.md` (Challenge rules and scoring)
2. `project-context.md` (Current implementation state, tasks, and ownership)
3. `schema/schema.md` (Database schema and rules)
4. `AGENTS.md` (AI Agent behavioral constraints)
5. `docs/frontend-uiux.md` (UI/UX design system)

## 2. Project Authority
In the event of conflicting information, the following files control specific domains:
- **Requirements & Scoring:** `PROBLEM_STATEMENT.md`
- **Architecture & Current State:** `project-context.md`
- **Features & Progress:** `project-context.md` (and `FEATURES.md`/`PROGRESS.md` if they exist)
- **AI Behavior:** `AGENTS.md`
- **UI/UX & Design:** `docs/frontend-uiux.md`

## 3. Before Writing Code
Every time you begin a new task, you must:
1. Inspect `git status` and pull the latest `main` branch.
2. Inspect the current repository to verify assumptions.
3. Read relevant documentation (see Section 1).
4. Identify any teammate changes recently pushed.
5. Understand task dependencies (outlined in `project-context.md`).
6. Avoid duplicating existing work or re-implementing existing components.

## 4. Task-Based Development
You must work on **one assigned task at a time**. Do not attempt to automatically implement the entire project roadmap in a single pass. 

For each assigned task:
- Understand the precise task scope.
- Inspect dependencies.
- Implement *only* the assigned task.
- Test the implementation locally.
- Update documentation to reflect the new state.
- Commit and push.

## 5. Database Protection
**Supabase PostgreSQL is the runtime source of truth.**
- **Never** replace the Supabase database with local JSON files, `localStorage`, or in-memory state.
- **Never** delete data without explicit reason.
- **Never** casually reset production or shared data.
- **Never** bypass backend validation rules.
- **Never** create duplicate schemas without justification. The seed data in `data/` is strictly for initial import.

## 6. Git Protection
When collaborating via Git:
- **Always** pull the latest `main` branch before starting work.
- **Always** preserve teammate changes. Do not overwrite without explicit instruction.
- **No force pushing** (`git push -f`) under any circumstances.
- **No destructive resets** that delete teammate history.
- Write meaningful, atomic commit messages (e.g., `feat(api): implement room booking validation`).
- **Never commit secrets**, API keys, or `.env` files.

## 7. Documentation Synchronization
Documentation is a living source of truth. Whenever your implementation changes:
- Update `project-context.md` (Task status, implemented APIs, etc.).
- Update `PROGRESS.md` and `FEATURES.md` if feature status changes (if files exist).
- Update architecture documentation if the architecture fundamentally changes.

## 8. AI Agent Rules
When implementing the AI Assistant feature, ensure the agent:
- Uses **native tool/function calling** for all data retrieval and actions.
- Queries **live backend data** from Supabase.
- **Never hallucinates** campus data.
- Asks for clarification when a user request is missing required parameters (e.g., "Book a room tomorrow").
- Refuses invalid or unauthorized requests (e.g., booking an occupied room).
- Confirms actual action results from the backend before telling the user it succeeded.
- Handles multi-tool requests correctly (e.g., checking schedule then finding an available room).

## 9. Frontend Rules
All UI implementations must strictly follow `docs/frontend-uiux.md`.
- Maintain the consistent design system (colors, typography, spacing).
- Ensure fully responsive layouts (mobile-first approach).
- Maintain WCAG AA accessibility standards (keyboard navigation, ARIA labels).
- Implement proper **loading (skeletons), error, and empty states** for all data views.
- Use polished micro-interactions and dialogs for destructive actions.
- Use `shadcn/ui` where appropriate to accelerate development without sacrificing quality.

## 10. Testing Rules
Every implementation must be tested according to its scope before being pushed:
- **Backend Tests:** Verify CRUD logic, validation rules, and overlap prevention (for bookings).
- **AI Tool Tests:** Verify correct parameter parsing, live data queries, and edge cases.
- **Frontend Tests:** Verify routing, state management, and UI rendering.
- **Integration Tests:** Verify Frontend ↔ Backend and AI ↔ Backend flows.
- **End-to-End Testing:** Verify the full cycle (e.g., Dashboard change → AI query response).

## 11. Hackathon Judge Awareness
**CRITICAL:** Judges will test this application live by editing data in the Dashboard and immediately asking the AI Agent about that data. 
Therefore, **AI responses must always reflect the live database state**. Do not cache data in a way that creates stale responses. 

## 12. Never Invent
If information is missing to complete a task:
- Inspect the repository.
- Inspect the documentation.
- Ask the user for clarification.
**Never invent implementation status, fake endpoints, or hallucinate behavior to bypass blockers.**

## 13. Completion Checklist
Before declaring a task complete, verify:
- [ ] Implementation works and fulfills the scope.
- [ ] Tests pass locally.
- [ ] No secrets or `.env` files are exposed in Git.
- [ ] Teammate changes are preserved.
- [ ] Documentation (`project-context.md`, etc.) is updated.
- [ ] Git status is clean and understood.
- [ ] Commit is created with a descriptive message.
- [ ] Changes are successfully pushed to `main`.
