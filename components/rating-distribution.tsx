export function RatingDistribution({ distribution }: { distribution: number[] }) {
  const total = distribution.reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-1">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[star - 1]
        const pct = total > 0 ? (count / total) * 100 : 0
        return (
          <div key={star} className="flex items-center gap-2">
            <span className="w-3 text-[10px] text-muted-foreground text-right">{star}</span>
            <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-8 text-[10px] text-muted-foreground text-right">
              {Math.round(pct)}%
            </span>
          </div>
        )
      })}
    </div>
  )
}
