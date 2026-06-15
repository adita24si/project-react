-- =========================================================================
-- TimberCraft CRM Supabase - Auth Only Schema & Sync Trigger
-- Run this script in the Supabase SQL Editor (SQL Editor -> New Query)
-- =========================================================================

-- 1. Create a table for user profiles linked to auth.users named public.users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    phone_number TEXT,
    address TEXT,
    role TEXT DEFAULT 'Store Manager', -- Store Manager, Sales Designer, Administrator, etc.
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Enable Row Level Security (RLS) on public.users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Define security policies
-- Allow everyone to read users table
CREATE POLICY "Public users are viewable by everyone" 
ON public.users FOR SELECT 
USING (true);

-- Allow users to insert their own entry
CREATE POLICY "Users can insert their own record" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to update their own entry
CREATE POLICY "Users can update their own record" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

-- 4. PostgreSQL Trigger to automatically create a user entry on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, full_name, email, phone_number, address, role)
    VALUES (
        new.id, 
        new.raw_user_meta_data->>'full_name', 
        new.email, -- Directly read from auth.users email
        new.raw_user_meta_data->>'phone_number', 
        new.raw_user_meta_data->>'address',
        COALESCE(new.raw_user_meta_data->>'role', 'Store Manager')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the trigger function to the auth.users table
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
