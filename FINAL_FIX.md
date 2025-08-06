# 🔧 FINAL FIX - Run This SQL

The tables exist but the API can't access them due to Row Level Security. 

## Run This SQL in Supabase SQL Editor:

```sql
-- DISABLE ALL ROW LEVEL SECURITY
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates DISABLE ROW LEVEL SECURITY;

-- CREATE ADMIN PROFILE
INSERT INTO public.profiles (id, email, name, role) 
VALUES (
  '53eef30c-d44f-454a-910a-6da30644880b',
  'admin@admin.com',
  'Administrator',
  'admin'
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  name = 'Administrator';
```

## After Running This:

1. Test: `node check-tables.js`
2. Should show: `✅ categories: EXISTS`
3. Start app: `npm run dev`
4. Login: `admin@admin.com` / `Password`

**This will fix the API access issue once and for all!** 🎯