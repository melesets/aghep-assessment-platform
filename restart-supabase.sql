-- RESTART SUPABASE PROJECT CONFIGURATION
-- This should force a complete refresh of the API

-- 1. Drop all existing policies and recreate
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;

-- 2. Completely disable RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates DISABLE ROW LEVEL SECURITY;

-- 3. Grant all permissions to public roles
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 4. Force PostgREST to reload
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- 5. Create a simple test view that should be accessible
CREATE OR REPLACE VIEW public.test_view AS
SELECT 'API_WORKING' as status, count(*) as categories_count FROM public.categories;

GRANT SELECT ON public.test_view TO anon, authenticated;

-- 6. Verify data exists
SELECT 'Data check:' as info, 
       (SELECT count(*) FROM public.categories) as categories,
       (SELECT count(*) FROM public.exams) as exams,
       (SELECT count(*) FROM public.questions) as questions;