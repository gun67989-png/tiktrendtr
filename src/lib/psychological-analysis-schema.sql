-- Psychological Analysis & Admin Dashboard Schema
-- Run this migration against your Supabase database

-- ============================================================
-- Analyses Table
-- Stores processed psychological analysis summaries (JSONB only, no raw data)
-- ============================================================
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_username TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'tiktok',
  analysis_data JSONB DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  viral_post_drafts JSONB DEFAULT '[]',
  analyzed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookups by profile
CREATE INDEX IF NOT EXISTS idx_analyses_profile_username ON analyses (profile_username);
CREATE INDEX IF NOT EXISTS idx_analyses_analyzed_at ON analyses (analyzed_at DESC);

-- ============================================================
-- Analysis Targets Table
-- Profiles queued for automated psychological analysis
-- ============================================================
CREATE TABLE IF NOT EXISTS analysis_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  platform TEXT NOT NULL DEFAULT 'tiktok',
  priority INT NOT NULL DEFAULT 0,
  last_analyzed_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for round-robin target selection
CREATE INDEX IF NOT EXISTS idx_analysis_targets_active ON analysis_targets (is_active, last_analyzed_at ASC NULLS FIRST);
CREATE INDEX IF NOT EXISTS idx_analysis_targets_priority ON analysis_targets (priority DESC);

-- ============================================================
-- Row Level Security (optional, enable if needed)
-- ============================================================
-- ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE analysis_targets ENABLE ROW LEVEL SECURITY;
