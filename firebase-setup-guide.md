# Firebase Setup Guide for PalPal

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter your project name (e.g., "PalPal")
4. Choose your region/location
5. Complete the setup

## Step 2: Get Your Firebase Credentials

1. In the Firebase Console, click on "Project Settings" (gear icon)
2. Go to the "General" tab
3. Scroll down to "Your apps" section
4. Click on "Web" icon to add a web app
5. Copy your Firebase configuration (you'll get something like):

```javascript
{
  apiKey: "AIza...",
  authDomain: "palpal-xxx.firebaseapp.com",
  projectId: "palpal-xxx",
  storageBucket: "palpal-xxx.appspot.com",
  messagingSenderId: "12345...",
  appId: "1:12345...",
  measurementId: "G-XXXXXXX"
}
```

## Step 3: Update public/firebase-config.js

Replace the placeholder values in `public/firebase-config.js` with your actual credentials from Step 2.

## Step 4: Add Firebase SDK to index.html

The Firebase SDK scripts need to be added to your `index.html`. Update it to include:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js"></script>

<!-- Your Firebase Configuration -->
<script src="firebase-config.js"></script>

<!-- Your Firebase Helper Scripts -->
<script src="firebase-auth.js"></script>
<script src="firebase-db.js"></script>
```

Add these scripts before the closing `</body>` tag in `index.html`.

## Step 5: Enable Firebase Services

In the Firebase Console, enable the services you need:

### Authentication

1. Go to "Authentication" in left sidebar
2. Click "Get started"
3. Enable sign-in methods:
   - Email/Password
   - Google
   - GitHub
   - etc.

### Firestore Database

1. Go to "Firestore Database" in left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (change to production rules later)
4. Select your region

### Cloud Storage

1. Go to "Storage" in left sidebar
2. Click "Get started"
3. Review security rules

## Step 6: Set Up Security Rules

### Firestore Security Rules (for development):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Security Rules (for development):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read/write to authenticated users
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 7: Test Your Setup

1. Open `index.html` in a browser
2. Open Developer Console (F12)
3. Test authentication functions:

```javascript
// Test signup
await signupWithEmail("test@example.com", "password123");

// Test login
await loginWithEmail("test@example.com", "password123");

// Test database
const docId = await addDocument("users", {
  name: "John Doe",
  email: "john@example.com",
});

// Test retrieval
const user = await getDocument("users", docId);
```

## Usage Examples

### Authentication

```javascript
// Sign up
await signupWithEmail("user@example.com", "password123");

// Sign in
const user = await loginWithEmail("user@example.com", "password123");

// Sign in with Google
await signInWithGoogle();

// Sign out
await signOut();

// Listen for auth changes
onAuthStateChanged((user) => {
  if (user) {
    console.log("User logged in:", user.uid);
  } else {
    console.log("User logged out");
  }
});
```

### Database Operations

```javascript
// Add a new document
const docId = await addDocument("projects", {
  name: "Work Tracker",
  status: "live",
  created: new Date(),
});

// Get a document
const project = await getDocument("projects", docId);

// Get all documents
const allProjects = await getAllDocuments("projects");

// Update a document
await updateDocument("projects", docId, { status: "archived" });

// Delete a document
await deleteDocument("projects", docId);

// Query documents
const liveProjects = await queryDocuments("projects", "status", "==", "live");

// Real-time updates
onCollectionUpdate("projects", (projects) => {
  console.log("Projects updated:", projects);
});
```

## Environment Variables

For production, store your credentials in environment variables rather than committing them. For a static site, you can use `.env` files with build tools or GitHub Actions secrets.

## Troubleshooting

- **CORS errors**: Check Firebase security rules
- **Auth not working**: Make sure auth methods are enabled in Firebase Console
- **Database read/write errors**: Check your Firestore security rules
- **SDK not loading**: Verify Firebase SDK URLs are accessible

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
