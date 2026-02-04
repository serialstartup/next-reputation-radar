"use client"

import { AppHeader } from "@/components/app-header"
import { ReviewCard } from "@/components/review-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMemo, useState } from "react"
import type { Review } from "@/lib/types"
import { useSearchParams, useRouter } from "next/navigation"
import { EmptyState } from "@/components/empty-state"
import { Search, MessageSquare } from "lucide-react"
import Link from "next/link"

interface ReviewsClientProps {
  initialReviews: Review[]
}

export function ReviewsClient({ initialReviews }: ReviewsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = (searchParams.get("query") || "").trim().toLowerCase()
  const [platformFilter, setPlatformFilter] = useState<string>("all")
  const [sentimentFilter, setSentimentFilter] = useState<string>("all")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [replyFilter, setReplyFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  const filtered = initialReviews.filter((r) => {
    if (platformFilter !== "all" && r.platform !== platformFilter) return false
    if (sentimentFilter !== "all" && r.sentiment !== sentimentFilter) return false
    if (ratingFilter !== "all" && r.rating !== Number(ratingFilter)) return false
    if (replyFilter !== "all" && r.replied !== (replyFilter === "replied")) return false
    if (query) {
      const blob = `${r.author} ${r.text} ${(r.topics || []).join(" ")}`.toLowerCase()
      if (!blob.includes(query)) return false
    }
    return true
  })

  const sorted = useMemo(() => {
    const arr = [...filtered]
    switch (sortBy) {
      case "oldest":
        arr.sort((a, b) => +new Date(a.date) - +new Date(b.date))
        break
      case "highest":
        arr.sort((a, b) => b.rating - a.rating)
        break
      case "lowest":
        arr.sort((a, b) => a.rating - b.rating)
        break
      case "newest":
      default:
        arr.sort((a, b) => +new Date(b.date) - +new Date(a.date))
    }
    return arr
  }, [filtered, sortBy])

  const hasNoSources = initialReviews.length === 0

  return (
    <>
      <AppHeader title="Reviews" description="All reviews from connected sources" />

      <div className="p-4 space-y-4">
        {hasNoSources ? (
          <EmptyState
            icon={MessageSquare}
            title="No reviews yet"
            description="Connect a source to start tracking your reviews."
            action={
              <Button size="sm" asChild>
                <Link href="/sources">Add source</Link>
              </Button>
            }
            className="py-12"
          />
        ) : (
          <>
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="yelp">Yelp</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue placeholder="Sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>

              <Select value={replyFilter} onValueChange={setReplyFilter}>
                <SelectTrigger className="w-40 h-8 text-xs">
                  <SelectValue placeholder="Reply" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Replies</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="unreplied">Unreplied</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 h-8 text-xs">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="highest">Highest rating</SelectItem>
                  <SelectItem value="lowest">Lowest rating</SelectItem>
                </SelectContent>
              </Select>

              <Badge variant="secondary" className="text-xs">
                {filtered.length} reviews
              </Badge>

              <Badge variant="outline" className="text-xs">
                {filtered.filter((r) => !r.replied).length} unreplied
              </Badge>

              {query && (
                <Badge variant="outline" className="text-xs">
                  query: &quot;{query}&quot;
                </Badge>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setPlatformFilter("all")
                  setSentimentFilter("all")
                  setRatingFilter("all")
                  setReplyFilter("all")
                  setSortBy("newest")
                  router.push("/reviews")
                }}
              >
                Clear all
              </Button>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {sorted.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {filtered.length === 0 && (
              <EmptyState
                icon={Search}
                title="No reviews match your filters"
                description="Try clearing filters or adjusting your search query."
                action={
                  <Button
                    size="sm"
                    onClick={() => {
                      setPlatformFilter("all")
                      setSentimentFilter("all")
                      setRatingFilter("all")
                      router.push("/reviews")
                    }}
                  >
                    Clear filters
                  </Button>
                }
                className="py-12"
              />
            )}
          </>
        )}
      </div>
    </>
  )
}
