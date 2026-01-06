# PalPal Project Modularization Guide

## Project Structure

```
public/
├── css/                          # Modular CSS files
│   ├── main.css                  # Entry point (imports all)
│   ├── base.css                  # Reset and base styles
│   ├── navbar.css                # Navigation bar styles
│   ├── mobile-menu.css           # Mobile menu component
│   ├── typography.css            # Typography and logo styles
│   ├── buttons.css               # All button components
│   ├── projects.css              # Projects section styles
│   ├── footer.css                # Footer styles
│   └── responsive.css            # Media queries
│
├── js/                           # JavaScript modules
│   ├── app-init.js               # Application initializer
│   ├── modules/                  # Core modules
│   │   ├── index.js              # Module exports reference
│   │   ├── config.js             # Firebase configuration
│   │   ├── auth.js               # Authentication module
│   │   ├── database.js           # Firestore database module
│   │   ├── navigation.js         # Page navigation UI
│   │   ├── mobile-menu.js        # Mobile menu component
│   │   ├── nav-auth.js           # Navigation auth UI
│   │   └── utils.js              # Shared utilities
│   │
│   └── pages/                    # Page-specific scripts (future)
│
├── index.html                    # Main landing page
├── auth.html                     # Authentication page
├── about.html                    # About page
├── index.css                     # Deprecated - use css/main.css
├── firebase-*.js                 # Deprecated - use modules
│
└── assets/                       # Images, icons, etc.

projects/
├── shared/                       # Shared modules across projects
│   ├── palpal-auth.js           # Shared auth utilities
│   ├── palpal-db.js             # Shared database utilities
│   └── styles.css               # Shared styles
│
└── work-tracker/                # Work tracker project
    ├── src/
    ├── vite.config.ts
    └── package.json
```

## Module Dependencies

### Load Order

1. **Firebase SDK** (async, from CDN)
2. **Configuration** - `config.js`
3. **Core Modules** - `auth.js`, `database.js`, `utils.js`
4. **UI Modules** - `navigation.js`, `mobile-menu.js`, `nav-auth.js`
5. **App Initializer** - `app-init.js`

### Module Relationships

```
FirebaseConfig
    ↓
FirebaseAuth ← Uses config
    ↓
NavAuthentication ← Uses FirebaseAuth
    ↓
AppInitializer ← Orchestrates all modules
    ↑
UINavigation ← Standalone UI module
MobileMenu ← Standalone UI module
PalPalUtils ← Standalone utilities
```

## Module Documentation

### FirebaseConfig (config.js)

**Purpose:** Centralized Firebase configuration management

**Class Methods:**
- `getConfig()` - Get Firebase configuration object
- `isValid()` - Check if configuration is valid
- `getEnvVar(key)` - Get environment variable

**Usage:**
```javascript
const config = new FirebaseConfig();
if (config.isValid()) {
  // Firebase is properly configured
}
```

### FirebaseAuth (auth.js)

**Purpose:** All authentication operations with error handling

**Static Methods:**
- `signup(email, password)` - Create new account
- `login(email, password)` - Sign in with email
- `signInWithGoogle()` - Google OAuth
- `signInWithFacebook()` - Facebook OAuth
- `logout()` - Sign out user
- `getCurrentUser()` - Get current user
- `onAuthStateChanged(callback)` - Listen for auth changes
- `resetPassword(email)` - Send password reset email
- `handleAuthError(error)` - Convert errors to user-friendly messages

**Usage:**
```javascript
try {
  const user = await FirebaseAuth.login(email, password);
  console.log('Logged in:', user.uid);
} catch (error) {
  console.error(error.message); // User-friendly error
}
```

### FirebaseDatabase (database.js)

**Purpose:** All Firestore database operations

**Static Methods:**
- `addDocument(collection, data)` - Create document
- `getDocument(collection, docId)` - Fetch single doc
- `getAllDocuments(collection)` - Fetch all docs
- `updateDocument(collection, docId, data)` - Update doc
- `deleteDocument(collection, docId)` - Delete doc
- `queryDocuments(collection, field, op, value)` - Query with condition
- `onDocumentUpdate(collection, docId, callback)` - Real-time updates
- `onCollectionUpdate(collection, callback)` - Listen to collection
- `batchWrite(collection, documents)` - Write multiple docs
- `getPaginatedDocuments(collection, pageSize, startAfter)` - Pagination

**Usage:**
```javascript
const workEntries = await FirebaseDatabase.getAllDocuments('work_entries');
const unsubscribe = FirebaseDatabase.onDocumentUpdate('users', userId, (data) => {
  console.log('User data updated:', data);
});
```

### UINavigation (navigation.js)

**Purpose:** Page navigation and section visibility

**Methods:**
- `goToProjects()` - Navigate to projects section
- `goToHome()` - Navigate to home section
- `getCurrentPage()` - Get current page

**Usage:**
```javascript
const nav = new UINavigation();
nav.goToProjects(); // Navigate to projects
```

### MobileMenu (mobile-menu.js)

**Purpose:** Mobile menu toggle and interactions

**Methods:**
- `toggle()` - Toggle menu visibility
- `open()` - Open menu
- `close()` - Close menu
- `getIsOpen()` - Check if menu is open

**Usage:**
```javascript
const menu = new MobileMenu();
menu.toggle(); // Toggle menu
```

### NavAuthentication (nav-auth.js)

**Purpose:** Update authentication UI in navigation

**Methods:**
- `updateNavAuth(user)` - Update UI based on user state
- `renderUserMenu(user)` - Show signed-in user menu
- `renderSignInButton()` - Show sign-in button
- `handleSignOut()` - Handle sign-out action

**Usage:**
```javascript
const navAuth = new NavAuthentication();
// Automatically updates UI when auth state changes
```

### PalPalUtils (utils.js)

**Purpose:** Shared utility functions

**Static Methods:**
- `debounce(func, delay)` - Debounce function calls
- `throttle(func, delay)` - Throttle function calls
- `formatDate(date)` - Format date string
- `formatTime(date)` - Format time string
- `getTimeDifference(start, end)` - Calculate time difference
- `isValidEmail(email)` - Validate email
- `validatePassword(password)` - Check password strength
- `getFromStorage(key, default)` - Read from localStorage
- `saveToStorage(key, value)` - Write to localStorage
- `removeFromStorage(key)` - Delete from localStorage
- `showNotification(msg, type, duration)` - Show notification
- `navigate(url)` - Navigate safely

**Usage:**
```javascript
const isValid = PalPalUtils.isValidEmail('user@example.com');
const diff = PalPalUtils.getTimeDifference(startTime, endTime);
PalPalUtils.saveToStorage('userPrefs', { theme: 'dark' });
```

## Migration from Old Structure

### Old Files → New Location

| Old File | New Location | Notes |
|----------|--------------|-------|
| `firebase-config.js` | `js/modules/config.js` | Refactored as class |
| `firebase-auth.js` | `js/modules/auth.js` | Refactored as static class |
| `firebase-db.js` | `js/modules/database.js` | Refactored as static class |
| Inline scripts in `index.html` | `js/modules/navigation.js`, `mobile-menu.js`, `nav-auth.js` | Extracted to modules |
| Inline styles in `index.html` | `css/main.css` | Moved to external CSS |

### Deprecated Files

The following files are now deprecated and should not be used:
- ❌ `firebase-config.js`
- ❌ `firebase-auth.js`
- ❌ `firebase-db.js`
- ❌ `index.css`

Use the new modular structure instead.

## Adding New Modules

### Create a New Module

1. Create file in `public/js/modules/`
2. Use class or static methods
3. Add JSDoc comments
4. Export for module systems

```javascript
/**
 * New Module Description
 */

class NewModule {
  static methodName() {
    // Implementation
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NewModule;
}
```

4. Update `app-init.js` to initialize if needed
5. Update load order in `index.html`

## Performance Optimization

### Current Optimizations

- ✅ Modular code - Load only what you need
- ✅ Lazy initialization - Modules initialize on demand
- ✅ Separated concerns - Each module has single responsibility
- ✅ Utility consolidation - Shared code in utils module
- ✅ CSS modularization - Faster CSS loading with import

### Future Optimizations

- 🔄 Implement code splitting for different pages
- 🔄 Add service worker for offline support
- 🔄 Minify and bundle modules
- 🔄 Lazy load Firebase SDK
- 🔄 Add performance monitoring

## Development Best Practices

### When Adding Features

1. ✅ Create in appropriate module
2. ✅ Add JSDoc comments
3. ✅ Handle errors gracefully
4. ✅ Use PalPalUtils for common tasks
5. ✅ Test across browsers and devices

### When Fixing Bugs

1. ✅ Find the responsible module
2. ✅ Fix in that module only
3. ✅ Add error handling
4. ✅ Update related tests

### Code Style

- Use consistent naming: `camelCase` for functions/variables, `PascalCase` for classes
- Add JSDoc comments for public methods
- Keep methods focused and single-responsibility
- Handle errors with try-catch and meaningful messages

## Environment Variables

All Firebase config should use environment variables:

```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
VITE_FIREBASE_MEASUREMENT_ID=xxx
```

See `.env.example` for complete template.

## Testing

When testing modules:

```javascript
// Test FirebaseAuth
try {
  const user = await FirebaseAuth.login('test@example.com', 'password');
  console.log('✓ Login successful');
} catch (error) {
  console.error('✗ Login failed:', error);
}

// Test UINavigation
const nav = new UINavigation();
nav.goToProjects();
console.log(nav.getCurrentPage()); // 'projects'
```

## Troubleshooting

### Issue: "FirebaseAuth is not defined"

**Solution:** Ensure `js/modules/auth.js` is loaded before using it.

```html
<script src="js/modules/config.js"></script>
<script src="js/modules/auth.js"></script>
```

### Issue: Firebase SDK not loading

**Solution:** Check that Firebase SDK scripts are loaded from CDN:

```html
<script src="/__/firebase/10.7.0/firebase-app-compat.js"></script>
<script src="/__/firebase/10.7.0/firebase-auth-compat.js"></script>
```

### Issue: Auth state listener not working

**Solution:** Ensure `nav-auth.js` is loaded and initialized:

```html
<script src="js/modules/nav-auth.js"></script>
<script src="js/app-init.js"></script>
```

## Support

For issues or questions about the modular structure, refer to this guide or check the module's JSDoc comments.
