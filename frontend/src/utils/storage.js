// Centralized localStorage management utility for IQAC Portal

export const STORAGE_KEYS = {
  AUTH: 'iqac_auth',
  USER: 'iqac_user',
  ACADEMIC_YEAR: 'iqac_academic_year',
  NOTIFICATIONS: 'iqac_notifications',
  THEME: 'iqac_theme',
};

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },

  clearAuth: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error clearing auth from localStorage:', error);
    }
  },

  clearAll: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing all localStorage:', error);
    }
  },
};
