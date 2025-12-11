# Work Tracker Integration Guide

## Overview

Your Work Tracker will be hosted at: `palpal.live/projects/work-tracker/`

It will use shared authentication and database from PalPal.

## Steps to Integrate Your Work Tracker

### 1. Build Your Work Tracker for Production

In your Work Tracker repository:

```bash
npm run build
# This creates a /dist folder with optimized production files
```

### 2. Copy Build Files to PalPal

Copy the contents of the Work Tracker `dist/` folder to:
```
palpal.live/projects/work-tracker/
```

Keep the `index.html` that's already there - it handles authentication.

### 3. Update Vite Configuration (if using Vite)

In your Work Tracker `vite.config.js`, ensure the base is set correctly:

```javascript
export default {
  build: {
    outDir: 'dist',
  },
  base: '/projects/work-tracker/',  // Important for routing
}
```

### 4. Access Shared Services

In your Work Tracker React components, use the shared utilities:

```javascript
// Get current user
const user = palpalAuth.getCurrentUser();
const userId = palpalAuth.getUserId();

// Require authentication
if (!palpalAuth.isAuthenticated()) {
  navigate('/auth');
}

// Initialize database
palpalDB.init();

// Get user's work sessions
const sessions = await palpalDB.getAllProjectData('work-tracker', 'sessions');

// Add new session
const sessionId = await palpalDB.addProjectData('work-tracker', 'sessions', {
  startTime: new Date(),
  tags: ['development', 'coding'],
  duration: 3600
});

// Listen to real-time updates
const unsubscribe = palpalDB.listenProjectData('work-tracker', 'sessions', (data) => {
  console.log('Sessions updated:', data);
});
```

### 5. Firebase Firestore Structure for Work Tracker

Your data will be automatically organized as:

```
projects/
  work-tracker/
    users/
      {userId}/
        sessions/
          {sessionId}: { startTime, endTime, tags, notes, duration... }
        tags/
          {tagId}: { name, color, description... }
        reports/
          {reportId}: { date, totalHours, sessionsCount... }
```

### 6. Update Backend (if applicable)

Remove any hardcoded API calls to Vercel. Use the shared Firebase services instead:

```javascript
// OLD (remove this)
fetch('https://api.work-tracker.vercel.app/sessions')

// NEW (use this)
const sessions = await palpalDB.getAllProjectData('work-tracker', 'sessions');
```

### 7. Environment Variables (Optional)

If your Work Tracker needs any custom env vars, add them to `.env.example` and `.env`:

```
VITE_APP_NAME=Work Tracker
VITE_PROJECT_NAME=work-tracker
```

Access them in your React app:
```javascript
const projectName = import.meta.env.VITE_PROJECT_NAME;
```

## Local Development

During development, you can:

1. Run your Work Tracker locally with `npm run dev`
2. Keep PalPal running separately
3. When ready, build and copy files to palpal.live

## Directory Structure After Integration

```
palpal.live/
├── index.html
├── auth.html
├── firebase-config.js
├── firebase-auth.js
├── firebase-db.js
├── projects/
│   ├── work-tracker/
│   │   ├── index.html (shared wrapper)
│   │   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   └── (your built Work Tracker files)
│   └── shared/
│       ├── palpal-auth.js
│       ├── palpal-db.js
│       └── styles.css
```

## Database Access from Work Tracker

```javascript
// In your React components or services

// Initialize (only once)
palpalDB.init();

// Create
await palpalDB.addProjectData('work-tracker', 'sessions', {
  startTime: new Date(),
  tags: [],
  notes: 'Description'
});

// Read
const sessions = await palpalDB.getAllProjectData('work-tracker', 'sessions');

// Update
await palpalDB.updateProjectData('work-tracker', 'sessions', sessionId, {
  endTime: new Date(),
  duration: 3600
});

// Delete
await palpalDB.deleteProjectData('work-tracker', 'sessions', sessionId);

// Query
const todaySessions = await palpalDB.queryProjectData(
  'work-tracker',
  'sessions',
  'date',
  '==',
  new Date().toISOString().split('T')[0]
);

// Real-time listening
const unsubscribe = palpalDB.listenProjectData('work-tracker', 'sessions', (sessions) => {
  // This callback fires whenever sessions change
  console.log('Sessions:', sessions);
});
```

## Adding More Projects

To add Task Manager or Analytics, follow the same pattern:

1. Create `projects/task-manager/` directory
2. Create `projects/task-manager/index.html` with shared wrapper
3. Update main `index.html` to link to `/projects/task-manager/`
4. Use the same `palpalAuth` and `palpalDB` utilities
5. Data is automatically isolated per project

## Troubleshooting

- **Authentication not working**: Make sure `firebase-config.js` is loaded
- **Data not syncing**: Check that user is authenticated with `palpalAuth.isAuthenticated()`
- **Routing issues**: Verify Vite `base` is set to `/projects/work-tracker/`
- **CORS errors**: Check Firebase security rules allow your operations

## Support

All projects share:
- Firebase authentication (`palpalAuth`)
- Firestore database (`palpalDB`)
- Common styles (`projects/shared/styles.css`)

Each project has isolated data in its own Firestore collections.
