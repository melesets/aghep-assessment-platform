import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, BookOpen, Award, Settings, BarChart3, Stethoscope, Database, HardDrive } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  questions?: any[];
  source?: 'database' | 'localStorage';
}

export const ExamListUpdated: React.FC = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExamsFromAllSources();
  }, []);

  const loadExamsFromAllSources = async () => {
    try {
      console.log('🔍 Loading exams from multiple sources...');
      
      // Load from Supabase database
      const { data: examsData, error: examsError } = await supabase
        .from('exams')
        .select(`
          id,
          title,
          description,
          duration,
          passing_score,
          is_published,
          is_active,
          questions (id)
        `)
        .eq('is_published', true)
        .eq('is_active', true);

      let databaseExams: Exam[] = [];
      
      if (examsError) {
        console.error('❌ Error loading exams from database:', examsError);
      } else if (examsData) {
        databaseExams = examsData.map((exam: any) => ({
          id: exam.id,
          title: exam.title,
          description: exam.description || 'Professional assessment exam',
          duration: exam.duration,
          totalQuestions: exam.questions?.length || 0,
          passingScore: exam.passing_score,
          source: 'database' as const
        }));
        console.log('✅ Loaded exams from database:', databaseExams.length);
      }

      // Load from localStorage (for backward compatibility and QuestionBuilder saves)
      const savedExams = JSON.parse(localStorage.getItem('saved-exams') || '[]');
      const localStorageExams: Exam[] = savedExams.map((exam: any) => ({
        id: exam.id,
        title: exam.title,
        description: exam.description || 'Professional assessment exam',
        duration: exam.settings?.timeLimit || 60,
        totalQuestions: exam.questions?.length || 0,
        passingScore: exam.settings?.passingScore || 70,
        questions: exam.questions,
        source: 'localStorage' as const
      }));

      console.log('✅ Loaded exams from localStorage:', localStorageExams.length);

      // Combine both sources, avoiding duplicates (database takes priority)
      const allExams = [...databaseExams];
      localStorageExams.forEach(localExam => {
        if (!allExams.find(dbExam => dbExam.id === localExam.id)) {
          allExams.push(localExam);
        }
      });

      console.log('✅ Total exams loaded:', allExams.length);
      setExams(allExams);
    } catch (error) {
      console.error('❌ Error loading exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = auth.user?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exams from all sources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Modern Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Adare General Hospital
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Professional Assessment & Certification Platform
            </p>
            <div className="flex justify-center items-center gap-2 text-sm text-gray-500 mb-12">
              <span>Powered by HSQD</span>
              <span>•</span>
              <span>Health Sector Quality Directorate</span>
            </div>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Exams */}
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Certification Exams</h3>
                <p className="text-gray-600 mb-6">Take professional assessments and earn certificates</p>
                <div className="text-sm text-gray-500">
                  {exams.length} Available Exams
                </div>
              </CardContent>
            </Card>

            {/* Records */}
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white" onClick={() => navigate('/records')}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Assessment Records</h3>
                <p className="text-gray-600 mb-6">View analytics and track your progress</p>
                <div className="text-sm text-gray-500">
                  Performance Analytics
                </div>
              </CardContent>
            </Card>

            {/* Skill Lab */}
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white" onClick={() => navigate('/skill-lab')}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                  <Stethoscope className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Skill Laboratory</h3>
                <p className="text-gray-600 mb-6">Hands-on practical training sessions</p>
                <div className="text-sm text-gray-500">
                  4 Active Sessions
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Panel */}
          {isAdmin && (
            <div className="text-center mb-16">
              <Button 
                onClick={() => navigate('/admin')} 
                variant="outline"
                className="px-8 py-3"
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            </div>
          )}

          {/* Exams Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Available Exams
              <span className="block text-sm font-normal text-gray-600 mt-2">
                📊 Loaded from Database & Question Builder
              </span>
            </h2>
            
            {exams.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Exams Available</h3>
                <p className="text-gray-600 mb-4">No published exams found.</p>
                {isAdmin && (
                  <div className="space-y-2">
                    <Button onClick={() => navigate('/admin/question-builder')}>
                      Create Exam with Question Builder
                    </Button>
                    <div className="text-sm text-gray-500">
                      or use the <button onClick={() => navigate('/admin')} className="text-blue-600 hover:underline">Admin Panel</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {exams.map((exam) => (
                  <Card key={exam.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Award className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {exam.duration} min
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                            exam.source === 'database' 
                              ? 'text-green-600 bg-green-50' 
                              : 'text-blue-600 bg-blue-50'
                          }`}>
                            {exam.source === 'database' ? (
                              <>
                                <Database className="h-3 w-3" />
                                DB
                              </>
                            ) : (
                              <>
                                <HardDrive className="h-3 w-3" />
                                QB
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{exam.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                        <span>{exam.totalQuestions} questions</span>
                        <span>{exam.passingScore}% to pass</span>
                      </div>

                      <Button 
                        className="w-full"
                        onClick={() => navigate(`/exam/${exam.id}`)}
                      >
                        Start Exam
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Source Legend */}
          {exams.length > 0 && (
            <div className="text-center">
              <div className="inline-flex items-center gap-6 text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-1">
                  <Database className="h-3 w-3 text-green-600" />
                  <span>DB = Database Exam</span>
                </div>
                <div className="flex items-center gap-1">
                  <HardDrive className="h-3 w-3 text-blue-600" />
                  <span>QB = Question Builder Exam</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamListUpdated;