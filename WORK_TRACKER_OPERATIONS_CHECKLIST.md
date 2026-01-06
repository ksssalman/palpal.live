# Work Tracker - Button Operations Verification Checklist

**Note:** All references to "entry/entries" and "currentEntry" have been updated to "session/sessions" and "currentSession" throughout the codebase and UI. Type/interface names may still use "Entry" for legacy/type reasons.

## ✅ Button Operation Tests

### Clock In Button
- [ ] Click "Clock In" → Timer immediately starts
- [ ] Current time displays correctly
- [ ] Clock-in timestamp stored (ISO format)
- [ ] Data saved to localStorage
- [ ] Cloud NOT synced (session incomplete)
- [ ] Tag input field appears
- [ ] Button text changes to "Clock Out"

### Add Tag Button
- [ ] Type tag name → Press Enter or click "+"
- [ ] Tag appears as badge below
- [ ] Input field clears
- [ ] Multiple tags allowed
- [ ] Tags stored in currentSession.tags[]
- [ ] localStorage updated
- [ ] Cloud NOT synced (session incomplete)

### Remove Tag Button (X on tag badge)
- [ ] Click X on any tag → Tag removed
- [ ] Badge disappears
- [ ] Remaining tags stay
- [ ] currentSession.tags updated
- [ ] localStorage updated
- [ ] Cloud NOT affected

### Clock Out Button
- [ ] Click "Clock Out" → Completes session
- [ ] clockOut timestamp recorded
- [ ] Session moved to "Recent Sessions" list
- [ ] Duration calculated and displayed
- [ ] currentSession cleared (timer stops)
- [ ] localStorage updated
- [ ] **Cloud synced if authenticated** ✅ CRITICAL
- [ ] Session visible in Firestore (if signed in)

### Sign In Button
- [ ] Click "Sign In" → Google popup appears
- [ ] User authorizes PalPal
- [ ] Popup closes automatically
- [ ] Header shows user email
- [ ] Cloud data loads (if any exists)
- [ ] Previous sessions merge from cloud
- [ ] New sessions sync to cloud on clock-out

### Sign Out Button
- [ ] Click "Sign Out" → User logged out
- [ ] Header shows "Sign In" button again
- [ ] Local data still visible (not deleted)
- [ ] Cloud sync disabled
- [ ] New sessions stay local only
- [ ] No data loss

### Delete Session Button
- [ ] Click trash icon on session → Confirm dialog
- [ ] Session removed from list
- [ ] Session deleted from localStorage
- [ ] Cloud session NOT deleted (data inconsistency)
- [ ] ID removed from selectedSessions[]

### Add Manual Session (During Clock Session)
- [ ] Click "+" during active clock-in
- [ ] Modal appears with time fields
- [ ] Enter clock-in and clock-out times
- [ ] Select tag for this sub-session
- [ ] Click "Save" → New session created
- [ ] New session linked via parentId
- [ ] Synced to cloud if authenticated
- [ ] Appears in session list

### Export CSV Button
- [ ] Click "Download CSV"
- [ ] File downloads (work-tracker-{date}.csv)
- [ ] CSV contains headers: ID, Clock In, Clock Out, Duration, Tags
- [ ] All visible sessions included
- [ ] Can open in Excel/Sheets

### Export JSON Button
- [ ] Click "Download JSON"
- [ ] File downloads (work-tracker-{date}.json)
- [ ] JSON contains all session objects
- [ ] Can parse and process
- [ ] Preserves all field types

### Clear All Data Button
- [ ] Click "Clear All" → Warning modal appears
- [ ] Modal asks for confirmation
- [ ] If confirmed: All local data deleted
- [ ] localStorage cleared
- [ ] currentSession cleared
- [ ] sessions[] = []
- [ ] UI resets to empty state
- [ ] Cloud data NOT deleted

---

## 🔄 Cloud Sync Verification

### Prerequisites
- [ ] User signed in with Google
- [ ] Browser console visible
- [ ] Firestore console tab open

### Clock Out → Cloud Sync Test
```
1. [ ] Clock in work session
2. [ ] Add tags
3. [ ] Clock out → Watch Firestore
   └─ [ ] New document appears in:
        projects/work-tracker/users/{UID}/sessions/
4. [ ] Check console → No errors
5. [ ] Refresh page
   └─ [ ] Session still visible (cloud loaded)
```

### Manual Session → Cloud Sync Test
```
1. [ ] Clock in
2. [ ] Click "Add Manual Session"
3. [ ] Fill form and save
   └─ [ ] Document appears in Firestore
4. [ ] Check console for sync logs
5. [ ] Verify parentId matches clock-in session
```

### Offline Sync Fallback
```
1. [ ] Clock in work session
2. [ ] Disable network (DevTools → Offline)
3. [ ] Clock out → Session saved locally
4. [ ] Check localStorage → Session present
5. [ ] Enable network
6. [ ] Check Firestore → Session synced (if supported)
```

---

## 📊 Data Persistence Verification

### localStorage Check
```javascript
// In browser console:
console.log(JSON.parse(localStorage.getItem('timeSessions')))
console.log(JSON.parse(localStorage.getItem('currentSession')))

// Expected: Array of TimeEntry objects with:
// - id (number)
// - clockIn (ISO string)
// - clockOut (ISO string or null)
// - tags (array of strings)
```

### Cloud Storage Check
```
1. Open Firebase Console
2. Go to Firestore Database
3. Path: projects/work-tracker/users/{USER_ID}/sessions
4. [ ] Documents visible for each clocked-out session
5. [ ] Data matches localStorage sessions
6. [ ] Timestamps correct (ISO format)
7. [ ] Tags array present
```

### Data Merge Test
```
1. [ ] Sign in (cloud data loads)
2. [ ] Clear localStorage
3. Refresh page
   └─ [ ] Cloud data reappears (loaded from Firestore)
4. [ ] No data loss occurs
```

---

## 🐛 Error Handling Verification

### Network Error Handling
```
1. [ ] Clock out while network unavailable
2. [ ] Session saved to localStorage ✅
3. [ ] Error message NOT shown (graceful fail)
4. [ ] Session marked as "synced" = false (optional)
5. [ ] Console shows error details
```

### Auth State Changes
```
1. [ ] Sign in → Auth state updates
2. [ ] Cloud data loads
3. [ ] Sign out → Still shows local data
4. [ ] Sign back in → Cloud data loads again
```

### Validation
```
1. [ ] Clock out with no tags → Allowed ✅
2. [ ] Clock out with tags → All tags saved ✅
3. [ ] Clock in time > Clock out time → Rejected ❌
4. [ ] Manual session outside session bounds → Rejected ❌
```

---

## 📱 Multi-Device Sync Test

### Device 1 (Computer A)
```
1. [ ] Sign in with Google
2. [ ] Clock in → Work → Clock out → Session synced
3. [ ] Leave tab open
```

### Device 2 (Computer B)
```
1. [ ] Sign in with same Google account
2. [ ] Wait 2-3 seconds
3. [ ] [ ] Previous session appears (cloud loaded)
4. [ ] Clock in → Work → Clock out → Session synced
```

### Device 1 (Again)
```
1. [ ] Refresh page
2. [ ] [ ] Both sessions visible (merged from cloud)
3. [ ] No duplicates or conflicts
```

---

## 🎯 Success Criteria

| Criterion | Status |
|-----------|--------|
| Clock in/out works without cloud | ✅ Must Work |
| Tags persist through refresh | ✅ Must Work |
| Cloud sync on authenticated clock-out | ✅ Must Work |
| localStorage as fallback | ✅ Must Work |
| Multi-device sync | ✅ Should Work |
| Offline sessions sync when online | ⏳ Optional |
| Real-time sync (no refresh needed) | ⏳ Future |
| Conflict resolution | ⏳ Not Implemented |

---

## 🔍 Monitoring & Logs

### Browser Console Watch
```javascript
// Add to WorkTrackerWidget.tsx for debugging:
useEffect(() => {
   console.log('Current sessions:', sessions);
   console.log('Active session:', currentSession);
   console.log('Authenticated:', !!user);
}, [sessions, currentSession, user]);

// Watch localStorage changes
window.addEventListener('storage', (e) => {
  console.log('localStorage changed:', e.key, e.newValue);
});
```

### Firestore Monitoring
```
1. Open Firebase Console
2. Firestore Database
3. Add Document Filter:
   - Collection: sessions
   - Field: userId
   - Operator: ==
   - Value: {current user UID}
4. Watch documents appear in real-time
```

---

## 📋 Production Checklist

Before deploying to production:

- [ ] All button operations tested
- [ ] Cloud sync working with real Firebase
- [ ] localStorage fallback verified
- [ ] Error messages user-friendly
- [ ] No sensitive data in console logs
- [ ] CORS configured for Firestore
- [ ] Security rules set correctly
- [ ] Google OAuth app configured
- [ ] Environment variables set
- [ ] Offline mode documented
- [ ] User guide created
- [ ] Support contact provided

---

**Document Version:** 1.0
**Last Updated:** January 5, 2026
**Maintained By:** PalPal Team
