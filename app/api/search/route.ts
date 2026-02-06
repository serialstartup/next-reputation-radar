import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchTerm = `%${query.toLowerCase()}%`

    // Search reviews
    const { data: reviews } = await supabase
      .from("reviews")
      .select("id, author, text, rating, platform, sentiment, date, sources(name)")
      .ilike("author", searchTerm)
      .ilike("text", searchTerm)
      .order("created_at", { ascending: false })
      .limit(10)

    // Search sources
    const { data: sources } = await supabase
      .from("sources")
      .select("id, name, platform, url")
      .ilike("name", searchTerm)
      .limit(5)

    // Search competitors
    const { data: competitors } = await supabase
      .from("competitors")
      .select("id, name, platform")
      .ilike("name", searchTerm)
      .limit(5)

    return NextResponse.json({
      results: {
        reviews: reviews || [],
        sources: sources || [],
        competitors: competitors || [],
      },
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Search failed" },
      { status: 500 }
    )
  }
}
