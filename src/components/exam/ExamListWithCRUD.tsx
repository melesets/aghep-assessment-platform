import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, BookOpen, Award, Settings, BarChart3, Stethoscope, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { dataManager } from '../../lib/dataManager';

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  passing_score: number;
  questions?: any[];
  is_published: boolean;
  is_active: boolean;
}

export const ExamListWithCRUD: React.FC = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newExam, setNewExam] = useState({
    title: '',
    description: '',
    duration: 30,
    passing_score: 70
  });

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    setLoading(true);
    try {
      const { data, error } = await dataManager.getExams();
      if (!error && data) {
        setExams(data.filter((exam: any) => exam.is_published && exam.is_active));
        console.log('✅ Loaded exams from data manager:', data.length);
      }
    } catch (error) {
      console.error('Error loading exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await dataManager.createExam({
        ...newExam,
        is_published: true,
        is_active: true,
        category_id: '1', // Default category
        max_attempts: 3,
        shuffle_questions: false,
        shuffle_options: false,
        show_results_immediately: true,
        allow_review: true
      });
      
      if (!error && data) {
        console.log('✅ Exam created:', data);
        await loadExams(); // Reload exams
        setShowCreateForm(false);
        setNewExam({ title: '', description: '', duration: 30, passing_score: 70 });
      }
    } catch (error) {
      console.error('Error creating exam:', error);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    
    try {
      const { error } = await dataManager.deleteExam(examId);
      if (!error) {
        console.log('✅ Exam deleted');
        await loadExams(); // Reload exams
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };

  const isAdmin = auth.user?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => navigate('/admin')} 
                  variant="outline"
                  className="px-8 py-3"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
                <Button 
                  onClick={() => setShowCreateForm(true)} 
                  className="px-8 py-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Exam
                </Button>
              </div>
            </div>
          )}

          {/* Create Exam Form */}
          {showCreateForm && isAdmin && (
            <Card className="mb-8 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Create New Exam</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateExam} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exam Title
                    </label>
                    <input
                      type="text"
                      value={newExam.title}
                      onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newExam.description}
                      onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={newExam.duration}
                        onChange={(e) => setNewExam({ ...newExam, duration: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Passing Score (%)
                      </label>
                      <input
                        type="number"
                        value={newExam.passing_score}
                        onChange={(e) => setNewExam({ ...newExam, passing_score: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        max="100"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Create Exam
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Exams Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Available Exams</h2>
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
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteExam(exam.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{exam.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                      <span>{exam.questions?.length || 0} questions</span>
                      <span>{exam.passing_score}% to pass</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};