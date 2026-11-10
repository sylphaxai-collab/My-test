import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for logging
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Log entry interface
export interface LogEntry {
  id?: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  route?: string;
  userId?: string;
  context?: Record<string, any>;
}

// Logger class
class Logger {
  private level: LogLevel;
  private enabled: boolean;

  constructor() {
    // Get log level from environment, default to 'info'
    this.level = (process.env.LOG_LEVEL as LogLevel) || 'info';
    this.enabled = process.env.LOGGING_ENABLED !== 'false';
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false;
    
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    
    return levels[level] >= levels[this.level];
  }

  async log(level: LogLevel, message: string, context?: Record<string, any>): Promise<void> {
    if (!this.shouldLog(level)) return;

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: context || {}
    };

    // Add to Supabase logs table
    try {
      await supabase.from('logs').insert([logEntry]);
    } catch (error) {
      // Fallback to console if database logging fails
      // eslint-disable-next-line no-console
      console.error('Failed to log to database:', error);
    }

    // Also log to console in development
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console[level](JSON.stringify(logEntry, null, 2));
    }
  }

  debug(message: string, context?: Record<string, any>): Promise<void> {
    return this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>): Promise<void> {
    return this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>): Promise<void> {
    return this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, any>): Promise<void> {
    return this.log('error', message, context);
  }
}

// Export singleton instance
export const logger = new Logger();

// Specialized function for payment verification logging
export async function logPaymentVerification(
  success: boolean,
  message: string,
  context?: Record<string, any>
): Promise<void> {
  const baseContext = {
    ...context,
    timestamp: new Date().toISOString(),
    success
  };

  if (success) {
    await logger.info('Payment verification succeeded', baseContext);
  } else {
    await logger.error('Payment verification failed', baseContext);
  }
}
