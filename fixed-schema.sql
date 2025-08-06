-- SUPABASE DATABASE SCHEMA
-- Run this SQL in your Supabase Dashboard > SQL Editor

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'admin', 'instructor')),
  department VARCHAR(255),
  employee_id VARCHAR(100),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#2563eb',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Exams table
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  duration INTEGER NOT NULL DEFAULT 30,
  passing_score INTEGER NOT NULL DEFAULT 70,
  max_attempts INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  shuffle_questions BOOLEAN DEFAULT false,
  shuffle_options BOOLEAN DEFAULT false,
  show_results_immediately BOOLEAN DEFAULT true,
  allow_review BOOLEAN DEFAULT true,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) DEFAULT 'multiple-choice' CHECK (
    question_type IN ('multiple-choice', 'true-false', 'short-answer', 'essay', 'matching')
  ),
  points INTEGER DEFAULT 1,
  difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  explanation TEXT,
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  audio_url VARCHAR(500),
  time_limit INTEGER,
  order_index INTEGER,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Question Options table
CREATE TABLE IF NOT EXISTS public.question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  order_index INTEGER,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Exam Attempts table
CREATE TABLE IF NOT EXISTS public.exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (
    status IN ('in_progress', 'completed', 'abandoned', 'expired')
  ),
  score DECIMAL(5,2),
  percentage DECIMAL(5,2),
  total_questions INTEGER,
  correct_answers INTEGER,
  time_spent INTEGER,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. User Answers table
CREATE TABLE IF NOT EXISTS public.user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES public.question_options(id) ON DELETE SET NULL,
  answer_text TEXT,
  is_correct BOOLEAN,
  points_earned DECIMAL(5,2) DEFAULT 0,
  time_spent INTEGER,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_number VARCHAR(100) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  attempt_id UUID REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
  template_id VARCHAR(100),
  score DECIMAL(5,2) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  grade_text VARCHAR(100),
  issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expiry_date TIMESTAMP,
  is_valid BOOLEAN DEFAULT true,
  verification_code VARCHAR(100) UNIQUE,
  pdf_path VARCHAR(500),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Skill Lab Sessions table
CREATE TABLE IF NOT EXISTS public.skill_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  max_participants INTEGER DEFAULT 20,
  duration INTEGER NOT NULL,
  location VARCHAR(255),
  equipment_needed TEXT[],
  prerequisites TEXT[],
  learning_objectives TEXT[],
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (
    status IN ('scheduled', 'in_progress', 'completed', 'cancelled')
  ),
  scheduled_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Assessment Records table
CREATE TABLE IF NOT EXISTS public.assessment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  attempt_id UUID REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
  record_type VARCHAR(50) DEFAULT 'exam' CHECK (
    record_type IN ('exam', 'skill_session', 'certification')
  ),
  title VARCHAR(255) NOT NULL,
  score DECIMAL(5,2),
  percentage DECIMAL(5,2),
  status VARCHAR(50),
  completion_date TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_records ENABLE ROW LEVEL SECURITY;

-- Create policies (without IF NOT EXISTS)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
CREATE POLICY "Anyone can view active categories" ON public.categories 
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'instructor')
    )
  );

DROP POLICY IF EXISTS "Anyone can view published exams" ON public.exams;
CREATE POLICY "Anyone can view published exams" ON public.exams 
  FOR SELECT USING (is_published = true AND is_active = true);

DROP POLICY IF EXISTS "Instructors can manage exams" ON public.exams;
CREATE POLICY "Instructors can manage exams" ON public.exams 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'instructor')
    )
  );

DROP POLICY IF EXISTS "Anyone can view questions for published exams" ON public.questions;
CREATE POLICY "Anyone can view questions for published exams" ON public.questions 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.exams 
      WHERE id = exam_id AND is_published = true AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Anyone can view options for published exam questions" ON public.question_options;
CREATE POLICY "Anyone can view options for published exam questions" ON public.question_options 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.questions q
      JOIN public.exams e ON q.exam_id = e.id
      WHERE q.id = question_id AND e.is_published = true AND e.is_active = true
    )
  );

DROP POLICY IF EXISTS "Users can view own attempts" ON public.exam_attempts;
CREATE POLICY "Users can view own attempts" ON public.exam_attempts 
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own attempts" ON public.exam_attempts;
CREATE POLICY "Users can create own attempts" ON public.exam_attempts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own attempts" ON public.exam_attempts;
CREATE POLICY "Users can update own attempts" ON public.exam_attempts 
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own answers" ON public.user_answers;
CREATE POLICY "Users can view own answers" ON public.user_answers 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.exam_attempts 
      WHERE id = attempt_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own answers" ON public.user_answers;
CREATE POLICY "Users can insert own answers" ON public.user_answers 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.exam_attempts 
      WHERE id = attempt_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view own certificates" ON public.certificates;
CREATE POLICY "Users can view own certificates" ON public.certificates 
  FOR SELECT USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_exams_category ON public.exams(category_id);
CREATE INDEX IF NOT EXISTS idx_exams_active ON public.exams(is_active, is_published);
CREATE INDEX IF NOT EXISTS idx_questions_exam ON public.questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_question_options_question ON public.question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user ON public.exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam ON public.exam_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_attempt ON public.user_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON public.certificates(user_id);

-- Insert sample data
INSERT INTO public.categories (name, description, color) VALUES
  ('Healthcare Basics', 'Fundamental healthcare knowledge and procedures', '#2563eb'),
  ('Emergency Medicine', 'Emergency response and critical care', '#dc2626'),
  ('Patient Safety', 'Patient safety protocols and best practices', '#059669'),
  ('Medical Ethics', 'Ethical considerations in healthcare', '#7c3aed'),
  ('Pharmacology', 'Drug administration and medication safety', '#ea580c')
ON CONFLICT DO NOTHING;

-- Sample exam
INSERT INTO public.exams (title, description, instructions, category_id, duration, passing_score, is_published, is_active) 
SELECT 
  'Basic Healthcare Assessment',
  'Test your fundamental healthcare knowledge',
  'Answer all questions to the best of your ability. You have 30 minutes to complete this exam.',
  c.id,
  30,
  70,
  true,
  true
FROM public.categories c 
WHERE c.name = 'Healthcare Basics'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Sample questions
DO $$
DECLARE
    exam_uuid UUID;
BEGIN
    SELECT id INTO exam_uuid FROM public.exams WHERE title = 'Basic Healthcare Assessment' LIMIT 1;
    
    IF exam_uuid IS NOT NULL THEN
        -- Insert sample questions
        INSERT INTO public.questions (exam_id, question_text, question_type, points, difficulty, order_index) VALUES
          (exam_uuid, 'What is the normal range for adult heart rate?', 'multiple-choice', 1, 'easy', 1),
          (exam_uuid, 'Which of the following is a sign of shock?', 'multiple-choice', 1, 'medium', 2),
          (exam_uuid, 'Hand hygiene should be performed before and after patient contact.', 'true-false', 1, 'easy', 3);
        
        -- Insert options for first question
        INSERT INTO public.question_options (question_id, option_text, is_correct, order_index)
        SELECT q.id, '40-60 bpm', false, 1 FROM public.questions q WHERE q.question_text LIKE 'What is the normal range%'
        UNION ALL
        SELECT q.id, '60-100 bpm', true, 2 FROM public.questions q WHERE q.question_text LIKE 'What is the normal range%'
        UNION ALL
        SELECT q.id, '100-120 bpm', false, 3 FROM public.questions q WHERE q.question_text LIKE 'What is the normal range%'
        UNION ALL
        SELECT q.id, '120-140 bpm', false, 4 FROM public.questions q WHERE q.question_text LIKE 'What is the normal range%';
        
        -- Insert options for second question
        INSERT INTO public.question_options (question_id, option_text, is_correct, order_index)
        SELECT q.id, 'High blood pressure', false, 1 FROM public.questions q WHERE q.question_text LIKE 'Which of the following is a sign of shock%'
        UNION ALL
        SELECT q.id, 'Rapid pulse and pale skin', true, 2 FROM public.questions q WHERE q.question_text LIKE 'Which of the following is a sign of shock%'
        UNION ALL
        SELECT q.id, 'Slow breathing', false, 3 FROM public.questions q WHERE q.question_text LIKE 'Which of the following is a sign of shock%'
        UNION ALL
        SELECT q.id, 'Increased appetite', false, 4 FROM public.questions q WHERE q.question_text LIKE 'Which of the following is a sign of shock%';
        
        -- Insert options for true/false question
        INSERT INTO public.question_options (question_id, option_text, is_correct, order_index)
        SELECT q.id, 'True', true, 1 FROM public.questions q WHERE q.question_text LIKE 'Hand hygiene should be performed%'
        UNION ALL
        SELECT q.id, 'False', false, 2 FROM public.questions q WHERE q.question_text LIKE 'Hand hygiene should be performed%';
    END IF;
END $$;