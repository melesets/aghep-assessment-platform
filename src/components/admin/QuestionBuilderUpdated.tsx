import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { supabase } from '../../lib/supabase';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Move, 
  Eye, 
  Save, 
  Upload, 
  Download, 
  Settings, 
  Image, 
  Video, 
  FileText, 
  MoreVertical,
  GripVertical,
  Star,
  Clock,
  CheckSquare,
  Circle,
  List,
  ToggleLeft,
  Calendar,
  Hash,
  Type,
  AlignLeft,
  Shuffle,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Question Types (Google Forms-like)
export type QuestionType = 
  | 'multiple-choice'
  | 'checkboxes'
  | 'dropdown'
  | 'short-answer'
  | 'paragraph'
  | 'linear-scale'
  | 'multiple-choice-grid'
  | 'checkbox-grid'
  | 'date'
  | 'time'
  | 'file-upload'
  | 'true-false'
  | 'ranking'
  | 'slider'
  | 'number'
  | 'email'
  | 'url';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  points?: number;
  image?: string;
}

export interface QuestionValidation {
  required: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string;
  customMessage?: string;
}

export interface QuestionLogic {
  showIf?: {
    questionId: string;
    condition: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
    value: string | number;
  };
  skipTo?: string; // Question ID to skip to
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  correctAnswer?: string | string[] | number;
  points: number;
  timeLimit?: number; // in seconds
  explanation?: string;
  image?: string;
  video?: string;
  audio?: string;
  validation?: QuestionValidation;
  logic?: QuestionLogic;
  settings: {
    shuffleOptions: boolean;
    allowOther: boolean;
    multipleCorrect: boolean;
    showPoints: boolean;
    partialCredit: boolean;
  };
  metadata: {
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface ExamForm {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  settings: {
    shuffleQuestions: boolean;
    showProgressBar: boolean;
    allowBackNavigation: boolean;
    showQuestionNumbers: boolean;
    oneQuestionPerPage: boolean;
    timeLimit?: number;
    passingScore: number;
    maxAttempts: number;
    showCorrectAnswers: boolean;
    showScoreImmediately: boolean;
    collectEmail: boolean;
    requireSignIn: boolean;
    allowAnonymous: boolean;
  };
  styling: {
    theme: 'light' | 'dark' | 'custom';
    primaryColor: string;
    backgroundColor: string;
    fontFamily: string;
    headerImage?: string;
  };
  access: {
    isPublic: boolean;
    password?: string;
    startDate?: Date;
    endDate?: Date;
    allowedDomains?: string[];
  };
  notifications: {
    sendConfirmation: boolean;
    emailTemplate?: string;
    webhookUrl?: string;
  };
}

const questionTypes: { type: QuestionType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'multiple-choice', label: 'Multiple Choice', icon: <Circle className="h-4 w-4" />, description: 'Single correct answer' },
  { type: 'checkboxes', label: 'Checkboxes', icon: <CheckSquare className="h-4 w-4" />, description: 'Multiple correct answers' },
  { type: 'dropdown', label: 'Dropdown', icon: <ChevronDown className="h-4 w-4" />, description: 'Select from dropdown list' },
  { type: 'short-answer', label: 'Short Answer', icon: <Type className="h-4 w-4" />, description: 'Brief text response' },
  { type: 'paragraph', label: 'Paragraph', icon: <AlignLeft className="h-4 w-4" />, description: 'Long text response' },
  { type: 'linear-scale', label: 'Linear Scale', icon: <List className="h-4 w-4" />, description: 'Rating scale (1-5, 1-10)' },
  { type: 'true-false', label: 'True/False', icon: <ToggleLeft className="h-4 w-4" />, description: 'Binary choice' },
  { type: 'ranking', label: 'Ranking', icon: <List className="h-4 w-4" />, description: 'Order items by preference' },
  { type: 'slider', label: 'Slider', icon: <ToggleLeft className="h-4 w-4" />, description: 'Continuous scale' },
  { type: 'number', label: 'Number', icon: <Hash className="h-4 w-4" />, description: 'Numeric input' },
  { type: 'date', label: 'Date', icon: <Calendar className="h-4 w-4" />, description: 'Date picker' },
  { type: 'time', label: 'Time', icon: <Clock className="h-4 w-4" />, description: 'Time picker' },
  { type: 'email', label: 'Email', icon: <Type className="h-4 w-4" />, description: 'Email address' },
  { type: 'url', label: 'URL', icon: <Type className="h-4 w-4" />, description: 'Website URL' },
  { type: 'file-upload', label: 'File Upload', icon: <Upload className="h-4 w-4" />, description: 'Upload documents/images' }
];

const defaultQuestion: Omit<Question, 'id'> = {
  type: 'multiple-choice',
  title: '',
  required: false,
  points: 1,
  options: [
    { id: '1', text: 'Option 1', isCorrect: true },
    { id: '2', text: 'Option 2', isCorrect: false },
    { id: '3', text: 'Option 3', isCorrect: false },
    { id: '4', text: 'Option 4', isCorrect: false }
  ],
  settings: {
    shuffleOptions: false,
    allowOther: false,
    multipleCorrect: false,
    showPoints: true,
    partialCredit: false
  },
  metadata: {
    difficulty: 'medium',
    category: 'General',
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

export const QuestionBuilderUpdated: React.FC = () => {
  const [examForm, setExamForm] = useState<ExamForm>({
    id: '',
    title: 'Untitled Exam',
    description: '',
    questions: [],
    settings: {
      shuffleQuestions: false,
      showProgressBar: true,
      allowBackNavigation: true,
      showQuestionNumbers: true,
      oneQuestionPerPage: false,
      passingScore: 70,
      maxAttempts: 3,
      showCorrectAnswers: true,
      showScoreImmediately: true,
      collectEmail: false,
      requireSignIn: false,
      allowAnonymous: true
    },
    styling: {
      theme: 'light',
      primaryColor: '#2563eb',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter'
    },
    access: {
      isPublic: true
    },
    notifications: {
      sendConfirmation: false
    }
  });

  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [showQuestionTypes, setShowQuestionTypes] = useState(false);
  const [draggedQuestion, setDraggedQuestion] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add new question
  const addQuestion = (type: QuestionType = 'multiple-choice') => {
    const newQuestion: Question = {
      ...defaultQuestion,
      id: `q_${Date.now()}`,
      type,
      title: `Question ${examForm.questions.length + 1}`,
      metadata: {
        ...defaultQuestion.metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    setExamForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    setSelectedQuestion(newQuestion.id);
    setShowQuestionTypes(false);
  };

  // Update question
  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setExamForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { ...q, ...updates, metadata: { ...q.metadata, updatedAt: new Date() } }
          : q
      )
    }));
  };

  // Delete question
  const deleteQuestion = (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setExamForm(prev => ({
        ...prev,
        questions: prev.questions.filter(q => q.id !== questionId)
      }));
      setSelectedQuestion(null);
    }
  };

  // Duplicate question
  const duplicateQuestion = (questionId: string) => {
    const question = examForm.questions.find(q => q.id === questionId);
    if (question) {
      const duplicated: Question = {
        ...question,
        id: `q_${Date.now()}`,
        title: `${question.title} (Copy)`,
        metadata: {
          ...question.metadata,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };
      
      const questionIndex = examForm.questions.findIndex(q => q.id === questionId);
      setExamForm(prev => ({
        ...prev,
        questions: [
          ...prev.questions.slice(0, questionIndex + 1),
          duplicated,
          ...prev.questions.slice(questionIndex + 1)
        ]
      }));
    }
  };

  // Move question
  const moveQuestion = (questionId: string, direction: 'up' | 'down') => {
    const currentIndex = examForm.questions.findIndex(q => q.id === questionId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= examForm.questions.length) return;

    const newQuestions = [...examForm.questions];
    [newQuestions[currentIndex], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[currentIndex]];

    setExamForm(prev => ({ ...prev, questions: newQuestions }));
  };

  // Add option to question
  const addOption = (questionId: string) => {
    const question = examForm.questions.find(q => q.id === questionId);
    if (!question || !question.options) return;

    const newOption: QuestionOption = {
      id: `opt_${Date.now()}`,
      text: `Option ${question.options.length + 1}`,
      isCorrect: false
    };

    updateQuestion(questionId, {
      options: [...question.options, newOption]
    });
  };

  // Update option
  const updateOption = (questionId: string, optionId: string, updates: Partial<QuestionOption>) => {
    const question = examForm.questions.find(q => q.id === questionId);
    if (!question || !question.options) return;

    const updatedOptions = question.options.map(opt =>
      opt.id === optionId ? { ...opt, ...updates } : opt
    );

    updateQuestion(questionId, { options: updatedOptions });
  };

  // Delete option
  const deleteOption = (questionId: string, optionId: string) => {
    const question = examForm.questions.find(q => q.id === questionId);
    if (!question || !question.options || question.options.length <= 2) return;

    const updatedOptions = question.options.filter(opt => opt.id !== optionId);
    updateQuestion(questionId, { options: updatedOptions });
  };

  // Set correct answer
  const setCorrectAnswer = (questionId: string, optionId: string, isCorrect: boolean) => {
    const question = examForm.questions.find(q => q.id === questionId);
    if (!question || !question.options) return;

    let updatedOptions;
    
    if (question.settings.multipleCorrect) {
      // Multiple correct answers allowed
      updatedOptions = question.options.map(opt =>
        opt.id === optionId ? { ...opt, isCorrect } : opt
      );
    } else {
      // Single correct answer
      updatedOptions = question.options.map(opt => ({
        ...opt,
        isCorrect: opt.id === optionId ? isCorrect : false
      }));
    }

    updateQuestion(questionId, { options: updatedOptions });
  };

  // Save exam to database
  const saveExamToDatabase = async (exam: ExamForm) => {
    try {
      console.log('💾 Saving exam to database:', exam.title);

      // First, save or update the exam
      const examData = {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        duration: exam.settings.timeLimit || 60,
        passing_score: exam.settings.passingScore,
        is_published: true,
        is_active: true,
        settings: JSON.stringify(exam.settings),
        styling: JSON.stringify(exam.styling),
        access_settings: JSON.stringify(exam.access),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: examResult, error: examError } = await supabase
        .from('exams')
        .upsert(examData, { onConflict: 'id' })
        .select()
        .single();

      if (examError) {
        console.error('❌ Error saving exam:', examError);
        throw examError;
      }

      console.log('✅ Exam saved to database:', examResult);

      // Delete existing questions for this exam
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .eq('exam_id', exam.id);

      if (deleteError) {
        console.warn('⚠️ Error deleting existing questions:', deleteError);
      }

      // Save questions
      const questionsToSave = exam.questions.map((question, index) => ({
        id: question.id,
        exam_id: exam.id,
        question_text: question.title,
        question_type: question.type,
        options: JSON.stringify(question.options || []),
        correct_answer: JSON.stringify(question.correctAnswer || question.options?.find(opt => opt.isCorrect)?.id || ''),
        points: question.points,
        order_index: index,
        explanation: question.explanation || '',
        metadata: JSON.stringify(question.metadata),
        settings: JSON.stringify(question.settings),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      if (questionsToSave.length > 0) {
        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questionsToSave);

        if (questionsError) {
          console.error('❌ Error saving questions:', questionsError);
          throw questionsError;
        }

        console.log('✅ Questions saved to database:', questionsToSave.length);
      }

      console.log('🎉 Exam and questions saved successfully!');
    } catch (error) {
      console.error('❌ Database save error:', error);
      throw error;
    }
  };

  // Save exam
  const saveExam = async () => {
    if (!examForm.title.trim()) {
      alert('Please enter an exam title');
      return;
    }
    
    if (examForm.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    // Validate questions
    const invalidQuestions = examForm.questions.filter(q => {
      if (!q.title.trim()) return true;
      if (q.type === 'multiple-choice' || q.type === 'checkboxes') {
        if (!q.options || q.options.length < 2) return true;
        if (!q.options.some(opt => opt.isCorrect)) return true;
      }
      return false;
    });

    if (invalidQuestions.length > 0) {
      alert(`Please fix ${invalidQuestions.length} invalid question(s)`);
      return;
    }

    setIsSaving(true);

    try {
      // Save to both database and localStorage for compatibility
      const examToSave = {
        ...examForm,
        id: examForm.id || `exam_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to localStorage (for backward compatibility)
      const savedExams = JSON.parse(localStorage.getItem('saved-exams') || '[]');
      const existingIndex = savedExams.findIndex((e: any) => e.id === examToSave.id);
      if (existingIndex >= 0) {
        savedExams[existingIndex] = examToSave;
      } else {
        savedExams.push(examToSave);
      }
      localStorage.setItem('saved-exams', JSON.stringify(savedExams));

      // Save to database
      await saveExamToDatabase(examToSave);
      
      setExamForm(prev => ({ ...prev, id: examToSave.id }));
      alert('Exam saved successfully and is now available on the dashboard!');
    } catch (error) {
      console.error('Error saving exam:', error);
      alert('Error saving exam. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Import from CSV
  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        
        if (headers.length < 6) {
          alert('CSV must have at least 6 columns: Question, Option A, Option B, Option C, Option D, Correct Answer');
          return;
        }

        const importedQuestions: Question[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          if (values.length < 6) continue;

          const question: Question = {
            ...defaultQuestion,
            id: `q_${Date.now()}_${i}`,
            title: values[0],
            options: [
              { id: '1', text: values[1], isCorrect: parseInt(values[5]) === 0 },
              { id: '2', text: values[2], isCorrect: parseInt(values[5]) === 1 },
              { id: '3', text: values[3], isCorrect: parseInt(values[5]) === 2 },
              { id: '4', text: values[4], isCorrect: parseInt(values[5]) === 3 }
            ],
            explanation: values[6] || '',
            metadata: {
              ...defaultQuestion.metadata,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          };

          importedQuestions.push(question);
        }

        setExamForm(prev => ({
          ...prev,
          questions: [...prev.questions, ...importedQuestions]
        }));

        alert(`Successfully imported ${importedQuestions.length} questions`);
      } catch (error) {
        alert('Error importing CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer', 'Explanation'];
    const rows = examForm.questions
      .filter(q => q.type === 'multiple-choice' && q.options)
      .map(q => {
        const correctIndex = q.options!.findIndex(opt => opt.isCorrect);
        return [
          `"${q.title}"`,
          `"${q.options![0]?.text || ''}"`,
          `"${q.options![1]?.text || ''}"`,
          `"${q.options![2]?.text || ''}"`,
          `"${q.options![3]?.text || ''}"`,
          correctIndex.toString(),
          `"${q.explanation || ''}"`
        ].join(',');
      });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${examForm.title.replace(/\s+/g, '_')}_questions.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedQuestionData = selectedQuestion 
    ? examForm.questions.find(q => q.id === selectedQuestion)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={examForm.title}
              onChange={(e) => setExamForm(prev => ({ ...prev, title: e.target.value }))}
              className="text-2xl font-bold bg-transparent border-none outline-none focus:bg-gray-50 px-2 py-1 rounded"
              placeholder="Untitled Exam"
            />
            <span className="text-sm text-gray-500">
              {examForm.questions.length} question{examForm.questions.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            
            <Button
              variant="outline"
              onClick={exportToCSV}
              disabled={examForm.questions.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            
            <Button onClick={saveExam} loading={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Exam'}
            </Button>
          </div>
        </div>
        
        {examForm.description && (
          <p className="text-gray-600 mt-2">{examForm.description}</p>
        )}
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Exam Description */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <textarea
                value={examForm.description}
                onChange={(e) => setExamForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Exam description (optional)"
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Questions List */}
          <div className="space-y-4">
            {examForm.questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                isSelected={selectedQuestion === question.id}
                onSelect={() => setSelectedQuestion(question.id)}
                onUpdate={(updates) => updateQuestion(question.id, updates)}
                onDelete={() => deleteQuestion(question.id)}
                onDuplicate={() => duplicateQuestion(question.id)}
                onMove={(direction) => moveQuestion(question.id, direction)}
                onAddOption={() => addOption(question.id)}
                onUpdateOption={(optionId, updates) => updateOption(question.id, optionId, updates)}
                onDeleteOption={(optionId) => deleteOption(question.id, optionId)}
                onSetCorrectAnswer={(optionId, isCorrect) => setCorrectAnswer(question.id, optionId, isCorrect)}
                canMoveUp={index > 0}
                canMoveDown={index < examForm.questions.length - 1}
              />
            ))}

            {/* Add Question Button */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowQuestionTypes(!showQuestionTypes)}
                className="w-full py-8 border-2 border-dashed border-gray-300 hover:border-gray-400"
              >
                <Plus className="h-6 w-6 mr-2" />
                Add Question
              </Button>

              {/* Question Types Dropdown */}
              {showQuestionTypes && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Choose Question Type</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {questionTypes.map((type) => (
                        <button
                          key={type.type}
                          onClick={() => addQuestion(type.type)}
                          className="flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded mr-3">
                            {type.icon}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{type.label}</div>
                            <div className="text-sm text-gray-500">{type.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Question Settings */}
        {selectedQuestionData && (
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            <QuestionSettings
              question={selectedQuestionData}
              onUpdate={(updates) => updateQuestion(selectedQuestionData.id, updates)}
            />
          </div>
        )}
      </div>

      {/* Hidden file input for CSV import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={importFromCSV}
        className="hidden"
      />
    </div>
  );
};

// Question Card Component (same as before but with updated props)
interface QuestionCardProps {
  question: Question;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (direction: 'up' | 'down') => void;
  onAddOption: () => void;
  onUpdateOption: (optionId: string, updates: Partial<QuestionOption>) => void;
  onDeleteOption: (optionId: string) => void;
  onSetCorrectAnswer: (optionId: string, isCorrect: boolean) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onMove,
  onAddOption,
  onUpdateOption,
  onDeleteOption,
  onSetCorrectAnswer,
  canMoveUp,
  canMoveDown
}) => {
  const [isExpanded, setIsExpanded] = useState(isSelected);

  React.useEffect(() => {
    setIsExpanded(isSelected);
  }, [isSelected]);

  const questionTypeInfo = questionTypes.find(t => t.type === question.type);

  return (
    <Card 
      className={`transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
              <span className="text-sm font-medium text-gray-500">
                {index + 1}.
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {questionTypeInfo?.icon}
              <span className="text-sm text-gray-600">{questionTypeInfo?.label}</span>
            </div>
            
            {question.required && (
              <Star className="h-4 w-4 text-red-500" />
            )}
            
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {question.points} pt{question.points !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {canMoveUp && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onMove('up'); }}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            )}
            
            {canMoveDown && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onMove('down'); }}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
            >
              <Copy className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Question Title */}
        <div className="mb-4">
          <textarea
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Question title"
            className="w-full text-lg font-medium bg-transparent border-none outline-none resize-none focus:bg-gray-50 p-2 rounded"
            rows={2}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Question Options */}
        {(question.type === 'multiple-choice' || question.type === 'checkboxes' || question.type === 'dropdown') && question.options && (
          <div className="space-y-3">
            {question.options.map((option, optIndex) => (
              <div key={option.id} className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetCorrectAnswer(option.id, !option.isCorrect);
                  }}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    option.isCorrect 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {option.isCorrect && (
                    question.type === 'checkboxes' ? (
                      <CheckSquare className="h-3 w-3" />
                    ) : (
                      <Circle className="h-3 w-3 fill-current" />
                    )
                  )}
                </button>
                
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => onUpdateOption(option.id, { text: e.target.value })}
                  placeholder={`Option ${optIndex + 1}`}
                  className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
                
                {question.options!.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteOption(option.id);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddOption();
              }}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        )}

        {/* True/False Options */}
        {question.type === 'true-false' && (
          <div className="space-y-3">
            {['True', 'False'].map((option, index) => (
              <div key={option} className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate({ correctAnswer: index });
                  }}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    question.correctAnswer === index
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {question.correctAnswer === index && (
                    <Circle className="h-3 w-3 fill-current" />
                  )}
                </button>
                <span className="text-gray-700">{option}</span>
              </div>
            ))}
          </div>
        )}

        {/* Explanation */}
        {question.explanation !== undefined && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <textarea
              value={question.explanation}
              onChange={(e) => onUpdate({ explanation: e.target.value })}
              placeholder="Explanation (shown after answering)"
              className="w-full text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Question Settings Component (same as before)
interface QuestionSettingsProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
}

const QuestionSettings: React.FC<QuestionSettingsProps> = ({ question, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Question Settings</h3>
      </div>

      {/* Basic Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Required</label>
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
          <input
            type="number"
            value={question.points}
            onChange={(e) => onUpdate({ points: parseInt(e.target.value) || 1 })}
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
          <select
            value={question.metadata.difficulty}
            onChange={(e) => onUpdate({ 
              metadata: { 
                ...question.metadata, 
                difficulty: e.target.value as 'easy' | 'medium' | 'hard' 
              } 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <input
            type="text"
            value={question.metadata.category}
            onChange={(e) => onUpdate({ 
              metadata: { 
                ...question.metadata, 
                category: e.target.value 
              } 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Math, Science"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionBuilderUpdated;