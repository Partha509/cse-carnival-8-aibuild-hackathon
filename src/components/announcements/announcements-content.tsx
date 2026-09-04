"use client";

import * as React from "react";
import { Megaphone, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import {
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  type AnnouncementInput,
} from "@/lib/data/announcements";
import type { Announcement } from "@/lib/types";
import { AnnouncementFormDialog, type AnnouncementFormValues } from "./announcement-form-dialog";
import { DeleteAnnouncementDialog } from "./delete-announcement-dialog";
import { FeedbackToaster, useFeedback } from "@/components/feedback-toaster";

type Status = "loading" | "ready" | "error";
const ALL_PRIORITY = "__all__";

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-danger/10 text-danger border-danger/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-muted text-muted-foreground border-border",
};

function isExpired(expires: string): boolean {
  return expires < new Date().toISOString().slice(0, 10);
}

export function AnnouncementsContent() {
  const [status, setStatus] = React.useState<Status>("loading");
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [priorityFilter, setPriorityFilter] = React.useState<string>(ALL_PRIORITY);
  const [searchQuery, setSearchQuery] = React.useState("");

  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [editing, setEditing] = React.useState<Announcement | null>(null);

  const [deleteTarget, setDeleteTarget] = React.useState<Announcement | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const { items: toastItems, notify, dismiss } = useFeedback();

  // ─── Load ──────────────────────────────────────────────────────────────────
  const load = React.useCallback(async () => {
    setStatus("loading");
    try {
      const data = await fetchAnnouncements();
      // Sort: high first, then medium, then low; within priority newest first
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      data.sort((a, b) => {
        const po = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (po !== 0) return po;
        return b.date.localeCompare(a.date);
      });
      setAnnouncements(data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  // ─── Filters ───────────────────────────────────────────────────────────────
  const filtered = React.useMemo(() => {
    return announcements.filter((a) => {
      if (priorityFilter !== ALL_PRIORITY && a.priority !== priorityFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!a.title.toLowerCase().includes(q) && !a.body.toLowerCase().includes(q) && !a.posted_by.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [announcements, priorityFilter, searchQuery]);

  // ─── CRUD handlers ─────────────────────────────────────────────────────────
  function handleCreate() {
    setEditing(null);
    setFormMode("create");
    setFormOpen(true);
  }

  function handleEdit(ann: Announcement) {
    setEditing(ann);
    setFormMode("edit");
    setFormOpen(true);
  }

  function handleDeleteClick(ann: Announcement) {
    setDeleteTarget(ann);
    setDeleteOpen(true);
  }

  async function handleFormSubmit(values: AnnouncementFormValues) {
    try {
      if (formMode === "create") {
        const input: AnnouncementInput = {
          id: `ann-${Date.now()}`,
          ...values,
        };
        const created = await createAnnouncement(input);
        setAnnouncements((prev) => [created, ...prev]);
        notify("success", "Announcement posted successfully.");
      } else if (editing) {
        const updated = await updateAnnouncement(editing.id, values);
        setAnnouncements((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        notify("success", "Announcement updated.");
      }
      setFormOpen(false);
    } catch (err) {
      notify("error", (err as Error).message || "Failed to save announcement.");
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await deleteAnnouncement(deleteTarget.id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      notify("success", "Announcement deleted.");
    } catch (err) {
      notify("error", (err as Error).message || "Failed to delete announcement.");
    } finally {
      setDeleteOpen(false);
      setDeleteTarget(null);
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}><CardContent className="pt-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
        ))}
      </div>
    );
  }

  if (status === "error") {
    return <ErrorState title="Failed to load announcements" description="Could not reach the campus data service." onRetry={load} />;
  }

  return (
    <>
      <FeedbackToaster items={toastItems} onDismiss={dismiss} />

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search announcements…"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_PRIORITY}>All priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Post Announcement
        </Button>
      </div>

      {/* Empty states */}
      {announcements.length === 0 && (
        <EmptyState
          icon={Megaphone}
          title="No announcements yet"
          description="Post a university notice to get started."
          action={<Button onClick={handleCreate}>Post Announcement</Button>}
        />
      )}

      {announcements.length > 0 && filtered.length === 0 && (
        <EmptyState
          icon={Search}
          title="No matching announcements"
          description="Try adjusting your search or priority filter."
        />
      )}

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map((ann) => (
          <Card
            key={ann.id}
            className={`border-l-4 transition-opacity ${
              isExpired(ann.expires) ? "opacity-60" : ""
            } ${
              ann.priority === "high"
                ? "border-l-danger"
                : ann.priority === "medium"
                ? "border-l-warning"
                : "border-l-border"
            }`}
          >
            <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge className={`text-xs capitalize border ${PRIORITY_COLORS[ann.priority]}`}>
                    {ann.priority}
                  </Badge>
                  {isExpired(ann.expires) && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">Expired</Badge>
                  )}
                </div>
                <h3 className="font-semibold text-sm leading-tight">{ann.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {ann.posted_by} · {ann.date} · Expires {ann.expires}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(ann)}>
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteClick(ann)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              <p className="text-sm text-muted-foreground whitespace-pre-line">{ann.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialogs */}
      <AnnouncementFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        defaultValues={editing ?? undefined}
        onSubmit={handleFormSubmit}
      />
      <DeleteAnnouncementDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        announcementTitle={deleteTarget?.title ?? ""}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
