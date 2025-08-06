import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Save, Eye, Download, Palette, Type, Image, Upload, X, Sparkles, QrCode, Stamp, Award, AlertCircle } from 'lucide-react';

interface CertificateTemplate {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  organizationName: string;
  signatoryName: string;
  signatoryTitle: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontSize: {
    title: number;
    subtitle: number;
    body: number;
  };
  layout: 'minimal' | 'split' | 'card' | 'sidebar' | 'floating';
  logo?: {
    url: string;
    width: number;
    height: number;
    position: 'top-left' | 'top-center' | 'top-right' | 'center';
  };
  stamp?: {
    url: string;
    width: number;
    height: number;
    position: 'bottom-left' | 'bottom-right' | 'top-right' | 'center-right';
  };
  qrCode?: {
    enabled: boolean;
    position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
    size: number;
  };
  modernFeatures: {
    showQR: boolean;
    showStamp: boolean;
    alignment: 'left' | 'center' | 'right';
    spacing: 'compact' | 'normal' | 'spacious';
  };
  certification: {
    minimumScore: number;
    passingGrade: 'percentage' | 'points';
    showGrade: boolean;
    gradeText: string;
    maxScore?: number;
  };
}

const modernTemplates: CertificateTemplate[] = [
  {
    id: 'minimal-clean',
    name: '🎯 Minimal Clean',
    title: 'Certificate of Completion',
    subtitle: 'This certifies that',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Sarah Johnson',
    signatoryTitle: 'Medical Director',
    backgroundColor: '#ffffff',
    textColor: '#1a1a1a',
    accentColor: '#2563eb',
    fontSize: { title: 28, subtitle: 16, body: 14 },
    layout: 'minimal',
    modernFeatures: {
      showQR: true,
      showStamp: true,
      alignment: 'left',
      spacing: 'spacious'
    },
    qrCode: {
      enabled: true,
      position: 'bottom-right',
      size: 60
    },
    certification: {
      minimumScore: 70,
      passingGrade: 'percentage',
      showGrade: true,
      gradeText: 'Passing Grade',
      maxScore: 100
    }
  },
  {
    id: 'split-modern',
    name: '📱 Split Layout',
    title: 'Professional Certification',
    subtitle: 'We hereby certify',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Michael Chen',
    signatoryTitle: 'Chief Medical Officer',
    backgroundColor: '#f8fafc',
    textColor: '#0f172a',
    accentColor: '#0ea5e9',
    fontSize: { title: 32, subtitle: 18, body: 16 },
    layout: 'split',
    modernFeatures: {
      showQR: true,
      showStamp: true,
      alignment: 'center',
      spacing: 'normal'
    },
    qrCode: {
      enabled: true,
      position: 'bottom-left',
      size: 70
    },
    certification: {
      minimumScore: 75,
      passingGrade: 'percentage',
      showGrade: true,
      gradeText: 'Professional Standard',
      maxScore: 100
    }
  },
  {
    id: 'card-style',
    name: '💳 Card Style',
    title: 'Achievement Certificate',
    subtitle: 'Awarded to',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Emily Rodriguez',
    signatoryTitle: 'Director of Education',
    backgroundColor: '#ffffff',
    textColor: '#374151',
    accentColor: '#059669',
    fontSize: { title: 24, subtitle: 14, body: 12 },
    layout: 'card',
    modernFeatures: {
      showQR: true,
      showStamp: false,
      alignment: 'center',
      spacing: 'compact'
    },
    qrCode: {
      enabled: true,
      position: 'top-right',
      size: 50
    },
    certification: {
      minimumScore: 80,
      passingGrade: 'percentage',
      showGrade: true,
      gradeText: 'Achievement Level',
      maxScore: 100
    }
  },
  {
    id: 'sidebar-modern',
    name: '📋 Sidebar Layout',
    title: 'Excellence Certificate',
    subtitle: 'This document certifies',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. James Wilson',
    signatoryTitle: 'Quality Assurance Director',
    backgroundColor: '#fafafa',
    textColor: '#1f2937',
    accentColor: '#7c3aed',
    fontSize: { title: 26, subtitle: 15, body: 13 },
    layout: 'sidebar',
    modernFeatures: {
      showQR: true,
      showStamp: true,
      alignment: 'left',
      spacing: 'normal'
    },
    qrCode: {
      enabled: true,
      position: 'bottom-right',
      size: 65
    },
    certification: {
      minimumScore: 85,
      passingGrade: 'percentage',
      showGrade: true,
      gradeText: 'Excellence Standard',
      maxScore: 100
    }
  },
  {
    id: 'floating-elements',
    name: '🎈 Floating Design',
    title: 'Mastery Certificate',
    subtitle: 'This validates that',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Lisa Park',
    signatoryTitle: 'Chief of Staff',
    backgroundColor: '#ffffff',
    textColor: '#111827',
    accentColor: '#dc2626',
    fontSize: { title: 30, subtitle: 17, body: 15 },
    layout: 'floating',
    modernFeatures: {
      showQR: true,
      showStamp: true,
      alignment: 'center',
      spacing: 'spacious'
    },
    qrCode: {
      enabled: true,
      position: 'top-left',
      size: 55
    },
    certification: {
      minimumScore: 90,
      passingGrade: 'percentage',
      showGrade: true,
      gradeText: 'Mastery Level',
      maxScore: 100
    }
  },
  {
    id: 'tech-minimal',
    name: '💻 Tech Minimal',
    title: 'Digital Certification',
    subtitle: 'Digitally verified completion by',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Robert Kim',
    signatoryTitle: 'Innovation Director',
    backgroundColor: '#f9fafb',
    textColor: '#1f2937',
    accentColor: '#6366f1',
    fontSize: { title: 28, subtitle: 16, body: 14 },
    layout: 'minimal',
    modernFeatures: {
      showQR: true,
      showStamp: false,
      alignment: 'center',
      spacing: 'normal'
    },
    qrCode: {
      enabled: true,
      position: 'bottom-right',
      size: 80
    },
    certification: {
      minimumScore: 70,
      passingGrade: 'percentage',
      showGrade: true,
      gradeText: 'Digital Competency',
      maxScore: 100
    }
  },
  {
    id: 'corporate-clean',
    name: '🏢 Corporate Clean',
    title: 'Training Certificate',
    subtitle: 'Successfully completed by',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Amanda Foster',
    signatoryTitle: 'Training Coordinator',
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    accentColor: '#0891b2',
    fontSize: { title: 26, subtitle: 15, body: 13 },
    layout: 'split',
    modernFeatures: {
      showQR: true,
      showStamp: true,
      alignment: 'left',
      spacing: 'compact'
    },
    qrCode: {
      enabled: true,
      position: 'bottom-left',
      size: 60
    },
    certification: {
      minimumScore: 75,
      passingGrade: 'percentage',
      showGrade: true,
      gradeText: 'Training Standard',
      maxScore: 100
    }
  },
  {
    id: 'modern-badge',
    name: '🏆 Modern Badge',
    title: 'Recognition Certificate',
    subtitle: 'In recognition of',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Christopher Lee',
    signatoryTitle: 'Recognition Committee Chair',
    backgroundColor: '#fefefe',
    textColor: '#1a1a1a',
    accentColor: '#f59e0b',
    fontSize: { title: 24, subtitle: 14, body: 12 },
    layout: 'card',
    modernFeatures: {
      showQR: true,
      showStamp: true,
      alignment: 'center',
      spacing: 'normal'
    },
    qrCode: {
      enabled: true,
      position: 'top-right',
      size: 55
    },
    certification: {
      minimumScore: 80,
      passingGrade: 'percentage',
      showGrade: true,
      gradeText: 'Recognition Level',
      maxScore: 100
    }
  },
  {
    id: 'executive-modern',
    name: '👔 Executive Modern',
    title: 'Leadership Certificate',
    subtitle: 'Executive achievement by',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Maria Gonzalez',
    signatoryTitle: 'Chief Executive Officer',
    backgroundColor: '#f8fafc',
    textColor: '#0f172a',
    accentColor: '#1e40af',
    fontSize: { title: 30, subtitle: 18, body: 16 },
    layout: 'floating',
    modernFeatures: {
      showQR: true,
      showStamp: true,
      alignment: 'center',
      spacing: 'spacious'
    },
    qrCode: {
      enabled: true,
      position: 'bottom-right',
      size: 70
    },
    certification: {
      minimumScore: 85,
      passingGrade: 'percentage',
      showGrade: true,
      gradeText: 'Leadership Excellence',
      maxScore: 100
    }
  },
  {
    id: 'simple-elegant',
    name: '✨ Simple Elegant',
    title: 'Completion Certificate',
    subtitle: 'This is to certify that',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. David Thompson',
    signatoryTitle: 'Academic Director',
    backgroundColor: '#ffffff',
    textColor: '#374151',
    accentColor: '#10b981',
    fontSize: { title: 28, subtitle: 16, body: 14 },
    layout: 'minimal',
    modernFeatures: {
      showQR: true,
      showStamp: false,
      alignment: 'center',
      spacing: 'normal'
    },
    qrCode: {
      enabled: true,
      position: 'bottom-left',
      size: 65
    },
    certification: {
      minimumScore: 70,
      passingGrade: 'percentage',
      showGrade: true,
      gradeText: 'Completion Standard',
      maxScore: 100
    }
  }
];

const defaultTemplate: CertificateTemplate = modernTemplates[0];

// Helper function to ensure template has all required properties
const ensureTemplateDefaults = (template: any): CertificateTemplate => {
  return {
    ...template,
    modernFeatures: {
      showQR: true,
      showStamp: true,
      alignment: 'center',
      spacing: 'normal',
      ...template.modernFeatures
    },
    qrCode: {
      enabled: true,
      position: 'bottom-right',
      size: 60,
      ...template.qrCode
    },
    certification: {
      minimumScore: 70,
      passingGrade: 'percentage',
      showGrade: true,
      gradeText: 'Passing Grade',
      maxScore: 100,
      ...template.certification
    }
  };
};

// Function to check if score meets minimum requirement
export const isEligibleForCertificate = (score: number, template: CertificateTemplate): boolean => {
  const { minimumScore, passingGrade, maxScore = 100 } = template.certification;
  
  if (passingGrade === 'percentage') {
    return score >= minimumScore;
  } else {
    // For points-based system, convert to percentage
    const percentage = (score / maxScore) * 100;
    return percentage >= minimumScore;
  }
};

// Function to get grade status
export const getGradeStatus = (score: number, template: CertificateTemplate) => {
  const isEligible = isEligibleForCertificate(score, template);
  const { minimumScore, gradeText } = template.certification;
  
  return {
    isEligible,
    status: isEligible ? 'passed' : 'failed',
    message: isEligible 
      ? `Congratulations! You achieved ${gradeText} with ${score}%`
      : `Score of ${score}% is below the minimum requirement of ${minimumScore}%`,
    gradeText: isEligible ? gradeText : 'Below Standard'
  };
};

export const CertificateSettings: React.FC = () => {
  const [template, setTemplate] = useState<CertificateTemplate>(defaultTemplate);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);

  // Load saved template on component mount
  React.useEffect(() => {
    const savedTemplate = localStorage.getItem('certificate-template');
    if (savedTemplate) {
      try {
        const parsed = JSON.parse(savedTemplate);
        const templateWithDefaults = ensureTemplateDefaults(parsed);
        setTemplate(templateWithDefaults);
      } catch (error) {
        console.warn('Could not load saved template:', error);
        setTemplate(defaultTemplate);
      }
    }
  }, []);

  const saveTemplate = () => {
    localStorage.setItem('certificate-template', JSON.stringify(template));
    alert('Certificate template saved successfully!');
  };

  const resetTemplate = () => {
    setTemplate(defaultTemplate);
  };

  const generatePreviewPDF = async () => {
    // Mock certificate data for preview
    const mockCertificate = {
      studentName: 'John Doe',
      examTitle: 'Advanced Medical Training',
      score: 95,
      completedAt: new Date().toISOString(),
      certificateNumber: 'CERT-2024-001'
    };

    // Check if score meets minimum requirement
    const gradeStatus = getGradeStatus(mockCertificate.score, template);
    
    if (!gradeStatus.isEligible) {
      alert(`Cannot generate certificate: ${gradeStatus.message}`);
      return;
    }

    await generateModernCertificatePDF(mockCertificate, template);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        setTemplate(prev => ({
          ...prev,
          logo: {
            url: logoUrl,
            width: 80,
            height: 80,
            position: 'top-left'
          }
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file (PNG, JPG, SVG)');
    }
  };

  const handleStampUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const stampUrl = e.target?.result as string;
        setTemplate(prev => ({
          ...prev,
          stamp: {
            url: stampUrl,
            width: 60,
            height: 60,
            position: 'bottom-right'
          }
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file (PNG, JPG, SVG)');
    }
  };

  const removeLogo = () => {
    setTemplate(prev => ({ ...prev, logo: undefined }));
  };

  const removeStamp = () => {
    setTemplate(prev => ({ ...prev, stamp: undefined }));
  };

  const updateLogoSettings = (key: string, value: any) => {
    if (template.logo) {
      setTemplate(prev => ({
        ...prev,
        logo: { ...prev.logo!, [key]: value }
      }));
    }
  };

  const updateStampSettings = (key: string, value: any) => {
    if (template.stamp) {
      setTemplate(prev => ({
        ...prev,
        stamp: { ...prev.stamp!, [key]: value }
      }));
    }
  };

  const updateQRSettings = (key: string, value: any) => {
    setTemplate(prev => ({
      ...prev,
      qrCode: { ...prev.qrCode!, [key]: value }
    }));
  };

  const updateModernFeatures = (key: string, value: any) => {
    setTemplate(prev => ({
      ...prev,
      modernFeatures: { ...prev.modernFeatures, [key]: value }
    }));
  };

  const updateCertificationSettings = (key: string, value: any) => {
    setTemplate(prev => ({
      ...prev,
      certification: { ...prev.certification, [key]: value }
    }));
  };

  const generateQRCodeURL = (certificateNumber: string) => {
    const verificationURL = `https://verify.adarehospital.com/certificate/${certificateNumber}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=${template.qrCode?.size || 60}x${template.qrCode?.size || 60}&data=${encodeURIComponent(verificationURL)}`;
  };

  // Mock score for preview
  const previewScore = 95;
  const gradeStatus = getGradeStatus(previewScore, template);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modern Certificate Designer</h1>
        <p className="text-gray-600">
          Create contemporary certificates with modern layouts, QR codes, and minimum score requirements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Content Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Content Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Certificate Title"
                value={template.title}
                onChange={(e) => setTemplate(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Certificate of Completion"
              />
              <Input
                label="Subtitle"
                value={template.subtitle}
                onChange={(e) => setTemplate(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="This certifies that"
              />
              <Input
                label="Organization Name"
                value={template.organizationName}
                onChange={(e) => setTemplate(prev => ({ ...prev, organizationName: e.target.value }))}
                placeholder="Your Organization"
              />
              <Input
                label="Signatory Name"
                value={template.signatoryName}
                onChange={(e) => setTemplate(prev => ({ ...prev, signatoryName: e.target.value }))}
                placeholder="Dr. Sarah Johnson"
              />
              <Input
                label="Signatory Title"
                value={template.signatoryTitle}
                onChange={(e) => setTemplate(prev => ({ ...prev, signatoryTitle: e.target.value }))}
                placeholder="Medical Director"
              />
            </CardContent>
          </Card>

          {/* Certification Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certification Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Minimum Score"
                  type="number"
                  value={template.certification?.minimumScore || 70}
                  onChange={(e) => updateCertificationSettings('minimumScore', parseInt(e.target.value))}
                  min="0"
                  max="100"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade Type</label>
                  <select
                    value={template.certification?.passingGrade || 'percentage'}
                    onChange={(e) => updateCertificationSettings('passingGrade', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="points">Points</option>
                  </select>
                </div>
              </div>

              {template.certification?.passingGrade === 'points' && (
                <Input
                  label="Maximum Score"
                  type="number"
                  value={template.certification?.maxScore || 100}
                  onChange={(e) => updateCertificationSettings('maxScore', parseInt(e.target.value))}
                  min="1"
                />
              )}

              <Input
                label="Grade Text"
                value={template.certification?.gradeText || 'Passing Grade'}
                onChange={(e) => updateCertificationSettings('gradeText', e.target.value)}
                placeholder="e.g., Passing Grade, Excellence Level"
              />

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Show Grade on Certificate</label>
                <input
                  type="checkbox"
                  checked={template.certification?.showGrade || false}
                  onChange={(e) => updateCertificationSettings('showGrade', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              {/* Grade Status Preview */}
              <div className={`p-3 rounded-lg border ${
                gradeStatus.isEligible 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {gradeStatus.isEligible ? (
                    <Award className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    gradeStatus.isEligible ? 'text-green-800' : 'text-red-800'
                  }`}>
                    Preview Score: {previewScore}%
                  </span>
                </div>
                <p className={`text-xs ${
                  gradeStatus.isEligible ? 'text-green-700' : 'text-red-700'
                }`}>
                  {gradeStatus.message}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Modern Layout Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Modern Layout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Layout Style</label>
                <select
                  value={template.layout}
                  onChange={(e) => setTemplate(prev => ({ ...prev, layout: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="minimal">Minimal Clean</option>
                  <option value="split">Split Layout</option>
                  <option value="card">Card Style</option>
                  <option value="sidebar">Sidebar Layout</option>
                  <option value="floating">Floating Elements</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Alignment</label>
                  <select
                    value={template.modernFeatures?.alignment || 'center'}
                    onChange={(e) => updateModernFeatures('alignment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="left">Left Aligned</option>
                    <option value="center">Center Aligned</option>
                    <option value="right">Right Aligned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spacing</label>
                  <select
                    value={template.modernFeatures?.spacing || 'normal'}
                    onChange={(e) => updateModernFeatures('spacing', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="compact">Compact</option>
                    <option value="normal">Normal</option>
                    <option value="spacious">Spacious</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                  <input
                    type="color"
                    value={template.backgroundColor}
                    onChange={(e) => setTemplate(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                  <input
                    type="color"
                    value={template.textColor}
                    onChange={(e) => setTemplate(prev => ({ ...prev, textColor: e.target.value }))}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                  <input
                    type="color"
                    value={template.accentColor}
                    onChange={(e) => setTemplate(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Logo Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!template.logo ? (
                <div className="text-center">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-3">Upload organization logo</p>
                    <Button onClick={() => logoInputRef.current?.click()} variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Current Logo</span>
                    <Button onClick={removeLogo} variant="outline" size="sm">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex justify-center p-3 bg-gray-50 rounded-lg">
                    <img 
                      src={template.logo.url} 
                      alt="Logo" 
                      style={{ 
                        width: `${template.logo.width}px`, 
                        height: `${template.logo.height}px` 
                      }}
                      className="object-contain"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Width"
                      type="number"
                      value={template.logo.width}
                      onChange={(e) => updateLogoSettings('width', parseInt(e.target.value))}
                      min="40"
                      max="200"
                    />
                    <Input
                      label="Height"
                      type="number"
                      value={template.logo.height}
                      onChange={(e) => updateLogoSettings('height', parseInt(e.target.value))}
                      min="40"
                      max="200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <select
                      value={template.logo.position}
                      onChange={(e) => updateLogoSettings('position', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="top-left">Top Left</option>
                      <option value="top-center">Top Center</option>
                      <option value="top-right">Top Right</option>
                      <option value="center">Center</option>
                    </select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stamp Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stamp className="h-5 w-5" />
                Digital Stamp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Enable Stamp</label>
                <input
                  type="checkbox"
                  checked={template.modernFeatures?.showStamp || false}
                  onChange={(e) => updateModernFeatures('showStamp', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              {template.modernFeatures?.showStamp && (
                <>
                  {!template.stamp ? (
                    <div className="text-center">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <Stamp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-3">Upload digital stamp</p>
                        <Button onClick={() => stampInputRef.current?.click()} variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Stamp
                        </Button>
                        <input
                          ref={stampInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleStampUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Current Stamp</span>
                        <Button onClick={removeStamp} variant="outline" size="sm">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex justify-center p-3 bg-gray-50 rounded-lg">
                        <img 
                          src={template.stamp.url} 
                          alt="Stamp" 
                          style={{ 
                            width: `${template.stamp.width}px`, 
                            height: `${template.stamp.height}px` 
                          }}
                          className="object-contain"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Width"
                          type="number"
                          value={template.stamp.width}
                          onChange={(e) => updateStampSettings('width', parseInt(e.target.value))}
                          min="30"
                          max="120"
                        />
                        <Input
                          label="Height"
                          type="number"
                          value={template.stamp.height}
                          onChange={(e) => updateStampSettings('height', parseInt(e.target.value))}
                          min="30"
                          max="120"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                        <select
                          value={template.stamp.position}
                          onChange={(e) => updateStampSettings('position', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="bottom-left">Bottom Left</option>
                          <option value="bottom-right">Bottom Right</option>
                          <option value="top-right">Top Right</option>
                          <option value="center-right">Center Right</option>
                        </select>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* QR Code Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Enable QR Code</label>
                <input
                  type="checkbox"
                  checked={template.modernFeatures?.showQR || false}
                  onChange={(e) => updateModernFeatures('showQR', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              {template.modernFeatures?.showQR && template.qrCode && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                      <select
                        value={template.qrCode.position}
                        onChange={(e) => updateQRSettings('position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                        <option value="top-left">Top Left</option>
                        <option value="top-right">Top Right</option>
                      </select>
                    </div>
                    <Input
                      label="Size"
                      type="number"
                      value={template.qrCode.size}
                      onChange={(e) => updateQRSettings('size', parseInt(e.target.value))}
                      min="40"
                      max="100"
                    />
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <img 
                      src={generateQRCodeURL('CERT-2024-001')} 
                      alt="QR Code Preview" 
                      className="mx-auto"
                      style={{ width: `${template.qrCode.size}px`, height: `${template.qrCode.size}px` }}
                    />
                    <p className="text-xs text-gray-600 mt-2">QR Code Preview</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Template Gallery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Modern Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Choose from professionally designed modern certificate layouts
              </p>
              
              <div className="max-h-80 overflow-y-auto space-y-2">
                {modernTemplates.map((templateOption) => (
                  <div 
                    key={templateOption.id} 
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      template.id === templateOption.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setTemplate(templateOption)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900 text-sm">{templateOption.name}</div>
                      <div className="flex items-center gap-1">
                        {templateOption.modernFeatures?.showQR && <QrCode className="h-3 w-3 text-blue-500" />}
                        {templateOption.modernFeatures?.showStamp && <Stamp className="h-3 w-3 text-green-500" />}
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          {templateOption.certification?.minimumScore}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      <span className="capitalize">{templateOption.layout}</span> • 
                      <span className="capitalize"> {templateOption.modernFeatures?.alignment || 'center'}</span> • 
                      <span className="capitalize"> {templateOption.certification?.gradeText}</span>
                    </div>
                    
                    <div className="text-xs font-medium text-gray-800">
                      {templateOption.title}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button onClick={saveTemplate} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
            <Button onClick={resetTemplate} variant="outline">
              Reset
            </Button>
          </div>
        </div>

        {/* Modern Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className={`w-full aspect-[4/3] border rounded-lg p-6 relative overflow-hidden ${
                  template.layout === 'card' ? 'shadow-lg' : 'border-gray-200'
                }`}
                style={{ 
                  backgroundColor: template.backgroundColor,
                  color: template.textColor
                }}
              >
                {/* Logo */}
                {template.logo && (
                  <div 
                    className="absolute z-10"
                    style={{
                      top: template.logo.position.includes('top') ? '16px' : '50%',
                      left: template.logo.position.includes('left') ? '16px' : 
                            template.logo.position.includes('right') ? 'auto' : '50%',
                      right: template.logo.position.includes('right') ? '16px' : 'auto',
                      transform: template.logo.position === 'center' ? 'translate(-50%, -50%)' :
                                template.logo.position === 'top-center' ? 'translateX(-50%)' : 'none'
                    }}
                  >
                    <img 
                      src={template.logo.url} 
                      alt="Logo" 
                      style={{ 
                        width: `${template.logo.width * 0.4}px`, 
                        height: `${template.logo.height * 0.4}px` 
                      }}
                      className="object-contain"
                    />
                  </div>
                )}

                {/* QR Code */}
                {template.modernFeatures?.showQR && template.qrCode && (
                  <div 
                    className="absolute z-10"
                    style={{
                      top: template.qrCode.position.includes('top') ? '16px' : 'auto',
                      bottom: template.qrCode.position.includes('bottom') ? '16px' : 'auto',
                      left: template.qrCode.position.includes('left') ? '16px' : 'auto',
                      right: template.qrCode.position.includes('right') ? '16px' : 'auto'
                    }}
                  >
                    <img 
                      src={generateQRCodeURL('CERT-2024-001')} 
                      alt="QR Code" 
                      style={{ 
                        width: `${template.qrCode.size * 0.4}px`, 
                        height: `${template.qrCode.size * 0.4}px` 
                      }}
                      className="opacity-80"
                    />
                  </div>
                )}

                {/* Stamp */}
                {template.modernFeatures?.showStamp && template.stamp && (
                  <div 
                    className="absolute z-10"
                    style={{
                      top: template.stamp.position.includes('top') ? '16px' : 
                           template.stamp.position.includes('center') ? '50%' : 'auto',
                      bottom: template.stamp.position.includes('bottom') ? '16px' : 'auto',
                      left: template.stamp.position.includes('left') ? '16px' : 'auto',
                      right: template.stamp.position.includes('right') ? '16px' : 'auto',
                      transform: template.stamp.position.includes('center') ? 'translateY(-50%)' : 'none'
                    }}
                  >
                    <img 
                      src={template.stamp.url} 
                      alt="Stamp" 
                      style={{ 
                        width: `${template.stamp.width * 0.4}px`, 
                        height: `${template.stamp.height * 0.4}px` 
                      }}
                      className="object-contain opacity-80"
                    />
                  </div>
                )}

                {/* Content Layout */}
                <div className={`h-full flex flex-col justify-center ${
                  (template.modernFeatures?.alignment || 'center') === 'left' ? 'items-start text-left' :
                  (template.modernFeatures?.alignment || 'center') === 'right' ? 'items-end text-right' :
                  'items-center text-center'
                } ${
                  (template.modernFeatures?.spacing || 'normal') === 'compact' ? 'space-y-2' :
                  (template.modernFeatures?.spacing || 'normal') === 'spacious' ? 'space-y-6' : 'space-y-4'
                } ${
                  template.layout === 'sidebar' ? 'ml-20' :
                  template.layout === 'split' ? 'px-8' :
                  template.layout === 'card' ? 'px-4' : ''
                }`}>
                  
                  <div 
                    className="font-bold"
                    style={{ 
                      fontSize: `${template.fontSize.title * 0.4}px`,
                      color: template.accentColor
                    }}
                  >
                    {template.title}
                  </div>
                  
                  <div 
                    style={{ fontSize: `${template.fontSize.subtitle * 0.6}px` }}
                  >
                    {template.subtitle}
                  </div>

                  <div 
                    className="text-lg font-semibold py-2 px-4 rounded"
                    style={{ 
                      backgroundColor: `${template.accentColor}20`,
                      color: template.accentColor
                    }}
                  >
                    John Doe
                  </div>

                  <div style={{ fontSize: `${template.fontSize.body * 0.7}px` }}>
                    has successfully completed
                  </div>

                  <div 
                    className="font-semibold"
                    style={{ 
                      fontSize: `${template.fontSize.body * 0.8}px`,
                      color: template.accentColor 
                    }}
                  >
                    Advanced Medical Training
                  </div>

                  <div style={{ fontSize: `${template.fontSize.body * 0.6}px` }}>
                    Score: <span className="font-bold">{previewScore}%</span> • Date: {new Date().toLocaleDateString()}
                  </div>

                  {template.certification?.showGrade && (
                    <div 
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ 
                        backgroundColor: gradeStatus.isEligible ? '#10b98120' : '#ef444420',
                        color: gradeStatus.isEligible ? '#059669' : '#dc2626'
                      }}
                    >
                      {gradeStatus.gradeText}
                    </div>
                  )}

                  <div className="mt-4 text-xs">
                    <div className="font-medium">{template.organizationName}</div>
                    <div className="mt-2 pt-2 border-t border-current border-opacity-30">
                      <div>{template.signatoryName}</div>
                      <div className="opacity-75">{template.signatoryTitle}</div>
                    </div>
                  </div>
                </div>

                {/* Layout-specific decorations */}
                {template.layout === 'sidebar' && (
                  <div 
                    className="absolute left-0 top-0 w-16 h-full opacity-10"
                    style={{ backgroundColor: template.accentColor }}
                  />
                )}
                
                {template.layout === 'split' && (
                  <div 
                    className="absolute top-0 left-1/2 w-px h-full opacity-20"
                    style={{ backgroundColor: template.accentColor }}
                  />
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <Button 
                  onClick={generatePreviewPDF} 
                  className="flex-1"
                  disabled={!gradeStatus.isEligible}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {gradeStatus.isEligible ? 'Download Modern PDF' : 'Score Too Low'}
                </Button>
              </div>

              {!gradeStatus.isEligible && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  <AlertCircle className="h-3 w-3 inline mr-1" />
                  Minimum score of {template.certification?.minimumScore}% required for certification
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Modern PDF Generation Function
export const generateModernCertificatePDF = async (certificate: any, template: CertificateTemplate) => {
  // Check if score meets minimum requirement before generating
  if (!isEligibleForCertificate(certificate.score, template)) {
    const gradeStatus = getGradeStatus(certificate.score, template);
    throw new Error(gradeStatus.message);
  }

  const { jsPDF } = await import('jspdf');
  
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const bgColor = hexToRgb(template.backgroundColor);
  const textColor = hexToRgb(template.textColor);
  const accentColor = hexToRgb(template.accentColor);

  // Set background
  pdf.setFillColor(bgColor.r, bgColor.g, bgColor.b);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Modern layout-specific elements
  if (template.layout === 'sidebar') {
    pdf.setFillColor(accentColor.r, accentColor.g, accentColor.b);
    pdf.setGState(new pdf.GState({opacity: 0.1}));
    pdf.rect(0, 0, 30, pageHeight, 'F');
    pdf.setGState(new pdf.GState({opacity: 1}));
  }

  if (template.layout === 'split') {
    pdf.setDrawColor(accentColor.r, accentColor.g, accentColor.b);
    pdf.setGState(new pdf.GState({opacity: 0.2}));
    pdf.setLineWidth(1);
    pdf.line(pageWidth / 2, 0, pageWidth / 2, pageHeight);
    pdf.setGState(new pdf.GState({opacity: 1}));
  }

  // Add logo
  if (template.logo) {
    try {
      const logoWidth = template.logo.width * 0.264583;
      const logoHeight = template.logo.height * 0.264583;
      
      let logoX, logoY;
      
      switch (template.logo.position) {
        case 'top-left':
          logoX = 20;
          logoY = 20;
          break;
        case 'top-center':
          logoX = (pageWidth - logoWidth) / 2;
          logoY = 20;
          break;
        case 'top-right':
          logoX = pageWidth - logoWidth - 20;
          logoY = 20;
          break;
        case 'center':
          logoX = (pageWidth - logoWidth) / 2;
          logoY = (pageHeight - logoHeight) / 2 - 40;
          break;
        default:
          logoX = (pageWidth - logoWidth) / 2;
          logoY = 20;
      }

      pdf.addImage(template.logo.url, 'JPEG', logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
      console.warn('Could not add logo to PDF:', error);
    }
  }

  // Add QR Code
  if (template.modernFeatures?.showQR && template.qrCode) {
    try {
      const qrSize = template.qrCode.size * 0.264583;
      const verificationURL = `https://verify.adarehospital.com/certificate/${certificate.certificateNumber}`;
      const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=${template.qrCode.size}x${template.qrCode.size}&data=${encodeURIComponent(verificationURL)}`;
      
      let qrX, qrY;
      
      switch (template.qrCode.position) {
        case 'top-left':
          qrX = 20;
          qrY = 20;
          break;
        case 'top-right':
          qrX = pageWidth - qrSize - 20;
          qrY = 20;
          break;
        case 'bottom-left':
          qrX = 20;
          qrY = pageHeight - qrSize - 20;
          break;
        case 'bottom-right':
          qrX = pageWidth - qrSize - 20;
          qrY = pageHeight - qrSize - 20;
          break;
      }

      // Create a temporary image element to load the QR code
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        pdf.addImage(img, 'PNG', qrX, qrY, qrSize, qrSize);
      };
      img.src = qrCodeURL;
    } catch (error) {
      console.warn('Could not add QR code to PDF:', error);
    }
  }

  // Add stamp
  if (template.modernFeatures?.showStamp && template.stamp) {
    try {
      const stampWidth = template.stamp.width * 0.264583;
      const stampHeight = template.stamp.height * 0.264583;
      
      let stampX, stampY;
      
      switch (template.stamp.position) {
        case 'bottom-left':
          stampX = 20;
          stampY = pageHeight - stampHeight - 20;
          break;
        case 'bottom-right':
          stampX = pageWidth - stampWidth - 20;
          stampY = pageHeight - stampHeight - 20;
          break;
        case 'top-right':
          stampX = pageWidth - stampWidth - 20;
          stampY = 20;
          break;
        case 'center-right':
          stampX = pageWidth - stampWidth - 20;
          stampY = (pageHeight - stampHeight) / 2;
          break;
      }

      pdf.addImage(template.stamp.url, 'JPEG', stampX, stampY, stampWidth, stampHeight);
    } catch (error) {
      console.warn('Could not add stamp to PDF:', error);
    }
  }

  // Content positioning based on layout
  let contentX = pageWidth / 2;
  let contentY = pageHeight / 2;
  let textAlign: 'left' | 'center' | 'right' = 'center';

  if (template.layout === 'sidebar') {
    contentX = pageWidth / 2 + 15;
  }

  const alignment = template.modernFeatures?.alignment || 'center';
  if (alignment === 'left') {
    contentX = template.layout === 'sidebar' ? 50 : 40;
    textAlign = 'left';
  } else if (alignment === 'right') {
    contentX = pageWidth - 40;
    textAlign = 'right';
  }

  // Spacing adjustments
  const spacing = (template.modernFeatures?.spacing || 'normal') === 'compact' ? 0.8 : 
                 (template.modernFeatures?.spacing || 'normal') === 'spacious' ? 1.5 : 1.2;

  // Title
  pdf.setTextColor(accentColor.r, accentColor.g, accentColor.b);
  pdf.setFontSize(template.fontSize.title);
  pdf.setFont('helvetica', 'bold');
  pdf.text(template.title, contentX, contentY - 40 * spacing, { align: textAlign });

  // Modern accent line
  if (alignment === 'center') {
    pdf.setFillColor(accentColor.r, accentColor.g, accentColor.b);
    pdf.rect(contentX - 40, contentY - 35 * spacing, 80, 2, 'F');
  }

  // Subtitle
  pdf.setTextColor(textColor.r, textColor.g, textColor.b);
  pdf.setFontSize(template.fontSize.subtitle);
  pdf.setFont('helvetica', 'normal');
  pdf.text(template.subtitle, contentX, contentY - 20 * spacing, { align: textAlign });

  // Student name with modern highlight
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(accentColor.r, accentColor.g, accentColor.b);
  
  // Background highlight for name
  const nameWidth = pdf.getTextWidth(certificate.studentName);
  pdf.setFillColor(accentColor.r, accentColor.g, accentColor.b);
  pdf.setGState(new pdf.GState({opacity: 0.1}));
  pdf.rect(contentX - nameWidth/2 - 5, contentY - 8, nameWidth + 10, 12, 'F');
  pdf.setGState(new pdf.GState({opacity: 1}));
  
  pdf.text(certificate.studentName, contentX, contentY, { align: textAlign });

  // Body text
  pdf.setFontSize(template.fontSize.body);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(textColor.r, textColor.g, textColor.b);
  pdf.text('has successfully completed', contentX, contentY + 15 * spacing, { align: textAlign });

  // Exam title
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(accentColor.r, accentColor.g, accentColor.b);
  pdf.text(certificate.examTitle, contentX, contentY + 30 * spacing, { align: textAlign });

  // Score and date with grade status
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(textColor.r, textColor.g, textColor.b);
  const completedDate = new Date(certificate.completedAt).toLocaleDateString();
  pdf.text(`Score: ${certificate.score}% • Date: ${completedDate}`, contentX, contentY + 45 * spacing, { align: textAlign });

  // Add grade text if enabled
  if (template.certification?.showGrade) {
    const gradeStatus = getGradeStatus(certificate.score, template);
    pdf.setFontSize(10);
    pdf.setTextColor(accentColor.r, accentColor.g, accentColor.b);
    pdf.text(`Grade: ${gradeStatus.gradeText}`, contentX, contentY + 55 * spacing, { align: textAlign });
  }

  // Organization and signature
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(textColor.r, textColor.g, textColor.b);
  pdf.text(template.organizationName, contentX, contentY + 70 * spacing, { align: textAlign });

  // Modern signature line
  pdf.setDrawColor(textColor.r, textColor.g, textColor.b);
  pdf.setLineWidth(0.5);
  pdf.line(contentX - 30, contentY + 85 * spacing, contentX + 30, contentY + 85 * spacing);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(template.signatoryName, contentX, contentY + 92 * spacing, { align: textAlign });
  pdf.text(template.signatoryTitle, contentX, contentY + 98 * spacing, { align: textAlign });

  // Certificate number and minimum score info
  pdf.setFontSize(8);
  pdf.setTextColor(textColor.r, textColor.g, textColor.b);
  pdf.text(`Certificate #: ${certificate.certificateNumber}`, pageWidth - 20, pageHeight - 15, { align: 'right' });
  pdf.text(`Minimum Score: ${template.certification?.minimumScore}%`, pageWidth - 20, pageHeight - 10, { align: 'right' });

  // Save the PDF
  pdf.save(`modern-certificate-${certificate.certificateNumber}.pdf`);
};