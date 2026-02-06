import { Skeleton } from "@/components/ui/skeleton"

export function ReviewsListSkeleton() {
  return (
    <div className="space-y-3">
      {/* Filter bar skeleton */}
      <div className="flex flex-wrap items-center gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-28" />
        ))}
      </div>

      {/* Reviews skeleton */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function InsightsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Tabs skeleton */}
      <Skeleton className="h-10 w-64" />

      {/* Grid skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-5 w-40" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-3" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CompetitorsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toggle skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-8 w-48" />
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-1 mb-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton className="h-3 w-4" />
                  <Skeleton className="h-3 flex-1" />
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-5 w-20" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SourcesSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Form skeleton */}
      <div className="rounded-lg border p-4">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* List skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-40 mb-3" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  )
}
