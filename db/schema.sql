-- Reputation Radar – Supabase schema (compatible with the app)
-- Run this in Supabase SQL editor. It creates all enums, tables, RLS policies,
-- useful indexes, triggers, and a few helper views used by the UI.

-- Extensions ---------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enums -------------------------------------------------------------------
DO $$
BEGIN
  CREATE TYPE platform AS ENUM ('google','instagram','yelp','tripadvisor','facebook');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE sentiment AS ENUM ('positive','negative','neutral');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE priority_level AS ENUM ('high','medium','low');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE job_status AS ENUM ('pending','running','completed','failed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE job_type AS ENUM ('scrape','analyze','cluster');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE trend_type AS ENUM ('up','down','stable');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE source_status AS ENUM ('active','syncing','error');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Tables ------------------------------------------------------------------

-- profiles (mirrors auth.users, keeps business metadata)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  email TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS profiles_self_access ON public.profiles;
CREATE POLICY profiles_self_access ON public.profiles FOR ALL
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- notification_settings (user preferences used in /alerts)
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  negative_review_alert BOOLEAN DEFAULT true,
  weekly_report BOOLEAN DEFAULT true,
  competitor_change BOOLEAN DEFAULT false,
  email BOOLEAN DEFAULT true,
  sms BOOLEAN DEFAULT false,
  slack BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS notification_settings_owner_rw ON public.notification_settings;
CREATE POLICY notification_settings_owner_rw ON public.notification_settings FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notification_settings_updated ON public.notification_settings;
CREATE TRIGGER trg_notification_settings_updated
  BEFORE UPDATE ON public.notification_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- sources (connected platforms)
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform platform NOT NULL,
  url TEXT NOT NULL,
  name TEXT,
  connected_at TIMESTAMPTZ DEFAULT now(),
  review_count INT DEFAULT 0,
  avg_rating NUMERIC(3,2) DEFAULT 0,
  status source_status DEFAULT 'active',
  last_run_at TIMESTAMPTZ,
  raw_params JSONB
);
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sources_owner_rw ON public.sources;
CREATE POLICY sources_owner_rw ON public.sources FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE INDEX IF NOT EXISTS idx_sources_user ON public.sources(user_id);
CREATE INDEX IF NOT EXISTS idx_sources_platform ON public.sources(platform);

-- reviews (raw reviews)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
  platform platform NOT NULL,
  author TEXT,
  avatar TEXT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  inserted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sentiment sentiment,
  replied BOOLEAN DEFAULT false,
  reply_text TEXT,
  topics TEXT[],
  raw_json JSONB
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS reviews_owner_rw ON public.reviews;
CREATE POLICY reviews_owner_rw ON public.reviews FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_source ON public.reviews(source_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_sentiment ON public.reviews(sentiment);

-- clusters (AI topic clusters)
CREATE TABLE IF NOT EXISTS public.clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  period_start DATE,
  period_end DATE,
  label TEXT NOT NULL,
  sentiment sentiment NOT NULL,
  mention_percentage NUMERIC(5,2),
  priority priority_level,
  sample_reviews TEXT[],
  strategy TEXT,
  response_template TEXT,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.clusters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS clusters_owner_rw ON public.clusters;
CREATE POLICY clusters_owner_rw ON public.clusters FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE INDEX IF NOT EXISTS idx_clusters_user_period ON public.clusters(user_id, period_start, period_end);

-- actions (AI recommendations)
CREATE TABLE IF NOT EXISTS public.actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  period_start DATE,
  period_end DATE,
  title TEXT NOT NULL,
  description TEXT,
  priority priority_level NOT NULL,
  completed BOOLEAN DEFAULT false,
  category TEXT,
  related_cluster_id UUID REFERENCES public.clusters(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS actions_owner_rw ON public.actions;
CREATE POLICY actions_owner_rw ON public.actions FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE INDEX IF NOT EXISTS idx_actions_user_completed ON public.actions(user_id, completed);

-- competitors (for comparison cards)
CREATE TABLE IF NOT EXISTS public.competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  platform platform,
  url TEXT,
  avg_rating NUMERIC(3,2),
  review_count INT,
  rating_distribution INTEGER[],
  pain_points TEXT[],
  strengths TEXT[],
  trend trend_type,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS competitors_owner_rw ON public.competitors;
CREATE POLICY competitors_owner_rw ON public.competitors FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE INDEX IF NOT EXISTS idx_competitors_user ON public.competitors(user_id);

-- jobs (fetch/cluster pipeline)
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
  status job_status NOT NULL DEFAULT 'pending',
  type job_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  error TEXT
);
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS jobs_owner_rw ON public.jobs;
CREATE POLICY jobs_owner_rw ON public.jobs FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE INDEX IF NOT EXISTS idx_jobs_user_status ON public.jobs(user_id, status);

-- weekly_reports (used by Alerts & Reports preview)
CREATE TABLE IF NOT EXISTS public.weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  avg_rating NUMERIC(3,2) NOT NULL,
  total_reviews INT NOT NULL,
  new_reviews INT,
  sentiment_shift NUMERIC(6,2),
  sentiment_breakdown JSONB NOT NULL,
  top_issues TEXT[],
  highlights TEXT[],
  top_wins JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS weekly_reports_owner_rw ON public.weekly_reports;
CREATE POLICY weekly_reports_owner_rw ON public.weekly_reports FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE INDEX IF NOT EXISTS idx_weekly_reports_user_period ON public.weekly_reports(user_id, period_start DESC);

-- Helper Views -------------------------------------------------------------

-- Sentiment over last 30 days (for chart in Dashboard)
CREATE OR REPLACE VIEW public.v_sentiment_last_30d AS
SELECT
  date_trunc('day', r.created_at) AS day,
  SUM((r.sentiment = 'positive')::INT) AS positive,
  SUM((r.sentiment = 'negative')::INT) AS negative,
  SUM((r.sentiment = 'neutral')::INT) AS neutral
FROM public.reviews r
WHERE r.user_id = auth.uid() AND r.created_at >= now() - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1;

-- KPI helpers
CREATE OR REPLACE VIEW public.v_kpis AS
WITH base AS (
  SELECT
    AVG(r.rating)::NUMERIC(3,2) AS avg_rating,
    COUNT(*)::INT AS total_reviews,
    SUM(CASE WHEN r.sentiment = 'negative' THEN 1 ELSE 0 END)::INT AS total_negative
  FROM public.reviews r
  WHERE r.user_id = auth.uid()
),
neg AS (
  SELECT
    SUM(CASE WHEN r.sentiment = 'negative' THEN 1 ELSE 0 END)::NUMERIC AS neg_7d,
    COUNT(*)::NUMERIC AS all_7d
  FROM public.reviews r
  WHERE r.user_id = auth.uid() AND r.created_at >= now() - INTERVAL '7 days'
),
prev AS (
  SELECT
    SUM(CASE WHEN r.sentiment = 'negative' THEN 1 ELSE 0 END)::NUMERIC AS neg_prev_7d,
    COUNT(*)::NUMERIC AS all_prev_7d
  FROM public.reviews r
  WHERE r.user_id = auth.uid() AND r.created_at >= now() - INTERVAL '14 days'
    AND r.created_at < now() - INTERVAL '7 days'
)
SELECT
  base.avg_rating,
  base.total_reviews,
  COALESCE((neg.neg_7d / NULLIF(neg.all_7d, 0)) * 100, 0)::NUMERIC(5,2) AS negative_rate_7d,
  COALESCE((prev.neg_prev_7d / NULLIF(prev.all_prev_7d, 0)) * 100, 0)::NUMERIC(5,2) AS negative_rate_prev_7d,
  COALESCE(((neg.neg_7d / NULLIF(neg.all_7d, 0)) - (prev.neg_prev_7d / NULLIF(prev.all_prev_7d, 0))) * 100, 0)::NUMERIC(6,2) AS negative_trend_delta,
  (SELECT COUNT(*) FROM public.reviews r2 WHERE r2.user_id = auth.uid() AND r2.replied = false)::INT AS unanswered
FROM base, neg, prev;

-- Latest weekly report (for Alerts preview)
CREATE OR REPLACE VIEW public.v_latest_weekly_report AS
SELECT wr.*
FROM public.weekly_reports wr
WHERE wr.user_id = auth.uid()
ORDER BY wr.period_end DESC
LIMIT 1;

-- Hooks / conveniences -----------------------------------------------------

-- When a profile is created, create default notification settings
CREATE OR REPLACE FUNCTION public.init_user_settings() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notification_settings(user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_init_settings ON public.profiles;
CREATE TRIGGER trg_profiles_init_settings
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.init_user_settings();

-- Notes -------------------------------------------------------------------
-- 1) All tables have RLS enabled and restrict access to the authenticated user.
-- 2) Views reference auth.uid() and therefore return data scoped to the caller.
-- 3) After running this, insert your profile row to create default settings:
--    INSERT INTO public.profiles(id, company_name, email)
--    VALUES ('<auth_user_id>', 'Acme Café', 'owner@acme.com');
-- 4) Optionally seed a first weekly report for the Alerts page preview.
