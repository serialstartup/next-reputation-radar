import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div>
        <p className="text-sm font-semibold">Page not found</p>
        <p className="text-xs text-muted-foreground mt-1">
          The page you are looking for doesn’t exist or was moved.
        </p>
        <Link href="/dashboard" className="inline-block mt-3 text-xs underline">
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

