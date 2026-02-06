import { Suspense } from "react"
import { getSources } from "@/lib/queries"
import { SourcesClient } from "./sources-client"
import { SourcesSkeleton } from "@/components/review-skeletons"

export default async function SourcesPage() {
  const sources = await getSources()

  return (
    <Suspense fallback={<SourcesSkeleton />}>
      <SourcesClient initialSources={sources} />
    </Suspense>
  )
}
