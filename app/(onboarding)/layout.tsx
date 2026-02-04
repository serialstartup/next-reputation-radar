import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-background">
      <header className="flex h-14 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold">Reputation Radar</span>
        </Link>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-12">{children}</main>
    </div>
  )
}
