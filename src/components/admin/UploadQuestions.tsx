import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ExamData {
  id: string;
  title: string;
  description: string;
  duration: number;
  passingScore: number;
  questions: Question[];
}

export const UploadQuestions: React.FC = () => {
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 30,
    passingScore: 80
  });
  const [uploadedQuestions, setUploadedQuestions] = useState<Question[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const downloadTemplate = () => {
    const csvContent = [
      ['Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer (0-3)'],
      ['What is 2+2?', '3', '4', '5', '6', '1'],
      ['What is the capital of France?', 'London', 'Paris', 'Berlin', 'Madrid', '1'],
      ['Which is a programming language?', 'HTML', 'CSS', 'JavaScript', 'XML', '2']
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setUploadStatus('error');
      setErrorMessage('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',');
        
        if (headers.length < 6) {
          throw new Error('CSV must have at least 6 columns: Question, Option A, Option B, Option C, Option D, Correct Answer');
        }

        const questions: Question[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          
          if (values.length < 6) continue;
          
          const correctAnswer = parseInt(values[5]);
          if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
            throw new Error(`Invalid correct answer at row ${i + 1}. Must be 0, 1, 2, or 3`);
          }

          questions.push({
            id: `q${i}`,
            question: values[0],
            options: [values[1], values[2], values[3], values[4]],
            correctAnswer
          });
        }

        if (questions.length === 0) {
          throw new Error('No valid questions found in CSV');
        }

        setUploadedQuestions(questions);
        setUploadStatus('success');
        setErrorMessage('');
      } catch (error) {
        setUploadStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Error parsing CSV file');
      }
    };

    reader.readAsText(file);
  };

  const saveExam = () => {
    if (!examData.title || uploadedQuestions.length === 0) {
      setUploadStatus('error');
      setErrorMessage('Please provide exam title and upload questions');
      return;
    }

    const newExam: ExamData = {
      id: Date.now().toString(),
      title: examData.title,
      description: examData.description,
      duration: examData.duration,
      passingScore: examData.passingScore,
      questions: uploadedQuestions
    };

    // Save to localStorage (in real app, save to backend)
    const existingExams = JSON.parse(localStorage.getItem('custom-exams') || '[]');
    existingExams.push(newExam);
    localStorage.setItem('custom-exams', JSON.stringify(existingExams));

    alert('Exam saved successfully!');
    
    // Reset form
    setExamData({ title: '', description: '', duration: 30, passingScore: 80 });
    setUploadedQuestions([]);
    setUploadStatus('idle');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Questions</h1>
        <p className="text-gray-600">
          Create new exams by uploading questions via CSV file
        </p>
      </div>

      {/* Exam Details */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Exam Title"
              value={examData.title}
              onChange={(e) => setExamData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Advanced First Aid"
              required
            />
            <Input
              label="Duration (minutes)"
              type="number"
              value={examData.duration}
              onChange={(e) => setExamData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              min="1"
              required
            />
            <Input
              label="Passing Score (%)"
              type="number"
              value={examData.passingScore}
              onChange={(e) => setExamData(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
              min="1"
              max="100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={examData.description}
              onChange={(e) => setExamData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Brief description of the exam"
            />
          </div>
        </CardContent>
      </Card>

      {/* CSV Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Questions (CSV)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Button onClick={downloadTemplate} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Template
            </Button>
            <span className="text-sm text-gray-600">
              Download the CSV template to see the required format
            </span>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload CSV File</h3>
            <p className="text-gray-600 mb-4">
              Select a CSV file with your questions. Make sure to follow the template format.
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              <Button as="span" className="cursor-pointer">
                Choose CSV File
              </Button>
            </label>
          </div>

          {/* Upload Status */}
          {uploadStatus === 'success' && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800">
                Successfully uploaded {uploadedQuestions.length} questions
              </span>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{errorMessage}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Questions */}
      {uploadedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview Questions ({uploadedQuestions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {uploadedQuestions.slice(0, 5).map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {index + 1}. {question.question}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-2 rounded text-sm ${
                          optIndex === question.correctAnswer
                            ? 'bg-green-100 text-green-800 font-medium'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {uploadedQuestions.length > 5 && (
                <p className="text-sm text-gray-600 text-center">
                  ... and {uploadedQuestions.length - 5} more questions
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      {uploadedQuestions.length > 0 && (
        <div className="text-center">
          <Button onClick={saveExam} className="px-8">
            Save Exam
          </Button>
        </div>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CSV Format Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p><strong>Required columns (in order):</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Question - The question text</li>
              <li>Option A - First answer option</li>
              <li>Option B - Second answer option</li>
              <li>Option C - Third answer option</li>
              <li>Option D - Fourth answer option</li>
              <li>Correct Answer - Number (0 for A, 1 for B, 2 for C, 3 for D)</li>
            </ol>
            <p className="text-gray-600 mt-3">
              <strong>Tips:</strong> Use the template for best results. Ensure correct answer numbers are 0-3 only.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};