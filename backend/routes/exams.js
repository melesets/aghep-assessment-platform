const express = require('express');
const { query, getClient } = require('../config/database');
const { authenticateToken, requireAdmin, requireInstructor } = require('../middleware/auth');
const { validateExamCreation, validateExamUpdate, validateUUID, validatePagination } = require('../middleware/validation');
const { examLimiter, adminLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// @route   GET /api/exams
// @desc    Get all published exams
// @access  Private
router.get('/', authenticateToken, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    let whereClause = 'WHERE e.is_active = true AND e.is_published = true';
    const queryParams = [];
    let paramCount = 1;

    if (category) {
      whereClause += ` AND c.name ILIKE $${paramCount}`;
      queryParams.push(`%${category}%`);
      paramCount++;
    }

    if (search) {
      whereClause += ` AND (e.title ILIKE $${paramCount} OR e.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    // Get exams with question count
    const examsQuery = `
      SELECT 
        e.id, e.title, e.description, e.duration, e.passing_score, 
        e.max_attempts, e.start_date, e.end_date, e.created_at,
        c.name as category_name, c.color as category_color,
        COUNT(q.id) as total_questions,
        u.name as created_by_name
      FROM exams e
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN questions q ON e.id = q.exam_id
      LEFT JOIN users u ON e.created_by = u.id
      ${whereClause}
      GROUP BY e.id, c.name, c.color, u.name
      ORDER BY e.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);
    const examsResult = await query(examsQuery, queryParams);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT e.id) as total
      FROM exams e
      LEFT JOIN categories c ON e.category_id = c.id
      ${whereClause}
    `;

    const countResult = await query(countQuery, queryParams.slice(0, -2));
    const totalExams = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalExams / limit);

    res.json({
      success: true,
      data: {
        exams: examsResult.rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalExams,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching exams'
    });
  }
});

// @route   GET /api/exams/:id
// @desc    Get exam by ID with questions
// @access  Private
router.get('/:id', authenticateToken, validateUUID, async (req, res) => {
  try {
    const examId = req.params.id;

    // Get exam details
    const examResult = await query(`
      SELECT 
        e.id, e.title, e.description, e.instructions, e.duration, 
        e.passing_score, e.max_attempts, e.shuffle_questions, 
        e.shuffle_options, e.show_results_immediately, e.allow_review,
        e.start_date, e.end_date, e.is_active, e.is_published,
        c.name as category_name, c.color as category_color,
        u.name as created_by_name
      FROM exams e
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN users u ON e.created_by = u.id
      WHERE e.id = $1 AND e.is_active = true
    `, [examId]);

    if (examResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    const exam = examResult.rows[0];

    // Check if exam is published (unless user is admin/instructor)
    if (!exam.is_published && !['admin', 'instructor'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Exam is not available'
      });
    }

    // Check if exam is within date range
    const now = new Date();
    if (exam.start_date && new Date(exam.start_date) > now) {
      return res.status(403).json({
        success: false,
        message: 'Exam has not started yet'
      });
    }

    if (exam.end_date && new Date(exam.end_date) < now) {
      return res.status(403).json({
        success: false,
        message: 'Exam has ended'
      });
    }

    // Get questions with options
    const questionsResult = await query(`
      SELECT 
        q.id, q.question_text, q.question_type, q.points, q.difficulty,
        q.explanation, q.image_url, q.video_url, q.audio_url, 
        q.time_limit, q.order_index, q.is_required,
        json_agg(
          json_build_object(
            'id', qo.id,
            'option_text', qo.option_text,
            'order_index', qo.order_index
          ) ORDER BY qo.order_index
        ) as options
      FROM questions q
      LEFT JOIN question_options qo ON q.id = qo.question_id
      WHERE q.exam_id = $1
      GROUP BY q.id
      ORDER BY q.order_index, q.created_at
    `, [examId]);

    // Shuffle questions if enabled
    let questions = questionsResult.rows;
    if (exam.shuffle_questions) {
      questions = questions.sort(() => Math.random() - 0.5);
    }

    // Shuffle options if enabled
    if (exam.shuffle_options) {
      questions = questions.map(question => ({
        ...question,
        options: question.options ? question.options.sort(() => Math.random() - 0.5) : []
      }));
    }

    // Check user's previous attempts
    const attemptsResult = await query(`
      SELECT COUNT(*) as attempt_count, MAX(score) as best_score
      FROM exam_attempts 
      WHERE exam_id = $1 AND user_id = $2 AND status = 'completed'
    `, [examId, req.user.id]);

    const attemptInfo = attemptsResult.rows[0];
    const attemptCount = parseInt(attemptInfo.attempt_count);
    const canAttempt = attemptCount < exam.max_attempts;

    res.json({
      success: true,
      data: {
        exam: {
          ...exam,
          questions,
          total_questions: questions.length
        },
        attemptInfo: {
          attemptCount,
          maxAttempts: exam.max_attempts,
          canAttempt,
          bestScore: attemptInfo.best_score
        }
      }
    });

  } catch (error) {
    console.error('Get exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching exam'
    });
  }
});

// @route   POST /api/exams/:id/start
// @desc    Start exam attempt
// @access  Private
router.post('/:id/start', authenticateToken, examLimiter, validateUUID, async (req, res) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');

    const examId = req.params.id;
    const userId = req.user.id;

    // Check if exam exists and is available
    const examResult = await client.query(`
      SELECT id, title, max_attempts, is_active, is_published, start_date, end_date
      FROM exams 
      WHERE id = $1
    `, [examId]);

    if (examResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    const exam = examResult.rows[0];

    if (!exam.is_active || !exam.is_published) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        message: 'Exam is not available'
      });
    }

    // Check date restrictions
    const now = new Date();
    if (exam.start_date && new Date(exam.start_date) > now) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        message: 'Exam has not started yet'
      });
    }

    if (exam.end_date && new Date(exam.end_date) < now) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        message: 'Exam has ended'
      });
    }

    // Check if user has exceeded max attempts
    const attemptsResult = await client.query(`
      SELECT COUNT(*) as attempt_count
      FROM exam_attempts 
      WHERE exam_id = $1 AND user_id = $2 AND status IN ('completed', 'in_progress')
    `, [examId, userId]);

    const attemptCount = parseInt(attemptsResult.rows[0].attempt_count);
    if (attemptCount >= exam.max_attempts) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        message: 'Maximum attempts exceeded'
      });
    }

    // Check if user has an active attempt
    const activeAttemptResult = await client.query(`
      SELECT id FROM exam_attempts 
      WHERE exam_id = $1 AND user_id = $2 AND status = 'in_progress'
    `, [examId, userId]);

    if (activeAttemptResult.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'You already have an active attempt for this exam',
        data: {
          attemptId: activeAttemptResult.rows[0].id
        }
      });
    }

    // Get total questions count
    const questionsCountResult = await client.query(`
      SELECT COUNT(*) as total_questions
      FROM questions 
      WHERE exam_id = $1
    `, [examId]);

    const totalQuestions = parseInt(questionsCountResult.rows[0].total_questions);

    // Create new attempt
    const newAttemptResult = await client.query(`
      INSERT INTO exam_attempts (
        exam_id, user_id, attempt_number, status, total_questions,
        ip_address, user_agent
      )
      VALUES ($1, $2, $3, 'in_progress', $4, $5, $6)
      RETURNING id, attempt_number, started_at
    `, [
      examId, 
      userId, 
      attemptCount + 1, 
      totalQuestions,
      req.ip,
      req.get('User-Agent')
    ]);

    await client.query('COMMIT');

    const attempt = newAttemptResult.rows[0];

    res.status(201).json({
      success: true,
      message: 'Exam attempt started successfully',
      data: {
        attemptId: attempt.id,
        attemptNumber: attempt.attempt_number,
        startedAt: attempt.started_at,
        examTitle: exam.title
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Start exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while starting exam'
    });
  } finally {
    client.release();
  }
});

// @route   POST /api/exams
// @desc    Create new exam
// @access  Admin/Instructor
router.post('/', authenticateToken, requireInstructor, adminLimiter, validateExamCreation, async (req, res) => {
  try {
    const {
      title, description, instructions, category_id, duration, passing_score,
      max_attempts, shuffle_questions, shuffle_options, show_results_immediately,
      allow_review, start_date, end_date
    } = req.body;

    const newExamResult = await query(`
      INSERT INTO exams (
        title, description, instructions, category_id, duration, passing_score,
        max_attempts, shuffle_questions, shuffle_options, show_results_immediately,
        allow_review, start_date, end_date, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id, title, description, duration, passing_score, created_at
    `, [
      title, description, instructions, category_id, duration, passing_score,
      max_attempts || 3, shuffle_questions || false, shuffle_options || false,
      show_results_immediately !== false, allow_review !== false,
      start_date, end_date, req.user.id
    ]);

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      data: {
        exam: newExamResult.rows[0]
      }
    });

  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating exam'
    });
  }
});

// @route   PUT /api/exams/:id
// @desc    Update exam
// @access  Admin/Instructor
router.put('/:id', authenticateToken, requireInstructor, adminLimiter, validateUUID, validateExamUpdate, async (req, res) => {
  try {
    const examId = req.params.id;
    const updates = req.body;

    // Check if exam exists
    const examResult = await query('SELECT id, created_by FROM exams WHERE id = $1', [examId]);
    
    if (examResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Check permissions (only admin or creator can update)
    const exam = examResult.rows[0];
    if (req.user.role !== 'admin' && exam.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this exam'
      });
    }

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = [
      'title', 'description', 'instructions', 'category_id', 'duration',
      'passing_score', 'max_attempts', 'shuffle_questions', 'shuffle_options',
      'show_results_immediately', 'allow_review', 'start_date', 'end_date',
      'is_active', 'is_published'
    ];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = $${paramCount}`);
        values.push(updates[field]);
        paramCount++;
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    values.push(examId);
    const updateQuery = `
      UPDATE exams 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING id, title, description, duration, passing_score, is_active, is_published, updated_at
    `;

    const result = await query(updateQuery, values);

    res.json({
      success: true,
      message: 'Exam updated successfully',
      data: {
        exam: result.rows[0]
      }
    });

  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating exam'
    });
  }
});

// @route   DELETE /api/exams/:id
// @desc    Delete exam
// @access  Admin
router.delete('/:id', authenticateToken, requireAdmin, adminLimiter, validateUUID, async (req, res) => {
  try {
    const examId = req.params.id;

    // Check if exam exists
    const examResult = await query('SELECT id, title FROM exams WHERE id = $1', [examId]);
    
    if (examResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Soft delete (set is_active to false)
    await query(
      'UPDATE exams SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [examId]
    );

    res.json({
      success: true,
      message: 'Exam deleted successfully'
    });

  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting exam'
    });
  }
});

module.exports = router;