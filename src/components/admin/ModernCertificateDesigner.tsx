import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Upload,
  Download, 
  Eye, 
  Save,
  FileText,
  Edit3,
  Plus,
  Trash2,
  MousePointer,
  Type,
  Move,
  Copy,
  RotateCcw,
  Layers,
  X,
  Settings,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Database,
  Users,
  BookOpen,
  Award,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface EditableField {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  value: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: string;
  textAlign: string;
  placeholder: string;
  fieldType: 'text' | 'date' | 'number' | 'email' | 'database';
  required: boolean;
  zIndex: number;
  databaseField?: string; // Maps to database fields like 'student_name', 'exam_title', etc.
}

interface CertificateTemplate {
  id: string;
  name: string;
  file?: File;
  fileUrl?: string;
  templateType: 'image' | 'pdf' | 'powerpoint';
  fields: EditableField[];
  backgroundStyle: {
    backgroundImage?: string;
    backgroundColor?: string;
    width: number;
    height: number;
  };
}

interface ExamData {
  id: string;
  title: string;
  description: string;
  category: string;
  passingScore: number;
  duration: number;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  department?: string;
  employeeId?: string;
}

interface CertificateData {
  [key: string]: string;
}

const fieldTypeOptions = [
  { value: 'text', label: 'Text' },
  { value: 'date', label: 'Date' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'database', label: 'Database Field' }
];

const databaseFieldOptions = [
  { value: 'student_name', label: 'Student Name' },
  { value: 'student_email', label: 'Student Email' },
  { value: 'student_department', label: 'Student Department' },
  { value: 'student_employee_id', label: 'Employee ID' },
  { value: 'exam_title', label: 'Exam Title' },
  { value: 'exam_category', label: 'Exam Category' },
  { value: 'exam_score', label: 'Exam Score' },
  { value: 'exam_percentage', label: 'Score Percentage' },
  { value: 'completion_date', label: 'Completion Date' },
  { value: 'certificate_number', label: 'Certificate Number' },
  { value: 'passing_score', label: 'Passing Score' }
];

const fontFamilyOptions = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Verdana, sans-serif', label: 'Verdana' }
];

export const ModernCertificateDesigner: React.FC = () => {
  const { user } = useAuth();
  const [currentTemplate, setCurrentTemplate] = useState<CertificateTemplate>({
    id: 'default',
    name: 'No Template',
    templateType: 'image',
    fields: [],
    backgroundStyle: {
      backgroundColor: '#ffffff',
      width: 800,
      height: 600
    }
  });
  const [certificateData, setCertificateData] = useState<CertificateData>({});
  const [activeSection, setActiveSection] = useState<'import' | 'edit' | 'preview' | 'database'>('database');
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Database-related state
  const [exams, setExams] = useState<ExamData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [examAttempts, setExamAttempts] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load data from database
  useEffect(() => {
    loadDatabaseData();
  }, []);

  const loadDatabaseData = async () => {
    setLoadingData(true);
    try {
      // Load exams
      const { data: examsData, error: examsError } = await supabase
        .from('exams')
        .select(`
          id,
          title,
          description,
          passing_score,
          duration,
          categories(name)
        `)
        .eq('is_published', true)
        .eq('is_active', true);

      if (examsError) {
        console.error('Error loading exams:', examsError);
      } else {
        const formattedExams = examsData?.map(exam => ({
          id: exam.id,
          title: exam.title,
          description: exam.description || '',
          category: exam.categories?.name || 'Uncategorized',
          passingScore: exam.passing_score,
          duration: exam.duration
        })) || [];
        setExams(formattedExams);
      }

      // Load students (users with completed exam attempts)
      const { data: studentsData, error: studentsError } = await supabase
        .from('profiles')
        .select('id, name, email, department, employee_id')
        .eq('role', 'student');

      if (studentsError) {
        console.error('Error loading students:', studentsError);
      } else {
        const formattedStudents = studentsData?.map(student => ({
          id: student.id,
          name: student.name,
          email: student.email,
          department: student.department,
          employeeId: student.employee_id
        })) || [];
        setStudents(formattedStudents);
      }

    } catch (error) {
      console.error('Error loading database data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadExamAttempts = async (examId: string, studentId: string) => {
    if (!examId || !studentId) return;

    try {
      const { data: attemptsData, error } = await supabase
        .from('exam_attempts')
        .select(`
          id,
          score,
          percentage,
          completed_at,
          status,
          exams(title, passing_score),
          profiles(name, email, department, employee_id)
        `)
        .eq('exam_id', examId)
        .eq('user_id', studentId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error loading exam attempts:', error);
      } else {
        setExamAttempts(attemptsData || []);
        
        // Auto-populate certificate data if attempt exists
        if (attemptsData && attemptsData.length > 0) {
          const attempt = attemptsData[0]; // Most recent attempt
          const student = students.find(s => s.id === studentId);
          const exam = exams.find(e => e.id === examId);
          
          setCertificateData({
            student_name: student?.name || '',
            student_email: student?.email || '',
            student_department: student?.department || '',
            student_employee_id: student?.employeeId || '',
            exam_title: exam?.title || '',
            exam_category: exam?.category || '',
            exam_score: attempt.score?.toString() || '',
            exam_percentage: attempt.percentage?.toString() || '',
            completion_date: new Date(attempt.completed_at).toLocaleDateString(),
            certificate_number: `CERT-${Date.now()}`,
            passing_score: exam?.passingScore?.toString() || ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading exam attempts:', error);
    }
  };

  // Watch for exam/student selection changes
  useEffect(() => {
    if (selectedExam && selectedStudent) {
      loadExamAttempts(selectedExam, selectedStudent);
    }
  }, [selectedExam, selectedStudent]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileUrl = URL.createObjectURL(file);
      let templateType: 'image' | 'pdf' | 'powerpoint' = 'image';
      
      if (file.type.includes('pdf')) {
        templateType = 'pdf';
      } else if (file.type.includes('presentation') || file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
        templateType = 'powerpoint';
      }

      // For images, we can directly use them as background
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          setCurrentTemplate({
            id: `template_${Date.now()}`,
            name: file.name.split('.')[0],
            file: file,
            fileUrl: fileUrl,
            templateType: 'image',
            fields: [],
            backgroundStyle: {
              backgroundImage: `url(${fileUrl})`,
              width: Math.min(img.width, 800),
              height: Math.min(img.height, 600)
            }
          });
          setActiveSection('edit');
        };
        img.src = fileUrl;
      } else if (templateType === 'pdf') {
        // For PDF, we'll convert first page to image
        try {
          const pdfjsLib = await import('pdfjs-dist');
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
          
          const pdf = await pdfjsLib.getDocument(fileUrl).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1.5 });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d')!;
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          await page.render({ canvasContext: context, viewport }).promise;
          const imageUrl = canvas.toDataURL();
          
          setCurrentTemplate({
            id: `template_${Date.now()}`,
            name: file.name.split('.')[0],
            file: file,
            fileUrl: imageUrl,
            templateType: 'pdf',
            fields: [],
            backgroundStyle: {
              backgroundImage: `url(${imageUrl})`,
              width: Math.min(viewport.width, 800),
              height: Math.min(viewport.height, 600)
            }
          });
          setActiveSection('edit');
        } catch (error) {
          console.error('Error processing PDF:', error);
          alert('Error processing PDF. Please try an image file instead.');
        }
      } else {
        alert('PowerPoint files need to be converted to images first. Please export your PowerPoint slide as PNG/JPG and upload that instead.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    }
  }, []);

  const addField = useCallback((x: number, y: number) => {
    const newField: EditableField = {
      id: `field_${Date.now()}`,
      name: `Field ${currentTemplate.fields.length + 1}`,
      x: x,
      y: y,
      width: 200,
      height: 30,
      value: 'Click to edit',
      fontSize: 16,
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      textAlign: 'left',
      placeholder: 'Enter text here',
      fieldType: 'text',
      required: false,
      zIndex: currentTemplate.fields.length + 1,
      databaseField: undefined
    };
    
    setCurrentTemplate(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedField(newField.id);
  }, [currentTemplate.fields.length]);

  const addDatabaseField = useCallback((databaseField: string) => {
    const fieldLabel = databaseFieldOptions.find(opt => opt.value === databaseField)?.label || databaseField;
    const centerX = currentTemplate.backgroundStyle.width / 2 - 100;
    const centerY = currentTemplate.backgroundStyle.height / 2 - 15 + (currentTemplate.fields.length * 40);
    
    const newField: EditableField = {
      id: `field_${Date.now()}`,
      name: fieldLabel,
      x: centerX,
      y: centerY,
      width: 200,
      height: 30,
      value: certificateData[databaseField] || `{${databaseField}}`,
      fontSize: 16,
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      textAlign: 'center',
      placeholder: fieldLabel,
      fieldType: 'database',
      required: false,
      zIndex: currentTemplate.fields.length + 1,
      databaseField: databaseField
    };
    
    setCurrentTemplate(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedField(newField.id);
  }, [currentTemplate.fields.length, currentTemplate.backgroundStyle, certificateData]);

  const addFieldFromButton = useCallback(() => {
    // Add field at center of template
    const centerX = currentTemplate.backgroundStyle.width / 2 - 100;
    const centerY = currentTemplate.backgroundStyle.height / 2 - 15;
    addField(centerX, centerY);
  }, [addField, currentTemplate.backgroundStyle]);

  const updateField = useCallback((id: string, updates: Partial<EditableField>) => {
    setCurrentTemplate(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    }));
  }, []);

  const removeField = useCallback((id: string) => {
    setCurrentTemplate(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== id)
    }));
    if (selectedField === id) {
      setSelectedField(null);
    }
  }, [selectedField]);

  const duplicateField = useCallback((id: string) => {
    const fieldToDuplicate = currentTemplate.fields.find(f => f.id === id);
    if (fieldToDuplicate) {
      const newField: EditableField = {
        ...fieldToDuplicate,
        id: `field_${Date.now()}`,
        name: `${fieldToDuplicate.name} (Copy)`,
        x: fieldToDuplicate.x + 20,
        y: fieldToDuplicate.y + 20,
        zIndex: currentTemplate.fields.length + 1
      };
      setCurrentTemplate(prev => ({
        ...prev,
        fields: [...prev.fields, newField]
      }));
      setSelectedField(newField.id);
    }
  }, [currentTemplate.fields]);

  const moveFieldLayer = useCallback((id: string, direction: 'up' | 'down') => {
    setCurrentTemplate(prev => ({
      ...prev,
      fields: prev.fields.map(field => {
        if (field.id === id) {
          const newZIndex = direction === 'up' 
            ? Math.min(field.zIndex + 1, prev.fields.length)
            : Math.max(field.zIndex - 1, 1);
          return { ...field, zIndex: newZIndex };
        }
        return field;
      })
    }));
  }, []);

  const moveFieldPosition = useCallback((id: string, direction: 'up' | 'down' | 'left' | 'right', amount: number = 1) => {
    const field = currentTemplate.fields.find(f => f.id === id);
    if (!field) return;

    let newX = field.x;
    let newY = field.y;

    switch (direction) {
      case 'up':
        newY = Math.max(0, field.y - amount);
        break;
      case 'down':
        newY = Math.min(currentTemplate.backgroundStyle.height - field.height, field.y + amount);
        break;
      case 'left':
        newX = Math.max(0, field.x - amount);
        break;
      case 'right':
        newX = Math.min(currentTemplate.backgroundStyle.width - field.width, field.x + amount);
        break;
    }

    updateField(id, { x: newX, y: newY });
  }, [currentTemplate.fields, currentTemplate.backgroundStyle, updateField]);

  const clearAllFields = useCallback(() => {
    if (window.confirm('Are you sure you want to delete all fields? This action cannot be undone.')) {
      setCurrentTemplate(prev => ({
        ...prev,
        fields: []
      }));
      setSelectedField(null);
    }
  }, []);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!editMode || !canvasRef.current || isDragging) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if clicking on existing field
    const clickedField = currentTemplate.fields.find(field => 
      x >= field.x && x <= field.x + field.width &&
      y >= field.y && y <= field.y + field.height
    );
    
    if (clickedField) {
      setSelectedField(clickedField.id);
    } else {
      // Add new field at click position
      addField(x, y);
    }
  }, [editMode, currentTemplate.fields, addField, isDragging]);

  const handleMouseDown = useCallback((event: React.MouseEvent, fieldId: string) => {
    if (!editMode) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const field = currentTemplate.fields.find(f => f.id === fieldId);
    if (!field) return;

    setSelectedField(fieldId);
    setIsDragging(true);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: event.clientX - rect.left - field.x,
        y: event.clientY - rect.top - field.y
      });
    }
  }, [editMode, currentTemplate.fields]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDragging || !selectedField || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(
      currentTemplate.backgroundStyle.width - 200, 
      event.clientX - rect.left - dragOffset.x
    ));
    const newY = Math.max(0, Math.min(
      currentTemplate.backgroundStyle.height - 30, 
      event.clientY - rect.top - dragOffset.y
    ));

    updateField(selectedField, { x: newX, y: newY });
  }, [isDragging, selectedField, dragOffset, currentTemplate.backgroundStyle, updateField]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const updateCertificateData = useCallback((fieldId: string, value: string) => {
    setCertificateData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  }, []);

  const generateCertificate = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation: currentTemplate.backgroundStyle.width > currentTemplate.backgroundStyle.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [currentTemplate.backgroundStyle.width, currentTemplate.backgroundStyle.height]
      });

      // Add background image if available
      if (currentTemplate.fileUrl && currentTemplate.templateType === 'image') {
        try {
          pdf.addImage(
            currentTemplate.fileUrl, 
            'JPEG', 
            0, 
            0, 
            currentTemplate.backgroundStyle.width, 
            currentTemplate.backgroundStyle.height
          );
        } catch (error) {
          console.warn('Could not add background image to PDF');
        }
      }

      // Add text fields sorted by zIndex
      const sortedFields = [...currentTemplate.fields].sort((a, b) => a.zIndex - b.zIndex);
      sortedFields.forEach(field => {
        let value = field.value;
        
        // Use database data for database fields
        if (field.fieldType === 'database' && field.databaseField) {
          value = certificateData[field.databaseField] || field.value;
        } else {
          value = certificateData[field.id] || field.value;
        }
        
        pdf.setFontSize(field.fontSize);
        pdf.setTextColor(field.color);
        pdf.text(value, field.x, field.y + field.fontSize);
      });

      // Save certificate to database if we have exam attempt data
      if (selectedExam && selectedStudent && examAttempts.length > 0) {
        const attempt = examAttempts[0];
        const certificateNumber = `CERT-${Date.now()}`;
        
        try {
          const { error: certError } = await supabase
            .from('certificates')
            .insert({
              certificate_number: certificateNumber,
              user_id: selectedStudent,
              exam_id: selectedExam,
              attempt_id: attempt.id,
              score: attempt.score,
              percentage: attempt.percentage,
              grade_text: attempt.percentage >= (exams.find(e => e.id === selectedExam)?.passingScore || 70) ? 'PASS' : 'FAIL',
              verification_code: `VER-${Date.now()}`,
              metadata: {
                template_name: currentTemplate.name,
                fields: currentTemplate.fields.length
              }
            });
            
          if (certError) {
            console.error('Error saving certificate to database:', certError);
          } else {
            console.log('✅ Certificate saved to database');
          }
        } catch (error) {
          console.error('Error saving certificate:', error);
        }
      }

      pdf.save(`certificate-${currentTemplate.name}-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error generating certificate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentTemplate, certificateData, selectedExam, selectedStudent, examAttempts, exams]);

  const saveTemplate = useCallback(() => {
    try {
      const templateData = {
        name: currentTemplate.name,
        fields: currentTemplate.fields,
        backgroundStyle: currentTemplate.backgroundStyle
      };
      localStorage.setItem('certificate-template', JSON.stringify(templateData));
      alert('Template saved successfully!');
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template. Please try again.');
    }
  }, [currentTemplate]);

  const selectedFieldData = currentTemplate.fields.find(f => f.id === selectedField);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Designer</h1>
        <p className="text-gray-600">Connect with database to create certificates from exam results</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${activeSection === 'database' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeSection === 'database' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
            <span className="font-medium">Select Data</span>
          </div>
          <div className="w-8 h-px bg-gray-300"></div>
          <div className={`flex items-center space-x-2 ${activeSection === 'import' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeSection === 'import' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
            <span className="font-medium">Import Template</span>
          </div>
          <div className="w-8 h-px bg-gray-300"></div>
          <div className={`flex items-center space-x-2 ${activeSection === 'edit' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeSection === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</div>
            <span className="font-medium">Position Fields</span>
          </div>
          <div className="w-8 h-px bg-gray-300"></div>
          <div className={`flex items-center space-x-2 ${activeSection === 'preview' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeSection === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>4</div>
            <span className="font-medium">Generate Certificate</span>
          </div>
        </div>
      </div>

      {/* Step 1: Database Selection */}
      {activeSection === 'database' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Step 1: Select Exam & Student Data
                <Button
                  onClick={loadDatabaseData}
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  disabled={loadingData}
                >
                  <RefreshCw className={`h-4 w-4 ${loadingData ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingData ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading data from database...</p>
                </div>
              ) : (
                <>
                  {/* Exam Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <BookOpen className="h-4 w-4 inline mr-2" />
                      Select Exam
                    </label>
                    <select
                      value={selectedExam}
                      onChange={(e) => setSelectedExam(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choose an exam...</option>
                      {exams.map(exam => (
                        <option key={exam.id} value={exam.id}>
                          {exam.title} ({exam.category})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {exams.length} published exams found in database
                    </p>
                  </div>

                  {/* Student Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="h-4 w-4 inline mr-2" />
                      Select Student
                    </label>
                    <select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choose a student...</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.email})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {students.length} students found in database
                    </p>
                  </div>

                  {/* Exam Attempts */}
                  {selectedExam && selectedStudent && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Award className="h-4 w-4 inline mr-2" />
                        Exam Attempts
                      </label>
                      {examAttempts.length > 0 ? (
                        <div className="space-y-2">
                          {examAttempts.map((attempt, index) => (
                            <div key={attempt.id} className="p-3 border rounded-lg bg-green-50 border-green-200">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-green-800">
                                    Attempt #{index + 1} - {attempt.percentage}%
                                  </p>
                                  <p className="text-sm text-green-600">
                                    Completed: {new Date(attempt.completed_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-green-800">
                                    Score: {attempt.score}
                                  </p>
                                  <p className="text-xs text-green-600">
                                    {attempt.percentage >= (exams.find(e => e.id === selectedExam)?.passingScore || 70) ? 'PASSED' : 'FAILED'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 border border-gray-200 rounded-lg text-center text-gray-500">
                          <p>No completed exam attempts found for this student and exam combination.</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Database Fields Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Available Database Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  These fields will be automatically populated from the database:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {databaseFieldOptions.map(field => (
                    <div key={field.value} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{field.label}</span>
                      <span className="text-xs text-gray-500 font-mono">
                        {certificateData[field.value] || `{${field.value}}`}
                      </span>
                    </div>
                  ))}
                </div>
                
                {selectedExam && selectedStudent && examAttempts.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">✅ Data loaded successfully!</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Certificate data is ready. Proceed to import your template.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="lg:col-span-2 flex justify-between">
            <div></div>
            <Button 
              onClick={() => setActiveSection('import')} 
              disabled={!selectedExam || !selectedStudent || examAttempts.length === 0}
            >
              Next: Import Template
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Import Template */}
      {activeSection === 'import' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Step 2: Import Certificate Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-gray-400 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Certificate Template</h3>
                  <p className="text-gray-600 mb-4">
                    Upload an image (PNG, JPG) or PDF file. The template will preserve all styling and layout.
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.gif"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="template-upload"
                  />
                  <label
                    htmlFor="template-upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500 space-y-2">
                <p><strong>Recommended:</strong> Export your PowerPoint slide as PNG/JPG for best results</p>
                <p>Supported formats: Images (.jpg, .png, .gif), PDF (.pdf)</p>
              </div>

              <div className="flex justify-between">
                <Button onClick={() => setActiveSection('database')} variant="outline">
                  Back
                </Button>
                <div></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Edit Template */}
      {activeSection === 'edit' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template Canvas */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Edit3 className="h-5 w-5" />
                    Position Fields: {currentTemplate.name}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditMode(!editMode)}
                      variant={editMode ? 'default' : 'outline'}
                      size="sm"
                    >
                      {editMode ? <MousePointer className="h-4 w-4 mr-2" /> : <Type className="h-4 w-4 mr-2" />}
                      {editMode ? 'Edit Mode' : 'View Mode'}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Field Management Toolbar */}
                {editMode && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                    <div className="flex flex-wrap gap-2 items-center mb-3">
                      <Button onClick={addFieldFromButton} size="sm" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Field
                      </Button>
                      {selectedField && (
                        <>
                          <Button 
                            onClick={() => duplicateField(selectedField)} 
                            size="sm" 
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <Copy className="h-4 w-4" />
                            Duplicate
                          </Button>
                          <Button 
                            onClick={() => removeField(selectedField)} 
                            size="sm" 
                            variant="outline"
                            className="flex items-center gap-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                          <div className="flex items-center gap-1 ml-4">
                            <span className="text-sm text-gray-600 mr-2">Move:</span>
                            <Button 
                              onClick={() => moveFieldPosition(selectedField, 'up', 5)} 
                              size="sm" 
                              variant="outline"
                              title="Move up"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button 
                              onClick={() => moveFieldPosition(selectedField, 'down', 5)} 
                              size="sm" 
                              variant="outline"
                              title="Move down"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                            <Button 
                              onClick={() => moveFieldPosition(selectedField, 'left', 5)} 
                              size="sm" 
                              variant="outline"
                              title="Move left"
                            >
                              <ArrowLeft className="h-3 w-3" />
                            </Button>
                            <Button 
                              onClick={() => moveFieldPosition(selectedField, 'right', 5)} 
                              size="sm" 
                              variant="outline"
                              title="Move right"
                            >
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </>
                      )}
                      {currentTemplate.fields.length > 0 && (
                        <Button 
                          onClick={clearAllFields} 
                          size="sm" 
                          variant="outline"
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 ml-auto"
                        >
                          <X className="h-4 w-4" />
                          Clear All
                        </Button>
                      )}
                    </div>
                    
                    {/* Database Fields Quick Add */}
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600 mb-2">Quick Add Database Fields:</p>
                      <div className="flex flex-wrap gap-1">
                        {databaseFieldOptions.slice(0, 6).map(field => (
                          <Button
                            key={field.value}
                            onClick={() => addDatabaseField(field.value)}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            <Database className="h-3 w-3 mr-1" />
                            {field.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    {editMode ? 'Click to add fields, drag to position them exactly where you need them' : 'Switch to Edit Mode to position fields'}
                  </p>
                </div>
                
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <div
                    ref={canvasRef}
                    className={`relative ${editMode ? 'cursor-crosshair' : 'cursor-default'} select-none`}
                    style={{
                      width: currentTemplate.backgroundStyle.width,
                      height: currentTemplate.backgroundStyle.height,
                      maxWidth: '100%',
                      backgroundImage: currentTemplate.backgroundStyle.backgroundImage,
                      backgroundColor: currentTemplate.backgroundStyle.backgroundColor,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      margin: '0 auto'
                    }}
                    onClick={handleCanvasClick}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {/* Render editable fields sorted by zIndex */}
                    {currentTemplate.fields
                      .sort((a, b) => a.zIndex - b.zIndex)
                      .map(field => (
                      <div
                        key={field.id}
                        className={`absolute border-2 ${
                          selectedField === field.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : editMode 
                              ? field.fieldType === 'database'
                                ? 'border-dashed border-green-400 hover:border-green-600 bg-green-50'
                                : 'border-dashed border-gray-400 hover:border-gray-600'
                              : 'border-transparent'
                        } ${editMode ? 'cursor-move' : ''} transition-all`}
                        style={{
                          left: field.x,
                          top: field.y,
                          width: field.width,
                          height: field.height,
                          fontSize: field.fontSize,
                          color: field.color,
                          fontFamily: field.fontFamily,
                          fontWeight: field.fontWeight,
                          textAlign: field.textAlign as any,
                          display: 'flex',
                          alignItems: 'center',
                          padding: '2px 4px',
                          zIndex: field.zIndex,
                          userSelect: 'none'
                        }}
                        onMouseDown={(e) => handleMouseDown(e, field.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (editMode) setSelectedField(field.id);
                        }}
                      >
                        <span className="truncate pointer-events-none">
                          {field.fieldType === 'database' && field.databaseField 
                            ? certificateData[field.databaseField] || field.value
                            : certificateData[field.id] || field.value
                          }
                        </span>
                        {field.fieldType === 'database' && (
                          <Database className="h-3 w-3 ml-1 text-green-600" />
                        )}
                        {editMode && selectedField === field.id && (
                          <div className="absolute -top-10 -right-2 flex gap-1 bg-white shadow-lg rounded border p-1">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateField(field.id);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              title="Duplicate"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeField(field.id);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              title="Delete"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Properties Panel */}
          <div className="space-y-4">
            {/* Field Properties */}
            {selectedFieldData && editMode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Field Properties
                    {selectedFieldData.fieldType === 'database' && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Database Field
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    label="Field Name"
                    value={selectedFieldData.name}
                    onChange={(e) => updateField(selectedField!, { name: e.target.value })}
                    size="sm"
                  />
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Field Type</label>
                    <select
                      value={selectedFieldData.fieldType}
                      onChange={(e) => updateField(selectedField!, { fieldType: e.target.value as any })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    >
                      {fieldTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  {selectedFieldData.fieldType === 'database' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Database Field</label>
                      <select
                        value={selectedFieldData.databaseField || ''}
                        onChange={(e) => updateField(selectedField!, { databaseField: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="">Select database field...</option>
                        {databaseFieldOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedFieldData.fieldType !== 'database' && (
                    <Input
                      label="Default Text"
                      value={selectedFieldData.value}
                      onChange={(e) => updateField(selectedField!, { value: e.target.value })}
                      size="sm"
                    />
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="X Position"
                      type="number"
                      value={Math.round(selectedFieldData.x)}
                      onChange={(e) => updateField(selectedField!, { x: parseInt(e.target.value) || 0 })}
                      size="sm"
                    />
                    <Input
                      label="Y Position"
                      type="number"
                      value={Math.round(selectedFieldData.y)}
                      onChange={(e) => updateField(selectedField!, { y: parseInt(e.target.value) || 0 })}
                      size="sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Width"
                      type="number"
                      value={selectedFieldData.width}
                      onChange={(e) => updateField(selectedField!, { width: parseInt(e.target.value) || 100 })}
                      size="sm"
                    />
                    <Input
                      label="Height"
                      type="number"
                      value={selectedFieldData.height}
                      onChange={(e) => updateField(selectedField!, { height: parseInt(e.target.value) || 20 })}
                      size="sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Font Size"
                      type="number"
                      value={selectedFieldData.fontSize}
                      onChange={(e) => updateField(selectedField!, { fontSize: parseInt(e.target.value) || 12 })}
                      size="sm"
                    />
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                      <input
                        type="color"
                        value={selectedFieldData.color}
                        onChange={(e) => updateField(selectedField!, { color: e.target.value })}
                        className="w-full h-8 rounded border border-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Font Family</label>
                    <select
                      value={selectedFieldData.fontFamily}
                      onChange={(e) => updateField(selectedField!, { fontFamily: e.target.value })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    >
                      {fontFamilyOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Font Weight</label>
                      <select
                        value={selectedFieldData.fontWeight}
                        onChange={(e) => updateField(selectedField!, { fontWeight: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Text Align</label>
                      <select
                        value={selectedFieldData.textAlign}
                        onChange={(e) => updateField(selectedField!, { textAlign: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <strong>Tip:</strong> Drag the field on the template for precise positioning, or use the arrow buttons in the toolbar for fine adjustments.
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fields List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Fields ({currentTemplate.fields.length})
                  </span>
                  {editMode && (
                    <Button onClick={addFieldFromButton} size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {currentTemplate.fields
                    .sort((a, b) => b.zIndex - a.zIndex)
                    .map(field => (
                    <div
                      key={field.id}
                      className={`p-2 border rounded cursor-pointer text-sm transition-colors ${
                        selectedField === field.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedField(field.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{field.name}</span>
                            {field.fieldType === 'database' && (
                              <Database className="h-3 w-3 text-green-600" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            Position: {Math.round(field.x)}, {Math.round(field.y)} • 
                            {field.fieldType === 'database' && field.databaseField 
                              ? ` DB: ${field.databaseField}`
                              : ` ${field.value}`
                            }
                          </div>
                        </div>
                        {editMode && (
                          <div className="flex gap-1 ml-2">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateField(field.id);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeField(field.id);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {currentTemplate.fields.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No fields added yet.<br />
                      {editMode ? 'Click on the template to add fields.' : 'Switch to Edit Mode to add fields.'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => setActiveSection('import')} 
                variant="outline" 
                size="sm"
              >
                Back
              </Button>
              <Button 
                onClick={() => setActiveSection('preview')} 
                size="sm"
                disabled={currentTemplate.fields.length === 0}
              >
                Next: Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Preview & Generate */}
      {activeSection === 'preview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Data Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Certificate Data
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">
                  Connected to Database
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Show selected exam and student info */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Selected Data:</h4>
                <p className="text-sm text-blue-800">
                  <strong>Exam:</strong> {exams.find(e => e.id === selectedExam)?.title}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Student:</strong> {students.find(s => s.id === selectedStudent)?.name}
                </p>
                {examAttempts.length > 0 && (
                  <p className="text-sm text-blue-800">
                    <strong>Score:</strong> {examAttempts[0].percentage}% ({examAttempts[0].score} points)
                  </p>
                )}
              </div>

              {/* Editable fields for non-database fields */}
              {currentTemplate.fields
                .filter(field => field.fieldType !== 'database')
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(field => (
                <div key={field.id}>
                  <Input
                    label={`${field.name}${field.required ? ' *' : ''}`}
                    type={field.fieldType === 'email' ? 'email' : field.fieldType === 'number' ? 'number' : field.fieldType === 'date' ? 'date' : 'text'}
                    value={certificateData[field.id] || ''}
                    onChange={(e) => updateCertificateData(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                </div>
              ))}

              {/* Database fields preview */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Database Fields (Auto-populated):</h4>
                {currentTemplate.fields
                  .filter(field => field.fieldType === 'database' && field.databaseField)
                  .map(field => (
                  <div key={field.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">{field.name}</span>
                    <span className="text-sm text-green-800">
                      {certificateData[field.databaseField!] || 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Certificate Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <div
                  className="relative"
                  style={{
                    width: currentTemplate.backgroundStyle.width,
                    height: currentTemplate.backgroundStyle.height,
                    maxWidth: '100%',
                    backgroundImage: currentTemplate.backgroundStyle.backgroundImage,
                    backgroundColor: currentTemplate.backgroundStyle.backgroundColor,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    margin: '0 auto'
                  }}
                >
                  {currentTemplate.fields
                    .sort((a, b) => a.zIndex - b.zIndex)
                    .map(field => (
                    <div
                      key={field.id}
                      className="absolute"
                      style={{
                        left: field.x,
                        top: field.y,
                        width: field.width,
                        height: field.height,
                        fontSize: field.fontSize,
                        color: field.color,
                        fontFamily: field.fontFamily,
                        fontWeight: field.fontWeight,
                        textAlign: field.textAlign as any,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2px 4px',
                        zIndex: field.zIndex
                      }}
                    >
                      <span className="truncate">
                        {field.fieldType === 'database' && field.databaseField 
                          ? certificateData[field.databaseField] || field.value
                          : certificateData[field.id] || field.value
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <Button 
                  onClick={() => setActiveSection('edit')} 
                  variant="outline"
                >
                  Back to Edit
                </Button>
                <Button 
                  onClick={generateCertificate} 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {isLoading ? 'Generating...' : 'Generate & Save Certificate'}
                </Button>
                <Button 
                  onClick={saveTemplate} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ModernCertificateDesigner;