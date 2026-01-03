// Firebase Configuration Template
// This file should contain your Firebase project configuration
// Copy this file to firebase-config.js and update with your actual Firebase project settings
//
// Get these values from:
// Firebase Console > Project Settings > General > Your apps > Web app

/* 
window.firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
*/

// For deployment, this file should be created with actual values
// It's not committed to version control for security reasons

// Fallback for development/testing
if (typeof window !== 'undefined' && typeof window.firebaseConfig === 'undefined') {
  console.warn('⚠️ firebase-config.js: Firebase configuration not found. Please create firebase-config.js with your Firebase project settings.');
  console.warn('   See firebase-config.template.js for the required format.');
  
  // Provide a placeholder to prevent errors
  window.firebaseConfig = {
    apiKey: "PLACEHOLDER",
    authDomain: "PLACEHOLDER",
    projectId: "PLACEHOLDER",
    storageBucket: "PLACEHOLDER",
    messagingSenderId: "PLACEHOLDER",
    appId: "PLACEHOLDER",
    measurementId: "PLACEHOLDER"
  };
}
