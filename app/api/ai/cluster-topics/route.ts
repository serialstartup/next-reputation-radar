import { NextResponse } from "next/server"
import { mockClusters } from "@/lib/mock-data"

export async function POST(request: Request) {
  // Return mock clusters as if produced by an AI pipeline
  return NextResponse.json({ clusters: mockClusters })
}
