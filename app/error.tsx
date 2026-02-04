"use client"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
          <div>
            <p className="text-sm font-semibold">Something went wrong</p>
            <p className="text-xs text-muted-foreground mt-1">
              {error?.message || "An unexpected error occurred."}
            </p>
            <button className="mt-3 text-xs underline" onClick={() => reset()}>
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}

