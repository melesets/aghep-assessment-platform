import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserInfoForm } from './UserInfoForm';
import { ExamTaking } from './ExamTaking';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, Users, Award, AlertCircle, CheckCircle } from 'lucide-react';
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

interface ExamData {
  id: string;
  title: string;
  duration: number;
  questions: any[];
  passingScore: number;
  description?: string;
}

const mockExamData: Record<string, ExamData> = {
  '1': {
    id: '1',
    title: 'Basic Life Support (BLS)',
    duration: 30,
    passingScore: 80,
    description: 'Essential life-saving techniques including CPR, AED usage, and emergency response protocols.',
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
    description: 'Comprehensive first aid training covering wound care, burns, fractures, and emergency medical situations.',
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
    description: 'Fire prevention, evacuation procedures, and proper use of fire safety equipment.',
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

export const ExamStartUpdated: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExam = async () => {
      if (!examId) {
        navigate('/');
        return;
      }

      console.log('🔍 Loading exam for start page:', examId);

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
            description: examData.description || 'Professional assessment exam',
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
          description: localExam.description || 'Professional assessment exam',
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
        console.log('✅ Loaded exam from localStorage:', formattedExam.title);
        setLoading(false);
        return;
      }

      // Finally, try mock data
      const mockExam = mockExamData[examId];
      if (mockExam) {
        setExamData(mockExam);
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

  const handleStartExam = () => {
    setShowUserForm(true);
  };

  const handleUserInfoSubmit = (info: UserInfo) => {
    setUserInfo(info);
    setShowUserForm(false);
  };

  const handleCancelUserForm = () => {
    setShowUserForm(false);
  };

  const handleBackToExamList = () => {
    navigate('/');
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
        <Button onClick={handleBackToExamList}>Back to Exams</Button>
      </div>
    );
  }

  // If user info is collected and form is not showing, start the exam
  if (userInfo && !showUserForm) {
    return <ExamTaking userInfo={userInfo} />;
  }

  // Show user info form
  if (showUserForm) {
    return (
      <UserInfoForm
        examTitle={examData.title}
        onSubmit={handleUserInfoSubmit}
        onCancel={handleCancelUserForm}
      />
    );
  }

  // Show exam overview and start button
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{examData.title}</h1>
        <p className="text-gray-600 text-lg">Assessment Overview</p>
      </div>

      {/* Exam Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Exam Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {examData.description && (
            <p className="text-gray-700">{examData.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
              <div>
                <div className="font-semibold text-gray-900">{examData.duration} minutes</div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
              <div>
                <div className="font-semibold text-gray-900">{examData.questions.length} questions</div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600" />
              <div>
                <div className="font-semibold text-gray-900">{examData.passingScore}%</div>
                <div className="text-sm text-gray-600">Passing Score</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Important Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600 mt-0.5">1.</span>
              <span>You will need to provide your personal information before starting the exam for certificate generation.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600 mt-0.5">2.</span>
              <span>Once you start the exam, the timer will begin and cannot be paused.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600 mt-0.5">3.</span>
              <span>You must achieve at least {examData.passingScore}% to pass and receive a certificate.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600 mt-0.5">4.</span>
              <span>Make sure you have a stable internet connection throughout the exam.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600 mt-0.5">5.</span>
              <span>Your answers are automatically saved as you progress through the exam.</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={handleBackToExamList} variant="outline" className="flex-1">
          Back to Exams
        </Button>
        <Button onClick={handleStartExam} className="flex-1">
          Start Exam
        </Button>
      </div>
    </div>
  );
};

export default ExamStartUpdated;