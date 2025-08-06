import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle, XCircle, Award, Home } from 'lucide-react';

interface ExamResult {
  examId: string;
  examTitle: string;
  answers: Record<string, number>;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
}

export const ExamResults: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resultId) {
      const storedResult = localStorage.getItem(`exam-result-${resultId}`);
      if (storedResult) {
        const parsedResult = JSON.parse(storedResult);
        setResult(parsedResult);
        
        // Save assessment record when result is loaded
        const assessmentRecord = {
          id: Date.now().toString(),
          studentName: 'Student User',
          studentId: 'STU' + Math.random().toString().slice(-3),
          examTitle: parsedResult.examTitle,
          examType: 'theory' as const,
          score: parsedResult.percentage,
          percentage: parsedResult.percentage,
          status: parsedResult.passed ? 'passed' as const : 'failed' as const,
          completedAt: new Date(parsedResult.completedAt),
          duration: 30, // Default duration
          attempts: 1
        };

        const existingRecords = JSON.parse(localStorage.getItem('assessment-records') || '[]');
        // Check if record already exists to avoid duplicates
        const recordExists = existingRecords.some((record: any) => 
          record.examTitle === parsedResult.examTitle && 
          record.completedAt === parsedResult.completedAt
        );
        
        if (!recordExists) {
          existingRecords.push(assessmentRecord);
          localStorage.setItem('assessment-records', JSON.stringify(existingRecords));
        }
      }
    }
    setLoading(false);
  }, [resultId]);

  const generateCertificate = () => {
    if (!result || !result.passed) return;

    const certificateId = Date.now().toString();
    const certificate = {
      id: certificateId,
      examTitle: result.examTitle,
      studentName: 'Student Name', // In real app, get from auth
      score: result.percentage,
      completedAt: result.completedAt,
      certificateNumber: `CERT-${certificateId.slice(-6)}`
    };

    localStorage.setItem(`certificate-${certificateId}`, JSON.stringify(certificate));
    
    // Save assessment record
    const assessmentRecord = {
      id: Date.now().toString(),
      studentName: 'Student Name',
      studentId: 'STU' + Math.random().toString().slice(-3),
      examTitle: result.examTitle,
      examType: 'theory' as const,
      score: result.percentage,
      percentage: result.percentage,
      status: result.passed ? 'passed' as const : 'failed' as const,
      completedAt: new Date(result.completedAt),
      duration: 30, // Default duration
      attempts: 1
    };

    const existingRecords = JSON.parse(localStorage.getItem('assessment-records') || '[]');
    existingRecords.push(assessmentRecord);
    localStorage.setItem('assessment-records', JSON.stringify(existingRecords));

    navigate(`/certificate/${certificateId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Results not found</h2>
        <p className="text-gray-600 mb-4">The exam results you're looking for could not be found.</p>
        <Button onClick={() => navigate('/')}>
          <Home className="h-4 w-4 mr-2" />
          Back to Exams
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="mb-4">
          {result.passed ? (
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {result.passed ? 'Congratulations!' : 'Better luck next time!'}
        </h1>
        <p className="text-gray-600 text-lg">
          {result.passed 
            ? 'You have successfully passed the exam.' 
            : 'You did not meet the passing requirements this time.'}
        </p>
      </div>

      {/* Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{result.examTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
              {result.percentage}%
            </div>
            <div className="text-gray-600 mb-4">Final Score</div>
            <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
              result.passed 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {result.passed ? 'PASSED' : 'FAILED'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{result.correctAnswers}</div>
              <div className="text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{result.totalQuestions}</div>
              <div className="text-gray-600">Total Questions</div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            Completed on {new Date(result.completedAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-4">
        <Button onClick={() => navigate('/')} variant="outline" className="w-full">
          <Home className="h-4 w-4 mr-2" />
          Back to Exams
        </Button>
        
        {result.passed && (
          <Button onClick={generateCertificate} className="w-full">
            <Award className="h-4 w-4 mr-2" />
            Get Certificate
          </Button>
        )}
      </div>
    </div>
  );
};