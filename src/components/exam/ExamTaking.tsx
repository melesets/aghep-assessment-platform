import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';

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

export const ExamTaking: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (examId) {
      let exam = mockExamData[examId];
      
      // If not found in default exams, check custom exams
      if (!exam) {
        const customExams = JSON.parse(localStorage.getItem('custom-exams') || '[]');
        exam = customExams.find((e: any) => e.id === examId);
      }
      
      if (exam) {
        setExamData(exam);
        setTimeRemaining(exam.duration * 60); // Convert minutes to seconds
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
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
      completedAt: new Date().toISOString()
    }));

    navigate(`/results/${resultId}`);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!examData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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