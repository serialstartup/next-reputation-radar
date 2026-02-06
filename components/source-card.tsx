"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"
import { ExternalLink, RefreshCw, Trash2, Loader2 } from "lucide-react"
import type { Source } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  active: { label: "Active", variant: "default" },
  syncing: { label: "Syncing...", variant: "secondary" },
  error: { label: "Error", variant: "destructive" },
}

interface SourceCardProps {
  source: Source
  onDelete?: () => void
}

export function SourceCard({ source, onDelete }: SourceCardProps) {
  const status = statusMap[source.status]
  const [loading, setLoading] = useState<{ refresh?: boolean; delete?: boolean }>({})
  const supabase = createClient()

  const handleRefresh = async () => {
    setLoading({ refresh: true })
    
    // Call Apify API to refresh this source
    const response = await fetch("/api/apify/run-source", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_id: source.id, url: source.url }),
    })

    if (response.ok) {
      // Update status to syncing
      await supabase
        .from("sources")
        .update({ status: "syncing" })
        .eq("id", source.id)
    }

    setLoading({})
    window.dispatchEvent(new CustomEvent("source-updated"))
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${source.name}"?`)) return
    
    setLoading({ delete: true })
    
    const { error } = await supabase
      .from("sources")
      .delete()
      .eq("id", source.id)

    if (!error) {
      onDelete?.()
    }

    setLoading({})
    window.dispatchEvent(new CustomEvent("source-updated"))
  }

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
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleRefresh}
              disabled={loading.refresh || source.status === "syncing"}
            >
              {loading.refresh ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => window.open(source.url, "_blank")}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive"
              onClick={handleDelete}
              disabled={loading.delete}
            >
              {loading.delete ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
