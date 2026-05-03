"use client"

import { useMemo, useState } from "react"
import { Plus, Search, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"
import { IdeaCard } from "@/components/idea-card"
import { IdeaForm } from "@/components/idea-form"
import type { Idea, IdeaStatus } from "@/lib/types"

type Filter = "all" | IdeaStatus

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
]

export function IdeasBoard({ ideas }: { ideas: Idea[] }) {
  const [filter, setFilter] = useState<Filter>("all")
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)

  const counts = useMemo(() => {
    return {
      all: ideas.length,
      pending: ideas.filter((i) => i.status === "pending").length,
      "in-progress": ideas.filter((i) => i.status === "in-progress").length,
      done: ideas.filter((i) => i.status === "done").length,
    }
  }, [ideas])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return ideas.filter((idea) => {
      const matchesFilter = filter === "all" || idea.status === filter
      const matchesSearch =
        !q ||
        idea.title.toLowerCase().includes(q) ||
        idea.description.toLowerCase().includes(q) ||
        idea.category.toLowerCase().includes(q)
      return matchesFilter && matchesSearch
    })
  }, [ideas, filter, search])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search ideas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New idea
        </Button>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          {filters.map((f) => (
            <TabsTrigger key={f.value} value={f.value} className="gap-2">
              {f.label}
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {counts[f.value]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Lightbulb className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>
              {ideas.length === 0 ? "No ideas yet" : "No matching ideas"}
            </EmptyTitle>
            <EmptyDescription>
              {ideas.length === 0
                ? "Capture your first idea to get started."
                : "Try adjusting your search or filter."}
            </EmptyDescription>
          </EmptyHeader>
          {ideas.length === 0 && (
            <EmptyContent>
              <Button onClick={() => setCreateOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create your first idea
              </Button>
            </EmptyContent>
          )}
        </Empty>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((idea) => (
            <IdeaCard key={idea.$id} idea={idea} />
          ))}
        </div>
      )}

      <IdeaForm open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
