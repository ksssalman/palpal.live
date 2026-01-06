# Session Functionality Overview

The **Work Tracker** session logic is centralized within `TimeTrackerWidget.tsx`. It manages the lifecycle of work sessions, including creation, modification, persistence, and synchronization with the cloud.

## 1. Session Lifecycle

### Start Session (Clock In)
- **Function**: `clockIn()`
- **Action**: Creates a new `TimeEntry` object.
  - `id`: Current timestamp (`Date.now()`).
  - `clockIn`: Current ISO string.
  - `clockOut`: `null` (indicates active session).
  - `tags`: Empty array.
- **State Update**: Sets `currentEntry` state, which triggers a UI update to show the active timer customization view.
- **Persistence**: `currentEntry` is automatically saved to `localStorage` ('currentEntry') via a `useEffect` hook to survive page reloads.

### Modification (Adding Tags)
- **Functions**: `addTag()`, `removeTag()`
- **Action**: Modifies the `tags` array of the `currentEntry` object.
- **State Update**: Replaces `currentEntry` with the updated object.

### End Session (Clock Out)
- **Function**: `clockOut()`
- **Action**:
  - Updates `currentEntry` with a `clockOut` timestamp (ISO string).
  - Moves the completed entry from `currentEntry` state to the `entries` array (history).
  - Clears `currentEntry` state (sets to `null`).
- **Persistence**:
  - **Local**: `entries` array is saved to `localStorage` ('timeEntries').
  - **Cloud**: If the user is authenticated, the finished entry is immediately uploaded to Firestore via `bridge.saveItem('work-tracker', 'sessions', completedEntry)`.

### Deletion
- **Function**: `deleteEntry(id)`
- **Action**: Removes the entry from the local `entries` state.
- **Cloud Sync**: If authenticated, calls `bridge.deleteItem` to remove the corresponding document from Firestore.

## 2. Data Persistence Strategy

The system uses a **Hybrid Persistence Model**:

1.  **Local Storage (First-Class Citizen)**:
    -   `currentEntry`: Ensures the active timer is never lost during browser refreshes or crashes.
    -   `timeEntries`: Maintains a full copy of history locally for offline access or guest users.
    -   `work_tracker_timezone`: Stores user preference locally.

2.  **Cloud Sync (Firebase)**:
    -   **On Load**: If authenticated, the app prioritizes fetching data from Firestore (`bridge.getAllItems`).
    -   **On Save**: Completed sessions are pushed to the cloud.
    -   **On Delete**: Removed from cloud.
    -   **UserProfile**: Settings like 'timezone' are stored in a dedicated user profile document.

## 3. Timezone Awareness [New]

-   **State**: Managed via `timezone` state variable.
-   **Source**: Defaults to system timezone (`Intl.DateTimeFormat().resolvedOptions().timeZone`), but can be overridden by user settings.
-   **Logic**: All timestamps are stored in **UTC (ISO 8601)**. Timezone conversions happen **only at the view layer** (formatting functions `formatTime`, `formatDate`) using the selected timezone. This ensures data integrity regardless of where the user is located.

## 4. Verification

-   [x] **Clock In**: Correctly initializes local state; survives refresh.
-   [x] **Clock Out**: Moves to history; triggers cloud sync.
-   [x] **Tags**: Can be added/removed dynamically; persisted with session.
-   [x] **Delete**: Removes from both local and cloud.
-   [x] **Timezone**: "Clocked In" time and "Current Time" correctly reflect the selected timezone offset.
