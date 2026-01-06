/**
 * PalPal Shared Utilities Module
 * Common utilities used across the project
 */

class PalPalUtils {
  /**
   * Debounce a function
   */
  static debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  /**
   * Throttle a function
   */
  static throttle(func, delay = 300) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }

  /**
   * Format date in user-friendly way
   */
  static formatDate(date) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(date).toLocaleDateString('en-US', options);
  }

  /**
   * Format time in HH:MM format
   */
  static formatTime(date) {
    const hours = String(new Date(date).getHours()).padStart(2, '0');
    const minutes = String(new Date(date).getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Calculate time difference
   */
  static getTimeDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;

    return {
      totalMinutes: diffMins,
      totalHours: diffHours,
      hours: diffHours,
      minutes: remainingMins,
      formatted: `${diffHours}h ${remainingMins}m`,
    };
  }

  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static validatePassword(password) {
    return {
      length: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      isStrong:
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password),
    };
  }

  /**
   * Get from localStorage with fallback
   */
  static getFromStorage(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  /**
   * Save to localStorage
   */
  static saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Remove from localStorage
   */
  static removeFromStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Show notification/toast message
   */
  static showNotification(message, type = 'info', duration = 3000) {
    // This would typically integrate with a toast/notification library
    console.log(`[${type.toUpperCase()}] ${message}`);
  }

  /**
   * Safely navigate to URL
   */
  static navigate(url) {
    try {
      window.location.href = url;
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PalPalUtils;
}
