# Work Tracker - Free & Authenticated Modes

## Overview

Work Tracker now supports two modes of operation:

### 🆓 Free Mode (Unauthenticated)

- No login required
- Works immediately on first visit
- Data stored in browser localStorage
- Perfect for trying it out

### 🔒 Premium Mode (Authenticated)

- Sign in with email/password
- Data synced to Firebase cloud
- Access from any device
- Real-time updates

## Quick Start

### For Free Users

```typescript
import { getWorkTrackerDB } from "./utils/localDB";

const db = getWorkTrackerDB();

// Add a work item
const itemId = await db.addItem("items", {
  title: "Review design mockups",
  status: "active",
});

// Get all items
const items = await db.getAllItems("items");

// Update an item
await db.updateItem("items", itemId, { status: "completed" });

// Delete an item
await db.deleteItem("items", itemId);
```

### For Authenticated Users

Same API works! Automatically uses Firebase instead:

```typescript
import { getWorkTrackerDB } from "./utils/localDB";

// Same interface, but data syncs to cloud
const db = getWorkTrackerDB();

// Automatically uses Firebase if authenticated
const items = await db.getAllItems("items");
```

## Terminology

All time-tracking terminology has been removed:

| Old Term         | New Term                           |
| ---------------- | ---------------------------------- |
| `sessions`       | `items`                            |
| `start/end time` | `status` (active/completed/paused) |
| `clock in/out`   | `create/update item`               |
| `duration`       | `Optional property on items`       |
| `time tracking`  | `work tracking`                    |

## Code Examples

### Creating Items

```typescript
// Before (time tracker)
await db.addItem("sessions", {
  startTime: new Date(),
  tags: ["coding"],
  duration: 3600,
});

// After (work tracker)
await db.addItem("items", {
  title: "Implement authentication",
  status: "active",
  tags: ["backend"],
});
```

### Checking Auth Status

```typescript
const isAuthenticated = window.palpalAppState?.isAuthenticated;
const db = getWorkTrackerDB();

if (isAuthenticated) {
  console.log("Data syncing to cloud");
} else {
  console.log("Using local storage (free version)");
}
```

### Exporting Data (Free Users)

```typescript
import { localDB } from "./utils/localDB";

// Export as JSON
const jsonData = localDB.exportData();
console.log(jsonData);

// Save to file
const blob = new Blob([jsonData], { type: "application/json" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "work-tracker-backup.json";
a.click();
```

### Importing Data

```typescript
import { localDB } from "./utils/localDB";

// Import from JSON
const jsonData = "{...}";
localDB.importData(jsonData);
```

## UI Considerations

### Show Auth Status

```typescript
function Header() {
  const isAuth = window.palpalAppState?.isAuthenticated;
  const user = window.palpalAppState?.user;

  return (
    <header>
      {isAuth ? (
        <div>
          <span>Logged in as {user.email}</span>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <span>Free version (local storage)</span>
          <button onClick={() => (window.location.href = "/auth.html")}>
            Sign In for Cloud Sync
          </button>
        </div>
      )}
    </header>
  );
}
```

### Data Persistence Banner

```typescript
function DataInfo() {
  const isLocal = getWorkTrackerDB().isLocal;

  if (isLocal) {
    return (
      <div className="palpal-alert palpal-alert-warning">
        Your data is stored locally.
        <a href="/auth.html">Sign in</a> to sync across devices.
      </div>
    );
  }

  return (
    <div className="palpal-alert palpal-alert-success">
      Your data is synced to the cloud.
    </div>
  );
}
```

## Migration Guide (If Coming from Time Tracker)

1. **Rename collections**:

   - `sessions` → `items`

2. **Update data structure**:

   ```typescript
   // Before
   {
     startTime: Date,
     endTime: Date,
     duration: number,
     tags: []
   }

   // After
   {
     title: string,
     description: string,
     status: 'active' | 'completed' | 'paused',
     tags: []
   }
   ```

3. **Update code**:
   - Replace all `sessions` collection references with `items`
   - Replace time-based logic with status-based logic
   - Update UI labels from "time tracking" to "work tracking"

## File Changes

- ✅ `src/AppWithAuth.tsx` - No longer requires authentication
- ✅ `src/utils/localDB.ts` - New localStorage utility
- ✅ `src/types/palpal.d.ts` - Updated type definitions
- ✅ `vite.config.ts` - Configured for subdirectory
- ✅ `index.html` - Includes shared scripts

## Next Steps

1. Update your React components to use the new data structure
2. Replace "sessions" terminology with "items"
3. Use `getWorkTrackerDB()` instead of directly calling Firebase
4. Test both free and authenticated modes
5. Build and deploy!
