"use client"

import { AppHeader } from "@/components/app-header"
import { CompetitorCard } from "@/components/competitor-card"
import { Card, CardContent } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { TrendingUp, Sparkles } from "lucide-react"
import { useState } from "react"
import { mockCompetitors } from "@/lib/mock-data"

export default function CompetitorsPage() {
  const [period, setPeriod] = useState("30d")

  return (
    <>
      <AppHeader
        title="Competitor Comparison"
        description="See how you stack up against the competition"
      />

      <div className="p-4 space-y-4">
        {/* Period Selector */}
        <div className="flex items-center justify-between">
          <ToggleGroup
            type="single"
            value={period}
            onValueChange={(v) => v && setPeriod(v)}
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
        <div className="grid gap-4 md:grid-cols-3">
          {mockCompetitors.map((competitor) => (
            <CompetitorCard key={competitor.id} competitor={competitor} />
          ))}
        </div>

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
