import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StarRating } from "@/components/star-rating"
import { MessageSquare, Edit2 } from "lucide-react"
import type { Review } from "@/lib/types"
import { ReviewReplyDialog } from "@/components/review-reply-dialog"

const platformColors: Record<string, string> = {
  google: "bg-blue-100 text-blue-700",
  instagram: "bg-pink-100 text-pink-700",
  yelp: "bg-red-100 text-red-700",
  tripadvisor: "bg-green-100 text-green-700",
  facebook: "bg-indigo-100 text-indigo-700",
}

const sentimentColors: Record<string, string> = {
  positive: "bg-emerald-100 text-emerald-700",
  negative: "bg-red-100 text-red-700",
  neutral: "bg-gray-100 text-gray-700",
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {review.author.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">{review.author}</span>
                <StarRating rating={review.rating} />
                <Badge variant="outline" className={platformColors[review.platform]}>
                  {review.platform}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{review.date}</p>
              <p className="mt-2 text-sm leading-relaxed">{review.text}</p>
              {review.topics && review.topics.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {review.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-[10px]">
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}
              {/* Sentiment badge */}
              <div className="mt-2">
                <Badge variant="outline" className={sentimentColors[review.sentiment]}>
                  {review.sentiment}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Reply Display */}
        {review.replied && review.reply_text && (
          <div className="mt-3 ml-11 rounded-md bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground">Your Reply</p>
            <p className="mt-1 text-xs">{review.reply_text}</p>
          </div>
        )}

        {/* Reply Button */}
        <div className="mt-3 flex gap-2">
          <ReviewReplyDialog review={review}>
            <Button
              variant={review.replied ? "outline" : "default"}
              size="sm"
              className="text-xs"
            >
              {review.replied ? (
                <>
                  <Edit2 className="mr-1 h-3 w-3" />
                  Edit Reply
                </>
              ) : (
                <>
                  <MessageSquare className="mr-1 h-3 w-3" />
                  Reply
                </>
              )}
            </Button>
          </ReviewReplyDialog>
        </div>
      </CardContent>
    </Card>
  )
}
