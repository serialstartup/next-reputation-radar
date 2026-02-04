import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"
import { RatingDistribution } from "@/components/rating-distribution"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { Competitor } from "@/lib/types"

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
}

const trendColors = {
  up: "text-emerald-500",
  down: "text-destructive",
  stable: "text-muted-foreground",
}

export function CompetitorCard({ competitor }: { competitor: Competitor }) {
  const TrendIcon = trendIcons[competitor.trend]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{competitor.name}</CardTitle>
          <TrendIcon className={`h-4 w-4 ${trendColors[competitor.trend]}`} />
        </div>
        <div className="flex items-center gap-2">
          <StarRating rating={competitor.avg_rating} />
          <span className="text-xs font-medium">{competitor.avg_rating}</span>
          <span className="text-xs text-muted-foreground">
            ({competitor.review_count} reviews)
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <RatingDistribution distribution={competitor.rating_distribution} />

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Pain Points</p>
          <div className="flex flex-wrap gap-1">
            {competitor.pain_points.map((point) => (
              <Badge key={point} variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200">
                {point}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Strengths</p>
          <div className="flex flex-wrap gap-1">
            {competitor.strengths.map((strength) => (
              <Badge key={strength} variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                {strength}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
