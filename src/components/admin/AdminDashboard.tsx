import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Upload, Edit, FileText, Settings, Plus, Cog, Users, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  activeExams: number;
  totalQuestions: number;
  certificatesIssued: number;
  averageScore: number;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    activeExams: 0,
    totalQuestions: 0,
    certificatesIssued: 0,
    averageScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      console.log('🔍 Loading admin dashboard statistics...');

      // Get active exams count
      const { data: examsData, error: examsError } = await supabase
        .from('exams')
        .select('id')
        .eq('is_active', true)
        .eq('is_published', true);

      // Get total questions count
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('id');

      // Get certificates issued count
      const { data: certificatesData, error: certificatesError } = await supabase
        .from('certificates')
        .select('id')
        .eq('is_valid', true);

      // Get average score from exam attempts
      const { data: attemptsData, error: attemptsError } = await supabase
        .from('exam_attempts')
        .select('percentage')
        .eq('status', 'completed')
        .not('percentage', 'is', null);

      // Calculate average score
      let averageScore = 0;
      if (attemptsData && attemptsData.length > 0) {
        const totalScore = attemptsData.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0);
        averageScore = Math.round(totalScore / attemptsData.length);
      }

      const newStats: DashboardStats = {
        activeExams: examsData?.length || 0,
        totalQuestions: questionsData?.length || 0,
        certificatesIssued: certificatesData?.length || 0,
        averageScore: averageScore
      };

      console.log('✅ Dashboard stats loaded:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('❌ Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminFeatures = [
    {
      title: 'User Management',
      description: 'Create and manage user accounts',
      icon: Users,
      path: '/admin/users',
      color: 'bg-red-500'
    },
    {
      title: 'Activity Logs',
      description: 'Monitor system activity and user actions',
      icon: Activity,
      path: '/admin/logs',
      color: 'bg-yellow-500'
    },
    {
      title: 'Upload Questions',
      description: 'Upload exam questions via CSV file',
      icon: Upload,
      path: '/admin/upload',
      color: 'bg-blue-500'
    },
    {
      title: 'Question Builder',
      description: 'Create questions with Google Forms-like interface',
      icon: Plus,
      path: '/admin/question-builder',
      color: 'bg-indigo-500'
    },
    {
      title: 'Edit Exams',
      description: 'Edit existing exams and questions',
      icon: Edit,
      path: '/admin/edit',
      color: 'bg-green-500'
    },
    {
      title: 'Exam Settings',
      description: 'Configure advanced exam settings and features',
      icon: Cog,
      path: '/admin/exam-settings',
      color: 'bg-orange-500'
    },
    {
      title: 'Certificate Settings',
      description: 'Customize certificate templates with modern designs',
      icon: FileText,
      path: '/admin/certificates',
      color: 'bg-purple-500'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences and global settings',
      icon: Settings,
      path: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage exams, questions, certificates, and system settings

        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={feature.path} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(feature.path)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${feature.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4 text-center">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">{stats.activeExams}</div>
                <div className="text-sm text-gray-600">Active Exams</div>
                <div className="text-xs text-green-600 mt-1">📊 From DB</div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">{stats.totalQuestions}</div>
                <div className="text-sm text-gray-600">Total Questions</div>
                <div className="text-xs text-green-600 mt-1">📊 From DB</div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-purple-600">{stats.certificatesIssued}</div>
                <div className="text-sm text-gray-600">Certificates Issued</div>
                <div className="text-xs text-green-600 mt-1">📊 From DB</div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.averageScore > 0 ? `${stats.averageScore}%` : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
                <div className="text-xs text-green-600 mt-1">📊 From DB</div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Empty State Message */}
      {!loading && stats.activeExams === 0 && (
        <Card className="mt-6">
          <CardContent className="p-6 text-center">
            <div className="text-gray-500 mb-4">
              <Plus className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Yet</h3>
              <p className="text-gray-600">
                Statistics will appear as you create exams and students take assessments.
              </p>
            </div>
            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg max-w-md mx-auto">
              <p className="font-medium mb-2">To see statistics:</p>
              <ul className="text-left space-y-1">
                <li>• Create exams and questions</li>
                <li>• Students take and complete exams</li>
                <li>• Certificates are generated</li>
                <li>• Real statistics will appear here</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
