import { Skeleton } from "@/components/ui/skeleton"

export function KPIGridSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  )
}

export function SentimentChartSkeleton() {
  return (
    <div className="rounded-lg border p-4">
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-[250px] w-full" />
    </div>
  )
}

export function LatestReviewsSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-32" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function TopIssuesSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-32" />
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function AIRecommendationsSkeleton() {
  return (
    <div className="rounded-lg border p-4">
      <Skeleton className="h-4 w-40 mb-4" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-md border p-3 mb-2 last:mb-0">
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  )
}
