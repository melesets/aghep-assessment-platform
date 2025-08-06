-- ADD POLICIES TO MAKE TABLES ACCESSIBLE
-- Run this in Supabase SQL Editor

-- Disable RLS temporarily to allow access
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options DISABLE ROW LEVEL SECURITY;

-- Or create permissive policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to categories" ON public.categories FOR ALL USING (true);

ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to exams" ON public.exams FOR ALL USING (true);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to questions" ON public.questions FOR ALL USING (true);

ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to question_options" ON public.question_options FOR ALL USING (true);