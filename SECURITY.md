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
