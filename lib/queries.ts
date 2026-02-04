import { createClient } from "@/lib/supabase/server"
import type {
  Source,
  Review,
  Cluster,
  Action,
  KPI,
  SentimentDataPoint,
  WeeklyReport,
} from "./types"

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getSources(): Promise<Source[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("sources")
    .select("*")
    .order("connected_at", { ascending: false })

  if (error) {
    console.error("Error fetching sources:", error)
    return []
  }

  return (data || []).map((s) => ({
    id: s.id,
    platform: s.platform,
    url: s.url,
    name: s.name || "",
    connected_at: s.connected_at || "",
    review_count: s.review_count || 0,
    avg_rating: Number(s.avg_rating) || 0,
    status: s.status || "active",
    user_id: s.user_id,
  }))
}

export async function getReviews(): Promise<Review[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching reviews:", error)
    return []
  }

  return (data || []).map((r) => ({
    id: r.id,
    source_id: r.source_id,
    platform: r.platform,
    author: r.author || "Anonymous",
    avatar: r.avatar,
    rating: r.rating || 0,
    text: r.text || "",
    date: r.created_at?.split("T")[0] || "",
    sentiment: r.sentiment || "neutral",
    replied: r.replied || false,
    reply_text: r.reply_text,
    topics: r.topics || [],
  }))
}

export async function getKPIs(): Promise<KPI[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("v_kpis").select("*").single()

  if (error || !data) {
    console.error("Error fetching KPIs:", error)
    return [
      { label: "Avg Rating", value: "0.0", change: 0, changeLabel: "no data" },
      { label: "Total Reviews", value: 0, change: 0, changeLabel: "no data" },
      { label: "Negative Trend", value: "0%", change: 0, changeLabel: "no data" },
      { label: "Unanswered", value: 0, change: 0, changeLabel: "no data" },
    ]
  }

  const negativeTrend = Math.round(data.negative_rate_7d || 0)
  const negativeDelta = Math.round(data.negative_trend_delta || 0)

  return [
    {
      label: "Avg Rating",
      value: Number(data.avg_rating || 0).toFixed(1),
      change: 0,
      changeLabel: "overall",
    },
    {
      label: "Total Reviews",
      value: data.total_reviews || 0,
      change: 0,
      changeLabel: "all time",
    },
    {
      label: "Negative Trend",
      value: `${negativeTrend}%`,
      change: negativeDelta,
      changeLabel: "vs last week",
    },
    {
      label: "Unanswered",
      value: data.unanswered || 0,
      change: 0,
      changeLabel: "need attention",
    },
  ]
}

export async function getClusters(): Promise<Cluster[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("clusters")
    .select("*")
    .order("mention_percentage", { ascending: false })

  if (error) {
    console.error("Error fetching clusters:", error)
    return []
  }

  return (data || []).map((c) => ({
    id: c.id,
    name: c.label,
    sentiment: c.sentiment,
    mention_percentage: Number(c.mention_percentage) || 0,
    priority: c.priority || "medium",
    sample_reviews: c.sample_reviews || [],
    strategy: c.strategy || "",
    response_template: c.response_template || "",
    review_count: c.review_count || 0,
  }))
}

export async function getActions(): Promise<Action[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("actions")
    .select("*")
    .order("priority", { ascending: true })
    .order("completed", { ascending: true })

  if (error) {
    console.error("Error fetching actions:", error)
    return []
  }

  return (data || []).map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description || "",
    priority: a.priority,
    completed: a.completed || false,
    category: a.category || "",
  }))
}

export async function getSentimentData(): Promise<SentimentDataPoint[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("v_sentiment_last_30d")
    .select("*")
    .order("day", { ascending: true })

  if (error) {
    console.error("Error fetching sentiment data:", error)
    return []
  }

  return (data || []).map((d) => ({
    date: d.day
      ? new Date(d.day).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "",
    positive: Number(d.positive) || 0,
    negative: Number(d.negative) || 0,
    neutral: Number(d.neutral) || 0,
  }))
}

export async function getLatestWeeklyReport(): Promise<WeeklyReport | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("v_latest_weekly_report")
    .select("*")
    .single()

  if (error || !data) {
    console.error("Error fetching weekly report:", error)
    return null
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })

  const breakdown = data.sentiment_breakdown as {
    positive?: number
    negative?: number
    neutral?: number
  } | null

  return {
    period: `${formatDate(data.period_start)} – ${formatDate(data.period_end)}, ${new Date(data.period_end).getFullYear()}`,
    avg_rating: Number(data.avg_rating) || 0,
    total_reviews: data.total_reviews || 0,
    new_reviews: data.new_reviews || 0,
    sentiment_shift: Number(data.sentiment_shift) || 0,
    sentiment_breakdown: {
      positive: breakdown?.positive || 0,
      negative: breakdown?.negative || 0,
      neutral: breakdown?.neutral || 0,
    },
    top_issues: data.top_issues || [],
    highlights: data.highlights || [],
    top_wins: data.top_wins as WeeklyReport["top_wins"],
  }
}
