-- CREATE ADMIN PROFILE
-- Run this in Supabase SQL Editor

-- First, let's see what auth users exist
-- You can check this in Authentication > Users in Supabase dashboard

-- Insert admin profile (replace the UUID with your actual admin user ID)
-- You can find the admin user ID in Authentication > Users
INSERT INTO public.profiles (id, email, name, role, department, employee_id, is_active) 
VALUES (
  '53eef30c-d44f-454a-910a-6da30644880b', -- Replace with actual admin user ID
  'admin@admin.com',
  'Administrator',
  'admin',
  'Administration',
  'ADMIN-001',
  true
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  name = 'Administrator',
  department = 'Administration';