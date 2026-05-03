import { Client, Databases, ID, Query } from "node-appwrite"

const endpoint = process.env.APPWRITE_ENDPOINT
const projectId = process.env.APPWRITE_PROJECT_ID
const apiKey = process.env.APPWRITE_API_KEY

export const databaseId = process.env.APPWRITE_DATABASE_ID || ""
export const collectionId = process.env.APPWRITE_COLLECTION_ID || ""

if (!endpoint || !projectId || !apiKey) {
  console.log("[v0] Missing Appwrite environment variables")
}

const client = new Client()
  .setEndpoint(endpoint || "")
  .setProject(projectId || "")
  .setKey(apiKey || "")

export const databases = new Databases(client)
export { ID, Query }
