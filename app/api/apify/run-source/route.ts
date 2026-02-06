import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const APIFY_BASE_URL = "https://api.apify.com/v2"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { source_id, url } = body

    if (!source_id && !url) {
      return NextResponse.json(
        { error: "source_id or url is required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get source details if source_id provided
    let source = null
    if (source_id) {
      const { data } = await supabase
        .from("sources")
        .select("*")
        .eq("id", source_id)
        .single()
      source = data
    }

    const targetUrl = source?.url || url
    const platform = source?.platform || detectPlatform(targetUrl)

    // Get Apify token from environment
    const apifyToken = process.env.APIFY_TOKEN
    if (!apifyToken) {
      console.warn("APIFY_TOKEN not configured, using mock response")
      return NextResponse.json({
        job: {
          id: `job_${Date.now()}`,
          type: "scrape",
          status: "pending",
          created_at: new Date().toISOString(),
          source: targetUrl,
        },
        message: "Source queued (mock - APIFY_TOKEN not configured)",
      })
    }

    // Select actor based on platform
    const actorId = platform === "google" 
      ? "maxcopesn/google-maps-reviews-scraper"
      : "apify/instagram-comment-scraper"

    // Start actor via REST API
    const response = await fetch(`${APIFY_BASE_URL}/acts/${actorId}/runs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apifyToken}`,
      },
      body: JSON.stringify({
        startUrls: [{ url: targetUrl }],
        maxItems: 100,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Apify API error:", errorText)
      throw new Error(`Apify API error: ${response.status}`)
    }

    const runResult = await response.json()

    // Create job record in database
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .insert({
        user_id: user.id,
        source_id: source_id || null,
        actor_run_id: runResult.data?.id,
        type: "scrape",
        status: "running",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (jobError) {
      console.error("Error creating job:", jobError)
    }

    // Update source status if source_id provided
    if (source_id) {
      await supabase
        .from("sources")
        .update({ status: "syncing", last_run_at: new Date().toISOString() })
        .eq("id", source_id)
    }

    return NextResponse.json({
      job: job || {
        id: runResult.data?.id,
        type: "scrape",
        status: "running",
        created_at: new Date().toISOString(),
        source: targetUrl,
      },
      message: `Scraping started for ${platform}`,
    })
  } catch (error) {
    console.error("Apify run error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

function detectPlatform(url: string): string {
  try {
    const u = new URL(url)
    if (u.hostname.includes("google.com") || u.hostname.includes("maps.google.com")) {
      return "google"
    }
    if (u.hostname.includes("instagram.com")) {
      return "instagram"
    }
    return "unknown"
  } catch {
    return "unknown"
  }
}
