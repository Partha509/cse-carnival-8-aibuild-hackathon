import type { Announcement } from "../types";

export type AnnouncementInput = {
  id: string;
  title: string;
  body: string;
  date: string;
  priority: "high" | "medium" | "low";
  posted_by: string;
  expires: string;
};
export type AnnouncementUpdate = Partial<Omit<AnnouncementInput, "id">>;

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.error === "string") return body.error;
  } catch {
    // fall through
  }
  return `Request failed with status ${res.status}.`;
}

export async function fetchAnnouncements(signal?: AbortSignal): Promise<Announcement[]> {
  const res = await fetch("/api/announcements", { cache: "no-store", signal });
  if (!res.ok) throw new Error(await parseError(res));
  const body = (await res.json()) as { data: Announcement[] };
  return body.data ?? [];
}

export async function createAnnouncement(input: AnnouncementInput): Promise<Announcement> {
  const res = await fetch("/api/announcements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const body = (await res.json()) as { data: Announcement };
  return body.data;
}

export async function updateAnnouncement(
  id: string,
  input: AnnouncementUpdate
): Promise<Announcement> {
  const res = await fetch(`/api/announcements/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const body = (await res.json()) as { data: Announcement };
  return body.data;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const res = await fetch(`/api/announcements/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await parseError(res));
}
