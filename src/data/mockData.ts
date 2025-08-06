// Enhanced mock data that looks and feels like real data
export const mockCategories = [
  {
    id: '1',
    name: 'Healthcare Basics',
    description: 'Fundamental healthcare knowledge and procedures',
    color: '#2563eb',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Emergency Medicine',
    description: 'Emergency response and critical care',
    color: '#dc2626',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '3',
    name: 'Patient Safety',
    description: 'Patient safety protocols and best practices',
    color: '#059669',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '4',
    name: 'Medical Ethics',
    description: 'Ethical considerations in healthcare',
    color: '#7c3aed',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '5',
    name: 'Pharmacology',
    description: 'Drug administration and medication safety',
    color: '#ea580c',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z'
  }
];

export const mockExams = [
  {
    id: '1',
    title: 'Basic Healthcare Assessment',
    description: 'Test your fundamental healthcare knowledge',
    instructions: 'Answer all questions to the best of your ability. You have 30 minutes to complete this exam.',
    category_id: '1',
    duration: 30,
    passing_score: 70,
    max_attempts: 3,
    is_active: true,
    is_published: true,
    shuffle_questions: false,
    shuffle_options: false,
    show_results_immediately: true,
    allow_review: true,
    created_at: '2024-01-15T10:00:00Z',
    questions: [
      {
        id: '1',
        exam_id: '1',
        question_text: 'What is the normal range for adult heart rate?',
        question_type: 'multiple-choice',
        points: 1,
        difficulty: 'easy',
        order_index: 1,
        options: [
          { id: '1', option_text: '40-60 bpm', is_correct: false, order_index: 1 },
          { id: '2', option_text: '60-100 bpm', is_correct: true, order_index: 2 },
          { id: '3', option_text: '100-120 bpm', is_correct: false, order_index: 3 },
          { id: '4', option_text: '120-140 bpm', is_correct: false, order_index: 4 }
        ]
      },
      {
        id: '2',
        exam_id: '1',
        question_text: 'Which of the following is a sign of shock?',
        question_type: 'multiple-choice',
        points: 1,
        difficulty: 'medium',
        order_index: 2,
        options: [
          { id: '5', option_text: 'High blood pressure', is_correct: false, order_index: 1 },
          { id: '6', option_text: 'Rapid pulse and pale skin', is_correct: true, order_index: 2 },
          { id: '7', option_text: 'Slow breathing', is_correct: false, order_index: 3 },
          { id: '8', option_text: 'Increased appetite', is_correct: false, order_index: 4 }
        ]
      },
      {
        id: '3',
        exam_id: '1',
        question_text: 'Hand hygiene should be performed before and after patient contact.',
        question_type: 'true-false',
        points: 1,
        difficulty: 'easy',
        order_index: 3,
        options: [
          { id: '9', option_text: 'True', is_correct: true, order_index: 1 },
          { id: '10', option_text: 'False', is_correct: false, order_index: 2 }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Emergency Response Protocols',
    description: 'Critical emergency response procedures and protocols',
    instructions: 'This exam covers emergency response scenarios. Read each question carefully.',
    category_id: '2',
    duration: 45,
    passing_score: 75,
    max_attempts: 2,
    is_active: true,
    is_published: true,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    allow_review: true,
    created_at: '2024-01-16T10:00:00Z',
    questions: [
      {
        id: '4',
        exam_id: '2',
        question_text: 'What is the first step in CPR?',
        question_type: 'multiple-choice',
        points: 2,
        difficulty: 'medium',
        order_index: 1,
        options: [
          { id: '11', option_text: 'Check for responsiveness', is_correct: true, order_index: 1 },
          { id: '12', option_text: 'Start chest compressions', is_correct: false, order_index: 2 },
          { id: '13', option_text: 'Give rescue breaths', is_correct: false, order_index: 3 },
          { id: '14', option_text: 'Call for help', is_correct: false, order_index: 4 }
        ]
      },
      {
        id: '5',
        exam_id: '2',
        question_text: 'The compression rate for adult CPR should be:',
        question_type: 'multiple-choice',
        points: 2,
        difficulty: 'medium',
        order_index: 2,
        options: [
          { id: '15', option_text: '80-90 per minute', is_correct: false, order_index: 1 },
          { id: '16', option_text: '100-120 per minute', is_correct: true, order_index: 2 },
          { id: '17', option_text: '120-140 per minute', is_correct: false, order_index: 3 },
          { id: '18', option_text: '60-80 per minute', is_correct: false, order_index: 4 }
        ]
      }
    ]
  }
];

export const mockProfiles = [
  {
    id: '53eef30c-d44f-454a-910a-6da30644880b',
    email: 'admin@admin.com',
    name: 'Administrator',
    role: 'admin',
    department: 'Administration',
    employee_id: 'ADMIN-001',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z'
  }
];

export const mockExamAttempts = [
  {
    id: '1',
    exam_id: '1',
    user_id: '53eef30c-d44f-454a-910a-6da30644880b',
    attempt_number: 1,
    status: 'completed',
    score: 85.5,
    percentage: 85.5,
    total_questions: 3,
    correct_answers: 3,
    time_spent: 1200,
    started_at: '2024-01-20T14:00:00Z',
    completed_at: '2024-01-20T14:20:00Z',
    created_at: '2024-01-20T14:00:00Z'
  }
];

export const mockCertificates = [
  {
    id: '1',
    certificate_number: 'AGHEP-2024-001',
    user_id: '53eef30c-d44f-454a-910a-6da30644880b',
    exam_id: '1',
    attempt_id: '1',
    template_id: 'default',
    score: 85.5,
    percentage: 85.5,
    grade_text: 'Excellent',
    issued_date: '2024-01-20T14:20:00Z',
    is_valid: true,
    verification_code: 'VER-2024-001',
    created_at: '2024-01-20T14:20:00Z'
  }
];