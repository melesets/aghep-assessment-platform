import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Palette, 
  Download, 
  Eye, 
  Save, 
  RotateCcw, 
  Upload,
  Layers,
  Type,
  Image as ImageIcon,
  Zap,
  Sparkles,
  Crown,
  Award,
  Star,
  Gem
} from 'lucide-react';

interface CertificateTemplate {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  organizationName: string;
  signatoryName: string;
  signatoryTitle: string;
  design: {
    backgroundColor: string;
    primaryColor: string;
    accentColor: string;
    textColor: string;
    borderColor: string;
    pattern: 'none' | 'geometric' | 'waves' | 'dots' | 'lines' | 'gradient' | 'watermark';
    layout: 'classic' | 'modern' | 'elegant' | 'corporate' | 'creative' | 'minimal';
    borderStyle: 'none' | 'simple' | 'decorative' | 'double' | 'shadow';
    fontFamily: 'serif' | 'sans-serif' | 'script' | 'modern';
  };
  elements: {
    showLogo: boolean;
    showBorder: boolean;
    showPattern: boolean;
    showWatermark: boolean;
    showQRCode: boolean;
    showSignature: boolean;
  };
}

const modernTemplates: CertificateTemplate[] = [
  {
    id: 'modern-blue',
    name: '🌊 Modern Ocean',
    title: 'CERTIFICATE OF EXCELLENCE',
    subtitle: 'This certifies that',
    organizationName: 'AGHEP Healthcare Institute',
    signatoryName: 'Dr. Sarah Johnson',
    signatoryTitle: 'Director of Education',
    design: {
      backgroundColor: '#f8fafc',
      primaryColor: '#0ea5e9',
      accentColor: '#0284c7',
      textColor: '#1e293b',
      borderColor: '#0ea5e9',
      pattern: 'waves',
      layout: 'modern',
      borderStyle: 'decorative',
      fontFamily: 'sans-serif'
    },
    elements: {
      showLogo: true,
      showBorder: true,
      showPattern: true,
      showWatermark: false,
      showQRCode: true,
      showSignature: true
    }
  },
  {
    id: 'elegant-gold',
    name: '👑 Royal Gold',
    title: 'CERTIFICATE OF ACHIEVEMENT',
    subtitle: 'Proudly presented to',
    organizationName: 'AGHEP Healthcare Institute',
    signatoryName: 'Dr. Michael Chen',
    signatoryTitle: 'Chief Medical Officer',
    design: {
      backgroundColor: '#fffbeb',
      primaryColor: '#d97706',
      accentColor: '#92400e',
      textColor: '#451a03',
      borderColor: '#d97706',
      pattern: 'geometric',
      layout: 'elegant',
      borderStyle: 'double',
      fontFamily: 'serif'
    },
    elements: {
      showLogo: true,
      showBorder: true,
      showPattern: true,
      showWatermark: true,
      showQRCode: false,
      showSignature: true
    }
  },
  {
    id: 'corporate-green',
    name: '🏢 Corporate Professional',
    title: 'PROFESSIONAL CERTIFICATION',
    subtitle: 'This document certifies that',
    organizationName: 'AGHEP Healthcare Institute',
    signatoryName: 'Dr. Emily Rodriguez',
    signatoryTitle: 'Director of Professional Development',
    design: {
      backgroundColor: '#ffffff',
      primaryColor: '#059669',
      accentColor: '#047857',
      textColor: '#064e3b',
      borderColor: '#059669',
      pattern: 'lines',
      layout: 'corporate',
      borderStyle: 'simple',
      fontFamily: 'sans-serif'
    },
    elements: {
      showLogo: true,
      showBorder: true,
      showPattern: false,
      showWatermark: false,
      showQRCode: true,
      showSignature: true
    }
  },
  {
    id: 'creative-purple',
    name: '✨ Creative Spark',
    title: 'CERTIFICATE OF MASTERY',
    subtitle: 'Awarded to',
    organizationName: 'AGHEP Healthcare Institute',
    signatoryName: 'Dr. James Wilson',
    signatoryTitle: 'Head of Innovation',
    design: {
      backgroundColor: '#faf5ff',
      primaryColor: '#7c3aed',
      accentColor: '#5b21b6',
      textColor: '#3c1361',
      borderColor: '#7c3aed',
      pattern: 'dots',
      layout: 'creative',
      borderStyle: 'shadow',
      fontFamily: 'modern'
    },
    elements: {
      showLogo: true,
      showBorder: true,
      showPattern: true,
      showWatermark: false,
      showQRCode: true,
      showSignature: true
    }
  },
  {
    id: 'minimal-gray',
    name: '⚡ Minimal Clean',
    title: 'CERTIFICATE OF COMPLETION',
    subtitle: 'This is to certify that',
    organizationName: 'AGHEP Healthcare Institute',
    signatoryName: 'Dr. Lisa Thompson',
    signatoryTitle: 'Academic Director',
    design: {
      backgroundColor: '#ffffff',
      primaryColor: '#374151',
      accentColor: '#1f2937',
      textColor: '#111827',
      borderColor: '#6b7280',
      pattern: 'none',
      layout: 'minimal',
      borderStyle: 'simple',
      fontFamily: 'sans-serif'
    },
    elements: {
      showLogo: false,
      showBorder: true,
      showPattern: false,
      showWatermark: false,
      showQRCode: false,
      showSignature: true
    }
  },
  {
    id: 'gradient-rainbow',
    name: '🌈 Gradient Rainbow',
    title: 'CERTIFICATE OF EXCELLENCE',
    subtitle: 'Celebrating the achievement of',
    organizationName: 'AGHEP Healthcare Institute',
    signatoryName: 'Dr. Robert Kim',
    signatoryTitle: 'Director of Excellence',
    design: {
      backgroundColor: '#ffffff',
      primaryColor: '#ec4899',
      accentColor: '#be185d',
      textColor: '#831843',
      borderColor: '#ec4899',
      pattern: 'gradient',
      layout: 'creative',
      borderStyle: 'decorative',
      fontFamily: 'modern'
    },
    elements: {
      showLogo: true,
      showBorder: true,
      showPattern: true,
      showWatermark: false,
      showQRCode: true,
      showSignature: true
    }
  }
];

export const ModernCertificateDesigner: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate>(modernTemplates[0]);
  const [customTemplate, setCustomTemplate] = useState<CertificateTemplate>(modernTemplates[0]);
  const [activeTab, setActiveTab] = useState<'templates' | 'design' | 'content' | 'elements'>('templates');
  const [previewMode, setPreviewMode] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleTemplateSelect = (template: CertificateTemplate) => {
    setSelectedTemplate(template);
    setCustomTemplate({ ...template });
  };

  const updateDesign = (field: keyof CertificateTemplate['design'], value: any) => {
    setCustomTemplate(prev => ({
      ...prev,
      design: {
        ...prev.design,
        [field]: value
      }
    }));
  };

  const updateContent = (field: keyof Omit<CertificateTemplate, 'design' | 'elements'>, value: string) => {
    setCustomTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateElements = (field: keyof CertificateTemplate['elements'], value: boolean) => {
    setCustomTemplate(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [field]: value
      }
    }));
  };

  const saveTemplate = () => {
    localStorage.setItem('certificate-template', JSON.stringify(customTemplate));
    alert('Certificate template saved successfully!');
  };

  const resetToDefault = () => {
    setCustomTemplate({ ...selectedTemplate });
  };

  const generatePreview = async () => {
    const mockCertificate = {
      id: 'preview',
      examTitle: 'Healthcare Professional Certification',
      studentName: 'John Doe',
      score: 95,
      completedAt: new Date().toISOString(),
      certificateNumber: 'CERT-2024-001',
      studentEmail: 'john.doe@example.com',
      studentDepartment: 'Emergency Medicine',
      studentPosition: 'Registered Nurse',
      studentOrganization: 'City General Hospital'
    };

    await generateModernCertificatePDF(mockCertificate, customTemplate);
  };

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'modern': return <Zap className="h-4 w-4" />;
      case 'elegant': return <Crown className="h-4 w-4" />;
      case 'corporate': return <Award className="h-4 w-4" />;
      case 'creative': return <Sparkles className="h-4 w-4" />;
      case 'minimal': return <Layers className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getPatternIcon = (pattern: string) => {
    switch (pattern) {
      case 'geometric': return <Gem className="h-4 w-4" />;
      case 'waves': return <span className="text-xs">🌊</span>;
      case 'dots': return <span className="text-xs">⚪</span>;
      case 'lines': return <span className="text-xs">📏</span>;
      case 'gradient': return <span className="text-xs">🌈</span>;
      case 'watermark': return <span className="text-xs">💧</span>;
      default: return <span className="text-xs">⬜</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modern Certificate Designer</h1>
        <p className="text-gray-600">Create stunning, professional certificates with modern designs and patterns</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {[
          { id: 'templates', label: 'Templates', icon: <Layers className="h-4 w-4" /> },
          { id: 'design', label: 'Design', icon: <Palette className="h-4 w-4" /> },
          { id: 'content', label: 'Content', icon: <Type className="h-4 w-4" /> },
          { id: 'elements', label: 'Elements', icon: <ImageIcon className="h-4 w-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <Card>
              <CardHeader>
                <CardTitle>Choose a Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modernTemplates.map(template => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate.id === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: template.design.primaryColor }}
                        ></div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{template.design.layout} Style</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center gap-2">
                          {getLayoutIcon(template.design.layout)}
                          <span>Layout: {template.design.layout}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getPatternIcon(template.design.pattern)}
                          <span>Pattern: {template.design.pattern}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Design Tab */}
          {activeTab === 'design' && (
            <Card>
              <CardHeader>
                <CardTitle>Design Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Colors */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customTemplate.design.backgroundColor}
                          onChange={(e) => updateDesign('backgroundColor', e.target.value)}
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <Input
                          value={customTemplate.design.backgroundColor}
                          onChange={(e) => updateDesign('backgroundColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customTemplate.design.primaryColor}
                          onChange={(e) => updateDesign('primaryColor', e.target.value)}
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <Input
                          value={customTemplate.design.primaryColor}
                          onChange={(e) => updateDesign('primaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customTemplate.design.accentColor}
                          onChange={(e) => updateDesign('accentColor', e.target.value)}
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <Input
                          value={customTemplate.design.accentColor}
                          onChange={(e) => updateDesign('accentColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customTemplate.design.textColor}
                          onChange={(e) => updateDesign('textColor', e.target.value)}
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <Input
                          value={customTemplate.design.textColor}
                          onChange={(e) => updateDesign('textColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Border Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customTemplate.design.borderColor}
                          onChange={(e) => updateDesign('borderColor', e.target.value)}
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <Input
                          value={customTemplate.design.borderColor}
                          onChange={(e) => updateDesign('borderColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layout & Style */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Layout & Style</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
                      <select
                        value={customTemplate.design.layout}
                        onChange={(e) => updateDesign('layout', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="classic">Classic</option>
                        <option value="modern">Modern</option>
                        <option value="elegant">Elegant</option>
                        <option value="corporate">Corporate</option>
                        <option value="creative">Creative</option>
                        <option value="minimal">Minimal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                      <select
                        value={customTemplate.design.fontFamily}
                        onChange={(e) => updateDesign('fontFamily', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="serif">Serif (Traditional)</option>
                        <option value="sans-serif">Sans-serif (Clean)</option>
                        <option value="script">Script (Elegant)</option>
                        <option value="modern">Modern (Contemporary)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
                      <select
                        value={customTemplate.design.pattern}
                        onChange={(e) => updateDesign('pattern', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="none">None</option>
                        <option value="geometric">Geometric</option>
                        <option value="waves">Waves</option>
                        <option value="dots">Dots</option>
                        <option value="lines">Lines</option>
                        <option value="gradient">Gradient</option>
                        <option value="watermark">Watermark</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Border Style</label>
                      <select
                        value={customTemplate.design.borderStyle}
                        onChange={(e) => updateDesign('borderStyle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="none">None</option>
                        <option value="simple">Simple</option>
                        <option value="decorative">Decorative</option>
                        <option value="double">Double</option>
                        <option value="shadow">Shadow</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <Card>
              <CardHeader>
                <CardTitle>Content Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Certificate Title"
                  value={customTemplate.title}
                  onChange={(e) => updateContent('title', e.target.value)}
                  placeholder="CERTIFICATE OF COMPLETION"
                />
                <Input
                  label="Subtitle"
                  value={customTemplate.subtitle}
                  onChange={(e) => updateContent('subtitle', e.target.value)}
                  placeholder="This is to certify that"
                />
                <Input
                  label="Organization Name"
                  value={customTemplate.organizationName}
                  onChange={(e) => updateContent('organizationName', e.target.value)}
                  placeholder="Your Organization Name"
                />
                <Input
                  label="Signatory Name"
                  value={customTemplate.signatoryName}
                  onChange={(e) => updateContent('signatoryName', e.target.value)}
                  placeholder="Dr. John Smith"
                />
                <Input
                  label="Signatory Title"
                  value={customTemplate.signatoryTitle}
                  onChange={(e) => updateContent('signatoryTitle', e.target.value)}
                  placeholder="Director of Education"
                />
              </CardContent>
            </Card>
          )}

          {/* Elements Tab */}
          {activeTab === 'elements' && (
            <Card>
              <CardHeader>
                <CardTitle>Certificate Elements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(customTemplate.elements).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => updateElements(key as keyof CertificateTemplate['elements'], e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="w-full aspect-[4/3] border-2 rounded-lg p-4 text-center relative overflow-hidden"
                style={{ 
                  backgroundColor: customTemplate.design.backgroundColor,
                  borderColor: customTemplate.design.borderColor,
                  color: customTemplate.design.textColor
                }}
              >
                {/* Background Pattern */}
                {customTemplate.elements.showPattern && customTemplate.design.pattern !== 'none' && (
                  <div className="absolute inset-0 opacity-10">
                    {customTemplate.design.pattern === 'waves' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent transform rotate-12"></div>
                    )}
                    {customTemplate.design.pattern === 'dots' && (
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                      }}></div>
                    )}
                    {customTemplate.design.pattern === 'geometric' && (
                      <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(45deg, currentColor 25%, transparent 25%), linear-gradient(-45deg, currentColor 25%, transparent 25%)`,
                        backgroundSize: '20px 20px'
                      }}></div>
                    )}
                  </div>
                )}

                <div className="relative z-10 space-y-2">
                  <h1 
                    className="text-lg font-bold"
                    style={{ color: customTemplate.design.primaryColor }}
                  >
                    {customTemplate.title}
                  </h1>
                  <div 
                    className="w-16 h-0.5 mx-auto"
                    style={{ backgroundColor: customTemplate.design.accentColor }}
                  ></div>
                  <p className="text-sm">{customTemplate.subtitle}</p>
                  <p className="text-base font-semibold">John Doe</p>
                  <p className="text-sm">Healthcare Professional Certification</p>
                  <p className="text-xs">Score: 95%</p>
                  <div className="pt-2">
                    <p className="text-xs font-medium">{customTemplate.organizationName}</p>
                    <div className="w-12 border-t border-current mx-auto mt-1"></div>
                    <p className="text-xs">{customTemplate.signatoryName}</p>
                    <p className="text-xs">{customTemplate.signatoryTitle}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button onClick={generatePreview} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Generate Preview PDF
            </Button>
            <Button onClick={saveTemplate} variant="outline" className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
            <Button onClick={resetToDefault} variant="outline" className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced PDF Generation Function
export const generateModernCertificatePDF = async (certificate: any, template: CertificateTemplate) => {
  try {
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

    const bgColor = hexToRgb(template.design.backgroundColor);
    const primaryColor = hexToRgb(template.design.primaryColor);
    const accentColor = hexToRgb(template.design.accentColor);
    const textColor = hexToRgb(template.design.textColor);
    const borderColor = hexToRgb(template.design.borderColor);

    // Set background
    if (template.design.backgroundColor !== '#ffffff') {
      pdf.setFillColor(bgColor.r, bgColor.g, bgColor.b);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    }

    // Add border if enabled
    if (template.elements.showBorder && template.design.borderStyle !== 'none') {
      pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b);
      
      if (template.design.borderStyle === 'double') {
        pdf.setLineWidth(2);
        pdf.rect(10, 10, pageWidth - 20, pageHeight - 20, 'S');
        pdf.rect(15, 15, pageWidth - 30, pageHeight - 30, 'S');
      } else if (template.design.borderStyle === 'decorative') {
        pdf.setLineWidth(3);
        pdf.rect(8, 8, pageWidth - 16, pageHeight - 16, 'S');
        // Add corner decorations
        const cornerSize = 15;
        pdf.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
        pdf.rect(8, 8, cornerSize, cornerSize, 'F');
        pdf.rect(pageWidth - 8 - cornerSize, 8, cornerSize, cornerSize, 'F');
        pdf.rect(8, pageHeight - 8 - cornerSize, cornerSize, cornerSize, 'F');
        pdf.rect(pageWidth - 8 - cornerSize, pageHeight - 8 - cornerSize, cornerSize, cornerSize, 'F');
      } else {
        pdf.setLineWidth(1);
        pdf.rect(10, 10, pageWidth - 20, pageHeight - 20, 'S');
      }
    }

    // Add background pattern
    if (template.elements.showPattern && template.design.pattern !== 'none') {
      pdf.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
      pdf.setGState(new pdf.GState({opacity: 0.1}));
      
      if (template.design.pattern === 'dots') {
        for (let x = 20; x < pageWidth - 20; x += 15) {
          for (let y = 20; y < pageHeight - 20; y += 15) {
            pdf.circle(x, y, 1, 'F');
          }
        }
      } else if (template.design.pattern === 'lines') {
        for (let x = 20; x < pageWidth - 20; x += 10) {
          pdf.line(x, 20, x, pageHeight - 20);
        }
      }
      
      pdf.setGState(new pdf.GState({opacity: 1}));
    }

    // Set font based on template
    const fontFamily = template.design.fontFamily === 'serif' ? 'times' : 'helvetica';
    
    // Title
    pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    pdf.setFontSize(32);
    pdf.setFont(fontFamily, 'bold');
    pdf.text(template.title, pageWidth / 2, 50, { align: 'center' });

    // Decorative line
    pdf.setDrawColor(accentColor.r, accentColor.g, accentColor.b);
    pdf.setLineWidth(3);
    pdf.line(pageWidth / 2 - 60, 60, pageWidth / 2 + 60, 60);

    // Subtitle
    pdf.setTextColor(textColor.r, textColor.g, textColor.b);
    pdf.setFontSize(18);
    pdf.setFont(fontFamily, 'normal');
    pdf.text(template.subtitle, pageWidth / 2, 80, { align: 'center' });

    // Student name with background highlight
    pdf.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
    pdf.setGState(new pdf.GState({opacity: 0.1}));
    const nameWidth = pdf.getTextWidth(certificate.studentName || 'Student Name');
    pdf.rect(pageWidth / 2 - nameWidth / 2 - 10, 90, nameWidth + 20, 15, 'F');
    pdf.setGState(new pdf.GState({opacity: 1}));

    pdf.setTextColor(textColor.r, textColor.g, textColor.b);
    pdf.setFontSize(28);
    pdf.setFont(fontFamily, 'bold');
    pdf.text(certificate.studentName || 'Student Name', pageWidth / 2, 100, { align: 'center' });

    // Exam title
    pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    pdf.setFontSize(20);
    pdf.setFont(fontFamily, 'bold');
    pdf.text(certificate.examTitle || 'Exam Title', pageWidth / 2, 125, { align: 'center' });

    // Score and date
    pdf.setTextColor(textColor.r, textColor.g, textColor.b);
    pdf.setFontSize(14);
    pdf.setFont(fontFamily, 'normal');
    const completedDate = new Date(certificate.completedAt).toLocaleDateString();
    pdf.text(`Score: ${certificate.score}% • Completed: ${completedDate}`, pageWidth / 2, 145, { align: 'center' });

    // Organization
    pdf.setFontSize(16);
    pdf.setFont(fontFamily, 'bold');
    pdf.text(template.organizationName, pageWidth / 2, 170, { align: 'center' });

    // Signature section
    if (template.elements.showSignature) {
      pdf.setDrawColor(textColor.r, textColor.g, textColor.b);
      pdf.line(pageWidth / 2 - 50, 190, pageWidth / 2 + 50, 190);
      
      pdf.setFontSize(12);
      pdf.setFont(fontFamily, 'normal');
      pdf.text(template.signatoryName, pageWidth / 2, 200, { align: 'center' });
      pdf.text(template.signatoryTitle, pageWidth / 2, 208, { align: 'center' });
    }

    // Certificate number
    pdf.setFontSize(10);
    pdf.text(`Certificate #: ${certificate.certificateNumber}`, pageWidth - 20, pageHeight - 10, { align: 'right' });

    // QR Code placeholder
    if (template.elements.showQRCode) {
      pdf.setDrawColor(textColor.r, textColor.g, textColor.b);
      pdf.rect(20, pageHeight - 30, 20, 20, 'S');
      pdf.setFontSize(8);
      pdf.text('QR Code', 30, pageHeight - 18, { align: 'center' });
    }

    // Save the PDF
    pdf.save(`modern-certificate-${certificate.certificateNumber || 'preview'}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};

export default ModernCertificateDesigner;