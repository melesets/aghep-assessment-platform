-- FINAL DATABASE FIX
-- This should resolve the API access issue

-- 1. First, let's make sure the schema is correct
SET search_path TO public;

-- 2. Grant permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 3. Disable RLS completely
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options DISABLE ROW LEVEL SECURITY;

-- 4. Create admin profile
INSERT INTO public.profiles (id, email, name, role) 
VALUES (
  '53eef30c-d44f-454a-910a-6da30644880b',
  'admin@admin.com',
  'Administrator',
  'admin'
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  name = 'Administrator';

-- 5. Verify data exists
SELECT 'Categories count:' as info, count(*) as count FROM public.categories
UNION ALL
SELECT 'Exams count:' as info, count(*) as count FROM public.exams
UNION ALL
SELECT 'Questions count:' as info, count(*) as count FROM public.questions
UNION ALL
SELECT 'Profiles count:' as info, count(*) as count FROM public.profiles;