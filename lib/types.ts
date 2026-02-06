export type Platform = "google" | "instagram" | "yelp" | "tripadvisor" | "facebook"

export type Sentiment = "positive" | "negative" | "neutral"

export interface Source {
  id: string
  platform: Platform
  url: string
  name: string
  connected_at: string
  review_count: number
  avg_rating: number
  status: "active" | "syncing" | "error"
  user_id?: string
}

export interface Review {
  id: string
  source_id: string
  platform: Platform
  author: string
  avatar?: string
  rating: number
  text: string
  date: string
  sentiment: Sentiment
  replied: boolean
  reply_text?: string
  topics?: string[]
}

export interface Cluster {
  id: string
  name: string
  sentiment: Sentiment
  mention_percentage: number
  priority: "high" | "medium" | "low"
  sample_reviews: string[]
  strategy: string
  response_template: string
  review_count: number
}

export interface Action {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  completed: boolean
  category: string
}

export interface Competitor {
  id: string
  name: string
  url?: string
  platform: Platform
  status?: "pending" | "active" | "error"
  avg_rating: number
  review_count: number
  rating_distribution: number[] // [1star, 2star, 3star, 4star, 5star]
  pain_points: string[]
  strengths: string[]
  trend: "up" | "down" | "stable"
}

export interface Job {
  id: string
  source_id: string
  status: "pending" | "running" | "completed" | "failed"
  type: "scrape" | "analyze" | "cluster"
  created_at: string
  completed_at?: string
  error?: string
}

export interface KPI {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: string
}

export interface SentimentDataPoint {
  date: string
  positive: number
  negative: number
  neutral: number
}

export interface NotificationSettings {
  negative_review_alert: boolean
  weekly_report: boolean
  competitor_change: boolean
  email: boolean
  slack: boolean
}

export interface WeeklyReport {
  period: string
  avg_rating: number
  total_reviews: number
  new_reviews: number
  sentiment_shift: number // percentage change vs previous period
  sentiment_breakdown: {
    positive: number
    negative: number
    neutral: number
  }
  top_issues: string[]
  highlights: string[]
  top_wins?: { title: string; detail?: string }[]
}
