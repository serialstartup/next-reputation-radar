import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"
import { ExternalLink, RefreshCw, Trash2 } from "lucide-react"
import type { Source } from "@/lib/types"

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  active: { label: "Active", variant: "default" },
  syncing: { label: "Syncing...", variant: "secondary" },
  error: { label: "Error", variant: "destructive" },
}

export function SourceCard({ source }: { source: Source }) {
  const status = statusMap[source.status]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">{source.name}</h3>
              <Badge variant={status.variant} className="text-[10px]">
                {status.label}
              </Badge>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <StarRating rating={source.avg_rating} />
              <span className="text-xs text-muted-foreground">
                {source.avg_rating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                {source.review_count} reviews
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Connected {source.connected_at}
            </p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon-sm">
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" className="text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
