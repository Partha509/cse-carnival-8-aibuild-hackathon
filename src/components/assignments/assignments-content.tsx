"use client";

import * as React from "react";
import { ClipboardList, Pencil, Plus, Search, Trash2 } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import {
  fetchAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  type AssignmentInput,
} from "@/lib/data/assignments";
import type { Assignment } from "@/lib/types";
import { AssignmentFormDialog, type AssignmentFormValues } from "./assignment-form-dialog";
import { DeleteAssignmentDialog } from "./delete-assignment-dialog";
import { FeedbackToaster, useFeedback } from "@/components/feedback-toaster";

type Status = "loading" | "ready" | "error";
const ALL = "__all__";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  submitted: "bg-schedule/10 text-schedule border-schedule/20",
  graded: "bg-events/10 text-events border-events/20",
  late: "bg-danger/10 text-danger border-danger/20",
};

function daysUntil(deadline: string): number {
  const today = new Date().toISOString().slice(0, 10);
  const diff = new Date(deadline).getTime() - new Date(today).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function DeadlineBadge({ deadline }: { deadline: string }) {
  const days = daysUntil(deadline);
  if (days < 0) return <Badge className="text-xs border bg-danger/10 text-danger border-danger/20">Overdue</Badge>;
  if (days === 0) return <Badge className="text-xs border bg-danger/10 text-danger border-danger/20">Due Today</Badge>;
  if (days <= 3) return <Badge className="text-xs border bg-warning/10 text-warning border-warning/20">{days}d left</Badge>;
  return <Badge variant="outline" className="text-xs">{days}d left</Badge>;
}

export function AssignmentsContent() {
  const [status, setStatus] = React.useState<Status>("loading");
  const [assignments, setAssignments] = React.useState<Assignment[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string>(ALL);
  const [courseQuery, setCourseQuery] = React.useState("");

  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [editing, setEditing] = React.useState<Assignment | null>(null);

  const [deleteTarget, setDeleteTarget] = React.useState<Assignment | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const { items: toastItems, notify, dismiss } = useFeedback();

  const load = React.useCallback(async () => {
    setStatus("loading");
    try {
      const data = await fetchAssignments();
      // Sort by deadline ascending
      data.sort((a, b) => a.deadline.localeCompare(b.deadline));
      setAssignments(data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const filtered = React.useMemo(() => {
    return assignments.filter((a) => {
      if (statusFilter !== ALL && a.status !== statusFilter) return false;
      if (courseQuery) {
        const q = courseQuery.toLowerCase();
        if (!a.course.toLowerCase().includes(q) && !a.course_title.toLowerCase().includes(q) && !a.title.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [assignments, statusFilter, courseQuery]);

  function handleCreate() { setEditing(null); setFormMode("create"); setFormOpen(true); }
  function handleEdit(a: Assignment) { setEditing(a); setFormMode("edit"); setFormOpen(true); }
  function handleDeleteClick(a: Assignment) { setDeleteTarget(a); setDeleteOpen(true); }

  async function handleFormSubmit(values: AssignmentFormValues) {
    try {
      if (formMode === "create") {
        const input: AssignmentInput = { id: `asgn-${Date.now()}`, ...values };
        const created = await createAssignment(input);
        setAssignments((prev) => [...prev, created].sort((a, b) => a.deadline.localeCompare(b.deadline)));
        notify("success", "Assignment added.");
      } else if (editing) {
        const updated = await updateAssignment(editing.id, values);
        setAssignments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        notify("success", "Assignment updated.");
      }
      setFormOpen(false);
    } catch (err) {
      notify("error", (err as Error).message || "Failed to save assignment.");
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await deleteAssignment(deleteTarget.id);
      setAssignments((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      notify("success", "Assignment deleted.");
    } catch (err) {
      notify("error", (err as Error).message || "Failed to delete assignment.");
    } finally {
      setDeleteOpen(false);
      setDeleteTarget(null);
    }
  }

  if (status === "loading") {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}><CardContent className="pt-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
        ))}
      </div>
    );
  }

  if (status === "error") {
    return <ErrorState title="Failed to load assignments" description="Could not reach the campus data service." onRetry={load} />;
  }

  return (
    <>
      <FeedbackToaster items={toastItems} onDismiss={dismiss} />

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search course or title…"
            className="pl-9"
            value={courseQuery}
            onChange={(e) => setCourseQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="graded">Graded</SelectItem>
            <SelectItem value="late">Late</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Assignment
        </Button>
      </div>

      {/* Empty states */}
      {assignments.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No assignments yet"
          description="Add a course assignment to track it here."
          action={<Button onClick={handleCreate}>Add Assignment</Button>}
        />
      )}
      {assignments.length > 0 && filtered.length === 0 && (
        <EmptyState icon={Search} title="No matching assignments" description="Try adjusting your filters." />
      )}

      {/* Desktop table */}
      {filtered.length > 0 && (
        <>
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="font-medium">{a.course}</div>
                      <div className="text-xs text-muted-foreground">{a.course_title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{a.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{a.description}</div>
                    </TableCell>
                    <TableCell>
                      <div>{a.deadline}</div>
                      <DeadlineBadge deadline={a.deadline} />
                    </TableCell>
                    <TableCell>
                      <Badge className={`capitalize border text-xs ${STATUS_COLORS[a.status]}`}>{a.status}</Badge>
                    </TableCell>
                    <TableCell>{a.marks}</TableCell>
                    <TableCell className="text-xs">{a.submission_platform}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(a)}>
                          <Pencil className="h-3.5 w-3.5" /><span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteClick(a)}>
                          <Trash2 className="h-3.5 w-3.5" /><span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden space-y-3">
            {filtered.map((a) => (
              <Card key={a.id}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{a.course} · {a.course_title}</p>
                      <p className="font-semibold text-sm">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{a.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className={`capitalize border text-xs ${STATUS_COLORS[a.status]}`}>{a.status}</Badge>
                        <DeadlineBadge deadline={a.deadline} />
                        <span className="text-xs text-muted-foreground self-center">{a.marks} marks</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(a)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteClick(a)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <AssignmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        defaultValues={editing ?? undefined}
        onSubmit={handleFormSubmit}
      />
      <DeleteAssignmentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        assignmentTitle={deleteTarget?.title ?? ""}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
