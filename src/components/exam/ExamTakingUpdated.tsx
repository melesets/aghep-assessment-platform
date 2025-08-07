import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface UserInfo {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  licenseNumber?: string;
  hospitalId: string;
  organization: string;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ExamData {
  id: string;
  title: string;
  duration: number;
  questions: Question[];
  passingScore: number;
}

const mockExamData: Record<string, ExamData> = {
  '1': {
    id: '1',
    title: 'Basic Life Support (BLS)',
    duration: 30,
    passingScore: 80,
    questions: [
      {
        id: '1',
        question: 'What is the correct compression rate for adult CPR?',
        options: ['80-100 per minute', '100-120 per minute', '120-140 per minute', '60-80 per minute'],
        correctAnswer: 1
      },
      {
        id: '2',
        question: 'How deep should chest compressions be for an adult?',
        options: ['1-2 inches', '2-2.4 inches', '3-4 inches', '1 inch'],
        correctAnswer: 1
      },
      {
        id: '3',
        question: 'What is the ratio of compressions to breaths in adult CPR?',
        options: ['15:2', '30:2', '20:2', '25:2'],
        correctAnswer: 1
      },
      {
        id: '4',
        question: 'When should you use an AED?',
        options: ['Only on conscious patients', 'On any unresponsive person', 'Only when trained medical personnel arrive', 'On unresponsive patients with no pulse'],
        correctAnswer: 3
      },
      {
        id: '5',
        question: 'What should you do if someone is choking and can still cough?',
        options: ['Perform back blows immediately', 'Encourage them to keep coughing', 'Start abdominal thrusts', 'Call 911 immediately'],
        correctAnswer: 1
      }
    ]
  },
  '2': {
    id: '2',
    title: 'First Aid Certification',
    duration: 25,
    passingScore: 75,
    questions: [
      {
        id: '1',
        question: 'What is the first step in treating a burn?',
        options: ['Apply ice', 'Remove clothing', 'Cool with water', 'Apply ointment'],
        correctAnswer: 2
      },
      {
        id: '2',
        question: 'How should you treat a nosebleed?',
        options: ['Tilt head back', 'Lean forward and pinch nose', 'Lie down flat', 'Apply ice to forehead'],
        correctAnswer: 1
      },
      {
        id: '3',
        question: 'What are signs of shock?',
        options: ['High fever', 'Rapid pulse and pale skin', 'Slow breathing', 'High blood pressure'],
        correctAnswer: 1
      }
    ]
  },
  '3': {
    id: '3',
    title: 'Fire Safety Training',
    duration: 20,
    passingScore: 70,
    questions: [
      {
        id: '1',
        question: 'What does PASS stand for in fire extinguisher use?',
        options: ['Pull, Aim, Squeeze, Sweep', 'Push, Aim, Spray, Stop', 'Pull, Alert, Squeeze, Spray', 'Point, Aim, Squeeze, Sweep'],
        correctAnswer: 0
      },
      {
        id: '2',
        question: 'What type of fire extinguisher is used for electrical fires?',
        options: ['Class A', 'Class B', 'Class C', 'Class D'],
        correctAnswer: 2
      }
    ]
  }
};

interface ExamTakingProps {
  userInfo?: UserInfo;
}

export const ExamTakingUpdated: React.FC<ExamTakingProps> = ({ userInfo }) => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExam = async () => {
      if (!examId) {
        navigate('/');
        return;
      }

      console.log('🔍 Loading exam:', examId);

      // First try to load from database
      try {
        const { data: examData, error } = await supabase
          .from('exams')
          .select(`
            id,
            title,
            description,
            duration,
            passing_score,
            questions (
              id,
              question_text,
              question_type,
              options,
              correct_answer,
              points,
              order_index,
              explanation
            )
          `)
          .eq('id', examId)
          .eq('is_published', true)
          .eq('is_active', true)
          .single();

        if (!error && examData && examData.questions?.length > 0) {
          // Format database exam data
          const formattedExam: ExamData = {
            id: examData.id,
            title: examData.title,
            duration: examData.duration,
            passingScore: examData.passing_score,
            questions: examData.questions
              .sort((a: any, b: any) => a.order_index - b.order_index)
              .map((q: any) => {
                const options = JSON.parse(q.options || '[]');
                return {
                  id: q.id,
                  question: q.question_text,
                  options: options.map((opt: any) => opt.text || opt),
                  correctAnswer: options.findIndex((opt: any) => opt.isCorrect === true)
                };
              })
          };

          setExamData(formattedExam);
          setTimeRemaining(formattedExam.duration * 60);
          console.log('✅ Loaded exam from database:', formattedExam.title);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('❌ Error loading exam from database:', error);
      }

      // If not found in database, try localStorage (Question Builder exams)
      const savedExams = JSON.parse(localStorage.getItem('saved-exams') || '[]');
      const localExam = savedExams.find((e: any) => e.id === examId);
      
      if (localExam && localExam.questions?.length > 0) {
        const formattedExam: ExamData = {
          id: localExam.id,
          title: localExam.title,
          duration: localExam.settings?.timeLimit || 60,
          passingScore: localExam.settings?.passingScore || 70,
          questions: localExam.questions.map((q: any) => ({
            id: q.id,
            question: q.title,
            options: q.options?.map((opt: any) => opt.text) || [],
            correctAnswer: q.options?.findIndex((opt: any) => opt.isCorrect) || 0
          }))
        };

        setExamData(formattedExam);
        setTimeRemaining(formattedExam.duration * 60);
        console.log('✅ Loaded exam from localStorage:', formattedExam.title);
        setLoading(false);
        return;
      }

      // Finally, try mock data
      const mockExam = mockExamData[examId];
      if (mockExam) {
        setExamData(mockExam);
        setTimeRemaining(mockExam.duration * 60);
        console.log('✅ Loaded mock exam:', mockExam.title);
        setLoading(false);
        return;
      }

      // If no exam found anywhere, redirect to home
      console.log('❌ Exam not found:', examId);
      setLoading(false);
      navigate('/');
    };

    loadExam();
  }, [examId, navigate]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && examData) {
      handleSubmitExam();
    }
  }, [timeRemaining, examData]);

  const handleAnswerChange = (questionId: string, answer: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitExam = async () => {
    if (!examData) return;

    setIsSubmitting(true);
    
    // Calculate score
    let correctAnswers = 0;
    examData.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const percentage = Math.round((correctAnswers / examData.questions.length) * 100);
    const passed = percentage >= examData.passingScore;

    // Store results and navigate
    const resultId = Date.now().toString();
    localStorage.setItem(`exam-result-${resultId}`, JSON.stringify({
      examId: examData.id,
      examTitle: examData.title,
      answers,
      correctAnswers,
      totalQuestions: examData.questions.length,
      percentage,
      passed,
      completedAt: new Date().toISOString(),
      userInfo: userInfo // Store user information with results
    }));

    navigate(`/results/${resultId}`);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Exam not found</h2>
        <p className="text-gray-600 mb-4">The exam you're looking for could not be found.</p>
        <Button onClick={() => navigate('/')}>
          Back to Exams
        </Button>
      </div>
    );
  }

  const currentQuestion = examData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / examData.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{examData.title}</h1>
          <p className="text-gray-600">
            Question {currentQuestionIndex + 1} of {examData.questions.length}
          </p>
        </div>
        <div className="flex items-center gap-2 text-lg font-mono">
          <Clock className="h-5 w-5" />
          <span className={timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Question {currentQuestionIndex + 1}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">{currentQuestion.question}</p>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 border">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={index}
                  checked={answers[currentQuestion.id] === index}
                  onChange={() => handleAnswerChange(currentQuestion.id, index)}
                  className="h-4 w-4 text-blue-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="text-sm text-gray-600">
          {Object.keys(answers).length} of {examData.questions.length} answered
        </div>

        {currentQuestionIndex === examData.questions.length - 1 ? (
          <Button onClick={handleSubmitExam} loading={isSubmitting}>
            Submit Exam
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestionIndex(prev => Math.min(examData.questions.length - 1, prev + 1))}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExamTakingUpdated;