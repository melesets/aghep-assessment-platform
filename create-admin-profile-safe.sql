-- CREATE ADMIN PROFILE SAFELY
-- This will automatically find and use the correct admin user ID

-- Method 1: Create profile for admin@admin.com user
INSERT INTO public.profiles (id, email, name, role, department, employee_id, is_active) 
SELECT 
  u.id,
  'admin@admin.com',
  'Administrator',
  'admin',
  'Administration',
  'ADMIN-001',
  true
FROM auth.users u 
WHERE u.email = 'admin@admin.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  name = 'Administrator',
  department = 'Administration';

-- Method 2: If no admin@admin.com user exists, let's create one
-- First check if we need to create the user
DO $$
BEGIN
  -- Check if admin user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@admin.com') THEN
    -- If no admin user, we need to create one first
    RAISE NOTICE 'No admin user found. Please create admin user first.';
  ELSE
    RAISE NOTICE 'Admin user found and profile created.';
  END IF;
END $$;