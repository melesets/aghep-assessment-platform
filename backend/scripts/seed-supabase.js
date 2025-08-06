const { supabase } = require('../config/supabase');

const seedSupabase = async () => {
  try {
    console.log('🌱 Starting Supabase database seeding...');

    // Create default categories
    console.log('📚 Creating categories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .upsert([
        {
          name: 'Basic Life Support',
          description: 'Essential life-saving techniques and procedures',
          color: '#2563eb'
        },
        {
          name: 'First Aid',
          description: 'Basic first aid and emergency response skills',
          color: '#059669'
        },
        {
          name: 'Fire Safety',
          description: 'Fire prevention and emergency response procedures',
          color: '#dc2626'
        },
        {
          name: 'Infection Control',
          description: 'Infection prevention and control measures',
          color: '#7c3aed'
        },
        {
          name: 'Patient Safety',
          description: 'Patient safety protocols and best practices',
          color: '#ea580c'
        }
      ], { onConflict: 'name' })
      .select();

    if (categoriesError) {
      console.error('❌ Error creating categories:', categoriesError);
    } else {
      console.log(`✅ Created ${categories.length} categories`);
    }

    // Create admin user using Supabase Auth
    console.log('👤 Creating admin user...');
    const { data: adminAuth, error: adminAuthError } = await supabase.auth.admin.createUser({
      email: 'admin@aghep.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        name: 'System Administrator',
        role: 'admin'
      }
    });

    if (adminAuthError && !adminAuthError.message.includes('already registered')) {
      console.error('❌ Error creating admin user:', adminAuthError);
    } else if (adminAuth.user) {
      // Create admin profile
      const { error: adminProfileError } = await supabase
        .from('profiles')
        .upsert({
          id: adminAuth.user.id,
          email: 'admin@aghep.com',
          name: 'System Administrator',
          role: 'admin',
          department: 'IT Department',
          employee_id: 'ADM001',
          is_active: true
        }, { onConflict: 'id' });

      if (adminProfileError) {
        console.error('❌ Error creating admin profile:', adminProfileError);
      } else {
        console.log('✅ Admin user created');
      }
    }

    // Create instructor user
    console.log('👨‍🏫 Creating instructor user...');
    const { data: instructorAuth, error: instructorAuthError } = await supabase.auth.admin.createUser({
      email: 'instructor@aghep.com',
      password: 'student123',
      email_confirm: true,
      user_metadata: {
        name: 'Dr. Sarah Johnson',
        role: 'instructor'
      }
    });

    if (instructorAuthError && !instructorAuthError.message.includes('already registered')) {
      console.error('❌ Error creating instructor user:', instructorAuthError);
    } else if (instructorAuth.user) {
      // Create instructor profile
      const { error: instructorProfileError } = await supabase
        .from('profiles')
        .upsert({
          id: instructorAuth.user.id,
          email: 'instructor@aghep.com',
          name: 'Dr. Sarah Johnson',
          role: 'instructor',
          department: 'Medical Education',
          employee_id: 'INS001',
          is_active: true
        }, { onConflict: 'id' });

      if (instructorProfileError) {
        console.error('❌ Error creating instructor profile:', instructorProfileError);
      } else {
        console.log('✅ Instructor user created');
      }
    }

    // Create student users
    console.log('👨‍🎓 Creating student users...');
    const students = [
      {
        email: 'student@demo.com',
        name: 'John Doe',
        department: 'Nursing',
        employee_id: 'STU001'
      },
      {
        email: 'jane.smith@aghep.com',
        name: 'Jane Smith',
        department: 'Emergency Medicine',
        employee_id: 'STU002'
      }
    ];

    for (const student of students) {
      const { data: studentAuth, error: studentAuthError } = await supabase.auth.admin.createUser({
        email: student.email,
        password: 'student123',
        email_confirm: true,
        user_metadata: {
          name: student.name,
          role: 'student'
        }
      });

      if (studentAuthError && !studentAuthError.message.includes('already registered')) {
        console.error(`❌ Error creating student ${student.email}:`, studentAuthError);
      } else if (studentAuth.user) {
        // Create student profile
        const { error: studentProfileError } = await supabase
          .from('profiles')
          .upsert({
            id: studentAuth.user.id,
            email: student.email,
            name: student.name,
            role: 'student',
            department: student.department,
            employee_id: student.employee_id,
            is_active: true
          }, { onConflict: 'id' });

        if (studentProfileError) {
          console.error(`❌ Error creating student profile for ${student.email}:`, studentProfileError);
        } else {
          console.log(`✅ Student ${student.name} created`);
        }
      }
    }

    // Get the BLS category ID for creating exams
    const blsCategory = categories?.find(cat => cat.name === 'Basic Life Support');
    const firstAidCategory = categories?.find(cat => cat.name === 'First Aid');
    const fireSafetyCategory = categories?.find(cat => cat.name === 'Fire Safety');

    // Create sample exams
    console.log('📝 Creating sample exams...');
    const { data: exams, error: examsError } = await supabase
      .from('exams')
      .upsert([
        {
          title: 'Basic Life Support (BLS) Certification',
          description: 'Essential life-saving techniques including CPR and AED usage for healthcare professionals.',
          instructions: 'This exam covers basic life support techniques. You have 30 minutes to complete 25 questions. A score of 80% or higher is required to pass.',
          category_id: blsCategory?.id,
          duration: 30,
          passing_score: 80,
          max_attempts: 3,
          is_active: true,
          is_published: true,
          created_by: adminAuth?.user?.id
        },
        {
          title: 'First Aid Certification',
          description: 'Comprehensive first aid skills for emergency situations in healthcare settings.',
          instructions: 'This exam tests your knowledge of first aid procedures. You have 25 minutes to complete 20 questions. A score of 75% or higher is required to pass.',
          category_id: firstAidCategory?.id,
          duration: 25,
          passing_score: 75,
          max_attempts: 3,
          is_active: true,
          is_published: true,
          created_by: adminAuth?.user?.id
        },
        {
          title: 'Fire Safety Training',
          description: 'Fire prevention and emergency response procedures for hospital environments.',
          instructions: 'This exam covers fire safety protocols. You have 20 minutes to complete 15 questions. A score of 70% or higher is required to pass.',
          category_id: fireSafetyCategory?.id,
          duration: 20,
          passing_score: 70,
          max_attempts: 3,
          is_active: true,
          is_published: true,
          created_by: adminAuth?.user?.id
        }
      ], { onConflict: 'title' })
      .select();

    if (examsError) {
      console.error('❌ Error creating exams:', examsError);
    } else {
      console.log(`✅ Created ${exams.length} exams`);
    }

    // Create sample questions for BLS exam
    const blsExam = exams?.find(exam => exam.title.includes('Basic Life Support'));
    if (blsExam) {
      console.log('❓ Creating sample questions...');
      
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .upsert([
          {
            exam_id: blsExam.id,
            question_text: 'What is the correct compression rate for adult CPR?',
            question_type: 'multiple-choice',
            points: 1,
            difficulty: 'medium',
            explanation: 'The American Heart Association recommends 100-120 compressions per minute for effective CPR.',
            order_index: 1
          },
          {
            exam_id: blsExam.id,
            question_text: 'How deep should chest compressions be for an adult?',
            question_type: 'multiple-choice',
            points: 1,
            difficulty: 'medium',
            explanation: 'Compressions should be at least 2 inches (5 cm) but no more than 2.4 inches (6 cm) deep.',
            order_index: 2
          },
          {
            exam_id: blsExam.id,
            question_text: 'What is the ratio of compressions to breaths in adult CPR?',
            question_type: 'multiple-choice',
            points: 1,
            difficulty: 'easy',
            explanation: 'The standard ratio is 30 compressions followed by 2 rescue breaths.',
            order_index: 3
          },
          {
            exam_id: blsExam.id,
            question_text: 'When should you use an AED?',
            question_type: 'multiple-choice',
            points: 1,
            difficulty: 'medium',
            explanation: 'An AED should be used on unresponsive patients with no pulse who may be in cardiac arrest.',
            order_index: 4
          },
          {
            exam_id: blsExam.id,
            question_text: 'What should you do if someone is choking and can still cough?',
            question_type: 'multiple-choice',
            points: 1,
            difficulty: 'easy',
            explanation: 'If the person can cough, encourage them to continue coughing as this may dislodge the object.',
            order_index: 5
          }
        ], { onConflict: 'exam_id,order_index' })
        .select();

      if (questionsError) {
        console.error('❌ Error creating questions:', questionsError);
      } else {
        console.log(`✅ Created ${questions.length} questions`);

        // Create options for each question
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

        for (let i = 0; i < questionOptions.length && i < questions.length; i++) {
          const question = questions[i];
          const options = questionOptions[i].options;
          
          const optionsToInsert = options.map((option, index) => ({
            question_id: question.id,
            option_text: option.text,
            is_correct: option.isCorrect,
            order_index: index + 1
          }));

          const { error: optionsError } = await supabase
            .from('question_options')
            .upsert(optionsToInsert, { onConflict: 'question_id,order_index' });

          if (optionsError) {
            console.error(`❌ Error creating options for question ${i + 1}:`, optionsError);
          }
        }

        console.log('✅ Created question options');
      }
    }

    // Create sample skill sessions
    if (instructorAuth?.user) {
      console.log('🧪 Creating skill lab sessions...');
      const { error: sessionsError } = await supabase
        .from('skill_sessions')
        .upsert([
          {
            title: 'Advanced CPR Techniques',
            description: 'Hands-on practice of advanced cardiopulmonary resuscitation techniques',
            instructor_id: instructorAuth.user.id,
            max_participants: 15,
            duration: 120,
            location: 'Skills Lab Room A',
            equipment_needed: ['CPR Mannequins', 'AED Trainers', 'Bag Mask Ventilators'],
            prerequisites: ['Basic CPR Certification', 'Healthcare Provider Status'],
            learning_objectives: ['Master advanced CPR techniques', 'Proper AED usage', 'Team-based resuscitation'],
            scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
          },
          {
            title: 'IV Insertion Workshop',
            description: 'Practice intravenous catheter insertion techniques',
            instructor_id: instructorAuth.user.id,
            max_participants: 12,
            duration: 90,
            location: 'Skills Lab Room B',
            equipment_needed: ['IV Training Arms', 'Catheters', 'IV Fluids', 'Tourniquets'],
            prerequisites: ['Basic Nursing Skills', 'Anatomy Knowledge'],
            learning_objectives: ['Safe IV insertion', 'Proper technique', 'Complication management'],
            scheduled_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days from now
          }
        ], { onConflict: 'title' });

      if (sessionsError) {
        console.error('❌ Error creating skill sessions:', sessionsError);
      } else {
        console.log('✅ Created skill lab sessions');
      }
    }

    console.log('✅ Supabase database seeding completed successfully!');
    console.log('👥 Created default users:');
    console.log('   - admin@aghep.com (password: admin123)');
    console.log('   - instructor@aghep.com (password: student123)');
    console.log('   - student@demo.com (password: student123)');
    console.log('   - jane.smith@aghep.com (password: student123)');
    console.log('📚 Created 5 categories and 3 sample exams');
    console.log('❓ Added sample questions for BLS exam');
    console.log('🧪 Created 2 skill lab sessions');
    console.log('🎉 Your Supabase database is ready to use!');

  } catch (error) {
    console.error('❌ Supabase seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedSupabase().then(() => {
    console.log('🎉 Seeding script completed');
    process.exit(0);
  });
}

module.exports = { seedSupabase };