interface LogEntry {
  id: string;
  timestamp: Date;
  action: string;
  description: string;
  userId: string;
  userEmail: string;
  userName: string;
  ipAddress?: string;
  userAgent?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'auth' | 'user_management' | 'exam' | 'system' | 'security';
  metadata?: Record<string, any>;
}

class LogService {
  private static instance: LogService;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private constructor() {
    this.loadLogs();
  }

  public static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService();
    }
    return LogService.instance;
  }

  private loadLogs(): void {
    try {
      const storedLogs = localStorage.getItem('activityLogs');
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs).map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load logs from localStorage:', error);
      this.logs = [];
    }
  }

  private saveLogs(): void {
    try {
      localStorage.setItem('activityLogs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to save logs to localStorage:', error);
    }
  }

  public log(
    action: string,
    description: string,
    category: LogEntry['category'],
    severity: LogEntry['severity'] = 'low',
    userId?: string,
    userEmail?: string,
    userName?: string,
    metadata?: Record<string, any>
  ): void {
    const logEntry: LogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      action,
      description,
      userId: userId || 'system',
      userEmail: userEmail || 'system',
      userName: userName || 'System',
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      severity,
      category,
      metadata
    };

    this.logs.unshift(logEntry);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    this.saveLogs();

    // Also log to console for debugging
    const logLevel = severity === 'critical' ? 'error' : severity === 'high' ? 'warn' : 'log';
    console[logLevel](`[${action}] ${description}`, metadata);
  }

  public logAuth(action: string, description: string, severity: LogEntry['severity'] = 'low', userId?: string, userEmail?: string, userName?: string): void {
    this.log(action, description, 'auth', severity, userId, userEmail, userName);
  }

  public logUserManagement(action: string, description: string, severity: LogEntry['severity'] = 'medium', userId?: string, userEmail?: string, userName?: string): void {
    this.log(action, description, 'user_management', severity, userId, userEmail, userName);
  }

  public logExam(action: string, description: string, severity: LogEntry['severity'] = 'low', userId?: string, userEmail?: string, userName?: string): void {
    this.log(action, description, 'exam', severity, userId, userEmail, userName);
  }

  public logSystem(action: string, description: string, severity: LogEntry['severity'] = 'medium', userId?: string, userEmail?: string, userName?: string): void {
    this.log(action, description, 'system', severity, userId, userEmail, userName);
  }

  public logSecurity(action: string, description: string, severity: LogEntry['severity'] = 'high', userId?: string, userEmail?: string, userName?: string): void {
    this.log(action, description, 'security', severity, userId, userEmail, userName);
  }

  public getLogs(
    limit?: number,
    category?: LogEntry['category'],
    severity?: LogEntry['severity'],
    startDate?: Date,
    endDate?: Date
  ): LogEntry[] {
    let filteredLogs = [...this.logs];

    if (category) {
      filteredLogs = filteredLogs.filter(log => log.category === category);
    }

    if (severity) {
      filteredLogs = filteredLogs.filter(log => log.severity === severity);
    }

    if (startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= startDate);
    }

    if (endDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= endDate);
    }

    if (limit) {
      filteredLogs = filteredLogs.slice(0, limit);
    }

    return filteredLogs;
  }

  public getLogStats(): {
    total: number;
    byCategory: Record<string, number>;
    bySeverity: Record<string, number>;
    recent: number;
  } {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const byCategory: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    let recent = 0;

    this.logs.forEach(log => {
      byCategory[log.category] = (byCategory[log.category] || 0) + 1;
      bySeverity[log.severity] = (bySeverity[log.severity] || 0) + 1;
      
      if (log.timestamp >= oneDayAgo) {
        recent++;
      }
    });

    return {
      total: this.logs.length,
      byCategory,
      bySeverity,
      recent
    };
  }

  public clearLogs(): void {
    this.logs = [];
    this.saveLogs();
    this.log('LOGS_CLEARED', 'All activity logs were cleared', 'system', 'high');
  }

  public exportLogs(format: 'json' | 'csv' = 'csv'): string {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2);
    }

    // CSV format
    const headers = ['Timestamp', 'Action', 'Description', 'User', 'Email', 'IP Address', 'Severity', 'Category'];
    const rows = this.logs.map(log => [
      log.timestamp.toISOString(),
      log.action,
      log.description,
      log.userName,
      log.userEmail,
      log.ipAddress || '',
      log.severity,
      log.category
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  private getClientIP(): string {
    // In a real application, this would be obtained from the server
    // For now, return a placeholder
    return 'localhost';
  }

  // Method to track user sessions
  public trackUserSession(userId: string, userEmail: string, userName: string, action: 'login' | 'logout'): void {
    const description = action === 'login' 
      ? `User ${userName} logged in successfully`
      : `User ${userName} logged out`;
    
    this.logAuth(
      action === 'login' ? 'USER_LOGIN' : 'USER_LOGOUT',
      description,
      'low',
      userId,
      userEmail,
      userName
    );
  }

  // Method to track failed login attempts
  public trackFailedLogin(email: string, reason: string): void {
    this.logSecurity(
      'FAILED_LOGIN',
      `Failed login attempt for ${email}: ${reason}`,
      'medium',
      'unknown',
      email,
      'Unknown User'
    );
  }

  // Method to track exam activities
  public trackExamActivity(action: string, examId: string, examTitle: string, userId: string, userEmail: string, userName: string): void {
    this.logExam(
      action,
      `User ${userName} ${action.toLowerCase().replace('_', ' ')} exam: ${examTitle}`,
      'low',
      userId,
      userEmail,
      userName,
      { examId, examTitle }
    );
  }

  // Method to track system errors
  public trackError(error: Error, context?: string): void {
    this.logSystem(
      'SYSTEM_ERROR',
      `System error${context ? ` in ${context}` : ''}: ${error.message}`,
      'high',
      'system',
      'system',
      'System',
      { 
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
        context
      }
    );
  }

  // Method to track configuration changes
  public trackConfigChange(setting: string, oldValue: any, newValue: any, userId: string, userEmail: string, userName: string): void {
    this.logSystem(
      'CONFIG_CHANGED',
      `Configuration changed: ${setting} changed from "${oldValue}" to "${newValue}" by ${userName}`,
      'medium',
      userId,
      userEmail,
      userName,
      { setting, oldValue, newValue }
    );
  }
}

// Export singleton instance
export const logService = LogService.getInstance();

// Export types for use in other components
export type { LogEntry };