import { AppHeader } from "@/components/app-header"
import { KPICard } from "@/components/kpi-card"
import { IssueCard } from "@/components/issue-card"
import { ActionItem } from "@/components/action-item"
import { ReviewCard } from "@/components/review-card"
import { SentimentChart } from "@/components/sentiment-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, TrendingUp } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import {
  getKPIs,
  getReviews,
  getActions,
  getSentimentData,
  getClusters,
} from "@/lib/queries"

const kpiIcons = ["star", "reviews", "negative", "unanswered"]

export default async function DashboardPage() {
  const [kpis, reviews, actions, sentimentData, clusters] = await Promise.all([
    getKPIs(),
    getReviews(),
    getActions(),
    getSentimentData(),
    getClusters(),
  ])

  const latestReviews = reviews.slice(0, 3)
  const topIssues = clusters.filter((c) => c.sentiment === "negative").slice(0, 2)
  const hasData = reviews.length > 0

  return (
    <>
      <AppHeader title="Dashboard" description="Overview of your online reputation" />

      <div className="p-4 space-y-4">
        {/* KPI Row */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, i) => (
            <KPICard key={kpi.label} kpi={kpi} iconKey={kpiIcons[i]} />
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Top Issues */}
            <div>
              <h2 className="text-sm font-semibold mb-3">Top Issues Today</h2>
              {topIssues.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {topIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      title={issue.name}
                      mentions={issue.review_count}
                      priority={issue.priority}
                      excerpt={issue.sample_reviews[0]}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <EmptyState
                      icon={CheckCircle2}
                      title="No issues detected"
                      description="AI analysis will show top issues here once you have more reviews."
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sentiment Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Sentiment Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                {sentimentData.length > 0 ? (
                  <SentimentChart data={sentimentData} />
                ) : (
                  <EmptyState
                    icon={TrendingUp}
                    title="No sentiment data yet"
                    description="Add sources and reviews to see sentiment trends."
                    className="py-8"
                  />
                )}
              </CardContent>
            </Card>

            {/* Latest Reviews */}
            <div>
              <h2 className="text-sm font-semibold mb-3">Latest Reviews</h2>
              {latestReviews.length > 0 ? (
                <div className="space-y-3">
                  {latestReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <EmptyState
                      icon={TrendingUp}
                      title="No reviews yet"
                      description="Connect a source to start tracking reviews."
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {actions.length > 0 ? (
                  actions.map((action) => (
                    <ActionItem key={action.id} action={action} />
                  ))
                ) : (
                  <EmptyState
                    title="No recommendations yet"
                    description="AI will suggest actions once you have reviews."
                    className="py-4"
                  />
                )}
              </CardContent>
            </Card>

            {/* Success Banner - only show when there's data */}
            {hasData && (
              <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="p-4 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-emerald-900">
                      Dashboard connected
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Your data is syncing from Supabase.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
