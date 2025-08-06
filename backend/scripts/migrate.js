const { query } = require('../config/database');

const createTables = async () => {
  try {
    console.log('🚀 Starting database migration...');

    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'admin', 'instructor')),
        department VARCHAR(255),
        employee_id VARCHAR(100),
        phone VARCHAR(20),
        is_active BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Categories table
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        color VARCHAR(7) DEFAULT '#2563eb',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Exams table
    await query(`
      CREATE TABLE IF NOT EXISTS exams (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        instructions TEXT,
        category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
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
        created_by UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Questions table
    await query(`
      CREATE TABLE IF NOT EXISTS questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
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
      )
    `);

    // Question Options table
    await query(`
      CREATE TABLE IF NOT EXISTS question_options (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
        option_text TEXT NOT NULL,
        is_correct BOOLEAN DEFAULT false,
        order_index INTEGER,
        explanation TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Exam Attempts table
    await query(`
      CREATE TABLE IF NOT EXISTS exam_attempts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
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
      )
    `);

    // User Answers table
    await query(`
      CREATE TABLE IF NOT EXISTS user_answers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        attempt_id UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
        question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
        selected_option_id UUID REFERENCES question_options(id) ON DELETE SET NULL,
        answer_text TEXT,
        is_correct BOOLEAN,
        points_earned DECIMAL(5,2) DEFAULT 0,
        time_spent INTEGER,
        answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Certificates table
    await query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        certificate_number VARCHAR(100) UNIQUE NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
        attempt_id UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
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
      )
    `);

    // Skill Lab Sessions table
    await query(`
      CREATE TABLE IF NOT EXISTS skill_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        instructor_id UUID REFERENCES users(id) ON DELETE SET NULL,
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
      )
    `);

    // Skill Session Participants table
    await query(`
      CREATE TABLE IF NOT EXISTS skill_session_participants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES skill_sessions(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'registered' CHECK (
          status IN ('registered', 'attended', 'absent', 'cancelled')
        ),
        performance_score DECIMAL(5,2),
        feedback TEXT,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        attended_at TIMESTAMP,
        UNIQUE(session_id, user_id)
      )
    `);

    // Assessment Records table
    await query(`
      CREATE TABLE IF NOT EXISTS assessment_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
        attempt_id UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
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
      )
    `);

    // System Settings table
    await query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        setting_key VARCHAR(255) UNIQUE NOT NULL,
        setting_value JSONB NOT NULL,
        description TEXT,
        is_public BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Audit Log table
    await query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(100),
        resource_id UUID,
        old_values JSONB,
        new_values JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_exams_category ON exams(category_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_exams_active ON exams(is_active, is_published)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_questions_exam ON questions(exam_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_question_options_question ON question_options(question_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_exam_attempts_user ON exam_attempts(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam ON exam_attempts(exam_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_user_answers_attempt ON user_answers(attempt_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates(certificate_number)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_skill_sessions_date ON skill_sessions(scheduled_date)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_assessment_records_user ON assessment_records(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at)`);

    // Create triggers for updated_at timestamps
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    const tablesWithUpdatedAt = ['users', 'categories', 'exams', 'questions', 'skill_sessions', 'system_settings'];
    
    for (const table of tablesWithUpdatedAt) {
      await query(`
        DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
        CREATE TRIGGER update_${table}_updated_at
          BEFORE UPDATE ON ${table}
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `);
    }

    console.log('✅ Database migration completed successfully!');
    console.log('📋 Created tables:');
    console.log('   - users');
    console.log('   - categories');
    console.log('   - exams');
    console.log('   - questions');
    console.log('   - question_options');
    console.log('   - exam_attempts');
    console.log('   - user_answers');
    console.log('   - certificates');
    console.log('   - skill_sessions');
    console.log('   - skill_session_participants');
    console.log('   - assessment_records');
    console.log('   - system_settings');
    console.log('   - audit_logs');
    console.log('🔍 Created indexes for performance optimization');
    console.log('⚡ Created triggers for automatic timestamp updates');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if called directly
if (require.main === module) {
  createTables().then(() => {
    console.log('🎉 Migration script completed');
    process.exit(0);
  });
}

module.exports = { createTables };