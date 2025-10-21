export const logger = {
  info: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data || '');
    }
  },
  error: (message, error = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ERROR] ${message}`, error || '');
    }
  },
  warn: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }
};