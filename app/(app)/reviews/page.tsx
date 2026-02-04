import { getReviews } from "@/lib/queries"
import { ReviewsClient } from "./reviews-client"

export default async function ReviewsPage() {
  const reviews = await getReviews()

  return <ReviewsClient initialReviews={reviews} />
}
