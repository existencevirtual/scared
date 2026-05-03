"use server"

import { revalidatePath } from "next/cache"
import { databases, databaseId, collectionId, ID, Query } from "@/lib/appwrite"
import type { Idea, IdeaStatus } from "@/lib/types"

export async function getIdeas(): Promise<Idea[]> {
  try {
    const res = await databases.listDocuments(databaseId, collectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ])
    return res.documents as unknown as Idea[]
  } catch (error) {
    console.log("[v0] Error fetching ideas:", error)
    return []
  }
}

export async function createIdea(formData: {
  title: string
  description: string
  category: string
  status: IdeaStatus
}) {
  try {
    await databases.createDocument(databaseId, collectionId, ID.unique(), {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: formData.status,
    })
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.log("[v0] Error creating idea:", error)
    return { success: false, error: error?.message || "Failed to create idea" }
  }
}

export async function updateIdea(
  id: string,
  formData: {
    title: string
    description: string
    category: string
    status: IdeaStatus
  },
) {
  try {
    await databases.updateDocument(databaseId, collectionId, id, {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: formData.status,
    })
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.log("[v0] Error updating idea:", error)
    return { success: false, error: error?.message || "Failed to update idea" }
  }
}

export async function updateIdeaStatus(id: string, status: IdeaStatus) {
  try {
    await databases.updateDocument(databaseId, collectionId, id, { status })
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.log("[v0] Error updating status:", error)
    return { success: false, error: error?.message || "Failed to update status" }
  }
}

export async function deleteIdea(id: string) {
  try {
    await databases.deleteDocument(databaseId, collectionId, id)
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.log("[v0] Error deleting idea:", error)
    return { success: false, error: error?.message || "Failed to delete idea" }
  }
}
