import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const MIGRATION_SQL = `
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Create ENUMs
DO $$ BEGIN
  CREATE TYPE room_type AS ENUM ('classroom', 'lab', 'seminar');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE room_status AS ENUM ('available', 'unavailable');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled', 'full');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE announcement_priority AS ENUM ('high', 'medium', 'low');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE assignment_status AS ENUM ('pending', 'submitted', 'graded', 'late');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 1. Schedules Table
CREATE TABLE IF NOT EXISTS public.schedules (
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
CREATE TABLE IF NOT EXISTS public.rooms (
    id TEXT PRIMARY KEY,
    room_number TEXT NOT NULL UNIQUE,
    type room_type NOT NULL,
    capacity INTEGER NOT NULL,
    equipment TEXT[] NOT NULL DEFAULT '{}',
    floor INTEGER NOT NULL,
    status room_status NOT NULL DEFAULT 'available'
);

-- 3. Room Bookings Table
CREATE TABLE IF NOT EXISTS public.room_bookings (
    booking_id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    booked_by TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    purpose TEXT NOT NULL
);

-- 4. Events Table
CREATE TABLE IF NOT EXISTS public.events (
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
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, student_id)
);

-- 6. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    date DATE NOT NULL,
    priority announcement_priority NOT NULL DEFAULT 'low',
    posted_by TEXT NOT NULL,
    expires DATE NOT NULL
);

-- 7. Assignments Table
CREATE TABLE IF NOT EXISTS public.assignments (
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_schedules_day ON public.schedules(day);
CREATE INDEX IF NOT EXISTS idx_room_bookings_date ON public.room_bookings(date);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_announcements_expires ON public.announcements(expires);
`;

async function applyMigration() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!url || !serviceKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Extract project ref
  const projectRef = url.replace('https://', '').replace('.supabase.co', '');
  console.log(`\n🔑  Project: ${projectRef}`);
  console.log('⏳  Applying migration via Supabase Management API...\n');

  // Try via Management API
  try {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({ query: MIGRATION_SQL }),
      }
    );

    const body = await response.text();
    if (response.ok) {
      console.log('✅  Migration applied via Management API.');
    } else {
      console.log('⚠️  Management API failed:', response.status, body.slice(0, 200));
      console.log('\n📋  Please apply the schema manually in Supabase SQL Editor:');
      console.log('    1. Go to https://supabase.com/dashboard/project/' + projectRef + '/editor');
      console.log('    2. Run the contents of: supabase/migrations/0001_initial_schema.sql\n');
    }
  } catch (err) {
    console.log('⚠️  Fetch error:', err);
    console.log('\n📋  Please apply the schema manually in Supabase SQL Editor:');
    console.log('    1. Go to https://supabase.com/dashboard/project/' + projectRef + '/editor');
    console.log('    2. Run the contents of: supabase/migrations/0001_initial_schema.sql\n');
  }

  // Verify tables now exist
  const db = createClient(url, serviceKey);
  const { error } = await db.from('rooms').select('count').limit(0);
  if (!error) {
    console.log('✅  Verification: rooms table is accessible.');
  } else {
    console.log('❌  Verification failed:', error.message);
    console.log('\n⚡  IMPORTANT: You must run the SQL migration in your Supabase dashboard before running verify.');
  }
}

applyMigration().catch(console.error);
