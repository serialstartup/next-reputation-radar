"use client"

import { useState } from "react"
import { MessageSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Review } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface ReviewReplyDialogProps {
  review: Review
  children: React.ReactNode
}

export function ReviewReplyDialog({ review, children }: ReviewReplyDialogProps) {
  const [open, setOpen] = useState(false)
  const [replyText, setReplyText] = useState(review.reply_text || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!replyText.trim()) {
      setError("Please enter a reply")
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { error: updateError } = await supabase
      .from("reviews")
      .update({
        reply_text: replyText,
        replied: true,
      })
      .eq("id", review.id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setOpen(false)
    // Trigger refresh via router or event
    window.dispatchEvent(new CustomEvent("review-replied"))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Reply to {review.author}
          </DialogTitle>
          <DialogDescription>
            Write a professional response to this review.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Original Review */}
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Original Review</p>
            <p className="text-sm">{review.text}</p>
          </div>

          {/* Reply Input */}
          <div className="space-y-2">
            <Label htmlFor="reply">Your Reply</Label>
            <Textarea
              id="reply"
              placeholder="Thank the customer for their feedback..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={5}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          {/* AI Suggest Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              // TODO: Call AI API to generate suggestion
              setReplyText(
                `Dear ${review.author},\n\nThank you for taking the time to share your experience with us. We truly appreciate your feedback.\n\nWe apologize for any inconvenience and will work hard to improve.\n\nBest regards,\nThe Team`
              )
            }}
          >
            ✨ Generate AI Suggestion
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {review.replied ? "Update Reply" : "Send Reply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
