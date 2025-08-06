// Data Manager - Handles data persistence with localStorage backup
import { mockExams, mockCategories, mockProfiles, mockExamAttempts, mockCertificates } from '../data/mockData';

interface DataStore {
  categories: any[];
  exams: any[];
  profiles: any[];
  examAttempts: any[];
  certificates: any[];
  questions: any[];
  questionOptions: any[];
}

class DataManager {
  private storageKey = 'aghep_app_data';
  
  // Initialize data store
  private initializeData(): DataStore {
    const savedData = localStorage.getItem(this.storageKey);
    
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
    
    // Return default data if no saved data
    return {
      categories: [...mockCategories],
      exams: [...mockExams],
      profiles: [...mockProfiles],
      examAttempts: [...mockExamAttempts],
      certificates: [...mockCertificates],
      questions: [],
      questionOptions: []
    };
  }
  
  // Save data to localStorage
  private saveData(data: DataStore): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      console.log('✅ Data saved successfully');
    } catch (error) {
      console.error('❌ Error saving data:', error);
    }
  }
  
  // Get current data
  private getData(): DataStore {
    return this.initializeData();
  }
  
  // Generate UUID
  private generateId(): string {
    return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
  
  // CATEGORIES
  async getCategories() {
    const data = this.getData();
    return { data: data.categories, error: null };
  }
  
  async createCategory(category: any) {
    const data = this.getData();
    const newCategory = {
      ...category,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    data.categories.push(newCategory);
    this.saveData(data);
    
    return { data: newCategory, error: null };
  }
  
  async updateCategory(id: string, updates: any) {
    const data = this.getData();
    const index = data.categories.findIndex(cat => cat.id === id);
    
    if (index === -1) {
      return { data: null, error: { message: 'Category not found' } };
    }
    
    data.categories[index] = {
      ...data.categories[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    this.saveData(data);
    return { data: data.categories[index], error: null };
  }
  
  async deleteCategory(id: string) {
    const data = this.getData();
    const index = data.categories.findIndex(cat => cat.id === id);
    
    if (index === -1) {
      return { data: null, error: { message: 'Category not found' } };
    }
    
    const deleted = data.categories.splice(index, 1)[0];
    this.saveData(data);
    
    return { data: deleted, error: null };
  }
  
  // EXAMS
  async getExams() {
    const data = this.getData();
    return { data: data.exams, error: null };
  }
  
  async createExam(exam: any) {
    const data = this.getData();
    const newExam = {
      ...exam,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      questions: []
    };
    
    data.exams.push(newExam);
    this.saveData(data);
    
    return { data: newExam, error: null };
  }
  
  async updateExam(id: string, updates: any) {
    const data = this.getData();
    const index = data.exams.findIndex(exam => exam.id === id);
    
    if (index === -1) {
      return { data: null, error: { message: 'Exam not found' } };
    }
    
    data.exams[index] = {
      ...data.exams[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    this.saveData(data);
    return { data: data.exams[index], error: null };
  }
  
  async deleteExam(id: string) {
    const data = this.getData();
    const index = data.exams.findIndex(exam => exam.id === id);
    
    if (index === -1) {
      return { data: null, error: { message: 'Exam not found' } };
    }
    
    const deleted = data.exams.splice(index, 1)[0];
    this.saveData(data);
    
    return { data: deleted, error: null };
  }
  
  // EXAM ATTEMPTS
  async createExamAttempt(attempt: any) {
    const data = this.getData();
    const newAttempt = {
      ...attempt,
      id: this.generateId(),
      created_at: new Date().toISOString()
    };
    
    data.examAttempts.push(newAttempt);
    this.saveData(data);
    
    return { data: newAttempt, error: null };
  }
  
  async getExamAttempts(userId?: string) {
    const data = this.getData();
    let attempts = data.examAttempts;
    
    if (userId) {
      attempts = attempts.filter(attempt => attempt.user_id === userId);
    }
    
    return { data: attempts, error: null };
  }
  
  // CERTIFICATES
  async createCertificate(certificate: any) {
    const data = this.getData();
    const newCertificate = {
      ...certificate,
      id: this.generateId(),
      certificate_number: `AGHEP-${Date.now()}`,
      verification_code: `VER-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    data.certificates.push(newCertificate);
    this.saveData(data);
    
    return { data: newCertificate, error: null };
  }
  
  async getCertificates(userId?: string) {
    const data = this.getData();
    let certificates = data.certificates;
    
    if (userId) {
      certificates = certificates.filter(cert => cert.user_id === userId);
    }
    
    return { data: certificates, error: null };
  }
  
  // PROFILES
  async createProfile(profile: any) {
    const data = this.getData();
    const newProfile = {
      ...profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    data.profiles.push(newProfile);
    this.saveData(data);
    
    return { data: newProfile, error: null };
  }
  
  async getProfile(userId: string) {
    const data = this.getData();
    const profile = data.profiles.find(p => p.id === userId);
    
    if (!profile) {
      return { data: null, error: { message: 'Profile not found' } };
    }
    
    return { data: profile, error: null };
  }
  
  // UTILITY METHODS
  async clearAllData() {
    localStorage.removeItem(this.storageKey);
    console.log('✅ All data cleared');
  }
  
  async exportData() {
    const data = this.getData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aghep_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }
  
  async importData(jsonData: string) {
    try {
      const data = JSON.parse(jsonData);
      this.saveData(data);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: { message: 'Invalid JSON data' } };
    }
  }
}

// Export singleton instance
export const dataManager = new DataManager();