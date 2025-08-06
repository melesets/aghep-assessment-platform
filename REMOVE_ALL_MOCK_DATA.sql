-- REMOVE ALL MOCK DATA FROM DATABASE
-- Run this in Supabase SQL Editor to clean everything except admin account

-- 1. Delete all sample questions and options
DELETE FROM public.question_options;
DELETE FROM public.questions;

-- 2. Delete all sample exams
DELETE FROM public.exams;

-- 3. Delete all sample categories
DELETE FROM public.categories;

-- 4. Delete any exam attempts
DELETE FROM public.user_answers;
DELETE FROM public.exam_attempts;

-- 5. Delete any certificates
DELETE FROM public.certificates;

-- 6. Keep only admin profile, delete any other profiles
DELETE FROM public.profiles WHERE email != 'admin@admin.com';

-- Verify what's left (should only be admin profile)
SELECT 'Remaining data:' as info;
SELECT 'profiles' as table_name, count(*) as count FROM public.profiles
UNION ALL
SELECT 'categories' as table_name, count(*) as count FROM public.categories
UNION ALL
SELECT 'exams' as table_name, count(*) as count FROM public.exams
UNION ALL
SELECT 'questions' as table_name, count(*) as count FROM public.questions
UNION ALL
SELECT 'question_options' as table_name, count(*) as count FROM public.question_options
UNION ALL
SELECT 'exam_attempts' as table_name, count(*) as count FROM public.exam_attempts
UNION ALL
SELECT 'certificates' as table_name, count(*) as count FROM public.certificates;