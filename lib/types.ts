export type IdeaStatus = "pending" | "in-progress" | "done"

export interface Idea {
  $id: string
  title: string
  description: string
  category: string
  status: IdeaStatus
  $createdAt: string
  $updatedAt: string
}

export const STATUS_OPTIONS: { value: IdeaStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
]

export const CATEGORY_OPTIONS = [
  "Product",
  "Engineering",
  "Design",
  "Marketing",
  "Personal",
  "Other",
]
