import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { supabase } from '../../lib/supabase';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Eye, 
  Save, 
  Upload, 
  Download, 
  FileText,
  GripVertical,
  Star,
  CheckSquare,
  Circle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

// Simplified Question interface for better compatibility
export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  type: 'multiple-choice';
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  points: number;
  explanation?: string;
  settings: {
    shuffleOptions: boolean;
    showPoints: boolean;
  };
  metadata: {
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
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
    timeLimit?: number;
    passingScore: number;
    maxAttempts: number;
    showCorrectAnswers: boolean;
    showScoreImmediately: boolean;
  };
}

const defaultQuestion: Omit<Question, 'id'> = {
  type: 'multiple-choice',
  title: '',
  required: false,
  points: 1,
  options: [
    { id: '1', text: 'Option A', isCorrect: true },
    { id: '2', text: 'Option B', isCorrect: false },
    { id: '3', text: 'Option C', isCorrect: false },
    { id: '4', text: 'Option D', isCorrect: false }
  ],
  settings: {
    shuffleOptions: false,
    showPoints: true
  },
  metadata: {
    difficulty: 'medium',
    category: 'General',
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

export const QuestionBuilderImproved: React.FC = () => {
  const [examForm, setExamForm] = useState<ExamForm>({
    id: '',
    title: 'Untitled Exam',
    description: '',
    questions: [],
    settings: {
      passingScore: 70,
      maxAttempts: 3,
      showCorrectAnswers: true,
      showScoreImmediately: true
    }
  });

  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showImportHelp, setShowImportHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add new question
  const addQuestion = () => {
    const newQuestion: Question = {
      ...defaultQuestion,
      id: `q_${Date.now()}`,
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

  // Update option
  const updateOption = (questionId: string, optionId: string, updates: Partial<QuestionOption>) => {
    const question = examForm.questions.find(q => q.id === questionId);
    if (!question || !question.options) return;

    const updatedOptions = question.options.map(opt =>
      opt.id === optionId ? { ...opt, ...updates } : opt
    );

    updateQuestion(questionId, { options: updatedOptions });
  };

  // Set correct answer
  const setCorrectAnswer = (questionId: string, optionId: string, isCorrect: boolean) => {
    const question = examForm.questions.find(q => q.id === questionId);
    if (!question || !question.options) return;

    // Single correct answer - uncheck others when one is checked
    const updatedOptions = question.options.map(opt => ({
      ...opt,
      isCorrect: opt.id === optionId ? isCorrect : false
    }));

    updateQuestion(questionId, { options: updatedOptions });
  };

  // Import from CSV/Excel with improved parsing
  const importFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isCSV = fileName.endsWith('.csv');

    if (!isCSV) {
      alert('Please select a CSV file (.csv)\n\nFor Excel files, please save as CSV first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        const lines = data.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          alert('File must contain at least a header row and one data row');
          return;
        }

        // Parse CSV with proper handling of quoted values
        const parseCSVLine = (line: string): string[] => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          
          result.push(current.trim());
          return result;
        };

        const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/"/g, ''));
        console.log('📋 CSV Headers:', headers);

        // More flexible column detection
        const findColumn = (possibleNames: string[]) => {
          return headers.findIndex(h => possibleNames.some(name => h.includes(name)));
        };

        const questionCol = findColumn(['question', 'q']);
        const optionACol = findColumn(['option a', 'a', 'choice a']);
        const optionBCol = findColumn(['option b', 'b', 'choice b']);
        const optionCCol = findColumn(['option c', 'c', 'choice c']);
        const optionDCol = findColumn(['option d', 'd', 'choice d']);
        const correctCol = findColumn(['correct', 'answer', 'right']);
        const explanationCol = findColumn(['explanation', 'explain', 'note']);

        if (questionCol === -1 || optionACol === -1 || optionBCol === -1 || correctCol === -1) {
          alert(`Missing required columns. Found headers: ${headers.join(', ')}\n\nRequired: Question, Option A, Option B, Correct Answer\nOptional: Option C, Option D, Explanation`);
          return;
        }

        const importedQuestions: Question[] = [];
        let skippedRows = 0;
        
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]).map(v => v.replace(/"/g, '').trim());
          
          const questionText = values[questionCol];
          if (!questionText) {
            skippedRows++;
            continue;
          }

          // Parse correct answer (flexible format)
          let correctAnswerIndex = 0;
          const correctAnswerValue = values[correctCol]?.toLowerCase();
          
          if (correctAnswerValue) {
            if (correctAnswerValue.includes('a') || correctAnswerValue === '0' || correctAnswerValue === '1') {
              correctAnswerIndex = 0;
            } else if (correctAnswerValue.includes('b') || correctAnswerValue === '1' || correctAnswerValue === '2') {
              correctAnswerIndex = 1;
            } else if (correctAnswerValue.includes('c') || correctAnswerValue === '2' || correctAnswerValue === '3') {
              correctAnswerIndex = 2;
            } else if (correctAnswerValue.includes('d') || correctAnswerValue === '3' || correctAnswerValue === '4') {
              correctAnswerIndex = 3;
            }
          }

          const options: QuestionOption[] = [
            { id: '1', text: values[optionACol] || 'Option A', isCorrect: correctAnswerIndex === 0 },
            { id: '2', text: values[optionBCol] || 'Option B', isCorrect: correctAnswerIndex === 1 }
          ];

          // Add optional C and D options if they exist
          if (optionCCol !== -1 && values[optionCCol]) {
            options.push({ id: '3', text: values[optionCCol], isCorrect: correctAnswerIndex === 2 });
          }
          if (optionDCol !== -1 && values[optionDCol]) {
            options.push({ id: '4', text: values[optionDCol], isCorrect: correctAnswerIndex === 3 });
          }

          const question: Question = {
            ...defaultQuestion,
            id: `q_${Date.now()}_${i}`,
            title: questionText,
            options,
            explanation: explanationCol !== -1 ? values[explanationCol] || '' : '',
            metadata: {
              ...defaultQuestion.metadata,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          };

          importedQuestions.push(question);
        }

        if (importedQuestions.length === 0) {
          alert('No valid questions found in the file. Please check the format.');
          return;
        }

        setExamForm(prev => ({
          ...prev,
          questions: [...prev.questions, ...importedQuestions]
        }));

        alert(`✅ Successfully imported ${importedQuestions.length} questions!${skippedRows > 0 ? `\n⚠️ Skipped ${skippedRows} invalid rows.` : ''}`);
        console.log('✅ Imported questions:', importedQuestions);
      } catch (error) {
        console.error('❌ Import error:', error);
        alert('Error importing file. Please check the format and try again.');
      }
    };

    reader.readAsText(file);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer', 'Explanation'];
    const rows = examForm.questions.map(q => {
      const correctIndex = q.options?.findIndex(opt => opt.isCorrect) || 0;
      const correctLetter = ['A', 'B', 'C', 'D'][correctIndex];
      
      return [
        `"${q.title}"`,
        `"${q.options?.[0]?.text || ''}"`,
        `"${q.options?.[1]?.text || ''}"`,
        `"${q.options?.[2]?.text || ''}"`,
        `"${q.options?.[3]?.text || ''}"`,
        correctLetter,
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

  // Save exam to database
  const saveExamToDatabase = async (exam: ExamForm) => {
    try {
      console.log('💾 Saving exam to database:', exam.title);

      const examData = {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        duration: exam.settings.timeLimit || 60,
        passing_score: exam.settings.passingScore,
        is_published: true,
        is_active: true,
        settings: JSON.stringify(exam.settings),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: examResult, error: examError } = await supabase
        .from('exams')
        .upsert(examData, { onConflict: 'id' })
        .select()
        .single();

      if (examError) throw examError;

      // Delete existing questions
      await supabase.from('questions').delete().eq('exam_id', exam.id);

      // Save questions
      const questionsToSave = exam.questions.map((question, index) => ({
        id: question.id,
        exam_id: exam.id,
        question_text: question.title,
        question_type: question.type,
        options: JSON.stringify(question.options || []),
        correct_answer: JSON.stringify(question.options?.find(opt => opt.isCorrect)?.id || ''),
        points: question.points,
        order_index: index,
        explanation: question.explanation || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      if (questionsToSave.length > 0) {
        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questionsToSave);

        if (questionsError) throw questionsError;
      }

      console.log('🎉 Exam saved successfully!');
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
      if (!q.options || q.options.length < 2) return true;
      if (!q.options.some(opt => opt.isCorrect)) return true;
      return false;
    });

    if (invalidQuestions.length > 0) {
      alert(`Please fix ${invalidQuestions.length} invalid question(s):\n- Questions must have a title\n- Questions must have at least 2 options\n- Questions must have a correct answer selected`);
      return;
    }

    setIsSaving(true);

    try {
      const examToSave = {
        ...examForm,
        id: examForm.id || `exam_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to localStorage for compatibility
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
      alert('✅ Exam saved successfully and is now available on the dashboard!');
    } catch (error) {
      console.error('Error saving exam:', error);
      alert('❌ Error saving exam. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
              onClick={() => setShowImportHelp(!showImportHelp)}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Import Help
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
      </div>

      {/* Import Help Modal */}
      {showImportHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                CSV Import Format Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Required CSV Format:</h4>
                <div className="text-sm text-blue-800 font-mono bg-white p-2 rounded">
                  Question,Option A,Option B,Option C,Option D,Correct Answer,Explanation
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Column Details:</h4>
                <ul className="text-sm space-y-1">
                  <li><strong>Question:</strong> The question text</li>
                  <li><strong>Option A-D:</strong> Answer choices (C and D are optional)</li>
                  <li><strong>Correct Answer:</strong> A, B, C, D or 0, 1, 2, 3</li>
                  <li><strong>Explanation:</strong> Optional explanation text</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Example Row:</h4>
                <div className="text-sm text-green-800 font-mono bg-white p-2 rounded">
                  "What is 2+2?","3","4","5","6","B","The answer is 4"
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Tips:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Use quotes around text with commas</li>
                  <li>• Save Excel files as CSV before importing</li>
                  <li>• Minimum 2 options required per question</li>
                  <li>• Each question must have one correct answer</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setShowImportHelp(false)}>
                  Got it!
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
                onUpdateOption={(optionId, updates) => updateOption(question.id, optionId, updates)}
                onSetCorrectAnswer={(optionId, isCorrect) => setCorrectAnswer(question.id, optionId, isCorrect)}
                canMoveUp={index > 0}
                canMoveDown={index < examForm.questions.length - 1}
              />
            ))}

            {/* Add Question Button */}
            <Button
              variant="outline"
              onClick={addQuestion}
              className="w-full py-8 border-2 border-dashed border-gray-300 hover:border-gray-400"
            >
              <Plus className="h-6 w-6 mr-2" />
              Add Question
            </Button>
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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={importFromFile}
        className="hidden"
      />
    </div>
  );
};

// Question Card Component
interface QuestionCardProps {
  question: Question;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (direction: 'up' | 'down') => void;
  onUpdateOption: (optionId: string, updates: Partial<QuestionOption>) => void;
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
  onUpdateOption,
  onSetCorrectAnswer,
  canMoveUp,
  canMoveDown
}) => {
  return (
    <Card 
      className={`transition-all cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GripVertical className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-500">
              {index + 1}.
            </span>
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
            placeholder="Enter your question here..."
            className="w-full text-lg font-medium bg-transparent border-none outline-none resize-none focus:bg-gray-50 p-2 rounded"
            rows={2}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Question Options */}
        {question.options && (
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
                  {option.isCorrect && <Circle className="h-3 w-3 fill-current" />}
                </button>
                
                <span className="text-sm font-medium text-gray-500 w-8">
                  {String.fromCharCode(65 + optIndex)}:
                </span>
                
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => onUpdateOption(option.id, { text: e.target.value })}
                  placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                  className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
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
              placeholder="Explanation (optional - shown after answering)"
              className="w-full text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Question Settings Component
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

      <div className="space-y-4">
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
            placeholder="e.g., Healthcare, Safety"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Shuffle Options</label>
          <input
            type="checkbox"
            checked={question.settings.shuffleOptions}
            onChange={(e) => onUpdate({ 
              settings: { 
                ...question.settings, 
                shuffleOptions: e.target.checked 
              } 
            })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Show Points</label>
          <input
            type="checkbox"
            checked={question.settings.showPoints}
            onChange={(e) => onUpdate({ 
              settings: { 
                ...question.settings, 
                showPoints: e.target.checked 
              } 
            })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionBuilderImproved;