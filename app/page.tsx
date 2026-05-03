import { Lightbulb } from "lucide-react"
import { Toaster } from "sonner"
import { getIdeas } from "@/app/actions"
import { IdeasBoard } from "@/components/ideas-board"

export default async function Page() {
  const ideas = await getIdeas()

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <header className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Lightbulb className="h-5 w-5" />
            </div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Ideas Tracker
            </h1>
          </div>
          <p className="max-w-2xl text-pretty text-muted-foreground leading-relaxed">
            Capture, organize, and track your ideas from inspiration to done.
            Stored securely with Appwrite.
          </p>
        </header>

        <IdeasBoard ideas={ideas} />
      </div>
      <Toaster richColors position="top-right" />
    </main>
  )
}
