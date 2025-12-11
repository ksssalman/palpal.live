# PalPal Multi-Project Architecture

## Directory Structure

```
palpal.live/
├── index.html (main landing page)
├── auth.html (authentication)
├── firebase-config.js (shared)
├── firebase-auth.js (shared)
├── firebase-db.js (shared)
├── projects/
│   ├── work-tracker/
│   │   ├── index.html
│   │   ├── assets/
│   │   ├── style.css
│   │   └── app.js
│   ├── task-manager/
│   │   ├── index.html
│   │   └── assets/
│   ├── analytics/
│   │   ├── index.html
│   │   └── assets/
│   └── shared/
│       ├── auth.js (shared auth handler)
│       ├── db.js (shared database handler)
│       └── styles.css (shared styles)
└── README.md
```

## How It Works

1. **Shared Authentication**: All projects use the same `firebase-config.js` and `firebase-auth.js`
2. **Shared Database**: Common Firestore structure with project-specific collections
3. **Independent Operation**: Each project is completely independent - removing one doesn't affect others
4. **Single Sign-On**: Users authenticate once and can access all projects
5. **Modular Design**: Easy to add new projects

## Project Routing

- Main: `palpal.live/`
- Authentication: `palpal.live/auth.html`
- Work Tracker: `palpal.live/projects/work-tracker/`
- Task Manager: `palpal.live/projects/task-manager/`
- Analytics: `palpal.live/projects/analytics/`

## Firebase Collections Structure

```
users/{userId}/
  - profile (basic user info)
  - preferences

work-tracker/
  ├── {userId}/
  │   ├── sessions (individual sessions)
  │   ├── tags (activity tags)
  │   └── reports (generated reports)

task-manager/
  ├── {userId}/
  │   ├── tasks (user tasks)
  │   └── categories (task categories)

analytics/
  ├── {userId}/
  │   ├── data-points (analytics events)
  │   └── dashboards (custom dashboards)
```

## Shared Auth Flow

1. User visits `palpal.live/`
2. Clicks "Sign In" → `auth.html`
3. Creates account or signs in
4. Gets redirected to `projects/work-tracker/` or dashboard
5. Auth persists across all projects
6. User can navigate between projects without re-authenticating

## Implementation Steps

1. Create `/projects` directory structure
2. Build Work Tracker React app for subdirectory
3. Create shared utilities for auth/db access
4. Update main `index.html` to link to `/projects/work-tracker/`
5. Each project loads shared Firebase configs
