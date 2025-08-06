-- SUPER SIMPLE VERSION - COPY THIS!

CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#2563eb',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID,
  duration INTEGER DEFAULT 30,
  passing_score INTEGER DEFAULT 70,
  is_published BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) DEFAULT 'multiple-choice',
  points INTEGER DEFAULT 1,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO categories (name, description, color) VALUES
  ('Healthcare Basics', 'Fundamental healthcare knowledge', '#2563eb'),
  ('Emergency Medicine', 'Emergency response and critical care', '#dc2626');

INSERT INTO exams (title, description, category_id, duration, passing_score, is_published, is_active) 
SELECT 
  'Basic Healthcare Assessment',
  'Test your fundamental healthcare knowledge',
  c.id,
  30,
  70,
  true,
  true
FROM categories c 
WHERE c.name = 'Healthcare Basics'
LIMIT 1;

INSERT INTO questions (exam_id, question_text, question_type, points, order_index)
SELECT 
  e.id,
  'What is the normal range for adult heart rate?',
  'multiple-choice',
  1,
  1
FROM exams e 
WHERE e.title = 'Basic Healthcare Assessment'
LIMIT 1;

INSERT INTO question_options (question_id, option_text, is_correct, order_index)
SELECT 
  q.id,
  '60-100 bpm',
  true,
  1
FROM questions q 
WHERE q.question_text LIKE 'What is the normal range%'
LIMIT 1;

INSERT INTO question_options (question_id, option_text, is_correct, order_index)
SELECT 
  q.id,
  '40-60 bpm',
  false,
  2
FROM questions q 
WHERE q.question_text LIKE 'What is the normal range%'
LIMIT 1;