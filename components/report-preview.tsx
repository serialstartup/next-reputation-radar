import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"
import type { WeeklyReport } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export function ReportPreview({ report }: { report: WeeklyReport }) {
  const total =
    report.sentiment_breakdown.positive +
    report.sentiment_breakdown.neutral +
    report.sentiment_breakdown.negative

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Reputation Weekly</CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            {report.period}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metrics Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border p-3">
            <p className="text-[10px] text-muted-foreground">Sentiment Shift</p>
            <p className="text-lg font-bold mt-0.5">
              {report.sentiment_shift > 0 ? "+" : ""}
              {report.sentiment_shift}%
            </p>
            <p className="text-[10px] text-muted-foreground">
              vs previous period
            </p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-[10px] text-muted-foreground">Avg Rating</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-lg font-bold">{report.avg_rating}</span>
              <StarRating rating={report.avg_rating} />
            </div>
            <p className="text-[10px] text-muted-foreground">
              {report.new_reviews} new reviews
            </p>
          </div>
        </div>

        {/* Sentiment Breakdown */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Sentiment Breakdown</p>
          <div className="flex h-3 overflow-hidden rounded-full">
            <div
              className="bg-emerald-500"
              style={{ width: `${(report.sentiment_breakdown.positive / total) * 100}%` }}
            />
            <div
              className="bg-gray-400"
              style={{ width: `${(report.sentiment_breakdown.neutral / total) * 100}%` }}
            />
            <div
              className="bg-red-500"
              style={{ width: `${(report.sentiment_breakdown.negative / total) * 100}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>Positive {report.sentiment_breakdown.positive}</span>
            <span>Neutral {report.sentiment_breakdown.neutral}</span>
            <span>Negative {report.sentiment_breakdown.negative}</span>
          </div>
        </div>

        {/* Top Wins */}
        {report.top_wins?.length ? (
          <div>
            <p className="text-xs font-medium mb-1">Top 3 Wins This Week</p>
            <ul className="space-y-2">
              {report.top_wins.slice(0, 3).map((w, i) => (
                <li key={i} className="text-xs">
                  <div className="flex items-start gap-2">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium leading-none">{w.title}</p>
                      {w.detail && (
                        <p className="text-[11px] text-muted-foreground mt-0.5">{w.detail}</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function ReportPreviewSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Reputation Weekly</CardTitle>
          <Skeleton className="h-4 w-28" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border p-3 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="rounded-md border p-3 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <Skeleton className="h-3 w-full" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </CardContent>
    </Card>
  )
}
