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
import type { Announcement } from "@/lib/types";

export type AnnouncementFormValues = {
  title: string;
  body: string;
  date: string;
  priority: "high" | "medium" | "low";
  posted_by: string;
  expires: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<Announcement>;
  onSubmit: (values: AnnouncementFormValues) => Promise<void>;
}

const today = new Date().toISOString().slice(0, 10);
const oneMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

const EMPTY: AnnouncementFormValues = {
  title: "",
  body: "",
  date: today,
  priority: "medium",
  posted_by: "",
  expires: oneMonth,
};

export function AnnouncementFormDialog({ open, onOpenChange, mode, defaultValues, onSubmit }: Props) {
  const [form, setForm] = React.useState<AnnouncementFormValues>(EMPTY);
  const [errors, setErrors] = React.useState<Partial<Record<keyof AnnouncementFormValues, string>>>({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setForm(
        defaultValues
          ? {
              title: defaultValues.title ?? "",
              body: defaultValues.body ?? "",
              date: defaultValues.date ?? today,
              priority: defaultValues.priority ?? "medium",
              posted_by: defaultValues.posted_by ?? "",
              expires: defaultValues.expires ?? oneMonth,
            }
          : EMPTY
      );
      setErrors({});
    }
  }, [open, defaultValues]);

  function validate(): boolean {
    const e: Partial<Record<keyof AnnouncementFormValues, string>> = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.body.trim()) e.body = "Body is required.";
    if (!form.date.match(/^\d{4}-\d{2}-\d{2}$/)) e.date = "Date must be YYYY-MM-DD.";
    if (!form.posted_by.trim()) e.posted_by = "Posted by is required.";
    if (!form.expires.match(/^\d{4}-\d{2}-\d{2}$/)) e.expires = "Expiry must be YYYY-MM-DD.";
    if (form.expires < form.date) e.expires = "Expiry must be on or after date.";
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

  function field(key: keyof AnnouncementFormValues, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Post Announcement" : "Edit Announcement"}</DialogTitle>
        </DialogHeader>
        <form id="ann-form" onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="ann-title">Title *</Label>
            <Input id="ann-title" value={form.title} onChange={(e) => field("title", e.target.value)} placeholder="Announcement headline" />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="ann-body">Body *</Label>
            <textarea
              id="ann-body"
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
              value={form.body}
              onChange={(e) => field("body", e.target.value)}
              placeholder="Full announcement text…"
            />
            {errors.body && <p className="text-xs text-destructive">{errors.body}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="ann-priority">Priority *</Label>
              <Select value={form.priority} onValueChange={(v) => field("priority", v)}>
                <SelectTrigger id="ann-priority"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="ann-posted-by">Posted By *</Label>
              <Input id="ann-posted-by" value={form.posted_by} onChange={(e) => field("posted_by", e.target.value)} placeholder="Department / Name" />
              {errors.posted_by && <p className="text-xs text-destructive">{errors.posted_by}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="ann-date">Date *</Label>
              <Input id="ann-date" type="date" value={form.date} onChange={(e) => field("date", e.target.value)} />
              {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="ann-expires">Expires *</Label>
              <Input id="ann-expires" type="date" value={form.expires} onChange={(e) => field("expires", e.target.value)} />
              {errors.expires && <p className="text-xs text-destructive">{errors.expires}</p>}
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
          <Button type="submit" form="ann-form" disabled={submitting}>
            {submitting ? "Saving…" : mode === "create" ? "Post" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
