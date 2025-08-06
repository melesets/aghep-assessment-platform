-- MINIMAL SUPABASE SCHEMA - COPY THIS ONE!

-- 1. Profiles table
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
        INSERT INTO public.questions (exam_id, question_text, question_type, points, difficulty, order_index) VALUES
          (exam_uuid, 'What is the normal range for adult heart rate?', 'multiple-choice', 1, 'easy', 1),
          (exam_uuid, 'Which of the following is a sign of shock?', 'multiple-choice', 1, 'medium', 2),
          (exam_uuid, 'Hand hygiene should be performed before and after patient contact.', 'true-false', 1, 'easy', 3);
        
        INSERT INTO public.question_options (question_id, option_text, is_correct, order_index)
        SELECT q.id, '40-60 bpm', false, 1 FROM public.questions q WHERE q.question_text LIKE 'What is the normal range%'
        UNION ALL
        SELECT q.id, '60-100 bpm', true, 2 FROM public.questions q WHERE q.question_text LIKE 'What is the normal range%'
        UNION ALL
        SELECT q.id, '100-120 bpm', false, 3 FROM public.questions q WHERE q.question_text LIKE 'What is the normal range%'
        UNION ALL
        SELECT q.id, '120-140 bpm', false, 4 FROM public.questions q WHERE q.question_text LIKE 'What is the normal range%';
        
        INSERT INTO public.question_options (question_id, option_text, is_correct, order_index)
        SELECT q.id, 'High blood pressure', false, 1 FROM public.questions q WHERE q.question_text LIKE 'Which of the following is a sign of shock%'
        UNION ALL
        SELECT q.id, 'Rapid pulse and pale skin', true, 2 FROM public.questions q WHERE q.question_text LIKE 'Which of the following is a sign of shock%'
        UNION ALL
        SELECT q.id, 'Slow breathing', false, 3 FROM public.questions q WHERE q.question_text LIKE 'Which of the following is a sign of shock%'
        UNION ALL
        SELECT q.id, 'Increased appetite', false, 4 FROM public.questions q WHERE q.question_text LIKE 'Which of the following is a sign of shock%';
        
        INSERT INTO public.question_options (question_id, option_text, is_correct, order_index)
        SELECT q.id, 'True', true, 1 FROM public.questions q WHERE q.question_text LIKE 'Hand hygiene should be performed%'
        UNION ALL
        SELECT q.id, 'False', false, 2 FROM public.questions q WHERE q.question_text LIKE 'Hand hygiene should be performed%';
    END IF;
END $$;