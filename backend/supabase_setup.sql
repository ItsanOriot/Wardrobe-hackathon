-- Supabase Database Setup for AI Stylist Application
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create wardrobe_items table
CREATE TABLE IF NOT EXISTS wardrobe_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL,
    color VARCHAR(20) NOT NULL CHECK (color IN (
        'Black', 'White', 'Gray', 'Blue', 'Brown',
        'Green', 'Red', 'Pink', 'Yellow', 'Purple', 'Orange'
    )),
    warmth VARCHAR(10) NOT NULL CHECK (warmth IN (
        'Cold', 'Cool', 'Neutral', 'Warm', 'Hot'
    )),
    formality INTEGER NOT NULL CHECK (formality >= 1 AND formality <= 10),
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_user_id ON wardrobe_items(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_created_at ON wardrobe_items(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_wardrobe_items_updated_at
    BEFORE UPDATE ON wardrobe_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only read their own wardrobe items
CREATE POLICY "Users can view their own wardrobe items"
    ON wardrobe_items FOR SELECT
    USING (auth.uid() = user_id);

-- Users can only insert their own wardrobe items
CREATE POLICY "Users can insert their own wardrobe items"
    ON wardrobe_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can only update their own wardrobe items
CREATE POLICY "Users can update their own wardrobe items"
    ON wardrobe_items FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own wardrobe items
CREATE POLICY "Users can delete their own wardrobe items"
    ON wardrobe_items FOR DELETE
    USING (auth.uid() = user_id);

-- Storage Setup Instructions:
-- 1. Go to Supabase Dashboard -> Storage
-- 2. Create a new bucket called "wardrobe-images"
-- 3. Set bucket to "Public" for read access
-- 4. Add the following storage policy for uploads:
--
-- Policy name: "Users can upload their own images"
-- Policy definition:
-- (bucket_id = 'wardrobe-images' AND (storage.foldername(name))[1] = auth.uid()::text)
--
-- This allows users to upload images to folders named with their user ID
