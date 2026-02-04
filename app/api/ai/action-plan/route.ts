import { NextResponse } from "next/server"
import { mockActions } from "@/lib/mock-data"

export async function POST(request: Request) {
  // Return mock action items based on provided context
  const body = await request.json().catch(() => ({}))
  const top = mockActions.slice(0, body?.limit ?? 3)
  return NextResponse.json({ actions: top })
}
