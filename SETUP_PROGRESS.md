# Subdomain Setup Complete - Next Steps

## ✅ Completed

The following changes have been made to enable work-tracker.palpal.live:

### 1. Updated Build Configuration
- Modified `projects/work-tracker/package.json` to build two versions:
  - `build:subdirectory` → `/projects/work-tracker/` base path
  - `build:subdomain` → `/` base path (root)
- Main `build` script now calls both

### 2. Updated Firebase Configuration
- Added new hosting target `work-tracker-subdomain` in `firebase.json`
- Points to `projects/work-tracker/dist-subdomain` for subdomain builds
- Updated `.firebaserc` to map the new target

### 3. Created Documentation
- `SUBDOMAIN_DEPLOYMENT.md` - Complete setup and troubleshooting guide
- Updated `README.md` with subdomain information

---

## ⚠️ Still Required (Manual Steps)

To activate the subdomain, you **must complete these steps**:

### Step 1: Build the Project
```bash
cd projects/work-tracker
npm install
npm run build
```

This creates:
- `dist/` - subdirectory version
- `dist-subdomain/` - subdomain version

### Step 2: Configure DNS
Add a CNAME record in your DNS provider:

| Type | Name | Value |
|------|------|-------|
| CNAME | `work-tracker` | `work-tracker-subdomain.web.app` |

**DNS Provider Examples:**
- **Cloudflare**: DNS records → Add record
- **Route53** (AWS): Create record → CNAME
- **GoDaddy**: DNS settings → Add CNAME record

### Step 3: Configure Firebase Custom Domain
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project `palpal-541342`
3. Navigate to **Hosting → Domains**
4. Click **Add custom domain**
5. Enter: `work-tracker.palpal.live`
6. Follow verification steps (usually verify DNS propagation)

### Step 4: Deploy
```bash
firebase deploy --only hosting
```

Or specifically:
```bash
firebase deploy --only hosting:palpal-live,hosting:work-tracker,hosting:work-tracker-subdomain
```

---

## 📋 Files Modified

1. `firebase.json` - Added work-tracker-subdomain target
2. `.firebaserc` - Added subdomain target mapping
3. `projects/work-tracker/package.json` - Added dual build scripts
4. `README.md` - Added subdomain information
5. **NEW**: `SUBDOMAIN_DEPLOYMENT.md` - Complete setup guide

---

## ✅ After Deployment

Both URLs will be active:
- `https://palpal.live/projects/work-tracker/` ✅
- `https://work-tracker.palpal.live/` ✅ (after DNS/Firebase setup)

Users can access Work Tracker from either location with the same authentication and data.
