-- FIND ADMIN USER ID
-- Run this in Supabase SQL Editor to find the admin user

-- Check what users exist in auth.users
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
WHERE email = 'admin@admin.com';

-- If no results, check all users
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;