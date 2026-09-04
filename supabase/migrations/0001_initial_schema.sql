-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Create ENUMs for strict validation as per schema
CREATE TYPE room_type AS ENUM ('classroom', 'lab', 'seminar');
CREATE TYPE room_status AS ENUM ('available', 'unavailable');
CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled', 'full');
CREATE TYPE announcement_priority AS ENUM ('high', 'medium', 'low');
CREATE TYPE assignment_status AS ENUM ('pending', 'submitted', 'graded', 'late');

-- 1. Schedules Table
CREATE TABLE public.schedules (
    id TEXT PRIMARY KEY,
    course TEXT NOT NULL,
    title TEXT NOT NULL,
    day TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    room TEXT NOT NULL,
    instructor TEXT NOT NULL,
    section TEXT NOT NULL
);

-- 2. Rooms Table
CREATE TABLE public.rooms (
    id TEXT PRIMARY KEY,
    room_number TEXT NOT NULL UNIQUE,
    type room_type NOT NULL,
    capacity INTEGER NOT NULL,
    equipment TEXT[] NOT NULL DEFAULT '{}',
    floor INTEGER NOT NULL,
    status room_status NOT NULL DEFAULT 'available'
);

-- 3. Room Bookings Table
CREATE TABLE public.room_bookings (
    booking_id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    booked_by TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    purpose TEXT NOT NULL,
    -- Prevent overlapping bookings for the same room on the same day
    CONSTRAINT no_overlap EXCLUDE USING gist (
        room_id WITH =,
        date WITH =,
        timerange(start_time::time, end_time::time) WITH &&
    )
);

-- 4. Events Table
CREATE TABLE public.events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    end_date DATE NOT NULL,
    venue TEXT NOT NULL,
    organizer TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    registered INTEGER NOT NULL DEFAULT 0,
    status event_status NOT NULL DEFAULT 'upcoming'
);

-- 5. Event Registrations Table
CREATE TABLE public.event_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, student_id)
);

-- 6. Announcements Table
CREATE TABLE public.announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    date DATE NOT NULL,
    priority announcement_priority NOT NULL DEFAULT 'low',
    posted_by TEXT NOT NULL,
    expires DATE NOT NULL
);

-- 7. Assignments Table
CREATE TABLE public.assignments (
    id TEXT PRIMARY KEY,
    course TEXT NOT NULL,
    course_title TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    assigned_date DATE NOT NULL,
    deadline DATE NOT NULL,
    submission_platform TEXT NOT NULL,
    status assignment_status NOT NULL DEFAULT 'pending',
    marks INTEGER NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_schedules_day ON public.schedules(day);
CREATE INDEX idx_room_bookings_date ON public.room_bookings(date);
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_announcements_expires ON public.announcements(expires);
