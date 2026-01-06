// Manual Firebase Initialization to enforce custom Auth Domain
// This replaces the auto-generated /__/firebase/init.js to ensure authDomain is set to palpal.live

(function() {
  const firebaseConfig = {
    apiKey: "AIzaSyAOWDCQ_iT2eyJ9fuDVE5e7NyZvZgNNbbM",
    authDomain: "palpal.live",
    projectId: "palpal-541342",
    storageBucket: "palpal-541342.firebasestorage.app",
    messagingSenderId: "155661868786",
    appId: "1:155661868786:web:e427251a2a29f346e4fa6b",
    measurementId: "G-WGBMFMB0MP"
  };

  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized manually with custom domain: palpal.live');
  } else {
    console.error('Firebase SDK not loaded before initialization script');
  }
})();
