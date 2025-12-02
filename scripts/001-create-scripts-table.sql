-- Create scripts table for storing chat conversation scripts
CREATE TABLE IF NOT EXISTS scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on title for faster search
CREATE INDEX IF NOT EXISTS idx_scripts_title ON scripts(title);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_scripts_created_at ON scripts(created_at DESC);

-- Create full-text search index on title and content
CREATE INDEX IF NOT EXISTS idx_scripts_search ON scripts USING GIN (to_tsvector('english', title || ' ' || content));
