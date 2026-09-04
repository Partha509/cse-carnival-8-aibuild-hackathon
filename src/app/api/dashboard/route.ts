import { NextResponse } from "next/server";
import { getSchedules } from "@/services/schedules";
import { getRooms } from "@/services/rooms";
import { getEvents } from "@/services/events";
import { getAnnouncements } from "@/services/announcements";
import { getAssignments } from "@/services/assignments";
import { getBookings } from "@/services/room_bookings";

/**
 * GET /api/dashboard
 * Aggregates all campus data for the dashboard in a single request.
 * Returns { schedules, rooms, events, announcements, assignments }
 * Each room also includes its bookings array for the availability widget.
 */
export async function GET() {
  const [
    schedulesRes,
    roomsRes,
    bookingsRes,
    eventsRes,
    announcementsRes,
    assignmentsRes,
  ] = await Promise.all([
    getSchedules(),
    getRooms(),
    getBookings(),
    getEvents(),
    getAnnouncements(),
    getAssignments(),
  ]);

  // Attach bookings to each room (matching src/lib/types.ts Room.bookings shape)
  const rooms = (roomsRes.data ?? []).map((room) => ({
    ...room,
    bookings: (bookingsRes.data ?? [])
      .filter((b) => b.room_id === room.id)
      .map(({ booking_id, booked_by, date, start_time, end_time, purpose }) => ({
        booking_id,
        booked_by,
        date,
        start_time,
        end_time,
        purpose,
      })),
  }));

  // Surface first service error if all fail
  const firstError =
    schedulesRes.error ??
    roomsRes.error ??
    eventsRes.error ??
    announcementsRes.error ??
    assignmentsRes.error;

  if (firstError) {
    return NextResponse.json({ error: firstError }, { status: 500 });
  }

  return NextResponse.json({
    schedules: schedulesRes.data ?? [],
    rooms,
    events: eventsRes.data ?? [],
    announcements: announcementsRes.data ?? [],
    assignments: assignmentsRes.data ?? [],
  });
}
