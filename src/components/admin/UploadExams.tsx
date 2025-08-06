import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Upload, FileText, Plus, Trash2, Save, Eye, Download } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface ExamTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  passingScore: number;
  questions: Question[];
  createdAt: Date;
  status: 'draft' | 'published';
}

const mockExams: ExamTemplate[] = [
  {
    id: '1',
    title: 'Basic Life Support Assessment',
    description: 'Comprehensive BLS knowledge assessment',
    category: 'Emergency Medicine',
    duration: 45,
    passingScore: 80,
    questions: [],
    createdAt: new Date('2024-01-15'),
    status: 'published'
  },
  {
    id: '2',
    title: 'Advanced Cardiac Life Support',
    description: 'ACLS certification exam',
    category: 'Cardiology',
    duration: 90,
    passingScore: 85,
    questions: [],
    createdAt: new Date('2024-01-20'),
    status: 'draft'
  }
];

export const UploadExams: React.FC = () => {
  const [exams, setExams] = useState<ExamTemplate[]>(mockExams);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamTemplate | null>(null);
  const [newExam, setNewExam] = useState<Partial<ExamTemplate>>({
    title: '',
    description: '',
    category: '',
    duration: 60,
    passingScore: 80,
    questions: []
  });
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });

  const handleCreateExam = () => {
    if (!newExam.title || !newExam.description || !newExam.category) return;

    const exam: ExamTemplate = {
      id: Date.now().toString(),
      title: newExam.title,
      description: newExam.description,
      category: newExam.category,
      duration: newExam.duration || 60,
      passingScore: newExam.passingScore || 80,
      questions: [],
      createdAt: new Date(),
      status: 'draft'
    };

    setExams(prev => [...prev, exam]);
    setNewExam({
      title: '',
      description: '',
      category: '',
      duration: 60,
      passingScore: 80,
      questions: []
    });
    setShowCreateForm(false);
  };

  const handleAddQuestion = () => {
    if (!selectedExam || !newQuestion.question || newQuestion.options?.some(opt => !opt)) return;

    const question: Question = {
      id: Date.now().toString(),
      question: newQuestion.question,
      options: newQuestion.options as string[],
      correctAnswer: newQuestion.correctAnswer || 0,
      explanation: newQuestion.explanation
    };

    setExams(prev =>
      prev.map(exam =>
        exam.id === selectedExam.id
          ? { ...exam, questions: [...exam.questions, question] }
          : exam
      )
    );

    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
  };

  const handleDeleteQuestion = (examId: string, questionId: string) => {
    setExams(prev =>
      prev.map(exam =>
        exam.id === examId
          ? { ...exam, questions: exam.questions.filter(q => q.id !== questionId) }
          : exam
      )
    );
  };

  const handlePublishExam = (examId: string) => {
    setExams(prev =>
      prev.map(exam =>
        exam.id === examId ? { ...exam, status: 'published' } : exam
      )
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Mock file processing
    console.log('Processing file:', file.name);
    alert('File upload functionality would be implemented here. Supported formats: JSON, CSV, Excel');
  };

  const exportExamTemplate = () => {
    const template = {
      title: 'Sample Exam Template',
      description: 'Description of the exam',
      category: 'Category Name',
      duration: 60,
      passingScore: 80,
      questions: [
        {
          question: 'Sample question text?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 0,
          explanation: 'Explanation for the correct answer'
        }
      ]
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exam-template.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
          <p className="text-gray-600">Create and manage certification exams</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportExamTemplate} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Exam
          </Button>
        </div>
      </div>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Exam Files</h3>
            <p className="text-gray-600 mb-4">
              Support for JSON, CSV, and Excel files. Download the template for proper formatting.
            </p>
            <input
              type="file"
              accept=".json,.csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button as="span" className="cursor-pointer">
                Choose Files
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Create Exam Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Exam</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Exam Title"
                value={newExam.title || ''}
                onChange={(e) => setNewExam(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter exam title"
              />
              <Input
                label="Category"
                value={newExam.category || ''}
                onChange={(e) => setNewExam(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Emergency Medicine"
              />
              <Input
                label="Duration (minutes)"
                type="number"
                value={newExam.duration || ''}
                onChange={(e) => setNewExam(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                placeholder="60"
              />
              <Input
                label="Passing Score (%)"
                type="number"
                value={newExam.passingScore || ''}
                onChange={(e) => setNewExam(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                placeholder="80"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newExam.description || ''}
                onChange={(e) => setNewExam(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Enter exam description"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleCreateExam}>Create Exam</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Exams */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Exams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exams.map((exam) => (
              <div key={exam.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-gray-900">{exam.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        exam.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {exam.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{exam.description}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>Category: {exam.category}</span>
                      <span>Duration: {exam.duration} min</span>
                      <span>Pass Score: {exam.passingScore}%</span>
                      <span>Questions: {exam.questions.length}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedExam(exam)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      Edit
                    </Button>
                    {exam.status === 'draft' && exam.questions.length > 0 && (
                      <Button
                        size="sm"
                        onClick={() => handlePublishExam(exam.id)}
                        className="flex items-center gap-1"
                      >
                        <Save className="h-3 w-3" />
                        Publish
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question Editor */}
      {selectedExam && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Questions - {selectedExam.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add New Question */}
            <div className="border rounded-lg p-4 mb-6 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-4">Add New Question</h4>
              <div className="space-y-4">
                <Input
                  label="Question"
                  value={newQuestion.question || ''}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Enter your question"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {newQuestion.options?.map((option, index) => (
                    <Input
                      key={index}
                      label={`Option ${String.fromCharCode(65 + index)}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(newQuestion.options || [])];
                        newOptions[index] = e.target.value;
                        setNewQuestion(prev => ({ ...prev, options: newOptions }));
                      }}
                      placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                    <select
                      value={newQuestion.correctAnswer || 0}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, correctAnswer: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {newQuestion.options?.map((_, index) => (
                        <option key={index} value={index}>
                          Option {String.fromCharCode(65 + index)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Explanation (Optional)"
                    value={newQuestion.explanation || ''}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                    placeholder="Explain why this is correct"
                  />
                </div>
                <Button onClick={handleAddQuestion} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </div>
            </div>

            {/* Existing Questions */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Existing Questions ({selectedExam.questions.length})</h4>
              {selectedExam.questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 mb-2">
                        {index + 1}. {question.question}
                      </h5>
                      <div className="grid grid-cols-2 gap-2 mb-2">
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
                      {question.explanation && (
                        <p className="text-sm text-gray-600 italic">
                          Explanation: {question.explanation}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteQuestion(selectedExam.id, question.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};