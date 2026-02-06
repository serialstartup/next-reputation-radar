import { Suspense } from "react"
import { AppHeader } from "@/components/app-header"
import { CompetitorCard } from "@/components/competitor-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { TrendingUp, Sparkles } from "lucide-react"
import { mockCompetitors } from "@/lib/mock-data"
import { CompetitorsSkeleton } from "@/components/review-skeletons"

export default function CompetitorsPage() {
  const competitors = mockCompetitors

  return (
    <>
      <AppHeader
        title="Competitor Comparison"
        description="See how you stack up against the competition"
      />

      <div className="p-4 space-y-4">
        {/* Period Selector */}
        <div className="flex items-center justify-between">
          <Suspense fallback={<div className="h-8 w-32" />}>
            <ToggleGroup
              type="single"
              defaultValue="30d"
              size="sm"
            >
              <ToggleGroupItem value="30d" className="text-xs">
                30 Days
              </ToggleGroupItem>
              <ToggleGroupItem value="90d" className="text-xs">
                90 Days
              </ToggleGroupItem>
              <ToggleGroupItem value="ytd" className="text-xs">
                YTD
              </ToggleGroupItem>
            </ToggleGroup>
          </Suspense>
        </div>

        {/* Strategic Advantage Banner */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Your Strategic Advantage</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                You have higher coffee quality ratings than all competitors. Leverage this
                in your marketing while addressing service speed gaps.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Competitor Cards */}
        <Suspense fallback={<CompetitorsSkeleton />}>
          <div className="grid gap-4 md:grid-cols-3">
            {competitors.map((competitor) => (
              <CompetitorCard key={competitor.id} competitor={competitor} />
            ))}
          </div>
        </Suspense>

        {/* AI Insight CTA */}
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-2 text-sm font-medium">
              Get AI-Powered Competitive Analysis
            </p>
            <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
              Our AI can analyze competitor reviews in depth and generate a detailed
              strategic report with actionable recommendations.
            </p>
            <Button className="mt-4" size="sm">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Generate Full Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
