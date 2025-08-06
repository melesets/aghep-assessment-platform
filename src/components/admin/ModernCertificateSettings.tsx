import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Save, Eye, Download, Palette, Type, Image, Upload, X, Sparkles } from 'lucide-react';

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
  layout: 'classic' | 'modern' | 'elegant';
  logo?: {
    url: string;
    width: number;
    height: number;
    position: 'top-left' | 'top-center' | 'top-right' | 'center';
  };
}

interface ModernTemplate extends CertificateTemplate {
  pattern?: 'geometric' | 'waves' | 'dots' | 'lines' | 'hexagon' | 'circuit' | 'gradient';
  gradientColors?: string[];
  borderStyle?: 'modern' | 'minimal' | 'bold' | 'artistic';
}

const predefinedTemplates: ModernTemplate[] = [
  {
    id: 'neon-cyber',
    name: '🚀 Neon Cyber',
    title: 'DIGITAL CERTIFICATION',
    subtitle: 'Future-Ready Professional',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Sarah Chen',
    signatoryTitle: 'Chief Innovation Officer',
    backgroundColor: '#0a0a0a',
    textColor: '#ffffff',
    accentColor: '#00ff88',
    fontSize: { title: 36, subtitle: 20, body: 16 },
    layout: 'modern',
    pattern: 'circuit',
    gradientColors: ['#00ff88', '#0088ff', '#8800ff'],
    borderStyle: 'modern'
  },
  {
    id: 'gradient-wave',
    name: '🌊 Ocean Wave',
    title: 'CERTIFICATE OF EXCELLENCE',
    subtitle: 'Riding the Wave of Success',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Michael Torres',
    signatoryTitle: 'Director of Excellence',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    accentColor: '#0ea5e9',
    fontSize: { title: 34, subtitle: 18, body: 16 },
    layout: 'modern',
    pattern: 'waves',
    gradientColors: ['#0ea5e9', '#06b6d4', '#8b5cf6'],
    borderStyle: 'artistic'
  },
  {
    id: 'geometric-gold',
    name: '💎 Geometric Gold',
    title: 'PREMIUM CERTIFICATION',
    subtitle: 'Excellence in Modern Healthcare',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Elena Rodriguez',
    signatoryTitle: 'Chief Medical Excellence Officer',
    backgroundColor: '#fefce8',
    textColor: '#92400e',
    accentColor: '#f59e0b',
    fontSize: { title: 38, subtitle: 22, body: 18 },
    layout: 'elegant',
    pattern: 'geometric',
    gradientColors: ['#f59e0b', '#f97316', '#dc2626'],
    borderStyle: 'bold'
  },
  {
    id: 'holographic-purple',
    name: '✨ Holographic',
    title: 'ADVANCED CERTIFICATION',
    subtitle: 'Next-Generation Healthcare Professional',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. James Wilson',
    signatoryTitle: 'Director of Advanced Medicine',
    backgroundColor: '#1e1b4b',
    textColor: '#ffffff',
    accentColor: '#a855f7',
    fontSize: { title: 35, subtitle: 19, body: 17 },
    layout: 'modern',
    pattern: 'hexagon',
    gradientColors: ['#a855f7', '#ec4899', '#06b6d4'],
    borderStyle: 'modern'
  },
  {
    id: 'minimalist-zen',
    name: '🎯 Minimalist Zen',
    title: 'PROFESSIONAL MASTERY',
    subtitle: 'Simplicity Meets Excellence',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Lisa Park',
    signatoryTitle: 'Chief of Professional Development',
    backgroundColor: '#ffffff',
    textColor: '#374151',
    accentColor: '#059669',
    fontSize: { title: 32, subtitle: 18, body: 16 },
    layout: 'modern',
    pattern: 'lines',
    gradientColors: ['#059669', '#0d9488'],
    borderStyle: 'minimal'
  },
  {
    id: 'cosmic-gradient',
    name: '🌌 Cosmic',
    title: 'STELLAR ACHIEVEMENT',
    subtitle: 'Reaching for the Stars',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Robert Kim',
    signatoryTitle: 'Director of Innovation',
    backgroundColor: '#0f172a',
    textColor: '#ffffff',
    accentColor: '#f472b6',
    fontSize: { title: 36, subtitle: 20, body: 18 },
    layout: 'modern',
    pattern: 'dots',
    gradientColors: ['#f472b6', '#a855f7', '#3b82f6'],
    borderStyle: 'artistic'
  },
  {
    id: 'tech-matrix',
    name: '💻 Tech Matrix',
    title: 'DIGITAL EXCELLENCE',
    subtitle: 'Mastering the Digital Age',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Amanda Foster',
    signatoryTitle: 'Chief Technology Officer',
    backgroundColor: '#111827',
    textColor: '#10b981',
    accentColor: '#34d399',
    fontSize: { title: 33, subtitle: 18, body: 16 },
    layout: 'modern',
    pattern: 'circuit',
    gradientColors: ['#34d399', '#10b981', '#059669'],
    borderStyle: 'modern'
  },
  {
    id: 'aurora-borealis',
    name: '🌈 Aurora',
    title: 'SPECTACULAR ACHIEVEMENT',
    subtitle: 'Illuminating Excellence',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Christopher Lee',
    signatoryTitle: 'Director of Clinical Excellence',
    backgroundColor: '#1e1b4b',
    textColor: '#ffffff',
    accentColor: '#06b6d4',
    fontSize: { title: 37, subtitle: 21, body: 19 },
    layout: 'elegant',
    pattern: 'waves',
    gradientColors: ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'],
    borderStyle: 'artistic'
  },
  {
    id: 'crystal-clear',
    name: '💎 Crystal Clear',
    title: 'CRYSTAL CERTIFICATION',
    subtitle: 'Clarity in Professional Excellence',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Maria Gonzalez',
    signatoryTitle: 'Chief Quality Officer',
    backgroundColor: '#f8fafc',
    textColor: '#1e293b',
    accentColor: '#0ea5e9',
    fontSize: { title: 34, subtitle: 19, body: 17 },
    layout: 'modern',
    pattern: 'geometric',
    gradientColors: ['#0ea5e9', '#06b6d4', '#8b5cf6'],
    borderStyle: 'minimal'
  },
  {
    id: 'fire-gradient',
    name: '🔥 Fire Energy',
    title: 'DYNAMIC CERTIFICATION',
    subtitle: 'Igniting Professional Excellence',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. David Thompson',
    signatoryTitle: 'Director of Dynamic Medicine',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    accentColor: '#f97316',
    fontSize: { title: 35, subtitle: 20, body: 18 },
    layout: 'modern',
    pattern: 'waves',
    gradientColors: ['#f97316', '#dc2626', '#7c2d12'],
    borderStyle: 'bold'
  },
  {
    id: 'electric-blue',
    name: '⚡ Electric Blue',
    title: 'HIGH-VOLTAGE ACHIEVEMENT',
    subtitle: 'Electrifying Professional Performance',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Jennifer Adams',
    signatoryTitle: 'Chief Performance Officer',
    backgroundColor: '#0c4a6e',
    textColor: '#ffffff',
    accentColor: '#0ea5e9',
    fontSize: { title: 36, subtitle: 20, body: 18 },
    layout: 'modern',
    pattern: 'lines',
    gradientColors: ['#0ea5e9', '#3b82f6', '#1d4ed8'],
    borderStyle: 'modern'
  },
  {
    id: 'quantum-dots',
    name: '🔬 Quantum',
    title: 'QUANTUM CERTIFICATION',
    subtitle: 'Advanced Scientific Excellence',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Kevin Zhang',
    signatoryTitle: 'Director of Research Excellence',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#8b5cf6',
    fontSize: { title: 33, subtitle: 18, body: 16 },
    layout: 'modern',
    pattern: 'dots',
    gradientColors: ['#8b5cf6', '#a855f7', '#c084fc'],
    borderStyle: 'minimal'
  },
  {
    id: 'neon-pink',
    name: '💖 Neon Pink',
    title: 'VIBRANT ACHIEVEMENT',
    subtitle: 'Bold Excellence in Healthcare',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Rachel Martinez',
    signatoryTitle: 'Director of Innovative Care',
    backgroundColor: '#1f1f1f',
    textColor: '#ffffff',
    accentColor: '#ec4899',
    fontSize: { title: 34, subtitle: 19, body: 17 },
    layout: 'modern',
    pattern: 'hexagon',
    gradientColors: ['#ec4899', '#f472b6', '#fb7185'],
    borderStyle: 'artistic'
  },
  {
    id: 'emerald-matrix',
    name: '🟢 Emerald Matrix',
    title: 'MATRIX CERTIFICATION',
    subtitle: 'Connected Excellence Network',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Steven Clark',
    signatoryTitle: 'Chief Network Officer',
    backgroundColor: '#064e3b',
    textColor: '#ffffff',
    accentColor: '#10b981',
    fontSize: { title: 35, subtitle: 20, body: 18 },
    layout: 'modern',
    pattern: 'circuit',
    gradientColors: ['#10b981', '#059669', '#047857'],
    borderStyle: 'modern'
  },
  {
    id: 'sunset-gradient',
    name: '🌅 Sunset',
    title: 'GOLDEN HOUR ACHIEVEMENT',
    subtitle: 'Excellence at Every Horizon',
    organizationName: 'Adare General Hospital',
    signatoryName: 'Dr. Nicole Brown',
    signatoryTitle: 'Director of Excellence Horizons',
    backgroundColor: '#fef3c7',
    textColor: '#92400e',
    accentColor: '#f59e0b',
    fontSize: { title: 36, subtitle: 21, body: 19 },
    layout: 'elegant',
    pattern: 'gradient',
    gradientColors: ['#f59e0b', '#f97316', '#dc2626', '#be185d'],
    borderStyle: 'artistic'
  }
];

const defaultTemplate: ModernTemplate = predefinedTemplates[0];

export const ModernCertificateSettings: React.FC = () => {
  const [template, setTemplate] = useState<ModernTemplate>(defaultTemplate);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Load saved template on component mount
  React.useEffect(() => {
    const savedTemplate = localStorage.getItem('certificate-template');
    if (savedTemplate) {
      try {
        setTemplate(JSON.parse(savedTemplate));
      } catch (error) {
        console.warn('Could not load saved template:', error);
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
      examTitle: 'Sample Exam',
      score: 95,
      completedAt: new Date().toISOString(),
      certificateNumber: 'CERT-123456'
    };

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
            width: 100,
            height: 100,
            position: 'top-center'
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

  const updateLogoSettings = (key: string, value: any) => {
    if (template.logo) {
      setTemplate(prev => ({
        ...prev,
        logo: { ...prev.logo!, [key]: value }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modern Certificate Designer</h1>
        <p className="text-gray-600">
          Create stunning certificates with modern patterns, gradients, and graphics
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
                placeholder="DIGITAL CERTIFICATION"
              />
              <Input
                label="Subtitle"
                value={template.subtitle}
                onChange={(e) => setTemplate(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Future-Ready Professional"
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
                placeholder="Dr. Sarah Chen"
              />
              <Input
                label="Signatory Title"
                value={template.signatoryTitle}
                onChange={(e) => setTemplate(prev => ({ ...prev, signatoryTitle: e.target.value }))}
                placeholder="Chief Innovation Officer"
              />
            </CardContent>
          </Card>

          {/* Design Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Design Settings
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
                  <option value="classic">Classic</option>
                  <option value="modern">Modern</option>
                  <option value="elegant">Elegant</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
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

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Title Font Size"
                  type="number"
                  value={template.fontSize.title}
                  onChange={(e) => setTemplate(prev => ({
                    ...prev,
                    fontSize: { ...prev.fontSize, title: parseInt(e.target.value) }
                  }))}
                  min="16"
                  max="48"
                />
                <Input
                  label="Subtitle Font Size"
                  type="number"
                  value={template.fontSize.subtitle}
                  onChange={(e) => setTemplate(prev => ({
                    ...prev,
                    fontSize: { ...prev.fontSize, subtitle: parseInt(e.target.value) }
                  }))}
                  min="12"
                  max="32"
                />
                <Input
                  label="Body Font Size"
                  type="number"
                  value={template.fontSize.body}
                  onChange={(e) => setTemplate(prev => ({
                    ...prev,
                    fontSize: { ...prev.fontSize, body: parseInt(e.target.value) }
                  }))}
                  min="10"
                  max="24"
                />
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Upload your organization logo</p>
                    <Button onClick={() => logoInputRef.current?.click()} variant="outline">
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Current Logo</span>
                    <Button onClick={removeLogo} variant="outline" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
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
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Width (px)"
                      type="number"
                      value={template.logo.width}
                      onChange={(e) => updateLogoSettings('width', parseInt(e.target.value))}
                      min="50"
                      max="300"
                    />
                    <Input
                      label="Height (px)"
                      type="number"
                      value={template.logo.height}
                      onChange={(e) => updateLogoSettings('height', parseInt(e.target.value))}
                      min="50"
                      max="300"
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

          {/* Modern Template Gallery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Modern Template Gallery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Choose from our collection of ultra-modern certificate templates with patterns and graphics
              </p>
              
              <div className="max-h-96 overflow-y-auto space-y-3">
                {predefinedTemplates.map((templateOption) => (
                  <div 
                    key={templateOption.id} 
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
                      template.id === templateOption.id 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setTemplate(templateOption)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-gray-900">{templateOption.name}</div>
                      <div className="flex items-center gap-1">
                        {templateOption.gradientColors?.slice(0, 3).map((color, index) => (
                          <div 
                            key={index}
                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: color }}
                            title={`Gradient Color ${index + 1}`}
                          ></div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-3 flex items-center gap-2">
                      <span className="capitalize">{templateOption.layout}</span>
                      <span>•</span>
                      <span className="capitalize">{templateOption.pattern}</span>
                      <span>•</span>
                      <span className="capitalize">{templateOption.borderStyle}</span>
                    </div>
                    
                    {/* Enhanced Mini Preview */}
                    <div 
                      className="w-full h-20 rounded-lg border-2 text-center flex items-center justify-center text-xs relative overflow-hidden"
                      style={{ 
                        backgroundColor: templateOption.backgroundColor,
                        color: templateOption.textColor,
                        borderColor: templateOption.accentColor
                      }}
                    >
                      {/* Pattern Background */}
                      <div 
                        className="absolute inset-0 opacity-10"
                        style={{
                          background: templateOption.pattern === 'gradient' 
                            ? `linear-gradient(45deg, ${templateOption.gradientColors?.join(', ')})`
                            : templateOption.pattern === 'waves'
                            ? `repeating-linear-gradient(45deg, ${templateOption.accentColor}22 0px, transparent 10px, transparent 20px, ${templateOption.accentColor}22 30px)`
                            : templateOption.pattern === 'dots'
                            ? `radial-gradient(circle at 25% 25%, ${templateOption.accentColor}22 2px, transparent 2px)`
                            : templateOption.pattern === 'lines'
                            ? `repeating-linear-gradient(90deg, ${templateOption.accentColor}22 0px, transparent 2px, transparent 8px, ${templateOption.accentColor}22 10px)`
                            : templateOption.pattern === 'geometric'
                            ? `conic-gradient(from 45deg, ${templateOption.accentColor}22, transparent, ${templateOption.accentColor}22)`
                            : templateOption.pattern === 'hexagon'
                            ? `repeating-conic-gradient(from 0deg at 50% 50%, ${templateOption.accentColor}22 0deg 60deg, transparent 60deg 120deg)`
                            : templateOption.pattern === 'circuit'
                            ? `linear-gradient(90deg, ${templateOption.accentColor}22 50%, transparent 50%), linear-gradient(0deg, ${templateOption.accentColor}22 50%, transparent 50%)`
                            : 'none',
                          backgroundSize: templateOption.pattern === 'dots' ? '20px 20px' : '30px 30px'
                        }}
                      ></div>
                      
                      <div className="relative z-10">
                        <div 
                          className="font-bold mb-1 text-xs"
                          style={{ color: templateOption.accentColor }}
                        >
                          {templateOption.title}
                        </div>
                        <div className="text-xs opacity-80">{templateOption.subtitle}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-gray-500 text-center pt-2 border-t">
                Click any template to apply modern patterns and graphics
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
              Reset to Default
            </Button>
          </div>
        </div>

        {/* Enhanced Preview Panel */}
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
                className="w-full aspect-[4/3] border-2 border-gray-200 rounded-lg p-8 text-center relative overflow-hidden"
                style={{ 
                  backgroundColor: template.backgroundColor,
                  color: template.textColor
                }}
              >
                {/* Modern Pattern Background */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: template.pattern === 'gradient' 
                      ? `linear-gradient(135deg, ${template.gradientColors?.join(', ')})`
                      : template.pattern === 'waves'
                      ? `repeating-linear-gradient(45deg, ${template.accentColor}33 0px, transparent 20px, transparent 40px, ${template.accentColor}33 60px)`
                      : template.pattern === 'dots'
                      ? `radial-gradient(circle at 25% 25%, ${template.accentColor}33 3px, transparent 3px), radial-gradient(circle at 75% 75%, ${template.accentColor}22 2px, transparent 2px)`
                      : template.pattern === 'lines'
                      ? `repeating-linear-gradient(45deg, ${template.accentColor}22 0px, transparent 4px, transparent 12px, ${template.accentColor}22 16px)`
                      : template.pattern === 'geometric'
                      ? `conic-gradient(from 45deg at 20% 20%, ${template.accentColor}33, transparent, ${template.accentColor}22), conic-gradient(from 225deg at 80% 80%, ${template.accentColor}22, transparent, ${template.accentColor}33)`
                      : template.pattern === 'hexagon'
                      ? `repeating-conic-gradient(from 0deg at 30% 30%, ${template.accentColor}33 0deg 60deg, transparent 60deg 120deg), repeating-conic-gradient(from 180deg at 70% 70%, ${template.accentColor}22 0deg 60deg, transparent 60deg 120deg)`
                      : template.pattern === 'circuit'
                      ? `linear-gradient(90deg, ${template.accentColor}22 2px, transparent 2px), linear-gradient(0deg, ${template.accentColor}22 2px, transparent 2px), radial-gradient(circle at 25% 25%, ${template.accentColor}33 4px, transparent 4px)`
                      : 'none',
                    backgroundSize: template.pattern === 'dots' ? '40px 40px, 60px 60px' 
                      : template.pattern === 'circuit' ? '20px 20px, 20px 20px, 80px 80px'
                      : '60px 60px'
                  }}
                ></div>

                {/* Logo */}
                {template.logo && (
                  <div 
                    className="absolute z-20"
                    style={{
                      top: template.logo.position === 'top-center' || template.logo.position === 'top-left' || template.logo.position === 'top-right' ? '20px' : '50%',
                      left: template.logo.position === 'top-left' ? '20px' : 
                            template.logo.position === 'top-right' ? 'auto' : '50%',
                      right: template.logo.position === 'top-right' ? '20px' : 'auto',
                      transform: template.logo.position === 'center' ? 'translate(-50%, -50%)' :
                                template.logo.position === 'top-center' ? 'translateX(-50%)' : 'none'
                    }}
                  >
                    <img 
                      src={template.logo.url} 
                      alt="Logo" 
                      style={{ 
                        width: `${template.logo.width * 0.3}px`, 
                        height: `${template.logo.height * 0.3}px` 
                      }}
                      className="object-contain"
                    />
                  </div>
                )}

                <div className={`h-full flex flex-col justify-center space-y-4 relative z-10 ${template.logo && template.logo.position === 'top-center' ? 'pt-16' : ''}`}>
                  <div 
                    className="font-bold tracking-wide"
                    style={{ 
                      fontSize: `${template.fontSize.title * 0.5}px`,
                      color: template.accentColor,
                      textShadow: template.backgroundColor === '#0a0a0a' || template.backgroundColor === '#111827' ? '0 0 10px currentColor' : 'none'
                    }}
                  >
                    {template.title}
                  </div>
                  
                  <div 
                    className="border-b-2 pb-2 mb-4"
                    style={{ 
                      fontSize: `${template.fontSize.subtitle * 0.7}px`,
                      borderColor: template.accentColor,
                      borderImage: template.gradientColors ? `linear-gradient(90deg, ${template.gradientColors.join(', ')}) 1` : 'none'
                    }}
                  >
                    {template.subtitle}
                  </div>

                  <div 
                    className="text-2xl font-bold border-b-2 pb-2 mb-4 inline-block"
                    style={{ borderColor: template.accentColor }}
                  >
                    John Doe
                  </div>

                  <div style={{ fontSize: `${template.fontSize.body * 0.8}px` }}>
                    has successfully completed the
                  </div>

                  <div 
                    className="text-xl font-semibold"
                    style={{ color: template.accentColor }}
                  >
                    Sample Exam
                  </div>

                  <div style={{ fontSize: `${template.fontSize.body * 0.8}px` }}>
                    with a score of <span className="font-bold">95%</span>
                  </div>

                  <div className="mt-8 text-xs">
                    <div>{template.organizationName}</div>
                    <div className="mt-4">
                      <div className="border-t border-gray-400 w-32 mx-auto pt-2">
                        <div>{template.signatoryName}</div>
                        <div>{template.signatoryTitle}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button onClick={generatePreviewPDF} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Modern PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Enhanced PDF Generation Function with Modern Graphics
export const generateModernCertificatePDF = async (certificate: any, template: ModernTemplate) => {
  // Import jsPDF dynamically
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

  // Set background color
  pdf.setFillColor(bgColor.r, bgColor.g, bgColor.b);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Add modern pattern background
  if (template.pattern && template.gradientColors) {
    const patternColor = hexToRgb(template.gradientColors[0]);
    pdf.setFillColor(patternColor.r, patternColor.g, patternColor.b);
    pdf.setGState(new pdf.GState({opacity: 0.1}));

    switch (template.pattern) {
      case 'geometric':
        // Draw geometric shapes
        for (let i = 0; i < 5; i++) {
          const x = (pageWidth / 6) * (i + 1);
          const y = pageHeight / 4;
          pdf.triangle(x, y, x + 20, y + 30, x - 20, y + 30, 'F');
        }
        break;
      
      case 'dots':
        // Draw dot pattern
        for (let x = 20; x < pageWidth; x += 30) {
          for (let y = 20; y < pageHeight; y += 30) {
            pdf.circle(x, y, 3, 'F');
          }
        }
        break;
      
      case 'lines':
        // Draw line pattern
        pdf.setLineWidth(2);
        for (let i = 0; i < pageWidth; i += 20) {
          pdf.line(i, 0, i + 40, pageHeight);
        }
        break;
      
      case 'waves':
        // Draw wave pattern
        pdf.setLineWidth(3);
        for (let y = 20; y < pageHeight; y += 40) {
          let path = `M 0 ${y}`;
          for (let x = 0; x < pageWidth; x += 20) {
            path += ` Q ${x + 10} ${y - 10} ${x + 20} ${y}`;
          }
          // Note: jsPDF doesn't support complex paths, so we'll use simple curves
          for (let x = 0; x < pageWidth; x += 40) {
            pdf.ellipse(x, y, 20, 5, 'S');
          }
        }
        break;
      
      case 'hexagon':
        // Draw hexagon pattern
        for (let x = 30; x < pageWidth; x += 60) {
          for (let y = 30; y < pageHeight; y += 50) {
            // Simple hexagon approximation with lines
            pdf.setLineWidth(1);
            const size = 15;
            pdf.lines([
              [size, 0], [size/2, size*0.866], [-size/2, size*0.866],
              [-size, 0], [-size/2, -size*0.866], [size/2, -size*0.866]
            ], x, y, [1, 1], 'S', true);
          }
        }
        break;
      
      case 'circuit':
        // Draw circuit pattern
        pdf.setLineWidth(1);
        for (let x = 20; x < pageWidth; x += 40) {
          for (let y = 20; y < pageHeight; y += 40) {
            pdf.rect(x, y, 20, 2, 'F');
            pdf.rect(x + 9, y - 10, 2, 20, 'F');
            pdf.circle(x + 10, y + 10, 3, 'S');
          }
        }
        break;
    }
    
    pdf.setGState(new pdf.GState({opacity: 1})); // Reset opacity
  }

  // Add modern border
  if (template.borderStyle) {
    pdf.setDrawColor(accentColor.r, accentColor.g, accentColor.b);
    
    switch (template.borderStyle) {
      case 'modern':
        pdf.setLineWidth(3);
        // Corner accents
        pdf.line(10, 10, 40, 10);
        pdf.line(10, 10, 10, 40);
        pdf.line(pageWidth - 40, 10, pageWidth - 10, 10);
        pdf.line(pageWidth - 10, 10, pageWidth - 10, 40);
        pdf.line(10, pageHeight - 40, 10, pageHeight - 10);
        pdf.line(10, pageHeight - 10, 40, pageHeight - 10);
        pdf.line(pageWidth - 40, pageHeight - 10, pageWidth - 10, pageHeight - 10);
        pdf.line(pageWidth - 10, pageHeight - 40, pageWidth - 10, pageHeight - 10);
        break;
      
      case 'bold':
        pdf.setLineWidth(5);
        pdf.rect(5, 5, pageWidth - 10, pageHeight - 10, 'S');
        break;
      
      case 'artistic':
        pdf.setLineWidth(2);
        // Decorative corners
        for (let i = 0; i < 4; i++) {
          const x = i < 2 ? 15 : pageWidth - 15;
          const y = i % 2 === 0 ? 15 : pageHeight - 15;
          pdf.circle(x, y, 8, 'S');
          pdf.circle(x, y, 12, 'S');
        }
        break;
      
      case 'minimal':
        pdf.setLineWidth(1);
        pdf.rect(15, 15, pageWidth - 30, pageHeight - 30, 'S');
        break;
    }
  }

  // Add logo if present
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

  // Adjust title position if logo is at top-center
  const titleY = template.logo && template.logo.position === 'top-center' ? 70 : 50;

  // Title with modern styling
  pdf.setTextColor(accentColor.r, accentColor.g, accentColor.b);
  pdf.setFontSize(template.fontSize.title);
  pdf.setFont('helvetica', 'bold');
  pdf.text(template.title, pageWidth / 2, titleY, { align: 'center' });

  // Modern decorative elements
  pdf.setFillColor(accentColor.r, accentColor.g, accentColor.b);
  pdf.rect(pageWidth / 2 - 60, titleY + 5, 120, 3, 'F');
  
  // Add gradient effect simulation with multiple rectangles
  if (template.gradientColors && template.gradientColors.length > 1) {
    const gradColor2 = hexToRgb(template.gradientColors[1]);
    pdf.setFillColor(gradColor2.r, gradColor2.g, gradColor2.b);
    pdf.rect(pageWidth / 2 - 40, titleY + 8, 80, 1, 'F');
  }

  // Subtitle
  pdf.setTextColor(textColor.r, textColor.g, textColor.b);
  pdf.setFontSize(template.fontSize.subtitle);
  pdf.setFont('helvetica', 'normal');
  pdf.text(template.subtitle, pageWidth / 2, titleY + 25, { align: 'center' });

  // Student name with modern highlight
  pdf.setFontSize(32);
  pdf.setFont('helvetica', 'bold');
  pdf.text(certificate.studentName, pageWidth / 2, titleY + 50, { align: 'center' });

  // Modern underline
  pdf.setFillColor(accentColor.r, accentColor.g, accentColor.b);
  pdf.rect(pageWidth / 2 - 80, titleY + 55, 160, 2, 'F');

  // Body text
  pdf.setFontSize(template.fontSize.body);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(textColor.r, textColor.g, textColor.b);
  pdf.text('has successfully completed the', pageWidth / 2, titleY + 75, { align: 'center' });

  // Exam title
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(accentColor.r, accentColor.g, accentColor.b);
  pdf.text(certificate.examTitle, pageWidth / 2, titleY + 95, { align: 'center' });

  // Score with modern styling
  pdf.setFontSize(template.fontSize.body);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(textColor.r, textColor.g, textColor.b);
  pdf.text(`with a score of ${certificate.score}%`, pageWidth / 2, titleY + 115, { align: 'center' });

  // Date and certificate number
  pdf.setFontSize(12);
  const completedDate = new Date(certificate.completedAt).toLocaleDateString();
  pdf.text(`Completed on: ${completedDate}`, pageWidth / 2 - 80, titleY + 140, { align: 'left' });
  pdf.text(`Certificate #: ${certificate.certificateNumber}`, pageWidth / 2 + 20, titleY + 140, { align: 'left' });

  // Organization name
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(template.organizationName, pageWidth / 2, titleY + 160, { align: 'center' });

  // Modern signature area
  pdf.setDrawColor(accentColor.r, accentColor.g, accentColor.b);
  pdf.setLineWidth(2);
  pdf.line(pageWidth / 2 - 50, titleY + 180, pageWidth / 2 + 50, titleY + 180);
  
  // Add decorative elements around signature
  pdf.setFillColor(accentColor.r, accentColor.g, accentColor.b);
  pdf.circle(pageWidth / 2 - 55, titleY + 180, 3, 'F');
  pdf.circle(pageWidth / 2 + 55, titleY + 180, 3, 'F');
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(textColor.r, textColor.g, textColor.b);
  pdf.text(template.signatoryName, pageWidth / 2, titleY + 190, { align: 'center' });
  pdf.text(template.signatoryTitle, pageWidth / 2, titleY + 200, { align: 'center' });

  // Save the PDF
  pdf.save(`modern-certificate-${certificate.certificateNumber}.pdf`);
};

export default ModernCertificateSettings;