import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Save, Shield, Bell, Database, Mail, Globe, Users, Key } from 'lucide-react';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportPhone: string;
    timezone: string;
    language: string;
  };
  security: {
    passwordMinLength: number;
    sessionTimeout: number;
    maxLoginAttempts: number;
    requireTwoFactor: boolean;
    allowPasswordReset: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    examReminders: boolean;
    certificateExpiry: boolean;
    systemAlerts: boolean;
  };
  exam: {
    defaultDuration: number;
    defaultPassingScore: number;
    allowRetakes: boolean;
    maxRetakeAttempts: number;
    showResultsImmediately: boolean;
    randomizeQuestions: boolean;
  };
  certificates: {
    defaultValidityPeriod: number;
    autoRenewalReminder: number;
    digitalSignature: boolean;
    watermark: boolean;
  };
}

const defaultSettings: SystemSettings = {
  general: {
    siteName: 'Healthcare Professional Portal',
    siteDescription: 'Certification and training platform for healthcare professionals',
    contactEmail: 'admin@hospital.com',
    supportPhone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    language: 'en'
  },
  security: {
    passwordMinLength: 8,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    requireTwoFactor: false,
    allowPasswordReset: true
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    examReminders: true,
    certificateExpiry: true,
    systemAlerts: true
  },
  exam: {
    defaultDuration: 60,
    defaultPassingScore: 80,
    allowRetakes: true,
    maxRetakeAttempts: 3,
    showResultsImmediately: true,
    randomizeQuestions: true
  },
  certificates: {
    defaultValidityPeriod: 24,
    autoRenewalReminder: 30,
    digitalSignature: true,
    watermark: true
  }
};

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'exam' | 'certificates'>('general');
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (section: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    console.log('Saving settings:', settings);
    setHasChanges(false);
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'exam', label: 'Exam Settings', icon: Users },
    { id: 'certificates', label: 'Certificates', icon: Key }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure system-wide settings and preferences</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSaveSettings} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Site Name"
                    value={settings.general.siteName}
                    onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                  />
                  <Input
                    label="Contact Email"
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
                  />
                  <Input
                    label="Support Phone"
                    value={settings.general.supportPhone}
                    onChange={(e) => handleSettingChange('general', 'supportPhone', e.target.value)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                  <textarea
                    value={settings.general.siteDescription}
                    onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Minimum Password Length"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                  />
                  <Input
                    label="Session Timeout (minutes)"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                  <Input
                    label="Max Login Attempts"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Require Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Require all users to enable 2FA</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.requireTwoFactor}
                        onChange={(e) => handleSettingChange('security', 'requireTwoFactor', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Allow Password Reset</h4>
                      <p className="text-sm text-gray-600">Allow users to reset their passwords via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.allowPasswordReset}
                        onChange={(e) => handleSettingChange('security', 'allowPasswordReset', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {key === 'emailNotifications' && 'Send notifications via email'}
                          {key === 'smsNotifications' && 'Send notifications via SMS'}
                          {key === 'examReminders' && 'Remind users about upcoming exams'}
                          {key === 'certificateExpiry' && 'Notify about expiring certificates'}
                          {key === 'systemAlerts' && 'Send system maintenance alerts'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'exam' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Exam Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Default Duration (minutes)"
                    type="number"
                    value={settings.exam.defaultDuration}
                    onChange={(e) => handleSettingChange('exam', 'defaultDuration', parseInt(e.target.value))}
                  />
                  <Input
                    label="Default Passing Score (%)"
                    type="number"
                    value={settings.exam.defaultPassingScore}
                    onChange={(e) => handleSettingChange('exam', 'defaultPassingScore', parseInt(e.target.value))}
                  />
                  <Input
                    label="Max Retake Attempts"
                    type="number"
                    value={settings.exam.maxRetakeAttempts}
                    onChange={(e) => handleSettingChange('exam', 'maxRetakeAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-4">
                  {[
                    { key: 'allowRetakes', label: 'Allow Retakes', desc: 'Allow users to retake failed exams' },
                    { key: 'showResultsImmediately', label: 'Show Results Immediately', desc: 'Display results right after exam completion' },
                    { key: 'randomizeQuestions', label: 'Randomize Questions', desc: 'Randomize question order for each attempt' }
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{label}</h4>
                        <p className="text-sm text-gray-600">{desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.exam[key as keyof typeof settings.exam] as boolean}
                          onChange={(e) => handleSettingChange('exam', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'certificates' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Certificate Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Default Validity Period (months)"
                    type="number"
                    value={settings.certificates.defaultValidityPeriod}
                    onChange={(e) => handleSettingChange('certificates', 'defaultValidityPeriod', parseInt(e.target.value))}
                  />
                  <Input
                    label="Renewal Reminder (days before expiry)"
                    type="number"
                    value={settings.certificates.autoRenewalReminder}
                    onChange={(e) => handleSettingChange('certificates', 'autoRenewalReminder', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-4">
                  {[
                    { key: 'digitalSignature', label: 'Digital Signature', desc: 'Add digital signature to certificates' },
                    { key: 'watermark', label: 'Watermark', desc: 'Add watermark to prevent forgery' }
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{label}</h4>
                        <p className="text-sm text-gray-600">{desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.certificates[key as keyof typeof settings.certificates] as boolean}
                          onChange={(e) => handleSettingChange('certificates', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};