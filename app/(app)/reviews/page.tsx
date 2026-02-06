import { Suspense } from "react"
import { getReviews } from "@/lib/queries"
import { ReviewsClient } from "./reviews-client"
import { ReviewsListSkeleton } from "@/components/review-skeletons"

export default async function ReviewsPage() {
  const reviews = await getReviews()

  return (
    <Suspense fallback={<ReviewsListSkeleton />}>
      <ReviewsClient initialReviews={reviews} />
    </Suspense>
  )
}
