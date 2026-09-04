# CampusOS

An intelligent university platform powered by an AI agent that understands and acts on real-time campus data.

## Overview

Students often struggle to track down scattered information across class schedules, room availability, campus events, administrative announcements, and assignment deadlines. 

**CampusOS** brings these five distinct systems into one unified platform. Crucially, it layers an intelligent **AI Agent** on top of the live data, allowing students to use natural-language requests to find information and perform supported campus actions (like booking a room or registering for an event) instantly.

The project consists of two main components:

### Campus Data Manager
A traditional, robust dashboard providing comprehensive CRUD (Create, Read, Update, Delete) management for:
- Schedules
- Rooms
- Events
- Announcements
- Assignments

### AI Agent
An intelligent chat interface that allows users to:
- Ask campus-related questions
- Search live data seamlessly
- Find available rooms based on specific requirements
- Book rooms securely
- Register for campus events
- Cancel event registrations

## Why CampusOS?

- **One Unified Campus Platform:** Eliminates the need to check five different portals.
- **Live Database-Backed Answers:** The AI agent reads the exact same database as the dashboard. If an admin edits a room capacity, the AI knows about it immediately.
- **Natural-Language Interaction:** Students can just talk to the platform instead of navigating complex UI filters.
- **Real Actions via Native Tool Calling:** The AI doesn't just chat; it executes real backend mutations.
- **Modern Responsive UI:** Designed to work flawlessly on both desktop and mobile devices.
- **Safe Clarification/Refusal Behavior:** The AI is programmed to ask for missing information and refuse unauthorized or impossible actions (e.g., booking an occupied room).

## Key Features

- **Schedule Management:** Track classes, instructors, and locations.
- **Room Management:** Directory of campus classrooms, labs, and seminar halls.
- **Room Availability:** Real-time checking of room status.
- **Room Booking:** Secure booking system with strict overlap prevention.
- **Event Management:** Discover upcoming campus activities.
- **Event Registration:** Reserve spots with capacity enforcement.
- **Announcements:** Stay updated on priority university notices.
- **Assignments:** Track course deadlines and grades.
- **AI Assistant:** Context-aware chatbot integrated directly into the app.
- **Live Data:** Instant synchronization between UI updates and AI context.
- **CRUD:** Full data management dashboard.
- **Responsive Dashboard:** Mobile-first, accessible design system.

## AI Agent

The CampusOS AI agent uses **native function/tool calling** to interact directly with the backend service layer. 

It supports the following nine tools:
1. `get_schedule`
2. `get_next_class`
3. `get_assignments`
4. `get_announcements`
5. `get_events`
6. `check_room_availability`
7. `book_room`
8. `register_for_event`
9. `cancel_registration`

When a user asks the AI to perform an action (e.g., booking a room), the tool is executed securely on the backend, business validation is run, and the result is permanently persisted in Supabase before the AI reports success.

## Live Data Architecture

**Frontend Flow:**
```text
User
→ Next.js Application
→ Backend/Service Layer
→ Supabase PostgreSQL
```

**AI Agent Flow:**
```text
User
→ AI Agent
→ LLM
→ Native Tools
→ Backend
→ Supabase
→ AI Response
```

*Note: The JSON files located in the `data/` folder are seed data only. They are used for the initial database import and are NOT the runtime source of truth.*

## Technology Stack
*(Planned Architecture)*
- **Next.js:** Full-stack React framework (App Router).
- **TypeScript:** End-to-end type safety.
- **Tailwind CSS & shadcn/ui:** Modern, accessible design system.
- **Supabase PostgreSQL:** Persistent, real-time database.
- **LLM / Native Tool Calling:** Core intelligence engine.

## Data Model

The application revolves around these core tables:
- **`schedules`**: Class times, courses, and instructors.
- **`rooms`**: Room types, capacities, and equipment.
- **`room_bookings`**: Reservations with strict conflict prevention.
- **`events`**: Campus activities and capacities.
- **`event_registrations`**: Student sign-ups for events.
- **`announcements`**: Priority university notices.
- **`assignments`**: Course tasks, deadlines, and grades.

**Official Conventions:**
- Dates are formatted using **ISO 8601** (`YYYY-MM-DD`).
- Time is formatted using **24-hour HH:MM**.
- The university week runs **Sunday–Thursday**.

## Example Queries

The AI is built to flawlessly handle queries like:
- *"When is my next class?"*
- *"What classes do I have on Wednesday?"*
- *"What assignments do I have due this week?"*
- *"Show me all high priority announcements."*
- *"I'm free until 2 PM — is there anything on campus I could drop into?"*
- *"Which labs have a projector and can fit at least 30 people?"*
- *"Book Room 7A02 tomorrow from 3 PM to 5 PM."*
- *"Register me for the Guest Lecture on Deep Learning."*
- *"I need a room for 5 people with a projector, tomorrow between 2 and 4."*
- *"Just book me any room tomorrow afternoon."* (The AI will ask for clarification).

## Database / Seed Data

**Supabase** serves as the persistent, runtime database for the application. 
The repository includes seed files (`data/*.json`) to help initialize the database. **These seed files should not be treated as live application state.**

Seed Record Counts:
- Schedules: 24
- Rooms: 20
- Events: 7
- Announcements: 8
- Assignments: 8

## Project Structure

```text
campusos-hackathon/
├── data/                  # Seed JSON files
├── docs/                  # UI/UX guides
├── sample_queries/        # Official evaluation queries
├── schema/                # Data schema definitions
├── .env.example
├── AGENTS.md
├── FEATURES.md
├── PROBLEM_STATEMENT.md
├── PROGRESS.md
├── README.md
├── SUBMISSION.md
├── claude.md
├── project-context.md
└── projectdetails.md
```
*(Note: Application directories like `app/`, `components/`, and `lib/` will be generated during the framework initialization phase).*

## Getting Started

*(To be updated once the framework is initialized)*
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd campusos-hackathon
   ```
2. **Install dependencies** (Pending framework initialization).
3. **Configure environment variables:** Copy `.env.example` to `.env` and fill in the required keys.
4. **Configure Supabase:** Run database migrations and seed scripts.
5. **Run the development server** (Pending `package.json` scripts).

## Environment Variables

Ensure the following variables are configured in your `.env` file based on `.env.example`. **Never expose actual secrets in source control.**

```text
# AI Agent (server-only)
LLM_PROVIDER=openai          # openai | groq
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
# GROQ_API_KEY=              # set LLM_PROVIDER=groq to use Groq (OpenAI-compatible, free tier)
# GROQ_MODEL=openai/gpt-oss-120b
CAMPUS_TIMEZONE=Asia/Dhaka   # resolves "today" / "tomorrow" for the campus

# Database Connection (Supabase vars added by the backend task)
DATABASE_URL=
PORT=3000
```

## Development

All frontend and backend development occurs within the unified Next.js environment. Developers must strictly follow the UI guidelines in `docs/frontend-uiux.md` and the team implementation tracker in `project-context.md`.

## Testing

```bash
npm test           # vitest unit tests (AI agent loop, datetime)
npm run ai:smoke   # live LLM smoke test — requires an API key in .env
```
Future implementation will include testing for:
- Backend services & API routes
- AI tool resolution and safety
- Frontend rendering & E2E flows

## Team

- **Teammate 1 [Shehab]:** Backend + Database (Supabase, CRUD, Service logic)
- **Teammate 2:** AI Agent (LLM, Tool calling, Safety)
- **Teammate 3:** Frontend + UI/UX (Next.js, Tailwind, Design system)

## Documentation

For deep technical context, refer to the following project documents:
- [`project-context.md`](./project-context.md): Team workflow and task tracker.
- [`projectdetails.md`](./projectdetails.md): Complete system architecture.
- [`AGENTS.md`](./AGENTS.md): Safety instructions for AI agents.
- [`claude.md`](./claude.md): Agent workflow and Git rules.
- [`FEATURES.md`](./FEATURES.md): Authoritative feature inventory.
- [`PROGRESS.md`](./PROGRESS.md): Living implementation tracker.
- [`docs/frontend-uiux.md`](./docs/frontend-uiux.md): Frontend design system.

## Hackathon Requirements

CampusOS directly addresses the AI Build Hackathon rubric:
- **Data Management & CRUD:** A fully functional dashboard powered by a real database.
- **AI Agent:** A conversational interface tightly integrated with campus data.
- **Live/Latest Data:** Guarantees that AI answers rely entirely on the real-time database state, bypassing stale cache issues.
- **Actions:** Real tool calling enables the AI to persist room bookings and event registrations.
- **Clarification/Refusal:** Intelligent safeguards prevent unauthorized actions and ambiguous queries.
- **UI/UX:** A polished, mobile-first, accessible frontend experience.

## Security

- Secrets (API Keys, Database URLs) must remain strictly within environment variables.
- Server-side credentials must never leak to the client bundle.
- Supabase Row Level Security (RLS) is utilized where applicable to restrict unauthorized data mutations.

## Current Status

**Status: Initialization Phase**
The project currently consists of the foundational documentation, architecture planning, and official seed data. Framework initialization (Next.js), database migrations (Supabase), and AI integration are scheduled as the immediate next steps in the roadmap.

## Roadmap

The development process is governed by a 29-task roadmap detailed in `project-context.md`.
**High-Level Phases:**
1. Backend & Database Foundation
2. AI Agent Implementation
3. Frontend UI/UX Construction
4. Integration (E2E Synchronization)
5. Quality Assurance & Testing
6. Delivery & Deployment

## Demo / Evaluation Flow

For hackathon judges, the following demonstration flow is recommended once deployed:
1. Open the dashboard and observe the populated seed data.
2. Edit a campus record (e.g., change a room's capacity or update an announcement).
3. Open the AI Assistant and immediately ask about the data you just changed to verify real-time sync.
4. Ask the AI to perform complex queries (e.g., "What classes do I have on Wednesday?").
5. Ask the AI to check room availability for a specific time and equipment need.
6. Ask the AI to **book the room**.
7. Ask the AI to **register you for an event**.
8. Ask a vague question ("Book a room tomorrow") to verify the AI asks for clarification instead of guessing.
9. Check the dashboard to verify that the AI's booking and registration actions successfully persisted in the backend.

## License

*(No license currently specified for this hackathon submission).*
