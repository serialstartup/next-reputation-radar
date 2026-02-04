import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { KPI } from "@/lib/types"
import { TrendingUp, TrendingDown, Star, MessageSquare, AlertTriangle, MessageCircleWarning } from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  star: Star,
  reviews: MessageSquare,
  negative: AlertTriangle,
  unanswered: MessageCircleWarning,
}

export function KPICard({ kpi, iconKey }: { kpi: KPI; iconKey?: string }) {
  const Icon = iconKey ? iconMap[iconKey] : null
  const isPositive = kpi.change && kpi.change > 0
  const isNegativeMetric = kpi.label === "Negative Trend" || kpi.label === "Unanswered"
  const trendPositive = isNegativeMetric ? !isPositive : isPositive

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold">{kpi.value}</p>
          {kpi.change !== undefined && (
            <div className="mt-1 flex items-center gap-1">
              {trendPositive ? (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span
                className={cn(
                  "text-xs",
                  trendPositive ? "text-emerald-500" : "text-destructive"
                )}
              >
                {kpi.change > 0 ? "+" : ""}
                {kpi.change} {kpi.changeLabel}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
