import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Settings, 
  Clock, 
  Users, 
  Shield, 
  Mail, 
  Palette, 
  BarChart3, 
  Bell, 
  Globe, 
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Link,
  Download,
  Upload,
  Shuffle,
  ArrowRight,
  ArrowLeft,
  Hash,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Star,
  Trophy,
  Target,
  Zap,
  BookOpen,
  FileText,
  Image,
  Video,
  Headphones
} from 'lucide-react';

export interface ExamSettings {
  // Basic Settings
  basic: {
    title: string;
    description: string;
    instructions: string;
    category: string;
    tags: string[];
    language: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };

  // Timing Settings
  timing: {
    timeLimit: number; // in minutes, 0 = no limit
    timeLimitPerQuestion: number; // in seconds, 0 = no limit
    showTimer: boolean;
    showTimeWarning: boolean;
    warningTime: number; // minutes before end
    autoSubmit: boolean;
    allowPause: boolean;
    maxPauseDuration: number; // in minutes
  };

  // Navigation Settings
  navigation: {
    allowBackNavigation: boolean;
    showProgressBar: boolean;
    showQuestionNumbers: boolean;
    oneQuestionPerPage: boolean;
    showQuestionList: boolean;
    allowJumpToQuestion: boolean;
    showReviewPage: boolean;
    confirmBeforeSubmit: boolean;
  };

  // Question Settings
  questions: {
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    showQuestionCount: boolean;
    showPointValues: boolean;
    randomizeFromPool: boolean;
    questionPoolSize: number;
    groupQuestionsByCategory: boolean;
    showCategoryHeaders: boolean;
  };

  // Scoring Settings
  scoring: {
    passingScore: number;
    passingScoreType: 'percentage' | 'points';
    maxScore: number;
    showScoreImmediately: boolean;
    showCorrectAnswers: boolean;
    showExplanations: boolean;
    allowPartialCredit: boolean;
    negativeMarking: boolean;
    negativeMarkingValue: number;
    weightedScoring: boolean;
  };

  // Attempts Settings
  attempts: {
    maxAttempts: number;
    attemptCooldown: number; // in hours
    showPreviousAttempts: boolean;
    keepBestScore: boolean;
    allowReviewAfterAttempt: boolean;
    lockAfterMaxAttempts: boolean;
  };

  // Access Control
  access: {
    isPublic: boolean;
    requireLogin: boolean;
    allowAnonymous: boolean;
    requirePassword: boolean;
    password: string;
    allowedUsers: string[];
    allowedGroups: string[];
    allowedDomains: string[];
    ipRestrictions: string[];
    startDate: Date | null;
    endDate: Date | null;
    availableDays: string[];
    availableHours: { start: string; end: string };
  };

  // Security Settings
  security: {
    preventCheating: boolean;
    disableRightClick: boolean;
    disableCopyPaste: boolean;
    fullScreenMode: boolean;
    detectTabSwitch: boolean;
    maxTabSwitches: number;
    blockScreenshots: boolean;
    requireWebcam: boolean;
    recordSession: boolean;
    plagiarismCheck: boolean;
  };

  // Appearance Settings
  appearance: {
    theme: 'light' | 'dark' | 'auto' | 'custom';
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: 'small' | 'medium' | 'large';
    headerImage: string;
    logoImage: string;
    customCSS: string;
    showBranding: boolean;
  };

  // Notifications Settings
  notifications: {
    sendStartNotification: boolean;
    sendCompletionNotification: boolean;
    sendReminderNotifications: boolean;
    reminderSchedule: number[]; // hours before deadline
    emailTemplate: string;
    webhookUrl: string;
    notifyAdmins: boolean;
    adminEmails: string[];
  };

  // Analytics Settings
  analytics: {
    trackProgress: boolean;
    trackTimeSpent: boolean;
    trackAnswerChanges: boolean;
    collectFeedback: boolean;
    showStatistics: boolean;
    exportResults: boolean;
    generateReports: boolean;
    integrateWithLMS: boolean;
    lmsSettings: {
      platform: string;
      apiKey: string;
      courseId: string;
    };
  };

  // Certificate Settings
  certificates: {
    generateCertificate: boolean;
    certificateTemplate: string;
    requireMinScore: boolean;
    minScoreForCertificate: number;
    includeBadges: boolean;
    badgeTypes: string[];
    sendCertificateEmail: boolean;
    certificateValidityPeriod: number; // in months
  };
}

const defaultSettings: ExamSettings = {
  basic: {
    title: '',
    description: '',
    instructions: '',
    category: 'General',
    tags: [],
    language: 'en',
    difficulty: 'intermediate'
  },
  timing: {
    timeLimit: 0,
    timeLimitPerQuestion: 0,
    showTimer: true,
    showTimeWarning: true,
    warningTime: 5,
    autoSubmit: true,
    allowPause: false,
    maxPauseDuration: 5
  },
  navigation: {
    allowBackNavigation: true,
    showProgressBar: true,
    showQuestionNumbers: true,
    oneQuestionPerPage: false,
    showQuestionList: false,
    allowJumpToQuestion: false,
    showReviewPage: true,
    confirmBeforeSubmit: true
  },
  questions: {
    shuffleQuestions: false,
    shuffleOptions: false,
    showQuestionCount: true,
    showPointValues: true,
    randomizeFromPool: false,
    questionPoolSize: 0,
    groupQuestionsByCategory: false,
    showCategoryHeaders: false
  },
  scoring: {
    passingScore: 70,
    passingScoreType: 'percentage',
    maxScore: 100,
    showScoreImmediately: true,
    showCorrectAnswers: true,
    showExplanations: true,
    allowPartialCredit: false,
    negativeMarking: false,
    negativeMarkingValue: 0.25,
    weightedScoring: false
  },
  attempts: {
    maxAttempts: 3,
    attemptCooldown: 0,
    showPreviousAttempts: true,
    keepBestScore: true,
    allowReviewAfterAttempt: true,
    lockAfterMaxAttempts: false
  },
  access: {
    isPublic: true,
    requireLogin: false,
    allowAnonymous: true,
    requirePassword: false,
    password: '',
    allowedUsers: [],
    allowedGroups: [],
    allowedDomains: [],
    ipRestrictions: [],
    startDate: null,
    endDate: null,
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    availableHours: { start: '00:00', end: '23:59' }
  },
  security: {
    preventCheating: false,
    disableRightClick: false,
    disableCopyPaste: false,
    fullScreenMode: false,
    detectTabSwitch: false,
    maxTabSwitches: 3,
    blockScreenshots: false,
    requireWebcam: false,
    recordSession: false,
    plagiarismCheck: false
  },
  appearance: {
    theme: 'light',
    primaryColor: '#2563eb',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter',
    fontSize: 'medium',
    headerImage: '',
    logoImage: '',
    customCSS: '',
    showBranding: true
  },
  notifications: {
    sendStartNotification: false,
    sendCompletionNotification: true,
    sendReminderNotifications: false,
    reminderSchedule: [24, 1],
    emailTemplate: '',
    webhookUrl: '',
    notifyAdmins: false,
    adminEmails: []
  },
  analytics: {
    trackProgress: true,
    trackTimeSpent: true,
    trackAnswerChanges: false,
    collectFeedback: false,
    showStatistics: true,
    exportResults: true,
    generateReports: false,
    integrateWithLMS: false,
    lmsSettings: {
      platform: '',
      apiKey: '',
      courseId: ''
    }
  },
  certificates: {
    generateCertificate: false,
    certificateTemplate: 'default',
    requireMinScore: true,
    minScoreForCertificate: 70,
    includeBadges: false,
    badgeTypes: [],
    sendCertificateEmail: true,
    certificateValidityPeriod: 12
  }
};

export const ExamSettings: React.FC = () => {
  const [settings, setSettings] = useState<ExamSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('basic');
  const [previewMode, setPreviewMode] = useState(false);

  const updateSettings = (section: keyof ExamSettings, updates: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  };

  const saveSettings = () => {
    // Save to localStorage (in real app, save to backend)
    localStorage.setItem('exam-settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const loadSettings = () => {
    const saved = localStorage.getItem('exam-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
      alert('Settings loaded successfully!');
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exam-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setSettings(imported);
        alert('Settings imported successfully!');
      } catch (error) {
        alert('Error importing settings file');
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'basic', label: 'Basic', icon: <FileText className="h-4 w-4" /> },
    { id: 'timing', label: 'Timing', icon: <Clock className="h-4 w-4" /> },
    { id: 'navigation', label: 'Navigation', icon: <ArrowRight className="h-4 w-4" /> },
    { id: 'questions', label: 'Questions', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'scoring', label: 'Scoring', icon: <Target className="h-4 w-4" /> },
    { id: 'attempts', label: 'Attempts', icon: <Zap className="h-4 w-4" /> },
    { id: 'access', label: 'Access', icon: <Users className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'certificates', label: 'Certificates', icon: <Trophy className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exam Settings</h1>
            <p className="text-gray-600">Configure your exam with Google Forms-like features</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={loadSettings}>
              <Upload className="h-4 w-4 mr-2" />
              Load
            </Button>
            
            <Button variant="outline" onClick={exportSettings}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <label className="cursor-pointer">
              <Button variant="outline" as="span">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importSettings}
                className="hidden"
              />
            </label>
            
            <Button onClick={saveSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-3">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'basic' && (
            <BasicSettings
              settings={settings.basic}
              onUpdate={(updates) => updateSettings('basic', updates)}
            />
          )}
          
          {activeTab === 'timing' && (
            <TimingSettings
              settings={settings.timing}
              onUpdate={(updates) => updateSettings('timing', updates)}
            />
          )}
          
          {activeTab === 'navigation' && (
            <NavigationSettings
              settings={settings.navigation}
              onUpdate={(updates) => updateSettings('navigation', updates)}
            />
          )}
          
          {activeTab === 'questions' && (
            <QuestionSettings
              settings={settings.questions}
              onUpdate={(updates) => updateSettings('questions', updates)}
            />
          )}
          
          {activeTab === 'scoring' && (
            <ScoringSettings
              settings={settings.scoring}
              onUpdate={(updates) => updateSettings('scoring', updates)}
            />
          )}
          
          {activeTab === 'attempts' && (
            <AttemptsSettings
              settings={settings.attempts}
              onUpdate={(updates) => updateSettings('attempts', updates)}
            />
          )}
          
          {activeTab === 'access' && (
            <AccessSettings
              settings={settings.access}
              onUpdate={(updates) => updateSettings('access', updates)}
            />
          )}
          
          {activeTab === 'security' && (
            <SecuritySettings
              settings={settings.security}
              onUpdate={(updates) => updateSettings('security', updates)}
            />
          )}
          
          {activeTab === 'appearance' && (
            <AppearanceSettings
              settings={settings.appearance}
              onUpdate={(updates) => updateSettings('appearance', updates)}
            />
          )}
          
          {activeTab === 'notifications' && (
            <NotificationSettings
              settings={settings.notifications}
              onUpdate={(updates) => updateSettings('notifications', updates)}
            />
          )}
          
          {activeTab === 'analytics' && (
            <AnalyticsSettings
              settings={settings.analytics}
              onUpdate={(updates) => updateSettings('analytics', updates)}
            />
          )}
          
          {activeTab === 'certificates' && (
            <CertificateSettings
              settings={settings.certificates}
              onUpdate={(updates) => updateSettings('certificates', updates)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Basic Settings Component
const BasicSettings: React.FC<{
  settings: ExamSettings['basic'];
  onUpdate: (updates: Partial<ExamSettings['basic']>) => void;
}> = ({ settings, onUpdate }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Exam Title"
          value={settings.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Enter exam title"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={settings.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Describe your exam"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
          <textarea
            value={settings.instructions}
            onChange={(e) => onUpdate({ instructions: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={6}
            placeholder="Provide detailed instructions for exam takers"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Category"
            value={settings.category}
            onChange={(e) => onUpdate({ category: e.target.value })}
            placeholder="e.g., Mathematics, Science"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={settings.difficulty}
              onChange={(e) => onUpdate({ difficulty: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Tags (comma-separated)"
            value={settings.tags.join(', ')}
            onChange={(e) => onUpdate({ tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
            placeholder="tag1, tag2, tag3"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => onUpdate({ language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Timing Settings Component
const TimingSettings: React.FC<{
  settings: ExamSettings['timing'];
  onUpdate: (updates: Partial<ExamSettings['timing']>) => void;
}> = ({ settings, onUpdate }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Limits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Total Time Limit (minutes, 0 = no limit)"
            type="number"
            value={settings.timeLimit}
            onChange={(e) => onUpdate({ timeLimit: parseInt(e.target.value) || 0 })}
            min="0"
          />
          
          <Input
            label="Time per Question (seconds, 0 = no limit)"
            type="number"
            value={settings.timeLimitPerQuestion}
            onChange={(e) => onUpdate({ timeLimitPerQuestion: parseInt(e.target.value) || 0 })}
            min="0"
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Show Timer</label>
            <input
              type="checkbox"
              checked={settings.showTimer}
              onChange={(e) => onUpdate({ showTimer: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Show Time Warning</label>
            <input
              type="checkbox"
              checked={settings.showTimeWarning}
              onChange={(e) => onUpdate({ showTimeWarning: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          {settings.showTimeWarning && (
            <Input
              label="Warning Time (minutes before end)"
              type="number"
              value={settings.warningTime}
              onChange={(e) => onUpdate({ warningTime: parseInt(e.target.value) || 5 })}
              min="1"
            />
          )}
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Auto Submit when Time Expires</label>
            <input
              type="checkbox"
              checked={settings.autoSubmit}
              onChange={(e) => onUpdate({ autoSubmit: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Allow Pause</label>
            <input
              type="checkbox"
              checked={settings.allowPause}
              onChange={(e) => onUpdate({ allowPause: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          {settings.allowPause && (
            <Input
              label="Max Pause Duration (minutes)"
              type="number"
              value={settings.maxPauseDuration}
              onChange={(e) => onUpdate({ maxPauseDuration: parseInt(e.target.value) || 5 })}
              min="1"
            />
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);

// Navigation Settings Component
const NavigationSettings: React.FC<{
  settings: ExamSettings['navigation'];
  onUpdate: (updates: Partial<ExamSettings['navigation']>) => void;
}> = ({ settings, onUpdate }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Navigation Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Allow Back Navigation</label>
            <input
              type="checkbox"
              checked={settings.allowBackNavigation}
              onChange={(e) => onUpdate({ allowBackNavigation: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Show Progress Bar</label>
            <input
              type="checkbox"
              checked={settings.showProgressBar}
              onChange={(e) => onUpdate({ showProgressBar: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Show Question Numbers</label>
            <input
              type="checkbox"
              checked={settings.showQuestionNumbers}
              onChange={(e) => onUpdate({ showQuestionNumbers: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">One Question Per Page</label>
            <input
              type="checkbox"
              checked={settings.oneQuestionPerPage}
              onChange={(e) => onUpdate({ oneQuestionPerPage: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Show Question List</label>
            <input
              type="checkbox"
              checked={settings.showQuestionList}
              onChange={(e) => onUpdate({ showQuestionList: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Allow Jump to Question</label>
            <input
              type="checkbox"
              checked={settings.allowJumpToQuestion}
              onChange={(e) => onUpdate({ allowJumpToQuestion: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Show Review Page</label>
            <input
              type="checkbox"
              checked={settings.showReviewPage}
              onChange={(e) => onUpdate({ showReviewPage: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Confirm Before Submit</label>
            <input
              type="checkbox"
              checked={settings.confirmBeforeSubmit}
              onChange={(e) => onUpdate({ confirmBeforeSubmit: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Question Settings Component
const QuestionSettings: React.FC<{
  settings: ExamSettings['questions'];
  onUpdate: (updates: Partial<ExamSettings['questions']>) => void;
}> = ({ settings, onUpdate }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Question Display
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Shuffle Questions</label>
            <input
              type="checkbox"
              checked={settings.shuffleQuestions}
              onChange={(e) => onUpdate({ shuffleQuestions: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Shuffle Answer Options</label>
            <input
              type="checkbox"
              checked={settings.shuffleOptions}
              onChange={(e) => onUpdate({ shuffleOptions: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Show Question Count</label>
            <input
              type="checkbox"
              checked={settings.showQuestionCount}
              onChange={(e) => onUpdate({ showQuestionCount: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Show Point Values</label>
            <input
              type="checkbox"
              checked={settings.showPointValues}
              onChange={(e) => onUpdate({ showPointValues: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Randomize from Question Pool</label>
            <input
              type="checkbox"
              checked={settings.randomizeFromPool}
              onChange={(e) => onUpdate({ randomizeFromPool: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          {settings.randomizeFromPool && (
            <Input
              label="Question Pool Size"
              type="number"
              value={settings.questionPoolSize}
              onChange={(e) => onUpdate({ questionPoolSize: parseInt(e.target.value) || 0 })}
              min="1"
            />
          )}
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Group Questions by Category</label>
            <input
              type="checkbox"
              checked={settings.groupQuestionsByCategory}
              onChange={(e) => onUpdate({ groupQuestionsByCategory: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Show Category Headers</label>
            <input
              type="checkbox"
              checked={settings.showCategoryHeaders}
              onChange={(e) => onUpdate({ showCategoryHeaders: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Scoring Settings Component
const ScoringSettings: React.FC<{
  settings: ExamSettings['scoring'];
  onUpdate: (updates: Partial<ExamSettings['scoring']>) => void;
}> = ({ settings, onUpdate }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Scoring Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Passing Score"
            type="number"
            value={settings.passingScore}
            onChange={(e) => onUpdate({ passingScore: parseInt(e.target.value) || 70 })}
            min="0"
            max="100"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score Type</label>
            <select
              value={settings.passingScoreType}
              onChange={(e) => onUpdate({ passingScoreType: e.target.value as 'percentage' | 'points' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="percentage">Percentage</option>
              <option value="points">Points</option>
            </select>
          </div>
        </div>
        
        {settings.passingScoreType === 'points' && (
          <Input
            label="Maximum Score"
            type="number"
            value={settings.maxScore}
            onChange={(e) => onUpdate({ maxScore: parseInt(e.target.value) || 100 })}
            min="1"
          />
        )}
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Show Score Immediately</label>
            <input
              type="checkbox"
              checked={settings.showScoreImmediately}
              onChange={(e) => onUpdate({ showScoreImmediately: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Show Correct Answers</label>
            <input
              type="checkbox"
              checked={settings.showCorrectAnswers}
              onChange={(e) => onUpdate({ showCorrectAnswers: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Show Explanations</label>
            <input
              type="checkbox"
              checked={settings.showExplanations}
              onChange={(e) => onUpdate({ showExplanations: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Allow Partial Credit</label>
            <input
              type="checkbox"
              checked={settings.allowPartialCredit}
              onChange={(e) => onUpdate({ allowPartialCredit: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Negative Marking</label>
            <input
              type="checkbox"
              checked={settings.negativeMarking}
              onChange={(e) => onUpdate({ negativeMarking: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          {settings.negativeMarking && (
            <Input
              label="Negative Marking Value (fraction of question points)"
              type="number"
              step="0.25"
              value={settings.negativeMarkingValue}
              onChange={(e) => onUpdate({ negativeMarkingValue: parseFloat(e.target.value) || 0.25 })}
              min="0"
              max="1"
            />
          )}
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Weighted Scoring</label>
            <input
              type="checkbox"
              checked={settings.weightedScoring}
              onChange={(e) => onUpdate({ weightedScoring: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Attempts Settings Component
const AttemptsSettings: React.FC<{
  settings: ExamSettings['attempts'];
  onUpdate: (updates: Partial<ExamSettings['attempts']>) => void;
}> = ({ settings, onUpdate }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Attempt Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Maximum Attempts (0 = unlimited)"
            type="number"
            value={settings.maxAttempts}
            onChange={(e) => onUpdate({ maxAttempts: parseInt(e.target.value) || 0 })}
            min="0"
          />
          
          <Input
            label="Cooldown Between Attempts (hours)"
            type="number"
            value={settings.attemptCooldown}
            onChange={(e) => onUpdate({ attemptCooldown: parseInt(e.target.value) || 0 })}
            min="0"
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Show Previous Attempts</label>
            <input
              type="checkbox"
              checked={settings.showPreviousAttempts}
              onChange={(e) => onUpdate({ showPreviousAttempts: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Keep Best Score</label>
            <input
              type="checkbox"
              checked={settings.keepBestScore}
              onChange={(e) => onUpdate({ keepBestScore: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Allow Review After Attempt</label>
            <input
              type="checkbox"
              checked={settings.allowReviewAfterAttempt}
              onChange={(e) => onUpdate({ allowReviewAfterAttempt: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Lock After Max Attempts</label>
            <input
              type="checkbox"
              checked={settings.lockAfterMaxAttempts}
              onChange={(e) => onUpdate({ lockAfterMaxAttempts: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Access Settings Component
const AccessSettings: React.FC<{
  settings: ExamSettings['access'];
  onUpdate: (updates: Partial<ExamSettings['access']>) => void;
}> = ({ settings, onUpdate }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Access Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Public Access</label>
            <input
              type="checkbox"
              checked={settings.isPublic}
              onChange={(e) => onUpdate({ isPublic: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Require Login</label>
            <input
              type="checkbox"
              checked={settings.requireLogin}
              onChange={(e) => onUpdate({ requireLogin: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Allow Anonymous</label>
            <input
              type="checkbox"
              checked={settings.allowAnonymous}
              onChange={(e) => onUpdate({ allowAnonymous: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Require Password</label>
            <input
              type="checkbox"
              checked={settings.requirePassword}
              onChange={(e) => onUpdate({ requirePassword: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          {settings.requirePassword && (
            <Input
              label="Password"
              type="password"
              value={settings.password}
              onChange={(e) => onUpdate({ password: e.target.value })}
              placeholder="Enter exam password"
            />
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="datetime-local"
              value={settings.startDate ? settings.startDate.toISOString().slice(0, 16) : ''}
              onChange={(e) => onUpdate({ startDate: e.target.value ? new Date(e.target.value) : null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="datetime-local"
              value={settings.endDate ? settings.endDate.toISOString().slice(0, 16) : ''}
              onChange={(e) => onUpdate({ endDate: e.target.value ? new Date(e.target.value) : null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Users (one per line)</label>
          <textarea
            value={settings.allowedUsers.join('\n')}
            onChange={(e) => onUpdate({ allowedUsers: e.target.value.split('\n').filter(Boolean) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="user1@example.com&#10;user2@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Domains (one per line)</label>
          <textarea
            value={settings.allowedDomains.join('\n')}
            onChange={(e) => onUpdate({ allowedDomains: e.target.value.split('\n').filter(Boolean) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="example.com&#10;university.edu"
          />
        </div>
      </CardContent>
    </Card>
  </div>
);

// Security Settings Component
const SecuritySettings: React.FC<{
  settings: ExamSettings['security'];
  onUpdate: (updates: Partial<ExamSettings['security']>) => void;
}> = ({ settings, onUpdate }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security & Anti-Cheating
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Enable Anti-Cheating</label>
            <input
              type="checkbox"
              checked={settings.preventCheating}
              onChange={(e) => onUpdate({ preventCheating: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Disable Right Click</label>
            <input
              type="checkbox"
              checked={settings.disableRightClick}
              onChange={(e) => onUpdate({ disableRightClick: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Disable Copy/Paste</label>
            <input
              type="checkbox"
              checked={settings.disableCopyPaste}
              onChange={(e) => onUpdate({ disableCopyPaste: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Full Screen Mode</label>
            <input
              type="checkbox"
              checked={settings.fullScreenMode}
              onChange={(e) => onUpdate({ fullScreenMode: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Detect Tab Switch</label>
            <input
              type="checkbox"
              checked={settings.detectTabSwitch}
              onChange={(e) => onUpdate({ detectTabSwitch: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          {settings.detectTabSwitch && (
            <Input
              label="Max Tab Switches Allowed"
              type="number"
              value={settings.maxTabSwitches}
              onChange={(e) => onUpdate({ maxTabSwitches: parseInt(e.target.value) || 3 })}
              min="0"
            />
          )}
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Block Screenshots</label>
            <input
              type="checkbox"
              checked={settings.blockScreenshots}
              onChange={(e) => onUpdate({ blockScreenshots: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Require Webcam</label>
            <input
              type="checkbox"
              checked={settings.requireWebcam}
              onChange={(e) => onUpdate({ requireWebcam: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Record Session</label>
            <input
              type="checkbox"
              checked={settings.recordSession}
              onChange={(e) => onUpdate({ recordSession: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Plagiarism Check</label>
            <input
              type="checkbox"
              checked={settings.plagiarismCheck}
              onChange={(e) => onUpdate({ plagiarismCheck: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Appearance Settings Component
const AppearanceSettings: React.FC<{
  settings: ExamSettings['appearance'];
  onUpdate: (updates: Partial<ExamSettings['appearance']>) => void;
}> = ({ settings, onUpdate }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Appearance & Branding
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => onUpdate({ theme: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            <select
              value={settings.fontSize}
              onChange={(e) => onUpdate({ fontSize: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => onUpdate({ primaryColor: e.target.value })}
              className="w-full h-10 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              className="w-full h-10 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
            <input
              type="color"
              value={settings.textColor}
              onChange={(e) => onUpdate({ textColor: e.target.value })}
              className="w-full h-10 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        
        <Input
          label="Font Family"
          value={settings.fontFamily}
          onChange={(e) => onUpdate({ fontFamily: e.target.value })}
          placeholder="Inter, Arial, sans-serif"
        />
        
        <div className="space-y-3">
          <Button variant="outline" className="w-full">
            <Image className="h-4 w-4 mr-2" />
            Upload Header Image
          </Button>
          
          <Button variant="outline" className="w-full">
            <Image className="h-4 w-4 mr-2" />
            Upload Logo
          </Button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Custom CSS</label>
          <textarea
            value={settings.customCSS}
            onChange={(e) => onUpdate({ customCSS: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            rows={6}
            placeholder="/* Custom CSS styles */"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Show Branding</label>
          <input
            type="checkbox"
            checked={settings.showBranding}
            onChange={(e) => onUpdate({ showBranding: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      </CardContent>
    </Card>
  </div>
);

// Notification Settings Component
const NotificationSettings: React.FC<{
  settings: ExamSettings['notifications'];
  onUpdate: (updates: Partial<ExamSettings['notifications']>) => void;
}> = ({ settings, onUpdate }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Email & Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Send Start Notification</label>
            <input
              type="checkbox"
              checked={settings.sendStartNotification}
              onChange={(e) => onUpdate({ sendStartNotification: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Send Completion Notification</label>
            <input
              type="checkbox"
              checked={settings.sendCompletionNotification}
              onChange={(e) => onUpdate({ sendCompletionNotification: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Send Reminder Notifications</label>
            <input
              type="checkbox"
              checked={settings.sendReminderNotifications}
              onChange={(e) => onUpdate({ sendReminderNotifications: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Notify Admins</label>
            <input
              type="checkbox"
              checked={settings.notifyAdmins}
              onChange={(e) => onUpdate({ notifyAdmins: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {settings.sendReminderNotifications && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Schedule (hours before deadline)</label>
            <Input
              value={settings.reminderSchedule.join(', ')}
              onChange={(e) => onUpdate({ 
                reminderSchedule: e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
              })}
              placeholder="24, 12, 1"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Template</label>
          <textarea
            value={settings.emailTemplate}
            onChange={(e) => onUpdate({ emailTemplate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={6}
            placeholder="Custom email template with variables like {{name}}, {{score}}, {{exam_title}}"
          />
        </div>
        
        <Input
          label="Webhook URL"
          value={settings.webhookUrl}
          onChange={(e) => onUpdate({ webhookUrl: e.target.value })}
          placeholder="https://your-webhook-url.com/endpoint"
        />
        
        {settings.notifyAdmins && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Admin Emails (one per line)</label>
            <textarea
              value={settings.adminEmails.join('\n')}
              onChange={(e) => onUpdate({ adminEmails: e.target.value.split('\n').filter(Boolean) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="admin1@example.com&#10;admin2@example.com"
            />
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);

// Analytics Settings Component
const AnalyticsSettings: React.FC<{
  settings: ExamSettings['analytics'];
  onUpdate: (updates: Partial<ExamSettings['analytics']>) => void;
}> = ({ settings, onUpdate }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Analytics & Reporting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Track Progress</label>
            <input
              type="checkbox"
              checked={settings.trackProgress}
              onChange={(e) => onUpdate({ trackProgress: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Track Time Spent</label>
            <input
              type="checkbox"
              checked={settings.trackTimeSpent}
              onChange={(e) => onUpdate({ trackTimeSpent: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Track Answer Changes</label>
            <input
              type="checkbox"
              checked={settings.trackAnswerChanges}
              onChange={(e) => onUpdate({ trackAnswerChanges: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Collect Feedback</label>
            <input
              type="checkbox"
              checked={settings.collectFeedback}
              onChange={(e) => onUpdate({ collectFeedback: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Show Statistics</label>
            <input
              type="checkbox"
              checked={settings.showStatistics}
              onChange={(e) => onUpdate({ showStatistics: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Export Results</label>
            <input
              type="checkbox"
              checked={settings.exportResults}
              onChange={(e) => onUpdate({ exportResults: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Generate Reports</label>
            <input
              type="checkbox"
              checked={settings.generateReports}
              onChange={(e) => onUpdate({ generateReports: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Integrate with LMS</label>
            <input
              type="checkbox"
              checked={settings.integrateWithLMS}
              onChange={(e) => onUpdate({ integrateWithLMS: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {settings.integrateWithLMS && (
          <div className="space-y-3 pt-3 border-t border-gray-200">
            <h4 className="font-medium text-gray-900">LMS Integration</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <select
                value={settings.lmsSettings.platform}
                onChange={(e) => onUpdate({ 
                  lmsSettings: { ...settings.lmsSettings, platform: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Platform</option>
                <option value="moodle">Moodle</option>
                <option value="canvas">Canvas</option>
                <option value="blackboard">Blackboard</option>
                <option value="schoology">Schoology</option>
                <option value="google-classroom">Google Classroom</option>
              </select>
            </div>
            
            <Input
              label="API Key"
              type="password"
              value={settings.lmsSettings.apiKey}
              onChange={(e) => onUpdate({ 
                lmsSettings: { ...settings.lmsSettings, apiKey: e.target.value }
              })}
              placeholder="Enter LMS API key"
            />
            
            <Input
              label="Course ID"
              value={settings.lmsSettings.courseId}
              onChange={(e) => onUpdate({ 
                lmsSettings: { ...settings.lmsSettings, courseId: e.target.value }
              })}
              placeholder="Enter course ID"
            />
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);

// Certificate Settings Component
const CertificateSettings: React.FC<{
  settings: ExamSettings['certificates'];
  onUpdate: (updates: Partial<ExamSettings['certificates']>) => void;
}> = ({ settings, onUpdate }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Certificates & Badges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Generate Certificate</label>
            <input
              type="checkbox"
              checked={settings.generateCertificate}
              onChange={(e) => onUpdate({ generateCertificate: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          {settings.generateCertificate && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Template</label>
                <select
                  value={settings.certificateTemplate}
                  onChange={(e) => onUpdate({ certificateTemplate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="default">Default</option>
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="elegant">Elegant</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Require Minimum Score</label>
                <input
                  type="checkbox"
                  checked={settings.requireMinScore}
                  onChange={(e) => onUpdate({ requireMinScore: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              
              {settings.requireMinScore && (
                <Input
                  label="Minimum Score for Certificate (%)"
                  type="number"
                  value={settings.minScoreForCertificate}
                  onChange={(e) => onUpdate({ minScoreForCertificate: parseInt(e.target.value) || 70 })}
                  min="0"
                  max="100"
                />
              )}
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Include Badges</label>
                <input
                  type="checkbox"
                  checked={settings.includeBadges}
                  onChange={(e) => onUpdate({ includeBadges: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              
              {settings.includeBadges && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Badge Types</label>
                  <div className="space-y-2">
                    {['Excellence', 'Perfect Score', 'First Attempt', 'Speed Demon', 'Persistent'].map((badge) => (
                      <label key={badge} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.badgeTypes.includes(badge)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              onUpdate({ badgeTypes: [...settings.badgeTypes, badge] });
                            } else {
                              onUpdate({ badgeTypes: settings.badgeTypes.filter(b => b !== badge) });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        />
                        <span className="text-sm text-gray-700">{badge}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Send Certificate Email</label>
                <input
                  type="checkbox"
                  checked={settings.sendCertificateEmail}
                  onChange={(e) => onUpdate({ sendCertificateEmail: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              
              <Input
                label="Certificate Validity Period (months)"
                type="number"
                value={settings.certificateValidityPeriod}
                onChange={(e) => onUpdate({ certificateValidityPeriod: parseInt(e.target.value) || 12 })}
                min="1"
                max="120"
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ExamSettings;