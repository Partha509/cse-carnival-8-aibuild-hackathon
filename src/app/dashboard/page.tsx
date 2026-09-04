import type { Metadata } from "next";
import { CalendarDays, ClipboardList, Megaphone } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your campus at a glance — classes, deadlines, and what's happening today."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="size-4 text-schedule" aria-hidden="true" />
              Today&apos;s Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={CalendarDays}
              title="No schedule data yet"
              description="Today's classes will appear here once the backend is connected."
              className="border-0 bg-transparent py-8"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList
                className="size-4 text-assignment"
                aria-hidden="true"
              />
              Upcoming Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={ClipboardList}
              title="No assignment data yet"
              description="Upcoming deadlines will appear here once the backend is connected."
              className="border-0 bg-transparent py-8"
            />
          </CardContent>
        </Card>
        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Megaphone
                className="size-4 text-announcement"
                aria-hidden="true"
              />
              Active Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Megaphone}
              title="No announcements yet"
              description="Active notices will appear here once the backend is connected."
              className="border-0 bg-transparent py-8"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
