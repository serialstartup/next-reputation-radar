Design a modern, business-focused SaaS web application called “Reputation Radar”.

Target users:
Local businesses, restaurant chains, clinics, salons, and digital agencies managing multiple local brands.

Core goal:
Help businesses understand what customers complain about, why reputation is dropping, and what actions to take.

Design principles:
- Extremely clear and readable for non-technical business owners
- Focus on problems and actions, not raw data
- Calm, trustworthy, professional UI
- Every insight must lead to a recommended action

Overall style:
- Clean B2B SaaS look
- Light background with soft accent colors
- Simple charts, no complex analytics
- Clear typography and spacing
- Minimalist but authoritative

Main screens:

1) Overview Dashboard
- Top KPI cards:
  - Average rating
  - Total reviews analyzed
  - Negative trend indicator (last 7 days)
  - Unanswered reviews count
- Section: “Top Issues Today”
  - Cards showing complaint themes (e.g. service, cleanliness)
  - Trend indicator (increasing / decreasing)
  - Short example review snippet
- Section: “Recommended Actions”
  - 3–5 AI-generated action items written in simple language

2) Sources Setup
- Simple form to add data sources:
  - Google Maps URL
  - Instagram profile URL
- Each source card shows:
  - Last fetch time
  - Status (active / error)
- Clear explanations for non-technical users

3) Insights – Topic Clusters
- Tabs: Negative / Positive / Neutral
- Each cluster shows:
  - Theme name
  - Percentage of mentions
  - Example quotes
  - Suggested response strategy

4) Competitor Comparison
- Side-by-side comparison cards
- “Your business vs competitors”
- Focus on:
  - Rating
  - Common complaints
  - Strengths competitors have that you don’t

5) Alerts & Reports
- Simple alert configuration
- Weekly reputation summary preview
- Exportable report layout

Empty states:
- Friendly instructions explaining why sources are needed
- Simple step-by-step onboarding

The design must feel:
- Trustworthy
- Easy to understand
- Calm but powerful
- Suitable for business decision-makers

# -----
0. Amaç
Kullanıcının verdiği Google Maps / Instagram linklerinden yorumları düzenli çekip; AI ile topic clustering + sentiment + aksiyon planı çıkaran B2B SaaS.
1. Stack
* Next.js App Router + Tailwind + shadcn/ui
* Supabase (auth, db)
* Apify (reviews/comments actors)
* AI (topic clustering, action plan)
* Jobs: Cron (daily fetch) + job table
2. Mimari kuralları
* Dashboard/Insights: Server Components (SSR + hızlı)
* Source ekleme formu: Server Actions
* Fetch/cluster: Route Handler + job
* Alerts: Route Handler (email/whatsapp v2)
3. Data Flow
1. User sources ekler → sources tablosu
2. Daily cron → Apify run → dataset → normalize → reviews
3. AI clustering → clusters, actions
4. UI: “Top Issues” + “Action Plan”
4. MVP Screens
* /dashboard (KPI + Top Issues + Action Plan)
* /sources (Google Maps + IG link ekle)
* /insights (clusters)
* /reviews (ham yorum listesi + filtre)
* /competitors (lite: link ekle + karşılaştır)
* /alerts (threshold kuralları, v1 basit)
5. Supabase Tables
* profiles
* sources (user_id, type: google_maps/instagram, url, actor_id, params_json, status, last_run_at)
* reviews (source_id, platform, author, rating, text, created_at, raw_json)
* clusters (user_id, period, label, sentiment, count, examples_json)
* actions (user_id, period, action_text, priority, related_cluster_id)
* competitors (user_id, name, url)
* jobs (fetch/cluster)
6. API Endpoints
* POST /api/apify/run-source
* POST /api/ai/cluster-topics
* POST /api/ai/action-plan
7. Kütüphaneler
* Same base: supabase, zod, react-hook-form
* NLP helpers: natural (opsiyonel), genelde LLM yeter
* PDF export (v2): @react-pdf/renderer
* Notifications (v2): resend (email), WhatsApp provider SDK
8. Klasör Yapısı

app/
  dashboard/
  sources/
  insights/
  reviews/
  competitors/
  alerts/
  api/
    apify/run-source/
    ai/cluster-topics/
    ai/action-plan/
components/
  KPIGrid.tsx
  IssueCard.tsx
  ReviewsTable.tsx
  ActionPlan.tsx
lib/
  apify/
  supabase/
  ai/
  normalize/
jobs/
  fetchReviews.ts
  clusterTopics.ts





AI’ye projenin kurulumunu yaptırırken şunu da en alta ekle:
* Next.js App Router kullan.
* app/ altında sayfaları oluştur.
* Varsayılan olarak Server Components; sadece gerekli UI’ları client yap.
* Form submit’leri mümkün olduğunca Server Actions ile yap.
* Dış servis/AI/Apify çağrılarını Route Handlers üzerinden yap.
* Supabase server client kullan (@supabase/ssr).
* shadcn/ui bileşenlerini kur ve Tailwind ile uyumlu tasarla.
* .env.example oluştur (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, APIFY_TOKEN, AI_API_KEY).
* “job” yaklaşımı: uzun işler jobs tablosu ile takip edilecek; UI polling.

