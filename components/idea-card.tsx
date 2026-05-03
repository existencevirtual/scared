"use client"

import { useState, useTransition } from "react"
import { MoreHorizontal, Pencil, Trash2, CheckCircle2, Clock, Loader2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { IdeaForm } from "@/components/idea-form"
import { toast } from "sonner"
import { deleteIdea, updateIdeaStatus } from "@/app/actions"
import type { Idea, IdeaStatus } from "@/lib/types"
import { STATUS_OPTIONS } from "@/lib/types"
import { cn } from "@/lib/utils"

const statusStyles: Record<IdeaStatus, string> = {
  pending: "bg-muted text-muted-foreground border-border",
  "in-progress": "bg-chart-2/15 text-chart-2 border-chart-2/30",
  done: "bg-chart-1/15 text-chart-1 border-chart-1/30",
}

const statusIcons: Record<IdeaStatus, React.ReactNode> = {
  pending: <Clock className="h-3 w-3" />,
  "in-progress": <Loader2 className="h-3 w-3" />,
  done: <CheckCircle2 className="h-3 w-3" />,
}

const statusLabel: Record<IdeaStatus, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  done: "Done",
}

export function IdeaCard({ idea }: { idea: Idea }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (status: IdeaStatus) => {
    if (status === idea.status) return
    startTransition(async () => {
      const result = await updateIdeaStatus(idea.$id, status)
      if (result.success) {
        toast.success("Status updated")
      } else {
        toast.error(result.error || "Failed to update status")
      }
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteIdea(idea.$id)
      if (result.success) {
        toast.success("Idea deleted")
        setDeleteOpen(false)
      } else {
        toast.error(result.error || "Failed to delete")
      }
    })
  }

  const created = new Date(idea.$createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <>
      <Card className="flex flex-col transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
          <div className="flex flex-col gap-2">
            <Badge
              variant="outline"
              className={cn("w-fit gap-1 font-medium", statusStyles[idea.status])}
            >
              {statusIcons[idea.status]}
              {statusLabel[idea.status]}
            </Badge>
            <CardTitle className="text-pretty text-lg leading-snug">
              {idea.title}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-mt-1 -mr-2 h-8 w-8 shrink-0"
                disabled={isPending}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {STATUS_OPTIONS.map((s) => (
                <DropdownMenuItem
                  key={s.value}
                  disabled={s.value === idea.status}
                  onClick={() => handleStatusChange(s.value)}
                >
                  Mark as {s.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex-1">
          {idea.description ? (
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {idea.description}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground/70">
              No description
            </p>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
          <Badge variant="secondary" className="font-normal">
            {idea.category}
          </Badge>
          <span>{created}</span>
        </CardFooter>
      </Card>

      <IdeaForm open={editOpen} onOpenChange={setEditOpen} idea={idea} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this idea?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The idea &quot;{idea.title}&quot; will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
