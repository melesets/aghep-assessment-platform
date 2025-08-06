-- FORCE API TO RECOGNIZE TABLES
-- This should refresh the PostgREST schema cache

-- 1. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- 2. Make sure tables are accessible by API roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 3. Ensure RLS is disabled (this is crucial)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options DISABLE ROW LEVEL SECURITY;

-- 4. Create a simple test function that the API can call
CREATE OR REPLACE FUNCTION public.test_api_access()
RETURNS json AS $$
BEGIN
  RETURN json_build_object(
    'status', 'success',
    'message', 'API can access database',
    'categories_count', (SELECT count(*) FROM public.categories),
    'profiles_count', (SELECT count(*) FROM public.profiles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.test_api_access() TO anon, authenticated;

-- 6. Insert admin profile if it doesn't exist
INSERT INTO public.profiles (id, email, name, role) 
VALUES (
  '53eef30c-d44f-454a-910a-6da30644880b',
  'admin@admin.com',
  'Administrator',
  'admin'
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  name = 'Administrator';