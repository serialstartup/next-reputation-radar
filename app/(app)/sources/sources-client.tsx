"use client"

import { AppHeader } from "@/components/app-header"
import { SourceCard } from "@/components/source-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Source } from "@/lib/types"

interface SourcesClientProps {
  initialSources: Source[]
}

export function SourcesClient({ initialSources }: SourcesClientProps) {
  const router = useRouter()
  const [googleUrl, setGoogleUrl] = useState("")
  const [igUrl, setIgUrl] = useState("")
  const [loading, setLoading] = useState<{ g?: boolean; i?: boolean }>({})
  const [error, setError] = useState<{ g?: string; i?: string }>({})
  const [flash, setFlash] = useState<string | null>(null)

  // Refresh sources when updated
  useEffect(() => {
    const handleRefresh = () => router.refresh()
    window.addEventListener("source-updated", handleRefresh)
    return () => window.removeEventListener("source-updated", handleRefresh)
  }, [router])

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

  const addGoogle = async () => {
    setFlash(null)
    if (!isValidGoogleMapsUrl(googleUrl)) {
      setError((e) => ({ ...e, g: "Please enter a valid Google Maps URL" }))
      return
    }
    setError((e) => ({ ...e, g: undefined }))
    setLoading((l) => ({ ...l, g: true }))

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError((e) => ({ ...e, g: "You must be logged in" }))
      setLoading((l) => ({ ...l, g: false }))
      return
    }

    const { error: insertError } = await supabase.from("sources").insert({
      user_id: user.id,
      platform: "google",
      url: googleUrl,
      name: "Google Business",
      status: "syncing",
    })

    if (insertError) {
      setError((e) => ({ ...e, g: insertError.message }))
      setLoading((l) => ({ ...l, g: false }))
      return
    }

    setLoading((l) => ({ ...l, g: false }))
    setFlash("Google source added successfully!")
    setGoogleUrl("")
    router.refresh()
  }

  const addInstagram = async () => {
    setFlash(null)
    if (!isValidInstagramUrl(igUrl)) {
      setError((e) => ({ ...e, i: "Please enter a valid Instagram profile URL" }))
      return
    }
    setError((e) => ({ ...e, i: undefined }))
    setLoading((l) => ({ ...l, i: true }))

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError((e) => ({ ...e, i: "You must be logged in" }))
      setLoading((l) => ({ ...l, i: false }))
      return
    }

    const username = igUrl.split("instagram.com/")[1]?.replace(/\/$/, "") || "Instagram"

    const { error: insertError } = await supabase.from("sources").insert({
      user_id: user.id,
      platform: "instagram",
      url: igUrl,
      name: `@${username}`,
      status: "syncing",
    })

    if (insertError) {
      setError((e) => ({ ...e, i: insertError.message }))
      setLoading((l) => ({ ...l, i: false }))
      return
    }

    setLoading((l) => ({ ...l, i: false }))
    setFlash("Instagram source added successfully!")
    setIgUrl("")
    router.refresh()
  }

  return (
    <>
      <AppHeader title="Sources" description="Manage your review sources" />

      <div className="p-4">
        {flash && (
          <div
            className="mb-3 text-xs rounded-md border bg-emerald-50 text-emerald-800 px-3 py-2"
            role="status"
            aria-live="polite"
          >
            {flash}
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: Add New Source */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Add New Source</CardTitle>
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
                    aria-invalid={!!error.g}
                    aria-describedby="google-url-error"
                    onKeyDown={(e) => e.key === "Enter" && addGoogle()}
                  />
                  <Button size="sm" onClick={addGoogle} disabled={!googleUrl || !!loading.g}>
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    {loading.g ? "Adding..." : "Add"}
                  </Button>
                </div>
                {error.g && (
                  <p id="google-url-error" className="text-[11px] text-destructive mt-1">
                    {error.g}
                  </p>
                )}
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
                    aria-invalid={!!error.i}
                    aria-describedby="instagram-url-error"
                    onKeyDown={(e) => e.key === "Enter" && addInstagram()}
                  />
                  <Button size="sm" onClick={addInstagram} disabled={!igUrl || !!loading.i}>
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    {loading.i ? "Adding..." : "Add"}
                  </Button>
                </div>
                {error.i && (
                  <p id="instagram-url-error" className="text-[11px] text-destructive mt-1">
                    {error.i}
                  </p>
                )}
              </div>

              <div className="rounded-md border border-dashed p-4 text-center">
                <Clock className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-2 text-xs font-medium">More sources coming soon</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Yelp, TripAdvisor, Facebook support is on the way
                </p>
                <div className="mt-2 flex justify-center gap-1">
                  <Badge variant="secondary" className="text-[10px]">
                    Yelp
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    TripAdvisor
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    Facebook
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Connected Sources */}
          <div>
            <h2 className="text-sm font-semibold mb-3">
              Connected Sources
              <Badge variant="secondary" className="ml-2 text-[10px]">
                {initialSources.length}
              </Badge>
            </h2>
            <div className="space-y-3">
              {initialSources.length > 0 ? (
                initialSources.map((source) => (
                  <SourceCard key={source.id} source={source} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      No sources connected yet. Add your first source to start tracking reviews.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
