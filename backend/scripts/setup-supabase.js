const { supabase } = require('../config/supabase');

const setupSupabase = async () => {
  try {
    console.log('🚀 Setting up Supabase database...');

    // Create tables using Supabase SQL editor queries
    const tables = [
      // Users table (extends Supabase auth.users)
      {
        name: 'profiles',
        sql: `
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
        `
      },

      // Categories table
      {
        name: 'categories',
        sql: `
          CREATE TABLE IF NOT EXISTS public.categories (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            description TEXT,
            color VARCHAR(7) DEFAULT '#2563eb',
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `
      },

      // Exams table
      {
        name: 'exams',
        sql: `
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
        `
      },

      // Questions table
      {
        name: 'questions',
        sql: `
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
        `
      },

      // Question Options table
      {
        name: 'question_options',
        sql: `
          CREATE TABLE IF NOT EXISTS public.question_options (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
            option_text TEXT NOT NULL,
            is_correct BOOLEAN DEFAULT false,
            order_index INTEGER,
            explanation TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `
      },

      // Exam Attempts table
      {
        name: 'exam_attempts',
        sql: `
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
        `
      },

      // User Answers table
      {
        name: 'user_answers',
        sql: `
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
        `
      },

      // Certificates table
      {
        name: 'certificates',
        sql: `
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
        `
      },

      // Skill Lab Sessions table
      {
        name: 'skill_sessions',
        sql: `
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
        `
      },

      // Assessment Records table
      {
        name: 'assessment_records',
        sql: `
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
        `
      }
    ];

    // Execute table creation
    for (const table of tables) {
      console.log(`Creating table: ${table.name}...`);
      const { error } = await supabase.rpc('exec', { sql: table.sql });
      
      if (error) {
        console.error(`❌ Error creating ${table.name}:`, error);
      } else {
        console.log(`✅ Table ${table.name} created successfully`);
      }
    }

    // Create Row Level Security (RLS) policies
    console.log('🔒 Setting up Row Level Security policies...');
    
    const rlsPolicies = [
      // Profiles policies
      `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`,
      `CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);`,
      `CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);`,
      
      // Exams policies
      `ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;`,
      `CREATE POLICY "Anyone can view published exams" ON public.exams FOR SELECT USING (is_published = true AND is_active = true);`,
      `CREATE POLICY "Instructors can manage exams" ON public.exams FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role IN ('admin', 'instructor')
        )
      );`,
      
      // Questions policies
      `ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;`,
      `CREATE POLICY "Anyone can view questions for published exams" ON public.questions FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.exams 
          WHERE id = exam_id AND is_published = true AND is_active = true
        )
      );`,
      
      // Exam attempts policies
      `ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;`,
      `CREATE POLICY "Users can view own attempts" ON public.exam_attempts FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can create own attempts" ON public.exam_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can update own attempts" ON public.exam_attempts FOR UPDATE USING (auth.uid() = user_id);`
    ];

    for (const policy of rlsPolicies) {
      const { error } = await supabase.rpc('exec', { sql: policy });
      if (error && !error.message.includes('already exists')) {
        console.error('❌ RLS Policy error:', error);
      }
    }

    // Create indexes
    console.log('🔍 Creating database indexes...');
    const indexes = [
      `CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);`,
      `CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);`,
      `CREATE INDEX IF NOT EXISTS idx_exams_category ON public.exams(category_id);`,
      `CREATE INDEX IF NOT EXISTS idx_exams_active ON public.exams(is_active, is_published);`,
      `CREATE INDEX IF NOT EXISTS idx_questions_exam ON public.questions(exam_id);`,
      `CREATE INDEX IF NOT EXISTS idx_exam_attempts_user ON public.exam_attempts(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam ON public.exam_attempts(exam_id);`
    ];

    for (const index of indexes) {
      const { error } = await supabase.rpc('exec', { sql: index });
      if (error && !error.message.includes('already exists')) {
        console.error('❌ Index error:', error);
      }
    }

    console.log('✅ Supabase setup completed successfully!');
    console.log('📋 Created tables with Row Level Security');
    console.log('🔍 Created performance indexes');
    console.log('🎉 Your database is ready to use!');

  } catch (error) {
    console.error('❌ Supabase setup failed:', error);
    process.exit(1);
  }
};

// Run setup if called directly
if (require.main === module) {
  setupSupabase().then(() => {
    console.log('🎉 Setup script completed');
    process.exit(0);
  });
}

module.exports = { setupSupabase };