import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, Users, Award, Play, CheckCircle, AlertCircle, Stethoscope, Heart, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SkillLabSession {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  instructor: string;
  equipment: string[];
  objectives: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'available' | 'in-progress' | 'completed';
  scheduledTime?: Date;
  practicalSkills: string[];
}

const skillLabSessions: SkillLabSession[] = [
  {
    id: '1',
    title: 'CPR & AED Training',
    description: 'Hands-on practice of cardiopulmonary resuscitation techniques and automated external defibrillator usage',
    category: 'Emergency Care',
    duration: 120,
    maxParticipants: 8,
    currentParticipants: 5,
    instructor: 'Dr. Sarah Johnson',
    equipment: ['CPR Mannequins', 'AED Trainers', 'Face Shields', 'Gloves'],
    objectives: [
      'Perform high-quality chest compressions',
      'Deliver effective rescue breaths',
      'Operate AED safely and effectively',
      'Recognize cardiac arrest scenarios'
    ],
    difficulty: 'Beginner',
    status: 'available',
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    practicalSkills: ['Chest Compressions', 'Rescue Breathing', 'AED Operation', 'Team Communication']
  },
  {
    id: '2',
    title: 'Advanced Wound Care',
    description: 'Comprehensive wound assessment, cleaning, and dressing techniques for various wound types',
    category: 'Wound Management',
    duration: 90,
    maxParticipants: 6,
    currentParticipants: 4,
    instructor: 'Nurse Emily Rodriguez',
    equipment: ['Wound Care Supplies', 'Suture Kits', 'Bandages', 'Antiseptics'],
    objectives: [
      'Assess wound severity and type',
      'Perform proper wound cleaning',
      'Apply appropriate dressings',
      'Document wound care procedures'
    ],
    difficulty: 'Intermediate',
    status: 'available',
    scheduledTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    practicalSkills: ['Wound Assessment', 'Sterile Technique', 'Dressing Application', 'Patient Education']
  },
  {
    id: '3',
    title: 'IV Insertion & Phlebotomy',
    description: 'Master the techniques of intravenous catheter insertion and blood collection procedures',
    category: 'Clinical Procedures',
    duration: 150,
    maxParticipants: 10,
    currentParticipants: 8,
    instructor: 'Dr. Michael Chen',
    equipment: ['IV Catheters', 'Phlebotomy Supplies', 'Practice Arms', 'Tourniquets'],
    objectives: [
      'Select appropriate vein for access',
      'Insert IV catheter successfully',
      'Collect blood samples safely',
      'Manage complications'
    ],
    difficulty: 'Advanced',
    status: 'in-progress',
    scheduledTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 minutes ago
    practicalSkills: ['Vein Selection', 'Needle Insertion', 'Blood Collection', 'Site Care']
  },
  {
    id: '4',
    title: 'Medication Administration',
    description: 'Safe medication preparation, calculation, and administration techniques across different routes',
    category: 'Pharmacology',
    duration: 100,
    maxParticipants: 12,
    currentParticipants: 10,
    instructor: 'Pharmacist Dr. Lisa Thompson',
    equipment: ['Medication Carts', 'Syringes', 'Calculators', 'Reference Materials'],
    objectives: [
      'Calculate medication dosages accurately',
      'Prepare medications safely',
      'Administer via multiple routes',
      'Monitor for adverse reactions'
    ],
    difficulty: 'Intermediate',
    status: 'available',
    scheduledTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    practicalSkills: ['Dosage Calculation', 'Medication Preparation', 'Route Administration', 'Patient Monitoring']
  }
];

export const SkillLab: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState<SkillLabSession | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const categories = Array.from(new Set(skillLabSessions.map(session => session.category)));
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const filteredSessions = skillLabSessions.filter(session => {
    const categoryMatch = filterCategory === 'all' || session.category === filterCategory;
    const difficultyMatch = filterDifficulty === 'all' || session.difficulty === filterDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'completed': return <Award className="h-4 w-4 text-purple-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Emergency Care': return <Heart className="h-5 w-5 text-red-500" />;
      case 'Clinical Procedures': return <Stethoscope className="h-5 w-5 text-blue-500" />;
      case 'Wound Management': return <Activity className="h-5 w-5 text-green-500" />;
      case 'Pharmacology': return <Award className="h-5 w-5 text-purple-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const joinSession = (sessionId: string) => {
    // In a real app, this would handle session enrollment
    alert(`Joining skill lab session: ${sessionId}`);
  };

  const startPracticalAssessment = (sessionId: string) => {
    // Navigate to a practical assessment for this skill
    navigate(`/skill-assessment/${sessionId}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Skill Laboratory</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hands-on training sessions to develop and assess practical healthcare skills in a controlled environment
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Levels</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(session.category)}
                  <span className="text-sm text-gray-600">{session.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(session.status)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(session.difficulty)}`}>
                    {session.difficulty}
                  </span>
                </div>
              </div>
              <CardTitle className="text-lg">{session.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{session.description}</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  {session.duration} minutes
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  {session.currentParticipants}/{session.maxParticipants} participants
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="h-4 w-4" />
                  Instructor: {session.instructor}
                </div>
                {session.scheduledTime && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {session.status === 'in-progress' ? 'Started: ' : 'Scheduled: '}
                    {session.scheduledTime.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Practical Skills Covered:</h4>
                <div className="flex flex-wrap gap-1">
                  {session.practicalSkills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {session.status === 'available' && session.currentParticipants < session.maxParticipants && (
                  <Button 
                    onClick={() => joinSession(session.id)}
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Join Session
                  </Button>
                )}
                {session.status === 'in-progress' && (
                  <Button 
                    onClick={() => joinSession(session.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Join In Progress
                  </Button>
                )}
                {session.status === 'completed' && (
                  <Button 
                    onClick={() => startPracticalAssessment(session.id)}
                    className="flex-1"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Take Assessment
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => setSelectedSession(session)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{selectedSession.title}</CardTitle>
                <Button variant="outline" onClick={() => setSelectedSession(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{selectedSession.description}</p>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Learning Objectives:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {selectedSession.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Required Equipment:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSession.equipment.map((item, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Practical Skills Assessment:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedSession.practicalSkills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-800">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex gap-3">
                  {selectedSession.status === 'available' && (
                    <Button onClick={() => joinSession(selectedSession.id)} className="flex-1">
                      Join Session
                    </Button>
                  )}
                  {selectedSession.status === 'completed' && (
                    <Button onClick={() => startPracticalAssessment(selectedSession.id)} className="flex-1">
                      Take Practical Assessment
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};