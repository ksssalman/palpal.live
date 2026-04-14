// Manual Firebase Initialization
// Uses absolute CDN URLs for universal compatibility (local dev, staging, production)

(function() {
  const firebaseConfig = {
    apiKey: "AIzaSyAOWDCQ_iT2eyJ9fuDVE5e7NyZvZgNNbbM",
    authDomain: "palpal-541342.firebaseapp.com",
    projectId: "palpal-541342",
    storageBucket: "palpal-541342.firebasestorage.app",
    messagingSenderId: "155661868786",
    appId: "1:155661868786:web:e427251a2a29f346e4fa6b",
    measurementId: "G-WGBMFMB0MP"
  };

  let retryCount = 0;
  const maxRetries = 30; // Retry for up to 3 seconds (30 * 100ms)

  function initializeFirebase() {
    retryCount++;
    
    if (typeof firebase !== 'undefined' && firebase.initializeApp) {
      try {
        firebase.initializeApp(firebaseConfig);
        console.log('✓ Firebase initialized successfully');
        window.firebaseInitialized = true;
        return;
      } catch (error) {
        if (error.code === 'app/duplicate-app') {
          console.log('✓ Firebase already initialized');
          window.firebaseInitialized = true;
          return;
        } else {
          console.error('✗ Firebase initialization failed:', error.message);
          window.firebaseInitialized = false;
          return;
        }
      }
    }
    
    if (retryCount < maxRetries) {
      setTimeout(initializeFirebase, 100);
    } else {
      console.error('✗ Firebase SDK failed to load after', maxRetries * 100, 'ms');
      window.firebaseInitialized = false;
    }
  }

  // Start initialization immediately
  initializeFirebase();
})();
