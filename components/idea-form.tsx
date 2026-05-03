"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { createIdea, updateIdea } from "@/app/actions"
import type { Idea, IdeaStatus } from "@/lib/types"
import { STATUS_OPTIONS, CATEGORY_OPTIONS } from "@/lib/types"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  idea?: Idea | null
}

export function IdeaForm({ open, onOpenChange, idea }: Props) {
  const isEdit = Boolean(idea)
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState(idea?.title ?? "")
  const [description, setDescription] = useState(idea?.description ?? "")
  const [category, setCategory] = useState(idea?.category ?? CATEGORY_OPTIONS[0])
  const [status, setStatus] = useState<IdeaStatus>(idea?.status ?? "pending")

  // Reset state when the dialog reopens with a different idea.
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setTitle(idea?.title ?? "")
      setDescription(idea?.description ?? "")
      setCategory(idea?.category ?? CATEGORY_OPTIONS[0])
      setStatus(idea?.status ?? "pending")
    }
    onOpenChange(next)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Title is required")
      return
    }

    startTransition(async () => {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        status,
      }

      const result = isEdit && idea
        ? await updateIdea(idea.$id, payload)
        : await createIdea(payload)

      if (result.success) {
        toast.success(isEdit ? "Idea updated" : "Idea created")
        onOpenChange(false)
      } else {
        toast.error(result.error || "Something went wrong")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit idea" : "New idea"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details of your idea."
              : "Capture a new idea before it slips away."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A short, descriptive title"
              maxLength={120}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more context, links, or notes..."
              rows={4}
              maxLength={2000}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as IdeaStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEdit ? "Save changes" : "Create idea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
