"use client"

import { OnboardingProgress } from "@/components/onboarding-progress"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function OnboardingStep2() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <OnboardingProgress currentStep={2} totalSteps={3} />
      </div>

      <div className="text-center">
        <h1 className="text-xl font-semibold">Connect your first source</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search for your business on Google to get started.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Search for your business</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="e.g. Acme Café, New York"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {query.length > 2 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Results</p>
              <div
                className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => router.push("/onboarding/step-3")}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Acme Café</p>
                  <p className="text-xs text-muted-foreground">
                    123 Main St, New York, NY · 4.3 stars · 847 reviews
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => router.push("/onboarding/step-1")}>
          Back
        </Button>
        <Button variant="ghost" onClick={() => router.push("/onboarding/step-3")}>
          Skip for now
        </Button>
      </div>
    </div>
  )
}
