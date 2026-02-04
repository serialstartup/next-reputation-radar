import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

interface IssueCardProps {
  title: string
  mentions: number
  priority: "high" | "medium" | "low"
  excerpt: string
}

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-gray-100 text-gray-700",
}

export function IssueCard({ title, mentions, priority, excerpt }: IssueCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">{title}</h3>
              <Badge variant="outline" className={priorityColors[priority]}>
                {priority}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {mentions} mentions this week
            </p>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{excerpt}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
