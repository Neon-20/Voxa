-- Voxa Database Setup Script
-- Run this in your Supabase SQL editor

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  original_content TEXT NOT NULL,
  improved_content TEXT,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mock_interviews table
CREATE TABLE IF NOT EXISTS mock_interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT NOT NULL,
  transcript TEXT,
  feedback TEXT,
  score INTEGER,
  duration INTEGER,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create career_qas table
CREATE TABLE IF NOT EXISTS career_qas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create voice_sessions table
CREATE TABLE IF NOT EXISTS voice_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  session_type TEXT NOT NULL,
  transcript TEXT,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roadmaps table
CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_qas ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for resumes
DROP POLICY IF EXISTS "Users can view own resumes" ON resumes;
CREATE POLICY "Users can view own resumes" ON resumes FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own resumes" ON resumes;
CREATE POLICY "Users can insert own resumes" ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for mock_interviews
DROP POLICY IF EXISTS "Users can view own interviews" ON mock_interviews;
CREATE POLICY "Users can view own interviews" ON mock_interviews FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own interviews" ON mock_interviews;
CREATE POLICY "Users can insert own interviews" ON mock_interviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for career_qas
DROP POLICY IF EXISTS "Users can view own QAs" ON career_qas;
CREATE POLICY "Users can view own QAs" ON career_qas FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own QAs" ON career_qas;
CREATE POLICY "Users can insert own QAs" ON career_qas FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for voice_sessions
DROP POLICY IF EXISTS "Users can view own voice sessions" ON voice_sessions;
CREATE POLICY "Users can view own voice sessions" ON voice_sessions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own voice sessions" ON voice_sessions;
CREATE POLICY "Users can insert own voice sessions" ON voice_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for roadmaps
DROP POLICY IF EXISTS "Users can view own roadmaps" ON roadmaps;
CREATE POLICY "Users can view own roadmaps" ON roadmaps FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can insert own roadmaps" ON roadmaps;
CREATE POLICY "Users can insert own roadmaps" ON roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample featured roadmaps (optional)
INSERT INTO roadmaps (user_id, role, content, is_featured) VALUES
(NULL, 'Software Engineer', '# Software Engineer Career Roadmap

## Entry Level (0-2 years)
- Learn programming fundamentals
- Master at least one programming language
- Build personal projects
- Contribute to open source

## Mid Level (2-5 years)
- Specialize in specific technologies
- Lead small projects
- Mentor junior developers
- Improve system design skills

## Senior Level (5+ years)
- Architect complex systems
- Lead technical decisions
- Mentor teams
- Drive technical strategy', TRUE),

(NULL, 'Data Scientist', '# Data Scientist Career Roadmap

## Entry Level (0-2 years)
- Master Python/R and SQL
- Learn statistics and mathematics
- Build data analysis projects
- Understand machine learning basics

## Mid Level (2-5 years)
- Specialize in ML algorithms
- Work with big data tools
- Deploy models to production
- Communicate insights effectively

## Senior Level (5+ years)
- Lead data science teams
- Design ML infrastructure
- Drive business strategy with data
- Research and innovation', TRUE)

ON CONFLICT DO NOTHING;
