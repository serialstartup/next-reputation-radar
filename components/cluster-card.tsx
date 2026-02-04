"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import type { Cluster } from "@/lib/types"

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-gray-100 text-gray-700",
}

export function ClusterCard({ cluster }: { cluster: Cluster }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cluster.response_template)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{cluster.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={priorityColors[cluster.priority]}>
              {cluster.priority}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {cluster.mention_percentage}% mentions
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Sample Reviews ({cluster.review_count} total)
          </p>
          <ul className="space-y-1">
            {cluster.sample_reviews.map((review, i) => (
              <li key={i} className="text-xs text-muted-foreground">
                &ldquo;{review}&rdquo;
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Strategy</p>
          <p className="text-xs">{cluster.strategy}</p>
        </div>

        <div className="rounded-md bg-muted/50 p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-muted-foreground">Response Template</p>
            <Button variant="ghost" size="icon-sm" onClick={handleCopy}>
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
          <p className="text-xs">{cluster.response_template}</p>
        </div>
      </CardContent>
    </Card>
  )
}
