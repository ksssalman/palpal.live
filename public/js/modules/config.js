/**
 * Firebase Configuration Module
 * Centralized Firebase initialization with environment variable support
 */

class FirebaseConfig {
  static instance = null;

  constructor() {
    if (FirebaseConfig.instance) {
      return FirebaseConfig.instance;
    }

    this.config = {
      apiKey: this.getEnvVar('VITE_FIREBASE_API_KEY'),
      authDomain: this.getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
      projectId: this.getEnvVar('VITE_FIREBASE_PROJECT_ID'),
      storageBucket: this.getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: this.getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
      appId: this.getEnvVar('VITE_FIREBASE_APP_ID'),
      measurementId: this.getEnvVar('VITE_FIREBASE_MEASUREMENT_ID'),
    };

    this.validateConfig();
    FirebaseConfig.instance = this;
  }

  /**
   * Get environment variable with fallback support
   */
  getEnvVar(key) {
    if (typeof import !== 'undefined' && import.meta?.env?.[key]) {
      return import.meta.env[key];
    }
    if (typeof process !== 'undefined' && process.env?.[key]) {
      return process.env[key];
    }
    return null;
  }

  /**
   * Validate that all required Firebase credentials are present
   */
  validateConfig() {
    const requiredKeys = [
      'apiKey',
      'authDomain',
      'projectId',
      'storageBucket',
      'messagingSenderId',
      'appId',
    ];

    const missingKeys = requiredKeys.filter((key) => !this.config[key]);

    if (missingKeys.length > 0) {
      console.error('Missing Firebase credentials:', missingKeys);
      console.error('Please create a .env file with your Firebase configuration.');
      console.error('Use .env.example as a template.');
    }
  }

  /**
   * Get Firebase configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Check if Firebase is properly configured
   */
  isValid() {
    const requiredKeys = [
      'apiKey',
      'authDomain',
      'projectId',
      'storageBucket',
      'messagingSenderId',
      'appId',
    ];
    return requiredKeys.every((key) => this.config[key]);
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FirebaseConfig;
}
