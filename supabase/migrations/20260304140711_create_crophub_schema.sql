/*
  # CropHub Database Schema

  ## Overview
  Creates the complete database schema for CropHub Agricultural Decision Support System.

  ## New Tables

  ### 1. users
  - `id` (uuid, primary key) - Unique user identifier
  - `name` (text) - User's full name
  - `email` (text, unique) - User email address
  - `password_hash` (text) - Bcrypt hashed password
  - `created_at` (timestamptz) - Account creation timestamp

  ### 2. soil_analyses
  - `id` (uuid, primary key) - Analysis record identifier
  - `user_id` (uuid, foreign key) - References users table
  - `image_url` (text) - S3 URL of uploaded soil image
  - `soil_type` (text) - Detected soil type (e.g., "Loamy Soil")
  - `nitrogen` (numeric) - Nitrogen content (kg/ha)
  - `phosphorus` (numeric) - Phosphorus content (kg/ha)
  - `potassium` (numeric) - Potassium content (kg/ha)
  - `ph` (numeric) - Soil pH level
  - `sand_percentage` (numeric) - Sand composition percentage
  - `silt_percentage` (numeric) - Silt composition percentage
  - `clay_percentage` (numeric) - Clay composition percentage
  - `recommendations` (jsonb) - AI-generated recommendations array
  - `analyzed_at` (timestamptz) - Analysis timestamp

  ### 3. crop_plans
  - `id` (uuid, primary key) - Crop plan identifier
  - `user_id` (uuid, foreign key) - References users table
  - `total_budget` (numeric) - Total budget allocated (encrypted)
  - `land_size` (numeric) - Land size in acres
  - `crop_allocation` (jsonb) - Array of crop allocations with encrypted budget data
  - `created_at` (timestamptz) - Plan creation timestamp

  ### 4. market_analyses
  - `id` (uuid, primary key) - Market analysis identifier
  - `user_id` (uuid, foreign key) - References users table
  - `crop_type` (text) - Type of crop being sold
  - `weight_tons` (numeric) - Weight in tons
  - `markets` (jsonb) - Array of market data with encrypted profit information
  - `best_market` (text) - Name of most profitable market
  - `max_profit` (numeric) - Maximum profit amount (encrypted)
  - `analyzed_at` (timestamptz) - Analysis timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Users can only access their own data
  - All financial data (budget, profit) is encrypted at application layer using AES-256-CBC
  - Password authentication uses bcrypt with 10 rounds

  ## Important Notes
  - Financial sensitive fields are encrypted before storage
  - All timestamps use UTC timezone
  - Foreign key constraints ensure data integrity
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create soil_analyses table
CREATE TABLE IF NOT EXISTS soil_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  soil_type text NOT NULL,
  nitrogen numeric NOT NULL,
  phosphorus numeric NOT NULL,
  potassium numeric NOT NULL,
  ph numeric NOT NULL,
  sand_percentage numeric NOT NULL,
  silt_percentage numeric NOT NULL,
  clay_percentage numeric NOT NULL,
  recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  analyzed_at timestamptz DEFAULT now()
);

-- Create crop_plans table
CREATE TABLE IF NOT EXISTS crop_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_budget numeric NOT NULL,
  land_size numeric NOT NULL,
  crop_allocation jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create market_analyses table
CREATE TABLE IF NOT EXISTS market_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crop_type text NOT NULL,
  weight_tons numeric NOT NULL,
  markets jsonb NOT NULL DEFAULT '[]'::jsonb,
  best_market text NOT NULL,
  max_profit numeric NOT NULL,
  analyzed_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_soil_analyses_user_id ON soil_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_soil_analyses_analyzed_at ON soil_analyses(analyzed_at DESC);

CREATE INDEX IF NOT EXISTS idx_crop_plans_user_id ON crop_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_crop_plans_created_at ON crop_plans(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_market_analyses_user_id ON market_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_market_analyses_analyzed_at ON market_analyses(analyzed_at DESC);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE soil_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for soil_analyses table
CREATE POLICY "Users can view own soil analyses"
  ON soil_analyses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own soil analyses"
  ON soil_analyses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own soil analyses"
  ON soil_analyses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own soil analyses"
  ON soil_analyses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for crop_plans table
CREATE POLICY "Users can view own crop plans"
  ON crop_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own crop plans"
  ON crop_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own crop plans"
  ON crop_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own crop plans"
  ON crop_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for market_analyses table
CREATE POLICY "Users can view own market analyses"
  ON market_analyses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own market analyses"
  ON market_analyses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own market analyses"
  ON market_analyses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own market analyses"
  ON market_analyses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
