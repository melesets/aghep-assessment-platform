import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';

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

export const EditExams: React.FC = () => {
  const [exams, setExams] = useState<ExamData[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  useEffect(() => {
    // Load exams from localStorage
    const customExams = JSON.parse(localStorage.getItem('custom-exams') || '[]');
    
    // Default exams
    const defaultExams: ExamData[] = [
      {
        id: '1',
        title: 'Basic Life Support (BLS)',
        description: 'Essential life-saving techniques including CPR and AED usage.',
        duration: 30,
        passingScore: 80,
        questions: [
          {
            id: '1',
            question: 'What is the correct compression rate for adult CPR?',
            options: ['80-100 per minute', '100-120 per minute', '120-140 per minute', '60-80 per minute'],
            correctAnswer: 1
          },
          {
            id: '2',
            question: 'How deep should chest compressions be for an adult?',
            options: ['1-2 inches', '2-2.4 inches', '3-4 inches', '1 inch'],
            correctAnswer: 1
          }
        ]
      },
      {
        id: '2',
        title: 'First Aid Certification',
        description: 'Basic first aid skills for emergency situations.',
        duration: 25,
        passingScore: 75,
        questions: [
          {
            id: '1',
            question: 'What is the first step in treating a burn?',
            options: ['Apply ice', 'Remove clothing', 'Cool with water', 'Apply ointment'],
            correctAnswer: 2
          }
        ]
      }
    ];

    setExams([...defaultExams, ...customExams]);
  }, []);

  const saveExam = (exam: ExamData) => {
    const updatedExams = exams.map(e => e.id === exam.id ? exam : e);
    setExams(updatedExams);
    
    // Save custom exams to localStorage
    const customExams = updatedExams.filter(e => !['1', '2', '3'].includes(e.id));
    localStorage.setItem('custom-exams', JSON.stringify(customExams));
    
    setSelectedExam(null);
    alert('Exam saved successfully!');
  };

  const deleteExam = (examId: string) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      const updatedExams = exams.filter(e => e.id !== examId);
      setExams(updatedExams);
      
      const customExams = updatedExams.filter(e => !['1', '2', '3'].includes(e.id));
      localStorage.setItem('custom-exams', JSON.stringify(customExams));
      
      if (selectedExam?.id === examId) {
        setSelectedExam(null);
      }
    }
  };

  const addQuestion = (examId: string) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    };
    setEditingQuestion(newQuestion);
    setShowAddQuestion(true);
  };

  const saveQuestion = (question: Question) => {
    if (!selectedExam) return;

    const updatedQuestions = editingQuestion?.id && selectedExam.questions.find(q => q.id === editingQuestion.id)
      ? selectedExam.questions.map(q => q.id === question.id ? question : q)
      : [...selectedExam.questions, question];

    const updatedExam = { ...selectedExam, questions: updatedQuestions };
    setSelectedExam(updatedExam);
    setEditingQuestion(null);
    setShowAddQuestion(false);
  };

  const deleteQuestion = (questionId: string) => {
    if (!selectedExam) return;
    
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = selectedExam.questions.filter(q => q.id !== questionId);
      setSelectedExam({ ...selectedExam, questions: updatedQuestions });
    }
  };

  const QuestionEditor = ({ question, onSave, onCancel }: {
    question: Question;
    onSave: (question: Question) => void;
    onCancel: () => void;
  }) => {
    const [editedQuestion, setEditedQuestion] = useState(question);

    return (
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">
            {question.id && selectedExam?.questions.find(q => q.id === question.id) ? 'Edit Question' : 'Add New Question'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
            <textarea
              value={editedQuestion.question}
              onChange={(e) => setEditedQuestion(prev => ({ ...prev, question: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Enter your question"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editedQuestion.options.map((option, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Option {String.fromCharCode(65 + index)}
                </label>
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...editedQuestion.options];
                    newOptions[index] = e.target.value;
                    setEditedQuestion(prev => ({ ...prev, options: newOptions }));
                  }}
                  placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
            <select
              value={editedQuestion.correctAnswer}
              onChange={(e) => setEditedQuestion(prev => ({ ...prev, correctAnswer: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {editedQuestion.options.map((_, index) => (
                <option key={index} value={index}>
                  Option {String.fromCharCode(65 + index)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => onSave(editedQuestion)}
              disabled={!editedQuestion.question || editedQuestion.options.some(opt => !opt)}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Question
            </Button>
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Exams</h1>
        <p className="text-gray-600">
          Modify existing exams and questions
        </p>
      </div>

      {!selectedExam ? (
        // Exam List
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{exam.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{exam.description}</p>
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div>Duration: {exam.duration} minutes</div>
                  <div>Questions: {exam.questions.length}</div>
                  <div>Pass Score: {exam.passingScore}%</div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setSelectedExam(exam)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  {!['1', '2', '3'].includes(exam.id) && (
                    <Button 
                      variant="outline"
                      onClick={() => deleteExam(exam.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Edit Selected Exam
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setSelectedExam(null)}>
              ← Back to Exams
            </Button>
            <h2 className="text-2xl font-bold text-gray-900">{selectedExam.title}</h2>
          </div>

          {/* Exam Details */}
          <Card>
            <CardHeader>
              <CardTitle>Exam Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Title"
                  value={selectedExam.title}
                  onChange={(e) => setSelectedExam(prev => prev ? { ...prev, title: e.target.value } : null)}
                />
                <Input
                  label="Duration (minutes)"
                  type="number"
                  value={selectedExam.duration}
                  onChange={(e) => setSelectedExam(prev => prev ? { ...prev, duration: parseInt(e.target.value) } : null)}
                />
                <Input
                  label="Passing Score (%)"
                  type="number"
                  value={selectedExam.passingScore}
                  onChange={(e) => setSelectedExam(prev => prev ? { ...prev, passingScore: parseInt(e.target.value) } : null)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={selectedExam.description}
                  onChange={(e) => setSelectedExam(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <Button onClick={() => saveExam(selectedExam)}>
                <Save className="h-4 w-4 mr-2" />
                Save Exam Details
              </Button>
            </CardContent>
          </Card>

          {/* Add Question Editor */}
          {(editingQuestion || showAddQuestion) && (
            <QuestionEditor
              question={editingQuestion || {
                id: Date.now().toString(),
                question: '',
                options: ['', '', '', ''],
                correctAnswer: 0
              }}
              onSave={saveQuestion}
              onCancel={() => {
                setEditingQuestion(null);
                setShowAddQuestion(false);
              }}
            />
          )}

          {/* Questions List */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Questions ({selectedExam.questions.length})</CardTitle>
                <Button onClick={() => addQuestion(selectedExam.id)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedExam.questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">
                        {index + 1}. {question.question}
                      </h4>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingQuestion(question)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteQuestion(question.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
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
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};