#!/bin/sh
# Generate firebase-init.js from environment variables
cat <<EOF > /usr/share/nginx/html/firebase-init.js
if (typeof firebase !== 'undefined') {
  firebase.initializeApp({
    apiKey: "${VITE_FIREBASE_API_KEY}",
    authDomain: "${VITE_FIREBASE_AUTH_DOMAIN}",
    projectId: "${VITE_FIREBASE_PROJECT_ID}",
    storageBucket: "${VITE_FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "${VITE_FIREBASE_MESSAGING_SENDER_ID}",
    appId: "${VITE_FIREBASE_APP_ID}"
  });
} else {
  console.error('Firebase SDK not loaded before init script');
}
EOF

# Start Nginx
exec "$@"
