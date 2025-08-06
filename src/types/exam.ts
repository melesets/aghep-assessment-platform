export type QuestionType = 'mcq-single' | 'mcq-multiple' | 'true-false' | 'fill-blank';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  category: 'nursing' | 'medical' | 'pharmacy' | 'radiology' | 'laboratory' | 'emergency' | 'surgery' | 'general';
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  ceuCredits: number; // Continuing Education Units
  prerequisites?: string[];
  duration: number; // in minutes
  totalPoints: number;
  passingScore: number; // percentage
  questions: Question[];
  settings: ExamSettings;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExamSettings {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  allowRetake: boolean;
  maxAttempts: number;
  showResults: boolean;
  showCorrectAnswers: boolean;
  requireProctoring: boolean;
  allowNotes: boolean;
  startDate?: Date;
  endDate?: Date;
  antiCheat: AntiCheatSettings;
}

export interface AntiCheatSettings {
  detectFocusLoss: boolean;
  preventCopy: boolean;
  preventRightClick: boolean;
  fullScreenMode: boolean;
  webcamMonitoring: boolean;
  faceDetection: boolean;
  screenRecording: boolean;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  answers: Record<string, string | string[]>;
  startTime: Date;
  endTime?: Date;
  score: number;
  percentage: number;
  passed: boolean;
  timeSpent: number; // in seconds
  flaggedEvents: FlaggedEvent[];
  proctorNotes?: string;
  webcamRecording?: string;
}

export interface FlaggedEvent {
  type: 'focus-loss' | 'tab-switch' | 'right-click' | 'copy-attempt' | 'face-not-detected' | 'multiple-faces' | 'suspicious-movement';
  timestamp: Date;
  details?: string;
}

export interface ExamSession {
  examId: string;
  startTime: Date;
  timeRemaining: number;
  currentQuestionIndex: number;
  answers: Record<string, string | string[]>;
  flaggedEvents: FlaggedEvent[];
}