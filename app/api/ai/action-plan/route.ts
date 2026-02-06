import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { mockActions } from "@/lib/mock-data"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { reviews, clusters, limit = 3 } = body

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const aiApiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY
    const aiProvider = process.env.AI_PROVIDER || "openai"
    const aiModel = process.env.AI_MODEL || "gpt-4o-mini"

    if (!aiApiKey) {
      console.warn("AI_API_KEY not configured, using mock actions")
      const top = mockActions.slice(0, limit)
      return NextResponse.json({ actions: top, source: "mock" })
    }

    // Build context from reviews/clusters
    let context = ""
    if (reviews && reviews.length > 0) {
      const negativeReviews = reviews.filter((r: any) => r.sentiment === "negative").slice(0, 10)
      context += `Recent negative reviews:\n${negativeReviews.map((r: any) => 
        `- ${r.author}: "${r.text}" (${r.platform}, ${r.rating} stars)`
      ).join("\n")}\n\n`
    }
    if (clusters && clusters.length > 0) {
      context += `Key themes from analysis:\n${clusters.map((c: any) => 
        `- ${c.name} (${c.sentiment}, ${c.mention_percentage}% mentions): ${c.strategy}`
      ).join("\n")}\n`
    }

    if (!context) {
      // No data, return empty or mock
      return NextResponse.json({ actions: [], source: "no_data" })
    }

    // Build AI prompt
    const systemPrompt = `You are an AI business consultant specializing in reputation management. 
Your task is to analyze customer feedback and generate 3-5 actionable recommendations.
Each action should be:
- Specific and practical
- Prioritized (high/medium/low)
- Written in simple language
- Include a brief description

Respond with a JSON array of actions with this structure:
[
  {
    "title": "Action title",
    "description": "Detailed description",
    "priority": "high|medium|low",
    "category": "Engagement|Operations|Quality|Marketing"
  }
]`

    const userPrompt = `Based on this customer feedback data, generate actionable recommendations:\n\n${context}`

    // Call AI API
    let aiResponse: any
    const requestBody = {
      model: aiModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    }

    if (aiProvider === "anthropic") {
      // Anthropic Claude API
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": aiApiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: aiModel,
          max_tokens: 1000,
          messages: [
            { role: "user", content: `${systemPrompt}\n\n${userPrompt}` },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`)
      }

      const result = await response.json()
      const content = result.content?.[0]?.text || "{}"
      aiResponse = JSON.parse(content)
    } else {
      // OpenAI compatible API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${aiApiKey}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("AI API error:", errorText)
        throw new Error(`AI API error: ${response.status}`)
      }

      const result = await response.json()
      const content = result.choices?.[0]?.message?.content || "{}"
      aiResponse = JSON.parse(content)
    }

    // Extract actions from AI response
    const actions = aiResponse.actions || aiResponse.recommendations || aiResponse

    // Save to database
    if (Array.isArray(actions) && actions.length > 0) {
      const actionsToInsert = actions.map((action: any, index: number) => ({
        user_id: user.id,
        title: action.title,
        description: action.description,
        priority: action.priority || "medium",
        category: action.category || "Operations",
        completed: false,
        created_at: new Date().toISOString(),
      }))

      // Delete old actions and insert new ones (or upsert)
      await supabase.from("actions").delete().eq("user_id", user.id)
      await supabase.from("actions").insert(actionsToInsert)
    }

    return NextResponse.json({ 
      actions: actions.slice(0, limit), 
      source: "ai",
    })
  } catch (error) {
    console.error("AI action plan error:", error)
    // Fallback to mock
    const fallbackActions = mockActions.slice(0, 3)
    return NextResponse.json({ 
      actions: fallbackActions, 
      source: "mock_fallback",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
