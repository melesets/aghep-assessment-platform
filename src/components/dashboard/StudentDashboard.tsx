import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { auth } = useAuth();
  const [stats, setStats] = useState({
    totalExams: 0,
    completedExams: 0,
    certificates: 0,
    avgScore: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<any[]>([]);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setStats({
      totalExams: 5,
      completedExams: 3,
      certificates: 2,
      avgScore: 85,
    });

    setRecentActivity([
      {
        id: '1',
        type: 'exam',
        title: 'JavaScript Fundamentals',
        score: 85,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        passed: true,
      },
      {
        id: '2',
        type: 'certificate',
        title: 'React Development Certificate',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ]);

    setUpcomingExams([
      {
        id: '1',
        title: 'Advanced TypeScript',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        duration: 90,
      },
      {
        id: '2',
        title: 'Node.js Backend',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        duration: 120,
      },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {auth.user?.name}!
          </h1>
          <p className="text-gray-600">Track your progress and continue learning</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalExams}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedExams}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.certificates}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'exam' 
                      ? 'bg-blue-100' 
                      : 'bg-yellow-100'
                  }`}>
                    {activity.type === 'exam' ? (
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Award className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">
                      {activity.score && (
                        <>
                          Score: {activity.score}% • 
                          <Badge 
                            variant={activity.passed ? 'success' : 'danger'}
                            className="ml-1"
                          >
                            {activity.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {activity.date.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Exams</CardTitle>
              <Link to="/exams">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="flex items-center space-x-4">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Calendar className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{exam.title}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{exam.duration} minutes</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {exam.date.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/exams">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                <BookOpen className="h-6 w-6" />
                <span>Browse Exams</span>
              </Button>
            </Link>
            <Link to="/certificates">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                <Award className="h-6 w-6" />
                <span>My Certificates</span>
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span>View Progress</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};