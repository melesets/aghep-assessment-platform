import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { useAuth } from './hooks/useAuth';
import { SimpleLayout } from './components/common/SimpleLayout';
import { Login } from './components/auth/Login';
import { ExamList } from './components/exam/ExamList';
import { ExamTaking } from './components/exam/ExamTaking';
import { ExamResults } from './components/exam/ExamResults';
import { CertificateView } from './components/certificates/CertificateView';
import { CertificateList } from './components/certificates/CertificateList';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UploadQuestions } from './components/admin/UploadQuestions';
import { EditExams } from './components/admin/EditExams';
import { CertificateSettings } from './components/admin/CertificateSettings';
import QuestionBuilder from './components/admin/QuestionBuilder';
import ExamSettings from './components/admin/ExamSettings';
import { AssessmentRecords } from './components/records/AssessmentRecords';
import { SkillLab } from './components/skilllab/SkillLab';

// Protected Route Component for Admin-only access
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useAuth();
  
  if (auth.user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function AuthWrapper() {
  const { auth } = useAuth();

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Login />;
  }

  return (
    <SimpleLayout>
      <Routes>
        {/* Public Routes (accessible by all authenticated users) */}
        <Route path="/" element={<ExamList />} />
        <Route path="/exam/:examId" element={<ExamTaking />} />
        <Route path="/results/:resultId" element={<ExamResults />} />
        <Route path="/certificate/:certificateId" element={<CertificateView />} />
        <Route path="/certificates" element={<CertificateList />} />
        
        {/* Admin-only Routes */}
        <Route path="/records" element={
          <AdminRoute>
            <AssessmentRecords />
          </AdminRoute>
        } />
        <Route path="/skill-lab" element={
          <AdminRoute>
            <SkillLab />
          </AdminRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/upload" element={
          <AdminRoute>
            <UploadQuestions />
          </AdminRoute>
        } />
        <Route path="/admin/edit" element={
          <AdminRoute>
            <EditExams />
          </AdminRoute>
        } />
        <Route path="/admin/certificates" element={
          <AdminRoute>
            <CertificateSettings />
          </AdminRoute>
        } />
        <Route path="/admin/question-builder" element={
          <AdminRoute>
            <QuestionBuilder />
          </AdminRoute>
        } />
        <Route path="/admin/exam-settings" element={
          <AdminRoute>
            <ExamSettings />
          </AdminRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SimpleLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;