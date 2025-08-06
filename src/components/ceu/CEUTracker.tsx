import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Target, 
  Calendar, 
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Download
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface CEURecord {
  id: string;
  title: string;
  category: string;
  credits: number;
  completedDate: Date;
  expirationDate?: Date;
  provider: string;
  certificateId?: string;
}

export const CEUTracker: React.FC = () => {
  const { auth } = useAuth();
  const [ceuRecords, setCeuRecords] = useState<CEURecord[]>([]);
  const [yearlyTarget, setYearlyTarget] = useState(100);
  const [currentYear] = useState(new Date().getFullYear());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockRecords: CEURecord[] = [
      {
        id: '1',
        title: 'Emergency Medicine Certification',
        category: 'Emergency Medicine',
        credits: 15,
        completedDate: new Date(2024, 2, 15),
        expirationDate: new Date(2026, 2, 15),
        provider: 'American Board of Emergency Medicine',
        certificateId: 'VERIFY-EM2024-001',
      },
      {
        id: '2',
        title: 'Nursing Excellence in Patient Care',
        category: 'Nursing',
        credits: 12,
        completedDate: new Date(2024, 1, 10),
        expirationDate: new Date(2027, 1, 10),
        provider: 'American Nurses Credentialing Center',
        certificateId: 'VERIFY-NE2024-002',
      },
      {
        id: '3',
        title: 'Laboratory Quality Assurance',
        category: 'Laboratory',
        credits: 10,
        completedDate: new Date(2024, 0, 20),
        expirationDate: new Date(2026, 0, 20),
        provider: 'Clinical Laboratory Management Association',
        certificateId: 'VERIFY-LQ2024-003',
      },
      {
        id: '4',
        title: 'Infection Control Workshop',
        category: 'General',
        credits: 5,
        completedDate: new Date(2023, 11, 5),
        provider: 'Hospital Education Department',
      },
      {
        id: '5',
        title: 'Patient Safety Seminar',
        category: 'General',
        credits: 3,
        completedDate: new Date(2023, 10, 15),
        provider: 'Joint Commission Resources',
      },
    ];

    setCeuRecords(mockRecords);
  }, []);

  const getCurrentYearRecords = () => {
    return ceuRecords.filter(record => 
      record.completedDate.getFullYear().toString() === selectedYear
    );
  };

  const getTotalCEUs = () => {
    return getCurrentYearRecords().reduce((sum, record) => sum + record.credits, 0);
  };

  const getCategoryBreakdown = () => {
    const breakdown: { [key: string]: number } = {};
    getCurrentYearRecords().forEach(record => {
      breakdown[record.category] = (breakdown[record.category] || 0) + record.credits;
    });
    
    return Object.entries(breakdown).map(([category, credits]) => ({
      name: category,
      value: credits,
      color: getCategoryColor(category),
    }));
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Emergency Medicine': '#EF4444',
      'Nursing': '#EC4899',
      'Pharmacy': '#10B981',
      'Radiology': '#8B5CF6',
      'Laboratory': '#3B82F6',
      'General': '#6B7280',
    };
    return colors[category] || '#6B7280';
  };

  const getMonthlyProgress = () => {
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      credits: 0,
      cumulative: 0,
    }));

    let cumulative = 0;
    getCurrentYearRecords().forEach(record => {
      const month = record.completedDate.getMonth();
      monthlyData[month].credits += record.credits;
    });

    monthlyData.forEach((data, index) => {
      cumulative += data.credits;
      data.cumulative = cumulative;
    });

    return monthlyData;
  };

  const getExpiringCertificates = () => {
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    
    return ceuRecords.filter(record => 
      record.expirationDate && 
      record.expirationDate <= threeMonthsFromNow &&
      record.expirationDate > new Date()
    );
  };

  const totalCEUs = getTotalCEUs();
  const progressPercentage = Math.min((totalCEUs / yearlyTarget) * 100, 100);
  const categoryBreakdown = getCategoryBreakdown();
  const monthlyProgress = getMonthlyProgress();
  const expiringCertificates = getExpiringCertificates();
  const availableYears = [...new Set(ceuRecords.map(record => record.completedDate.getFullYear().toString()))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CEU Tracker</h1>
          <p className="text-gray-600">Track your continuing education progress</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="block rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add CEU Record
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CEUs Earned</p>
                <p className="text-2xl font-bold text-gray-900">{totalCEUs}</p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Annual Target</p>
                <p className="text-2xl font-bold text-gray-900">{yearlyTarget}</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(progressPercentage)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-gray-900">{Math.max(0, yearlyTarget - totalCEUs)}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Annual Progress ({selectedYear})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress toward {yearlyTarget} CEU target</span>
              <span>{totalCEUs} / {yearlyTarget} CEUs</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${
                  progressPercentage >= 100 ? 'bg-green-500' :
                  progressPercentage >= 75 ? 'bg-blue-500' :
                  progressPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>{Math.round(yearlyTarget * 0.25)}</span>
              <span>{Math.round(yearlyTarget * 0.5)}</span>
              <span>{Math.round(yearlyTarget * 0.75)}</span>
              <span>{yearlyTarget}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expiring Certificates Alert */}
      {expiringCertificates.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              <span>Certificates Expiring Soon</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringCertificates.map(cert => (
                <div key={cert.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{cert.title}</p>
                    <p className="text-sm text-gray-600">
                      Expires: {cert.expirationDate?.toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="warning">Expiring</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>CEUs by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {categoryBreakdown.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                  <span className="font-medium">{category.value} CEUs</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="credits" fill="#3B82F6" name="Monthly CEUs" />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Cumulative CEUs"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* CEU Records Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>CEU Records ({selectedYear})</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Records
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Title</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Credits</th>
                  <th className="text-left p-3">Completed</th>
                  <th className="text-left p-3">Expires</th>
                  <th className="text-left p-3">Provider</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentYearRecords().map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium">{record.title}</div>
                      {record.certificateId && (
                        <div className="text-xs text-gray-500">
                          Cert: {record.certificateId}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{record.category}</Badge>
                    </td>
                    <td className="p-3 font-medium">{record.credits}</td>
                    <td className="p-3">{record.completedDate.toLocaleDateString()}</td>
                    <td className="p-3">
                      {record.expirationDate ? record.expirationDate.toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-3 text-gray-600">{record.provider}</td>
                    <td className="p-3">
                      {record.expirationDate ? (
                        record.expirationDate > new Date() ? (
                          <Badge variant="success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Valid
                          </Badge>
                        ) : (
                          <Badge variant="danger">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Expired
                          </Badge>
                        )
                      ) : (
                        <Badge variant="secondary">Permanent</Badge>
                      )}
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