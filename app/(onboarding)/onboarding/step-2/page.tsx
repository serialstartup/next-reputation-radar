"use client"

import { OnboardingProgress } from "@/components/onboarding-progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function OnboardingStep2() {
  const router = useRouter()
  const [googleUrl, setGoogleUrl] = useState("")
  const [igUrl, setIgUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState<{ google?: boolean; instagram?: boolean }>({})

  const isValidGoogleMapsUrl = (url: string) => {
    try {
      const u = new URL(url)
      return /google\./.test(u.hostname) && u.pathname.includes("/maps/")
    } catch {
      return false
    }
  }

  const isValidInstagramUrl = (url: string) => {
    try {
      const u = new URL(url)
      return u.hostname.includes("instagram.com") && /^\/[A-Za-z0-9._]+\/?$/.test(u.pathname)
    } catch {
      return false
    }
  }

  const handleConnect = async () => {
    setLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    // Connect Google if provided
    if (googleUrl && isValidGoogleMapsUrl(googleUrl)) {
      const { error } = await supabase.from("sources").insert({
        user_id: user.id,
        platform: "google",
        url: googleUrl,
        name: "Google Business",
        status: "syncing",
      })
      if (!error) setConnected((c) => ({ ...c, google: true }))
    }

    // Connect Instagram if provided
    if (igUrl && isValidInstagramUrl(igUrl)) {
      const username = igUrl.split("instagram.com/")[1]?.replace(/\/$/, "") || "Instagram"
      const { error } = await supabase.from("sources").insert({
        user_id: user.id,
        platform: "instagram",
        url: igUrl,
        name: `@${username}`,
        status: "syncing",
      })
      if (!error) setConnected((c) => ({ ...c, instagram: true }))
    }

    setLoading(false)
  }

  const canProceed = googleUrl || igUrl

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <OnboardingProgress currentStep={2} totalSteps={3} />
      </div>

      <div className="text-center">
        <h1 className="text-xl font-semibold">Connect Your Sources</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your review sources to start tracking customer feedback.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Add Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google-url" className="text-xs">
              Google Maps URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="google-url"
                placeholder="https://maps.google.com/place/..."
                className="text-xs"
                value={googleUrl}
                onChange={(e) => setGoogleUrl(e.target.value)}
              />
              {connected.google ? (
                <Button variant="outline" size="sm" disabled>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (isValidGoogleMapsUrl(googleUrl)) {
                      setConnected((c) => ({ ...c, google: true }))
                    }
                  }}
                  disabled={!isValidGoogleMapsUrl(googleUrl)}
                >
                  Connect
                </Button>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Find your business on Google Maps and paste the URL here.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram-url" className="text-xs">
              Instagram Profile URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="instagram-url"
                placeholder="https://instagram.com/yourbusiness"
                className="text-xs"
                value={igUrl}
                onChange={(e) => setIgUrl(e.target.value)}
              />
              {connected.instagram ? (
                <Button variant="outline" size="sm" disabled>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (isValidInstagramUrl(igUrl)) {
                      setConnected((c) => ({ ...c, instagram: true }))
                    }
                  }}
                  disabled={!isValidInstagramUrl(igUrl)}
                >
                  Connect
                </Button>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Paste your Instagram business profile URL.
            </p>
          </div>

          <div className="rounded-md border border-dashed p-4 text-center">
            <p className="text-xs font-medium">More sources coming soon</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Yelp, TripAdvisor, Facebook support is on the way
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-2">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-1")}>
          Back
        </Button>
        <Button
          onClick={handleConnect}
          disabled={!canProceed || loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {connected.google || connected.instagram ? "Continue" : "Skip for now"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
