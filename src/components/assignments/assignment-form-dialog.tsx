"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Assignment } from "@/lib/types";

export type AssignmentFormValues = {
  course: string;
  course_title: string;
  title: string;
  description: string;
  assigned_date: string;
  deadline: string;
  submission_platform: string;
  status: "pending" | "submitted" | "graded" | "late";
  marks: number;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<Assignment>;
  onSubmit: (values: AssignmentFormValues) => Promise<void>;
}

const today = new Date().toISOString().slice(0, 10);

const EMPTY: AssignmentFormValues = {
  course: "",
  course_title: "",
  title: "",
  description: "",
  assigned_date: today,
  deadline: today,
  submission_platform: "",
  status: "pending",
  marks: 100,
};

export function AssignmentFormDialog({ open, onOpenChange, mode, defaultValues, onSubmit }: Props) {
  const [form, setForm] = React.useState<AssignmentFormValues>(EMPTY);
  const [errors, setErrors] = React.useState<Partial<Record<keyof AssignmentFormValues, string>>>({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setForm(
        defaultValues
          ? {
              course: defaultValues.course ?? "",
              course_title: defaultValues.course_title ?? "",
              title: defaultValues.title ?? "",
              description: defaultValues.description ?? "",
              assigned_date: defaultValues.assigned_date ?? today,
              deadline: defaultValues.deadline ?? today,
              submission_platform: defaultValues.submission_platform ?? "",
              status: defaultValues.status ?? "pending",
              marks: defaultValues.marks ?? 100,
            }
          : EMPTY
      );
      setErrors({});
    }
  }, [open, defaultValues]);

  function validate(): boolean {
    const e: Partial<Record<keyof AssignmentFormValues, string>> = {};
    if (!form.course.trim()) e.course = "Course code is required.";
    if (!form.course_title.trim()) e.course_title = "Course title is required.";
    if (!form.title.trim()) e.title = "Assignment title is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.assigned_date.match(/^\d{4}-\d{2}-\d{2}$/)) e.assigned_date = "Must be YYYY-MM-DD.";
    if (!form.deadline.match(/^\d{4}-\d{2}-\d{2}$/)) e.deadline = "Must be YYYY-MM-DD.";
    if (form.deadline < form.assigned_date) e.deadline = "Deadline must be after assigned date.";
    if (!form.submission_platform.trim()) e.submission_platform = "Platform is required.";
    if (form.marks < 0) e.marks = "Marks must be non-negative.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  }

  function field<K extends keyof AssignmentFormValues>(key: K, value: AssignmentFormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Assignment" : "Edit Assignment"}</DialogTitle>
        </DialogHeader>
        <form id="asgn-form" onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="asgn-course">Course Code *</Label>
              <Input id="asgn-course" value={form.course} onChange={(e) => field("course", e.target.value)} placeholder="CSE101" />
              {errors.course && <p className="text-xs text-destructive">{errors.course}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="asgn-course-title">Course Title *</Label>
              <Input id="asgn-course-title" value={form.course_title} onChange={(e) => field("course_title", e.target.value)} placeholder="Introduction to Computing" />
              {errors.course_title && <p className="text-xs text-destructive">{errors.course_title}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="asgn-title">Assignment Title *</Label>
            <Input id="asgn-title" value={form.title} onChange={(e) => field("title", e.target.value)} placeholder="Assignment 1" />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="asgn-desc">Description *</Label>
            <textarea
              id="asgn-desc"
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
              value={form.description}
              onChange={(e) => field("description", e.target.value)}
              placeholder="Assignment details and requirements…"
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="asgn-assigned">Assigned Date *</Label>
              <Input id="asgn-assigned" type="date" value={form.assigned_date} onChange={(e) => field("assigned_date", e.target.value)} />
              {errors.assigned_date && <p className="text-xs text-destructive">{errors.assigned_date}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="asgn-deadline">Deadline *</Label>
              <Input id="asgn-deadline" type="date" value={form.deadline} onChange={(e) => field("deadline", e.target.value)} />
              {errors.deadline && <p className="text-xs text-destructive">{errors.deadline}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="asgn-platform">Submission Platform *</Label>
              <Input id="asgn-platform" value={form.submission_platform} onChange={(e) => field("submission_platform", e.target.value)} placeholder="Google Classroom" />
              {errors.submission_platform && <p className="text-xs text-destructive">{errors.submission_platform}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="asgn-marks">Total Marks *</Label>
              <Input id="asgn-marks" type="number" min={0} value={form.marks} onChange={(e) => field("marks", Number(e.target.value))} />
              {errors.marks && <p className="text-xs text-destructive">{errors.marks}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="asgn-status">Status *</Label>
            <Select value={form.status} onValueChange={(v) => field("status", v as AssignmentFormValues["status"])}>
              <SelectTrigger id="asgn-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
          <Button type="submit" form="asgn-form" disabled={submitting}>
            {submitting ? "Saving…" : mode === "create" ? "Add" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
