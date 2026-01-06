# Work Tracker Ecosystem - Architecture & Operations Guide

## 🎯 Overview

**Work Tracker** is a time tracking application within the PalPal ecosystem. It tracks work sessions with tags, supports both local and cloud storage, and integrates with the shared PalPal authentication and database systems.

**Key Features:**
- ⏱️ Clock in/out time tracking
- 🏷️ Custom tags for activity categorization
- 💾 Dual persistence (Local Storage + Firebase Cloud)
- 🔐 Google Sign-In integration
- 📊 Report generation (CSV/JSON)
- 🔄 Automatic cloud sync when authenticated

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Work Tracker Application                          │
│                   (React/TypeScript/Vite)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │            TimeTrackerWidget.tsx (Main Component)          │    │
│  │                                                            │    │
│  │  State Management:                                        │    │
│  │  - entries[] (all time entries)                          │    │
│  │  - currentEntry (active session)                         │    │
│  │  - user (auth state)                                     │    │
│  │  - view (tracker/report)                                 │    │
│  └────────────────────────────────────────────────────────────┘    │
│           ↓              ↓               ↓              ↓            │
│    ┌────────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│    │  Header    │  │ClockIn   │  │ Recent   │  │ Report   │       │
│    │ (Auth UI)  │  │Section   │  │ Entries  │  │ View     │       │
│    └────────────┘  └──────────┘  └──────────┘  └──────────┘       │
│         ↓              ↓               ↓              ↓              │
│    ┌────────────────────────────────────────────────────────┐    │
│    │           Local Storage (Browser)                      │    │
│    │  - timeEntries (all sessions)                         │    │
│    │  - currentEntry (active session)                      │    │
│    └────────────────────────────────────────────────────────┘    │
│         ↓                      ↓                      ↓             │
│    ┌─────────────────────────────────────────────────────────┐   │
│    │           PalPalBridge (Dual-Mode Bridge)              │   │
│    │                                                         │   │
│    │  Mode 1: SHARED ECOSYSTEM (Embedded in PalPal)        │   │
│    │  └─ Uses window.palpalAuth (shared)                  │   │
│    │  └─ Uses window.palpalDB (shared)                    │   │
│    │                                                         │   │
│    │  Mode 2: STANDALONE (Dedicated Firebase)              │   │
│    │  └─ Uses own Firebase instance                       │   │
│    │  └─ Isolated from PalPal ecosystem                   │   │
│    └─────────────────────────────────────────────────────────┘   │
│         ↓                                         ↓                 │
│    ┌──────────────────────┐           ┌──────────────────────┐    │
│    │  PalPal Shared Auth  │           │ Dedicated Firebase   │    │
│    │  (Optional - via CDN)│           │    (Standalone)      │    │
│    └──────────────────────┘           └──────────────────────┘    │
│         ↓                                         ↓                 │
│    ┌──────────────────────┐           ┌──────────────────────┐    │
│    │  PalPal Shared DB    │           │ Dedicated Firebase   │    │
│    │  (Optional - via CDN)│           │      Firestore       │    │
│    └──────────────────────┘           └──────────────────────┘    │
│         ↓                                         ↓                 │
│    ┌──────────────────────────────────────────────────────────┐   │
│    │              Cloud (Firebase/Firestore)                 │   │
│    │                                                          │   │
│    │  Path (Shared): projects/work-tracker/users/{UID}/     │   │
│    │  Path (Standalone): users/{UID}/sessions               │   │
│    └──────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow & Button Operations

### 1. **Clock In Button** → Start a Work Session

```typescript
// Button: "Clock In"
// Location: ClockInSection.tsx → onClick={onClockIn}

clockIn = (): void => {
  // Step 1: Create new entry
  const entry: TimeEntry = {
    id: Date.now(),              // Unique ID
    clockIn: new Date().toISOString(),  // Start time
    clockOut: null,              // Not finished yet
    tags: []                      // No tags initially
  };

  // Step 2: Set as current entry
  setCurrentEntry(entry);

  // Step 3: Auto-save to localStorage
  // (useEffect listens to currentEntry changes)
};

// Timeline:
// Browser → setCurrentEntry() → UI Updates → localStorage saved
// NO cloud sync yet (user must clock out first)
```

**What Happens:**
- ✅ UI shows active clock timer
- ✅ Current time displayed
- ✅ Tag input field appears
- ✅ Data saved locally (survives refresh)
- ❌ Cloud NOT synced (incomplete session)

---

### 2. **Add Tag Button** → Categorize Work

```typescript
// Button: "+" next to tag input
// Location: ClockInSection.tsx → onClick={onAddTag}

addTag = (): void => {
  // Validation
  if (tagInput.trim() && currentEntry) {
    // Step 1: Update current entry with new tag
    const updatedEntry: TimeEntry = {
      ...currentEntry,
      tags: [...currentEntry.tags, tagInput.trim()]
    };

    // Step 2: Save to state
    setCurrentEntry(updatedEntry);

    // Step 3: Clear input
    setTagInput('');

    // Step 4: Auto-save to localStorage
    // (useEffect watches currentEntry)
  }
};

// Timeline:
// User types "meeting" → Clicks "+" → Tag added → localStorage saved
// NO cloud sync yet (session still active)
```

**What Happens:**
- ✅ Tag appears as a badge
- ✅ Badge shows with remove button (X)
- ✅ Input field clears for next tag
- ✅ Data saved locally
- ❌ Cloud NOT synced (session incomplete)

---

### 3. **Clock Out Button** → Complete Session + Cloud Sync

```typescript
// Button: "Clock Out"
// Location: ClockInSection.tsx → onClick={onClockOut}

clockOut = async (): Promise<void> => {
  if (currentEntry) {
    // Step 1: Create completed entry
    const completedEntry: TimeEntry = {
      ...currentEntry,
      clockOut: new Date().toISOString()  // Add end time
    };

    // Step 2: Add to entries history
    const newEntries = [completedEntry, ...entries];
    setEntries(newEntries);

    // Step 3: Clear current entry
    setCurrentEntry(null);

    // Step 4: Save to localStorage
    // (useEffect watches entries and currentEntry)

    // Step 5: CLOUD SYNC (if authenticated)
    if (bridge?.isAuthenticated()) {
      try {
        // Save to cloud database
        await bridge.saveItem('work-tracker', 'sessions', completedEntry);
        // ✅ Cloud synced successfully
      } catch (e) {
        // ❌ Cloud sync failed (data still local)
        console.error('Cloud sync failed', e);
      }
    }
  }
};

// Timeline:
// User clicks "Clock Out"
//   → Entry completed locally (1ms)
//   → Removed from current view (instant)
//   → Added to history (instant)
//   → Sent to cloud (async, may fail)
//   → localStorage updated (instant)
```

**What Happens:**
- ✅ Session moved to "Recent Entries" list
- ✅ Duration calculated and displayed
- ✅ Tags visible with session
- ✅ Data saved locally + cloud (if authenticated)
- 🔄 Cloud sync happens in background (async)

---

### 4. **Cloud Sync Mechanism**

```typescript
// Triggered by Clock Out
if (bridge?.isAuthenticated()) {
  await bridge.saveItem('work-tracker', 'sessions', completedEntry);
}

// Inside PalPalBridge.saveItem():
// ═══════════════════════════════════════════════════════════════

// SHARED ECOSYSTEM MODE (if palpalDB exists)
saveItem: async (projectName, colName, data) => {
  // Calls shared PalPal DB from CDN
  return await sharedDB.addProjectData(
    projectName,        // "work-tracker"
    colName,           // "sessions"
    data               // { clockIn, clockOut, tags, id }
  );

  // Result: Saves to Firestore path:
  // projects/work-tracker/users/{USER_ID}/sessions/{DOC_ID}
}

// STANDALONE MODE (fallback)
saveItem: async (projectName, colName, data) => {
  // Uses dedicated Firebase
  const path = `users/${currentUser.uid}/sessions`;
  const docRef = await addDoc(collection(db, path), data);
  return docRef.id;

  // Result: Saves to Firestore path:
  // users/{USER_ID}/sessions/{DOC_ID}
}
```

**Cloud Storage Paths:**

| Mode | Path | Example |
|------|------|---------|
| **Shared** | `projects/work-tracker/users/{UID}/sessions/{ID}` | `projects/work-tracker/users/abc123/sessions/xyz789` |
| **Standalone** | `users/{UID}/sessions/{ID}` | `users/abc123/sessions/xyz789` |

---

### 5. **Load on App Start**

```typescript
// Runs on component mount
useEffect(() => {
  const loadInitialData = async () => {
    // Step 1: Load from localStorage (always)
    const saved = localStorage.getItem('timeEntries');
    if (saved) {
      setEntries(JSON.parse(saved) as TimeEntry[]);
    }

    const current = localStorage.getItem('currentEntry');
    if (current) {
      setCurrentEntry(JSON.parse(current) as TimeEntry);
    }

    // Step 2: If authenticated, load from cloud
    if (bridge.isAuthenticated()) {
      try {
        const remoteEntries = await bridge.getAllItems(
          'work-tracker',  // projectName
          'sessions'       // collectionName
        );
        if (remoteEntries && remoteEntries.length > 0) {
          setEntries(remoteEntries);  // Merge/override with cloud data
        }
      } catch (e) {
        // Cloud load failed, use local data only
        console.error('Failed to load cloud data:', e);
      }
    }
  };

  loadInitialData();
}, []);

// Timeline:
// App loads → localStorage read (sync, instant)
//          → Cloud fetch starts (async)
//          → UI rendered with local data
//          → Cloud data arrives → UI updates
```

**Data Merge Logic:**
1. Always load from localStorage first (instant UI)
2. If authenticated, fetch from cloud (async)
3. Cloud data has priority (if it exists, use it)
4. No conflict resolution (cloud overwrites local)

---

## 🔐 Authentication Flow

### Google Sign-In

```typescript
// Button: "Sign In with Google"
// Location: Header.tsx

handleSignIn = async () => {
  try {
    setIsSigningIn(true);

    // ECOSYSTEM MODE: Use shared auth
    if (bridge && !bridge.isDedicated) {
      await (window as any).palpalAuth.signInWithGoogle();
    }
    // STANDALONE MODE: Use dedicated auth
    else {
      await signInWithPopup(dedicatedAuth, googleProvider);
    }

    // ✅ Signed in → auth state listener fires → loads cloud data
  } catch (e) {
    setSignInError(e.message);
  } finally {
    setIsSigningIn(false);
  }
};

// Timeline:
// "Sign In" click → Google popup → User authorizes
//                → onAuthStateChanged fires
//                → loadInitialData() called
//                → Cloud data loaded and merged
```

### Auth State Listener

```typescript
// Continuously monitors login status
useEffect(() => {
  if (bridge) {
    // ECOSYSTEM: Use shared listener
    const unsubscribe = (window as any).palpalAuth?.onAuthStateChanged((u) => {
      const user = u ? { uid: u.uid, email: u.email } : null;
      setUser(user);
      if (user) loadInitialData();  // Load cloud data when signed in
    });

    // STANDALONE: Use dedicated listener
    const unsubscribe = onAuthStateChanged(dedicatedAuth, (u) => {
      const user = u ? { uid: u.uid, email: u.email } : null;
      setUser(user);
      if (user) loadInitialData();  // Load cloud data when signed in
    });
  }
}, []);
```

---

## 💾 Data Persistence Strategy

### Local Storage (Browser)

| Key | Data | Persists | Purpose |
|-----|------|----------|---------|
| `timeEntries` | Array of completed sessions | ✅ Yes (until cleared) | Main data store |
| `currentEntry` | Active session object | ✅ Yes | Resume interrupted sessions |

**Behavior:**
- Automatically saved via useEffect
- Survives page refresh ✅
- Lost if browser data cleared ❌
- Private to that browser/device

### Cloud Storage (Firebase Firestore)

**Only Synced After:**
- ✅ User clicks "Clock Out"
- ✅ User is authenticated (Google Sign-In)

**Data Never Lost If:**
- ❌ Network fails → stays local, retries later
- ❌ User not signed in → saved locally, syncs when authenticated
- ❌ Cloud sync errors → local copy kept

**Cloud Features:**
- Multi-device sync
- Permanent storage (unless user deletes)
- Accessible from other devices
- Real-time updates (onSnapshot) - *optional*

---

## 🔘 Button & Action Summary

| Button | Location | Trigger | Local Effect | Cloud Effect |
|--------|----------|---------|--------------|--------------|
| **Clock In** | ClockInSection | Creates session | Current entry set | None |
| **Add Tag** | ClockInSection | Adds tag to session | Tags updated | None |
| **Remove Tag** | ClockInSection | Removes tag | Tags updated | None |
| **Clock Out** | ClockInSection | Completes session | Moved to history | Synced if auth |
| **Sign In** | Header | Auth popup | User state set | Triggers cloud load |
| **Sign Out** | Header | Logout | User state cleared | Clears auth |
| **Delete Entry** | RecentEntriesList | Removes entry | Entry deleted locally | Not deleted cloud |
| **Add Manual Entry** | RecentEntriesList | Creates sub-entry | Added with tag | Synced if auth |
| **Export CSV/JSON** | ReportView | Downloads data | Creates file | None |
| **Clear All** | Header | Deletes everything | All data wiped | None (local only) |

---

## 🔄 Data Sync Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│           TIME TRACKER DATA LIFECYCLE                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. USER CLOCKS IN                                     │
│     ├─ Creates TimeEntry (id, clockIn, clockOut:null) │
│     ├─ setCurrentEntry() called                       │
│     ├─ useEffect auto-saves to localStorage           │
│     └─ Cloud: ❌ NOT synced (incomplete)              │
│                                                         │
│  2. USER ADDS TAGS                                    │
│     ├─ Appends tag to currentEntry.tags[]            │
│     ├─ setCurrentEntry() called                       │
│     ├─ useEffect auto-saves to localStorage           │
│     └─ Cloud: ❌ NOT synced (session incomplete)      │
│                                                         │
│  3. USER CLOCKS OUT                                   │
│     ├─ Completes entry (adds clockOut time)          │
│     ├─ Moves to entries[] array                       │
│     ├─ useEffect auto-saves to localStorage           │
│     ├─ Cloud: ✅ SYNCED if authenticated              │
│     │   └─ Path: projects/work-tracker/users/{UID}/  │
│     │     └─ sessions/{ENTRY_ID}                      │
│     └─ Returns to original tag form                   │
│                                                         │
│  4. PAGE REFRESH                                      │
│     ├─ useEffect on mount reads localStorage         │
│     ├─ Instant UI render with local data             │
│     ├─ If auth exists, fetches from cloud            │
│     ├─ Cloud data merged/overwrites local             │
│     └─ UI updates with cloud data                     │
│                                                         │
│  5. USER SIGNS OUT                                    │
│     ├─ currentEntry cleared                          │
│     ├─ entries[] persists in localStorage             │
│     ├─ User can still see history (offline)           │
│     └─ Cloud: No new syncs until signed in again      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuration & Environment

### Required Environment Variables

For **Standalone Mode**:
```env
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

For **Ecosystem Mode**:
- Loads from parent PalPal page
- No additional config needed
- Inherits PalPal's Firebase project

---

## 🚀 Deployment Modes

### Mode 1: Standalone (Self-Contained)

```
https://work-tracker.example.com
├─ Own Firebase project
├─ Independent database
├─ Dedicated Google OAuth app
└─ No PalPal ecosystem access
```

**Files Needed:**
- All in `/projects/work-tracker/`
- Standalone Firebase config
- Standalone .env file

### Mode 2: Ecosystem (Embedded in PalPal)

```
https://palpal.live/projects/work-tracker/
├─ Uses PalPal's Firebase
├─ Uses PalPal's OAuth
├─ Shared user database
└─ Integrated authentication
```

**Requirements:**
- Parent page loads palpal-auth.js + palpal-db.js
- Bridge detects `window.palpalAuth` exists
- Seamless integration

---

## ✅ Testing & Verification

### 1. Clock In/Out Cycle

```typescript
// Test Steps:
1. Click "Clock In" → Timer starts ✅
2. Add 3 tags → All appear ✅
3. Click "Clock Out" → Moved to history ✅
4. Refresh page → Entry still there ✅
5. Check localStorage ("timeEntries") → Entry visible ✅
```

### 2. Cloud Sync Test

```typescript
// Test Steps:
1. Sign in with Google ✅
2. Clock in/out → Entry created ✅
3. Check Firestore console → Entry exists ✅
4. Sign out, clear localStorage ❌
5. Refresh page, sign in → Cloud data loaded ✅
```

### 3. Offline Functionality

```typescript
// Test Steps:
1. Clock in while online
2. Go offline (DevTools → Network → Offline)
3. Clock out → Saved locally ✅
4. Go back online → Entry synced to cloud ✅
```

---

## 🔧 Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Data lost on refresh | Unauthenticated, not in localStorage | Sign in to enable cloud sync |
| Cloud sync fails | Network error | Check console, data stays local |
| "Add Tag" not working | currentEntry is null (not clocked in) | Clock in first |
| Tags not showing | Tags added but not persisted | Check localStorage in DevTools |
| Cloud data not loading | Auth not initialized | Sign in again, refresh page |
| Bridge returns null | Neither shared nor standalone available | Check Firebase config |

---

## 📊 Data Types

```typescript
interface TimeEntry {
  id: number;                    // Timestamp when created
  clockIn: string;              // ISO timestamp (2024-01-05T14:30:00.000Z)
  clockOut: string | null;      // ISO timestamp or null if active
  tags: string[];               // Array of tags ["meeting", "coding"]
  parentId?: number;            // For manual subtask entries
  isManual?: boolean;           // True if manually created
}

interface PalPalUser {
  uid: string;                  // Firebase UID
  email: string | null;         // Google email
}

interface TimeTrackerState {
  entries: TimeEntry[];         // All completed sessions
  currentEntry: TimeEntry | null; // Currently running session
  user: PalPalUser | null;      // Authenticated user
  view: 'tracker' | 'report';  // Current view mode
}
```

---

## 🎓 Summary

**Work Tracker** is a dual-mode time tracking app:

1. **Local Mode**: Works entirely in browser (localStorage)
2. **Cloud Mode**: Syncs to Firebase when authenticated

**Button Operations:**
- ⏱️ **Clock In**: Starts session (local only)
- 🏷️ **Add Tag**: Categorizes work (local only)
- ⏸️ **Clock Out**: Completes + syncs to cloud
- 🔐 **Sign In**: Enables cloud sync & loads remote data
- 📊 **Export**: Generates reports from local data

**Data Persistence:**
- **Local**: Instant, always available, survives refresh
- **Cloud**: Requires authentication, multi-device sync, permanent

**Bridge Design:**
- Auto-detects ecosystem vs. standalone mode
- Uses shared Firebase if available, falls back to dedicated
- Transparent to user (same API either way)

---

**Version:** 1.0
**Last Updated:** January 5, 2026
**Status:** Production Ready ✅
