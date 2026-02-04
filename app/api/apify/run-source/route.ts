import { NextResponse } from "next/server"

export async function POST(request: Request) {
  // Mock a queued job response for adding a source
  const body = await request.json().catch(() => ({}))
  const job_id = `job_${Math.random().toString(36).slice(2, 8)}`
  const now = new Date().toISOString()
  return NextResponse.json({
    job: {
      id: job_id,
      type: "scrape",
      status: "pending",
      created_at: now,
      source: body?.url ?? null,
    },
    message: "Source queued for scraping (mock)",
  })
}
