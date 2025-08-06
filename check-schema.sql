-- CHECK WHAT TABLES ACTUALLY EXIST
-- Run this in Supabase SQL Editor to see what's really there

-- 1. Check what schemas exist
SELECT schema_name 
FROM information_schema.schemata 
ORDER BY schema_name;

-- 2. Check what tables exist in public schema
SELECT table_name, table_schema
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 3. Check all tables regardless of schema
SELECT table_name, table_schema
FROM information_schema.tables 
WHERE table_type = 'BASE TABLE'
ORDER BY table_schema, table_name;

-- 4. Check if our specific tables exist
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories' AND table_schema = 'public') 
    THEN 'categories EXISTS' 
    ELSE 'categories MISSING' 
  END as categories_status,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') 
    THEN 'profiles EXISTS' 
    ELSE 'profiles MISSING' 
  END as profiles_status;