import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Search, Calendar, Award, TrendingUp, BarChart3, FileText, Calculator, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface AssessmentRecord {
  id: string;
  studentName: string;
  studentId: string;
  examTitle: string;
  examType: 'theory' | 'practical' | 'skill-lab';
  score: number;
  percentage: number;
  status: 'passed' | 'failed';
  completedAt: Date;
  duration: number; // in minutes
  attempts: number;
}

export const AssessmentRecords: React.FC = () => {
  const { auth } = useAuth();
  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    loadAssessmentRecords();
  }, []);

  const loadAssessmentRecords = async () => {
    try {

      
      // Get exam attempts with related data
      const { data: attempts, error } = await supabase
        .from('exam_attempts')
        .select(`
          id,
          score,
          percentage,
          status,
          started_at,
          completed_at,
          time_spent,
          attempt_number,
          exams (
            id,
            title
          ),
          profiles (
            id,
            name,
            employee_id
          )
        `)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading assessment records:', error);
        setRecords([]);
        return;
      }

      if (attempts && attempts.length > 0) {
        const formattedRecords: AssessmentRecord[] = attempts.map((attempt: any) => ({
          id: attempt.id,
          studentName: attempt.profiles?.name || 'Unknown Student',
          studentId: attempt.profiles?.employee_id || 'N/A',
          examTitle: attempt.exams?.title || 'Unknown Exam',
          examType: 'theory', // Default type, could be enhanced with exam metadata
          score: attempt.score || 0,
          percentage: attempt.percentage || 0,
          status: attempt.status === 'completed' && (attempt.percentage || 0) >= 70 ? 'passed' : 'failed',
          completedAt: new Date(attempt.completed_at || attempt.started_at),
          duration: Math.round((attempt.time_spent || 0) / 60), // Convert seconds to minutes
          attempts: attempt.attempt_number || 1
        }));


        setRecords(formattedRecords);
      } else {
        console.log('📝 No assessment records found in database');
        setRecords([]);
      }
    } catch (error) {
      console.error('❌ Error loading assessment records:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.examTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || record.examType === filterType;
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const calculateMedian = (scores: number[]): number => {
    if (scores.length === 0) return 0;
    const sorted = [...scores].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  const getStatistics = () => {
    const scores = filteredRecords.map(r => r.percentage);
    const passedCount = filteredRecords.filter(r => r.status === 'passed').length;
    const totalCount = filteredRecords.length;
    
    return {
      totalAssessments: totalCount,
      passRate: totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0,
      averageScore: totalCount > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / totalCount) : 0,
      medianScore: totalCount > 0 ? Math.round(calculateMedian(scores)) : 0,
      highestScore: totalCount > 0 ? Math.max(...scores) : 0,
      lowestScore: totalCount > 0 ? Math.min(...scores) : 0
    };
  };

  const stats = getStatistics();

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'theory': return 'bg-blue-100 text-blue-800';
      case 'practical': return 'bg-green-100 text-green-800';
      case 'skill-lab': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportRecords = () => {
    if (filteredRecords.length === 0) {
      alert('No records to export');
      return;
    }

    const csvContent = [
      ['Student Name', 'Student ID', 'Exam Title', 'Type', 'Score', 'Percentage', 'Status', 'Date', 'Duration', 'Attempts'],
      ...filteredRecords.map(record => [
        record.studentName,
        record.studentId,
        record.examTitle,
        record.examType,
        record.score.toString(),
        record.percentage.toString(),
        record.status,
        record.completedAt.toLocaleDateString(),
        record.duration.toString(),
        record.attempts.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment-records-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assessment Records</h1>
          <p className="text-gray-600">
            Track and analyze student assessment performance

          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowStats(!showStats)} variant="outline" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </Button>
          {filteredRecords.length > 0 && (
            <Button onClick={exportRecords} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Panel */}
      {showStats && filteredRecords.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalAssessments}</div>
              <div className="text-sm text-gray-600">Total Assessments</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.passRate}%</div>
              <div className="text-sm text-gray-600">Pass Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.averageScore}%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calculator className="h-4 w-4 text-orange-600" />
                <div className="text-2xl font-bold text-orange-600">{stats.medianScore}%</div>
              </div>
              <div className="text-sm text-orange-800 font-medium">Median Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.highestScore}%</div>
              <div className="text-sm text-gray-600">Highest Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.lowestScore}%</div>
              <div className="text-sm text-gray-600">Lowest Score</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters - Only show if there are records */}
      {filteredRecords.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by student name, ID, or exam..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="theory">Theory</option>
                <option value="practical">Practical</option>
                <option value="skill-lab">Skill Lab</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Records Table or Empty State */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Assessment Records ({filteredRecords.length})

          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Assessment Records Found</h3>
              <p className="text-gray-600 mb-4">
                No completed exam attempts found in the database.
              </p>
              <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg max-w-md mx-auto">
                <p className="font-medium mb-2">To see records here:</p>
                <ul className="text-left space-y-1">
                  <li>• Students need to take and complete exams</li>
                  <li>• Exam attempts will be automatically recorded</li>
                  <li>• Only completed attempts appear in records</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Exam</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Duration</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Attempts</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{record.studentName}</div>
                          <div className="text-sm text-gray-600">{record.studentId}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{record.examTitle}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getExamTypeColor(record.examType)}`}>
                          {record.examType.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${record.percentage >= 80 ? 'text-green-600' : record.percentage >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {record.percentage}%
                          </span>
                          <span className="text-sm text-gray-500">({record.score})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          record.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {record.completedAt.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{record.duration} min</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                          record.attempts === 1 ? 'bg-green-100 text-green-800' : 
                          record.attempts === 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {record.attempts}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
