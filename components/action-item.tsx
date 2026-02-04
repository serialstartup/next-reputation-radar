"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Action } from "@/lib/types"

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-gray-100 text-gray-700",
}

export function ActionItem({ action }: { action: Action }) {
  return (
    <div className="flex items-start gap-3 rounded-md border p-3">
      <Checkbox
        defaultChecked={action.completed}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "text-sm font-medium",
              action.completed && "line-through text-muted-foreground"
            )}
          >
            {action.title}
          </span>
          <Badge variant="outline" className={priorityColors[action.priority]}>
            {action.priority}
          </Badge>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{action.description}</p>
      </div>
    </div>
  )
}
