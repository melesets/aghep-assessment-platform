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
  AlertCircle,
  Target,
  Users,
  Star,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ProfessionalDashboard: React.FC = () => {
  const { auth } = useAuth();
  const [stats, setStats] = useState({
    totalCertifications: 0,
    completedCertifications: 0,
    certificates: 0,
    totalCEUs: 0,
    avgScore: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingCertifications, setUpcomingCertifications] = useState<any[]>([]);
  const [ceuProgress, setCeuProgress] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setStats({
      totalCertifications: 8,
      completedCertifications: 5,
      certificates: 4,
      totalCEUs: 47,
      avgScore: 88,
    });

    setRecentActivity([
      {
        id: '1',
        type: 'certification',
        title: 'Emergency Medicine Certification',
        score: 92,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        passed: true,
        ceus: 15,
      },
      {
        id: '2',
        type: 'certificate',
        title: 'Nursing Excellence Certificate',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        ceus: 12,
      },
      {
        id: '3',
        type: 'certification',
        title: 'Laboratory Quality Assurance',
        score: 85,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        passed: true,
        ceus: 10,
      },
    ]);

    setUpcomingCertifications([
      {
        id: '1',
        title: 'Pharmacy Clinical Practice',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        duration: 150,
        ceus: 20,
        level: 'Expert',
      },
      {
        id: '2',
        title: 'Radiology Imaging Interpretation',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        duration: 135,
        ceus: 18,
        level: 'Advanced',
      },
    ]);

    setCeuProgress([
      { name: 'Completed', value: 47, color: '#10B981' },
      { name: 'Remaining', value: 53, color: '#E5E7EB' },
    ]);

    setPerformanceData([
      { month: 'Jan', score: 85, ceus: 12 },
      { month: 'Feb', score: 88, ceus: 15 },
      { month: 'Mar', score: 92, ceus: 10 },
      { month: 'Apr', score: 87, ceus: 10 },
    ]);
  }, []);

  const COLORS = ['#10B981', '#E5E7EB'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {auth.user?.name}!
          </h1>
          <p className="text-gray-600">
            {auth.user?.department} - {auth.user?.position}
          </p>
          {auth.user?.licenseNumber && (
            <p className="text-sm text-gray-500">
              License: {auth.user.licenseNumber}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{stats.totalCEUs}</div>
          <div className="text-sm text-gray-500">CEUs Earned</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Certifications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCertifications}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.completedCertifications}</p>
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
                <p className="text-sm font-medium text-gray-600">CEU Credits</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCEUs}</p>
              </div>
              <Star className="h-8 w-8 text-purple-600" />
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
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CEU Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Annual CEU Progress</CardTitle>
            <p className="text-sm text-gray-600">Target: 100 CEUs per year</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={ceuProgress}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ceuProgress.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <div className="text-2xl font-bold text-green-600">47%</div>
              <div className="text-sm text-gray-500">of annual target</div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3B82F6" name="Avg Score %" />
                <Bar dataKey="ceus" fill="#10B981" name="CEUs Earned" />
              </BarChart>
            </ResponsiveContainer>
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
                    activity.type === 'certification' 
                      ? 'bg-blue-100' 
                      : 'bg-yellow-100'
                  }`}>
                    {activity.type === 'certification' ? (
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Award className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      {activity.score && (
                        <>
                          <span>Score: {activity.score}%</span>
                          <Badge 
                            variant={activity.passed ? 'success' : 'danger'}
                            className="text-xs"
                          >
                            {activity.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </>
                      )}
                      <span>•</span>
                      <span>{activity.ceus} CEUs</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {activity.date.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Certifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Certifications</CardTitle>
              <Link to="/certifications">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingCertifications.map((cert) => (
                <div key={cert.id} className="flex items-center space-x-4">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Calendar className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{cert.title}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{cert.duration} minutes</span>
                      <span>•</span>
                      <span>{cert.ceus} CEUs</span>
                      <Badge variant="outline" className="text-xs">
                        {cert.level}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {cert.date.toLocaleDateString()}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/certifications">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                <BookOpen className="h-6 w-6" />
                <span>Browse Certifications</span>
              </Button>
            </Link>
            <Link to="/certificates">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                <Award className="h-6 w-6" />
                <span>My Certificates</span>
              </Button>
            </Link>
            <Link to="/ceu-tracker">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                <Target className="h-6 w-6" />
                <span>CEU Tracker</span>
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span>My Profile</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Professional Development Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Professional Development Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-medium text-blue-900">Complete 100 CEUs this year</h4>
                <p className="text-sm text-blue-700">Progress: 47/100 CEUs</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">47%</div>
                <div className="w-24 bg-blue-200 rounded-full h-2 mt-1">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '47%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <h4 className="font-medium text-green-900">Achieve Expert Level in Emergency Medicine</h4>
                <p className="text-sm text-green-700">Next: Pharmacy Clinical Practice</p>
              </div>
              <div className="text-right">
                <Badge variant="success">On Track</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};