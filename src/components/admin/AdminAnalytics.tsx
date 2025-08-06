import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Award, Calendar, Download, Filter } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', exams: 45, certifications: 38, professionals: 12 },
  { month: 'Feb', exams: 52, certifications: 44, professionals: 15 },
  { month: 'Mar', exams: 48, certifications: 41, professionals: 8 },
  { month: 'Apr', exams: 61, certifications: 55, professionals: 18 },
  { month: 'May', exams: 55, certifications: 48, professionals: 14 },
  { month: 'Jun', exams: 67, certifications: 59, professionals: 22 },
];

const departmentData = [
  { name: 'Emergency Medicine', value: 35, color: '#3B82F6' },
  { name: 'Cardiology', value: 25, color: '#10B981' },
  { name: 'Pediatrics', value: 20, color: '#F59E0B' },
  { name: 'Surgery', value: 15, color: '#EF4444' },
  { name: 'Radiology', value: 5, color: '#8B5CF6' },
];

const certificationPerformance = [
  { name: 'BLS', attempts: 120, passed: 108, passRate: 90 },
  { name: 'ACLS', attempts: 85, passed: 72, passRate: 85 },
  { name: 'PALS', attempts: 65, passed: 58, passRate: 89 },
  { name: 'Infection Control', attempts: 45, passed: 41, passRate: 91 },
];

const recentActivity = [
  { id: 1, action: 'New certification completed', user: 'Dr. Sarah Johnson', time: '2 hours ago', type: 'success' },
  { id: 2, action: 'Exam failed - retry required', user: 'Dr. Michael Chen', time: '4 hours ago', type: 'warning' },
  { id: 3, action: 'New professional registered', user: 'Dr. Emily Rodriguez', time: '6 hours ago', type: 'info' },
  { id: 4, action: 'Certificate expired', user: 'Dr. James Wilson', time: '1 day ago', type: 'error' },
  { id: 5, action: 'Exam completed successfully', user: 'Dr. Lisa Thompson', time: '1 day ago', type: 'success' },
];

export const AdminAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6months');

  const totalExams = monthlyData.reduce((sum, month) => sum + month.exams, 0);
  const totalCertifications = monthlyData.reduce((sum, month) => sum + month.certifications, 0);
  const averagePassRate = certificationPerformance.reduce((sum, cert) => sum + cert.passRate, 0) / certificationPerformance.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor performance and track key metrics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">{totalExams}</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last period
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certifications Issued</p>
                <p className="text-2xl font-bold text-gray-900">{totalCertifications}</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +8% from last period
                </p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Pass Rate</p>
                <p className="text-2xl font-bold text-gray-900">{averagePassRate.toFixed(1)}%</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +2.3% from last period
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Professionals</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +5 new this month
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="exams" stroke="#3B82F6" strokeWidth={2} name="Exams" />
                <Line type="monotone" dataKey="certifications" stroke="#10B981" strokeWidth={2} name="Certifications" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Certifications by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certification Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Certification Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={certificationPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attempts" fill="#E5E7EB" name="Attempts" />
                <Bar dataKey="passed" fill="#10B981" name="Passed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.user}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Certification Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Certification</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Total Attempts</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Passed</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Failed</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Pass Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Trend</th>
                </tr>
              </thead>
              <tbody>
                {certificationPerformance.map((cert) => (
                  <tr key={cert.name} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{cert.name}</td>
                    <td className="py-3 px-4 text-gray-600">{cert.attempts}</td>
                    <td className="py-3 px-4 text-green-600">{cert.passed}</td>
                    <td className="py-3 px-4 text-red-600">{cert.attempts - cert.passed}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        cert.passRate >= 90 ? 'text-green-600' :
                        cert.passRate >= 80 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {cert.passRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">+2.1%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};