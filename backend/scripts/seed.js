const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 12);
    const studentPassword = await bcrypt.hash('student123', 12);

    // Insert default users
    await query(`
      INSERT INTO users (email, password, name, role, department, employee_id, is_active, email_verified)
      VALUES 
        ('admin@aghep.com', $1, 'System Administrator', 'admin', 'IT Department', 'ADM001', true, true),
        ('instructor@aghep.com', $2, 'Dr. Sarah Johnson', 'instructor', 'Medical Education', 'INS001', true, true),
        ('student@demo.com', $2, 'John Doe', 'student', 'Nursing', 'STU001', true, true),
        ('jane.smith@aghep.com', $2, 'Jane Smith', 'student', 'Emergency Medicine', 'STU002', true, true)
      ON CONFLICT (email) DO NOTHING
    `, [adminPassword, studentPassword]);

    // Insert default categories
    await query(`
      INSERT INTO categories (name, description, color)
      VALUES 
        ('Basic Life Support', 'Essential life-saving techniques and procedures', '#2563eb'),
        ('First Aid', 'Basic first aid and emergency response skills', '#059669'),
        ('Fire Safety', 'Fire prevention and emergency response procedures', '#dc2626'),
        ('Infection Control', 'Infection prevention and control measures', '#7c3aed'),
        ('Patient Safety', 'Patient safety protocols and best practices', '#ea580c')
      ON CONFLICT DO NOTHING
    `);

    // Get category IDs for exam insertion
    const categoriesResult = await query('SELECT id, name FROM categories');
    const categories = {};
    categoriesResult.rows.forEach(cat => {
      categories[cat.name] = cat.id;
    });

    // Get admin user ID
    const adminResult = await query('SELECT id FROM users WHERE email = $1', ['admin@aghep.com']);
    const adminId = adminResult.rows[0]?.id;

    // Insert default exams
    const examInsertResult = await query(`
      INSERT INTO exams (title, description, instructions, category_id, duration, passing_score, max_attempts, is_active, is_published, created_by)
      VALUES 
        (
          'Basic Life Support (BLS) Certification',
          'Essential life-saving techniques including CPR and AED usage for healthcare professionals.',
          'This exam covers basic life support techniques. You have 30 minutes to complete 25 questions. A score of 80% or higher is required to pass.',
          $1,
          30,
          80,
          3,
          true,
          true,
          $4
        ),
        (
          'First Aid Certification',
          'Comprehensive first aid skills for emergency situations in healthcare settings.',
          'This exam tests your knowledge of first aid procedures. You have 25 minutes to complete 20 questions. A score of 75% or higher is required to pass.',
          $2,
          25,
          75,
          3,
          true,
          true,
          $4
        ),
        (
          'Fire Safety Training',
          'Fire prevention and emergency response procedures for hospital environments.',
          'This exam covers fire safety protocols. You have 20 minutes to complete 15 questions. A score of 70% or higher is required to pass.',
          $3,
          20,
          70,
          3,
          true,
          true,
          $4
        )
      RETURNING id, title
    `, [categories['Basic Life Support'], categories['First Aid'], categories['Fire Safety'], adminId]);

    const exams = {};
    examInsertResult.rows.forEach(exam => {
      exams[exam.title] = exam.id;
    });

    // Insert sample questions for BLS exam
    const blsExamId = exams['Basic Life Support (BLS) Certification'];
    if (blsExamId) {
      const blsQuestions = await query(`
        INSERT INTO questions (exam_id, question_text, question_type, points, difficulty, explanation, order_index)
        VALUES 
          ($1, 'What is the correct compression rate for adult CPR?', 'multiple-choice', 1, 'medium', 'The American Heart Association recommends 100-120 compressions per minute for effective CPR.', 1),
          ($1, 'How deep should chest compressions be for an adult?', 'multiple-choice', 1, 'medium', 'Compressions should be at least 2 inches (5 cm) but no more than 2.4 inches (6 cm) deep.', 2),
          ($1, 'What is the ratio of compressions to breaths in adult CPR?', 'multiple-choice', 1, 'easy', 'The standard ratio is 30 compressions followed by 2 rescue breaths.', 3),
          ($1, 'When should you use an AED?', 'multiple-choice', 1, 'medium', 'An AED should be used on unresponsive patients with no pulse who may be in cardiac arrest.', 4),
          ($1, 'What should you do if someone is choking and can still cough?', 'multiple-choice', 1, 'easy', 'If the person can cough, encourage them to continue coughing as this may dislodge the object.', 5)
        RETURNING id, question_text, order_index
      `, [blsExamId]);

      // Insert options for BLS questions
      const questionOptions = [
        // Question 1 options
        { questionIndex: 0, options: [
          { text: '80-100 per minute', isCorrect: false },
          { text: '100-120 per minute', isCorrect: true },
          { text: '120-140 per minute', isCorrect: false },
          { text: '60-80 per minute', isCorrect: false }
        ]},
        // Question 2 options
        { questionIndex: 1, options: [
          { text: '1-2 inches', isCorrect: false },
          { text: '2-2.4 inches', isCorrect: true },
          { text: '3-4 inches', isCorrect: false },
          { text: '1 inch', isCorrect: false }
        ]},
        // Question 3 options
        { questionIndex: 2, options: [
          { text: '15:2', isCorrect: false },
          { text: '30:2', isCorrect: true },
          { text: '20:2', isCorrect: false },
          { text: '25:2', isCorrect: false }
        ]},
        // Question 4 options
        { questionIndex: 3, options: [
          { text: 'Only on conscious patients', isCorrect: false },
          { text: 'On any unresponsive person', isCorrect: false },
          { text: 'Only when trained medical personnel arrive', isCorrect: false },
          { text: 'On unresponsive patients with no pulse', isCorrect: true }
        ]},
        // Question 5 options
        { questionIndex: 4, options: [
          { text: 'Perform back blows immediately', isCorrect: false },
          { text: 'Encourage them to keep coughing', isCorrect: true },
          { text: 'Start abdominal thrusts', isCorrect: false },
          { text: 'Call 911 immediately', isCorrect: false }
        ]}
      ];

      for (let i = 0; i < questionOptions.length; i++) {
        const questionId = blsQuestions.rows[i].id;
        const options = questionOptions[i].options;
        
        for (let j = 0; j < options.length; j++) {
          await query(`
            INSERT INTO question_options (question_id, option_text, is_correct, order_index)
            VALUES ($1, $2, $3, $4)
          `, [questionId, options[j].text, options[j].isCorrect, j + 1]);
        }
      }
    }

    // Insert sample skill sessions
    const instructorResult = await query('SELECT id FROM users WHERE email = $1', ['instructor@aghep.com']);
    const instructorId = instructorResult.rows[0]?.id;

    if (instructorId) {
      await query(`
        INSERT INTO skill_sessions (title, description, instructor_id, max_participants, duration, location, equipment_needed, prerequisites, learning_objectives, scheduled_date)
        VALUES 
          (
            'Advanced CPR Techniques',
            'Hands-on practice of advanced cardiopulmonary resuscitation techniques',
            $1,
            15,
            120,
            'Skills Lab Room A',
            ARRAY['CPR Mannequins', 'AED Trainers', 'Bag Mask Ventilators'],
            ARRAY['Basic CPR Certification', 'Healthcare Provider Status'],
            ARRAY['Master advanced CPR techniques', 'Proper AED usage', 'Team-based resuscitation'],
            CURRENT_TIMESTAMP + INTERVAL '7 days'
          ),
          (
            'IV Insertion Workshop',
            'Practice intravenous catheter insertion techniques',
            $1,
            12,
            90,
            'Skills Lab Room B',
            ARRAY['IV Training Arms', 'Catheters', 'IV Fluids', 'Tourniquets'],
            ARRAY['Basic Nursing Skills', 'Anatomy Knowledge'],
            ARRAY['Safe IV insertion', 'Proper technique', 'Complication management'],
            CURRENT_TIMESTAMP + INTERVAL '10 days'
          ),
          (
            'Wound Care Management',
            'Advanced wound assessment and treatment techniques',
            $1,
            20,
            150,
            'Skills Lab Room C',
            ARRAY['Wound Models', 'Dressing Supplies', 'Assessment Tools'],
            ARRAY['Basic First Aid', 'Healthcare Experience'],
            ARRAY['Wound assessment', 'Proper dressing techniques', 'Infection prevention'],
            CURRENT_TIMESTAMP + INTERVAL '14 days'
          ),
          (
            'Emergency Response Simulation',
            'Full-scale emergency response simulation exercise',
            $1,
            25,
            180,
            'Main Simulation Center',
            ARRAY['High-Fidelity Mannequins', 'Monitoring Equipment', 'Emergency Medications'],
            ARRAY['BLS Certification', 'ACLS Preferred', 'Team Experience'],
            ARRAY['Emergency protocols', 'Team communication', 'Critical decision making'],
            CURRENT_TIMESTAMP + INTERVAL '21 days'
          )
      `, [instructorId]);
    }

    // Insert default system settings
    await query(`
      INSERT INTO system_settings (setting_key, setting_value, description, is_public)
      VALUES 
        ('app_name', '"AGHEP Assessment Platform"', 'Application name displayed to users', true),
        ('app_version', '"1.0.0"', 'Current application version', true),
        ('maintenance_mode', 'false', 'Enable/disable maintenance mode', false),
        ('max_file_upload_size', '5242880', 'Maximum file upload size in bytes (5MB)', false),
        ('session_timeout', '3600', 'Session timeout in seconds (1 hour)', false),
        ('password_min_length', '8', 'Minimum password length requirement', false),
        ('max_login_attempts', '5', 'Maximum failed login attempts before lockout', false),
        ('certificate_validity_months', '24', 'Default certificate validity period in months', false),
        ('email_notifications_enabled', 'true', 'Enable/disable email notifications', false),
        ('backup_retention_days', '30', 'Number of days to retain database backups', false)
      ON CONFLICT (setting_key) DO NOTHING
    `);

    console.log('✅ Database seeding completed successfully!');
    console.log('👥 Created default users:');
    console.log('   - admin@aghep.com (password: admin123)');
    console.log('   - instructor@aghep.com (password: student123)');
    console.log('   - student@demo.com (password: student123)');
    console.log('   - jane.smith@aghep.com (password: student123)');
    console.log('📚 Created 5 categories and 3 sample exams');
    console.log('❓ Added sample questions for BLS exam');
    console.log('🧪 Created 4 skill lab sessions');
    console.log('⚙️ Configured system settings');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('🎉 Seeding script completed');
    process.exit(0);
  });
}

module.exports = { seedDatabase };