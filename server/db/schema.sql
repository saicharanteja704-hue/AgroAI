-- Production PostgreSQL Schema for AI-Powered Agriculture Crop Advisory Assistant

-- Ensure UUID generation is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone VARCHAR(30),
    preferred_language VARCHAR(50) DEFAULT 'English',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Farmer Profiles Table (extended details)
CREATE TABLE IF NOT EXISTS farmer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    location VARCHAR(255),
    state VARCHAR(100),
    district VARCHAR(100),
    farm_size NUMERIC(10, 2),
    primary_crops TEXT[] DEFAULT '{}',
    experience_years INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Farms Table
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(120) NOT NULL,
    location VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    soil_type VARCHAR(100) NOT NULL,
    soil_condition VARCHAR(100),
    irrigation_availability VARCHAR(50) NOT NULL,
    water_source VARCHAR(100),
    farm_size NUMERIC(10, 2),
    land_unit VARCHAR(20) DEFAULT 'Acres',
    current_crop VARCHAR(100),
    previous_crop VARCHAR(100),
    crop_stage VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Advisories Table
CREATE TABLE IF NOT EXISTS advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES farms(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    crop VARCHAR(100),
    crop_stage VARCHAR(100),
    question TEXT NOT NULL,
    input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    summary TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    reasoning TEXT NOT NULL,
    immediate_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_practices JSONB NOT NULL DEFAULT '[]'::jsonb,
    risks JSONB NOT NULL DEFAULT '[]'::jsonb,
    preventive_measures JSONB NOT NULL DEFAULT '[]'::jsonb,
    warnings JSONB NOT NULL DEFAULT '[]'::jsonb,
    follow_up_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    confidence_level VARCHAR(30) NOT NULL DEFAULT 'High',
    expert_consultation_triggers JSONB DEFAULT '[]'::jsonb,
    is_favorite BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Performance and Query Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_user_id ON farmer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_user_id ON advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_category ON advisories(category);
CREATE INDEX IF NOT EXISTS idx_advisories_crop ON advisories(crop);
CREATE INDEX IF NOT EXISTS idx_advisories_created_at ON advisories(created_at DESC);
