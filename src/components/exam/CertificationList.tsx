import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Award,
  Search,
  Filter,
  BookOpen,
  Stethoscope,
  Heart,
  Brain,
  Zap
} from 'lucide-react';
import { Exam, ExamAttempt } from '../../types/exam';
import { format } from 'date-fns';

export const CertificationList: React.FC = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockExams: Exam[] = [
      {
        id: '1',
        title: 'Emergency Medicine Certification',
        description: 'Comprehensive certification covering emergency medical procedures, trauma care, and critical patient management.',
        category: 'emergency',
        level: 'advanced',
        ceuCredits: 15,
        prerequisites: ['Basic Life Support', 'Advanced Cardiac Life Support'],
        duration: 120,
        totalPoints: 200,
        passingScore: 80,
        questions: [],
        settings: {
          shuffleQuestions: true,
          shuffleOptions: true,
          allowRetake: true,
          maxAttempts: 2,
          showResults: true,
          showCorrectAnswers: false,
          requireProctoring: true,
          allowNotes: false,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          antiCheat: {
            detectFocusLoss: true,
            preventCopy: true,
            preventRightClick: true,
            fullScreenMode: true,
            webcamMonitoring: true,
            faceDetection: true,
            screenRecording: false,
          },
        },
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Nursing Excellence in Patient Care',
        description: 'Advanced nursing practices, patient safety protocols, and evidence-based care delivery methods.',
        category: 'nursing',
        level: 'intermediate',
        ceuCredits: 12,
        prerequisites: ['Basic Nursing Fundamentals'],
        duration: 90,
        totalPoints: 150,
        passingScore: 75,
        questions: [],
        settings: {
          shuffleQuestions: true,
          shuffleOptions: true,
          allowRetake: true,
          maxAttempts: 3,
          showResults: true,
          showCorrectAnswers: true,
          requireProctoring: false,
          allowNotes: true,
          startDate: new Date(),
          endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          antiCheat: {
            detectFocusLoss: false,
            preventCopy: false,
            preventRightClick: false,
            fullScreenMode: false,
            webcamMonitoring: false,
            faceDetection: false,
            screenRecording: false,
          },
        },
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        title: 'Pharmacy Clinical Practice',
        description: 'Clinical pharmacy practices, drug interactions, dosage calculations, and pharmaceutical care.',
        category: 'pharmacy',
        level: 'expert',
        ceuCredits: 20,
        prerequisites: ['Pharmacology Basics', 'Clinical Chemistry'],
        duration: 150,
        totalPoints: 250,
        passingScore: 85,
        questions: [],
        settings: {
          shuffleQuestions: true,
          shuffleOptions: true,
          allowRetake: false,
          maxAttempts: 1,
          showResults: true,
          showCorrectAnswers: false,
          requireProctoring: true,
          allowNotes: false,
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          antiCheat: {
            detectFocusLoss: true,
            preventCopy: true,
            preventRightClick: true,
            fullScreenMode: true,
            webcamMonitoring: true,
            faceDetection: true,
            screenRecording: true,
          },
        },
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        title: 'Radiology Imaging Interpretation',
        description: 'Advanced imaging interpretation, radiation safety, and diagnostic accuracy in medical imaging.',
        category: 'radiology',
        level: 'advanced',
        ceuCredits: 18,
        prerequisites: ['Basic Radiology', 'Anatomy & Physiology'],
        duration: 135,
        totalPoints: 220,
        passingScore: 80,
        questions: [],
        settings: {
          shuffleQuestions: true,
          shuffleOptions: true,
          allowRetake: true,
          maxAttempts: 2,
          showResults: true,
          showCorrectAnswers: true,
          requireProctoring: true,
          allowNotes: false,
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          antiCheat: {
            detectFocusLoss: true,
            preventCopy: true,
            preventRightClick: true,
            fullScreenMode: true,
            webcamMonitoring: true,
            faceDetection: true,
            screenRecording: false,
          },
        },
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5',
        title: 'Laboratory Quality Assurance',
        description: 'Laboratory management, quality control procedures, and regulatory compliance in clinical laboratories.',
        category: 'laboratory',
        level: 'intermediate',
        ceuCredits: 10,
        prerequisites: ['Basic Laboratory Techniques'],
        duration: 75,
        totalPoints: 120,
        passingScore: 75,
        questions: [],
        settings: {
          shuffleQuestions: true,
          shuffleOptions: true,
          allowRetake: true,
          maxAttempts: 3,
          showResults: true,
          showCorrectAnswers: true,
          requireProctoring: false,
          allowNotes: true,
          startDate: new Date(),
          endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
          antiCheat: {
            detectFocusLoss: false,
            preventCopy: false,
            preventRightClick: false,
            fullScreenMode: false,
            webcamMonitoring: false,
            faceDetection: false,
            screenRecording: false,
          },
        },
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const mockAttempts: ExamAttempt[] = [
      {
        id: '1',
        examId: '2',
        userId: auth.user?.id || '',
        answers: {},
        startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 75 * 60 * 1000),
        score: 128,
        percentage: 85,
        passed: true,
        timeSpent: 4500,
        flaggedEvents: [],
      },
    ];

    setExams(mockExams);
    setAttempts(mockAttempts);
    setLoading(false);
  }, [auth.user?.id]);

  const getExamStatus = (exam: Exam) => {
    const now = new Date();
    const attempt = attempts.find(a => a.examId === exam.id);
    
    if (attempt) {
      return attempt.passed ? 'completed' : 'failed';
    }
    
    if (exam.settings.startDate && now < exam.settings.startDate) {
      return 'upcoming';
    }
    
    if (exam.settings.endDate && now > exam.settings.endDate) {
      return 'expired';
    }
    
    return 'available';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'failed':
        return <Badge variant="danger">Failed</Badge>;
      case 'upcoming':
        return <Badge variant="secondary">Upcoming</Badge>;
      case 'expired':
        return <Badge variant="outline">Expired</Badge>;
      default:
        return <Badge variant="primary">Available</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency':
        return <Zap className="h-5 w-5 text-red-500" />;
      case 'nursing':
        return <Heart className="h-5 w-5 text-pink-500" />;
      case 'pharmacy':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'radiology':
        return <Brain className="h-5 w-5 text-purple-500" />;
      case 'laboratory':
        return <Stethoscope className="h-5 w-5 text-blue-500" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-orange-100 text-orange-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exam.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || exam.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Professional Certifications</h1>
          <p className="text-gray-600">Advance your career with industry-recognized certifications</p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredExams.length} certification{filteredExams.length !== 1 ? 's' : ''} available
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search certifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="emergency">Emergency Medicine</option>
              <option value="nursing">Nursing</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="radiology">Radiology</option>
              <option value="laboratory">Laboratory</option>
            </select>
            
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Certifications Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredExams.map((exam) => {
          const status = getExamStatus(exam);
          const attempt = attempts.find(a => a.examId === exam.id);
          
          return (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(exam.category)}
                    <div>
                      <CardTitle className="text-lg leading-tight">{exam.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(exam.level)}`}>
                          {exam.level}
                        </span>
                        <Badge variant="secondary">{exam.ceuCredits} CEUs</Badge>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(status)}
                </div>
                <p className="text-gray-600 text-sm mt-2">{exam.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{exam.duration} minutes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{exam.totalPoints} points</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-gray-400" />
                    <span>{exam.passingScore}% to pass</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                    <span>{exam.settings.maxAttempts} attempts</span>
                  </div>
                </div>

                {exam.prerequisites && exam.prerequisites.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Prerequisites:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {exam.prerequisites.map((prereq, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {exam.settings.startDate && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Available: {format(exam.settings.startDate, 'MMM d, yyyy')} - {' '}
                      {exam.settings.endDate ? format(exam.settings.endDate, 'MMM d, yyyy') : 'No end date'}
                    </span>
                  </div>
                )}

                {exam.settings.requireProctoring && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-orange-800 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Proctored Exam</span>
                    </div>
                    <p className="text-xs text-orange-700 mt-1">
                      Webcam monitoring and anti-cheat measures will be active
                    </p>
                  </div>
                )}

                {attempt && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span>Last attempt:</span>
                      <span className={`font-medium ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                        {attempt.percentage}% ({attempt.passed ? 'Passed' : 'Failed'})
                      </span>
                    </div>
                    {attempt.passed && (
                      <div className="flex items-center space-x-1 text-xs text-green-600 mt-1">
                        <Award className="h-3 w-3" />
                        <span>Certificate earned</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4">
                  {status === 'available' && (
                    <Button 
                      className="w-full"
                      onClick={() => navigate(`/exam/${exam.id}`)}
                    >
                      Start Certification
                    </Button>
                  )}
                  {status === 'completed' && (
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate('/certificates')}
                      >
                        View Certificate
                      </Button>
                      {exam.settings.allowRetake && (
                        <Button 
                          variant="secondary" 
                          className="w-full"
                          onClick={() => navigate(`/exam/${exam.id}`)}
                        >
                          Retake Certification
                        </Button>
                      )}
                    </div>
                  )}
                  {status === 'failed' && exam.settings.allowRetake && (
                    <Button 
                      variant="secondary" 
                      className="w-full"
                      onClick={() => navigate(`/exam/${exam.id}`)}
                    >
                      Retake Certification
                    </Button>
                  )}
                  {status === 'upcoming' && (
                    <Button disabled className="w-full">
                      Starts {format(exam.settings.startDate!, 'MMM d, yyyy')}
                    </Button>
                  )}
                  {status === 'expired' && (
                    <Button disabled className="w-full">
                      Certification Expired
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredExams.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No certifications found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or check back later for new certifications.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};