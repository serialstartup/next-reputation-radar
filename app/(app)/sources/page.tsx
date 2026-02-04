import { getSources } from "@/lib/queries"
import { SourcesClient } from "./sources-client"

export default async function SourcesPage() {
  const sources = await getSources()

  return <SourcesClient initialSources={sources} />
}
