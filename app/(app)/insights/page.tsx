import { Suspense } from "react"
import { AppHeader } from "@/components/app-header"
import { ClusterCard } from "@/components/cluster-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockClusters } from "@/lib/mock-data"
import { EmptyState } from "@/components/empty-state"
import { Lightbulb } from "lucide-react"
import { InsightsSkeleton } from "@/components/review-skeletons"

export default function InsightsPage() {
  const negative = mockClusters.filter((c) => c.sentiment === "negative")
  const positive = mockClusters.filter((c) => c.sentiment === "positive")
  const neutral = mockClusters.filter((c) => c.sentiment === "neutral")

  return (
    <>
      <AppHeader title="Topic Insights" description="AI-clustered topics from your reviews" />

      <div className="p-4">
        <Suspense fallback={<InsightsSkeleton />}>
          <Tabs defaultValue="negative">
            <TabsList>
              <TabsTrigger value="negative">
                Negative ({negative.length})
              </TabsTrigger>
              <TabsTrigger value="positive">
                Positive ({positive.length})
              </TabsTrigger>
              <TabsTrigger value="neutral">
                Neutral ({neutral.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="negative" className="mt-4">
              {negative.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {negative.map((cluster) => (
                    <ClusterCard key={cluster.id} cluster={cluster} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Lightbulb}
                  title="No negative clusters"
                  description="Great job! There are no prominent negative themes in this period."
                />
              )}
            </TabsContent>

            <TabsContent value="positive" className="mt-4">
              {positive.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {positive.map((cluster) => (
                    <ClusterCard key={cluster.id} cluster={cluster} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Lightbulb}
                  title="No positive clusters"
                  description="Once reviews are fetched, your strengths will appear here."
                />
              )}
            </TabsContent>

            <TabsContent value="neutral" className="mt-4">
              {neutral.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {neutral.map((cluster) => (
                    <ClusterCard key={cluster.id} cluster={cluster} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Lightbulb}
                  title="No neutral clusters"
                  description="Neutral mentions will appear once more data is available."
                />
              )}
            </TabsContent>
          </Tabs>
        </Suspense>
      </div>
    </>
  )
}
