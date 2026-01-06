# Subdomain Deployment Guide

## Overview

Work Tracker is now configured to be deployed to **both**:
- **Subdirectory**: `palpal.live/projects/work-tracker/`
- **Subdomain**: `work-tracker.palpal.live`

This guide explains the setup and how to complete the deployment.

## Architecture

### Build Configuration

The build process now creates two separate builds:

```
npm run build
├── npm run build:subdirectory  → dist/ (base path: /projects/work-tracker/)
└── npm run build:subdomain     → dist-subdomain/ (base path: /)
```

### Firebase Hosting Targets

Two Firebase hosting targets are configured in `firebase.json`:

```json
{
  "target": "work-tracker",
  "public": "projects/work-tracker/dist",
  ...
}
```

```json
{
  "target": "work-tracker-subdomain",
  "public": "projects/work-tracker/dist-subdomain",
  ...
}
```

## Setup Instructions

### Step 1: Ensure Dependencies Are Installed

```bash
cd projects/work-tracker
npm install
```

### Step 2: Build Both Versions

```bash
npm run build
```

This will generate:
- `projects/work-tracker/dist/` - For subdirectory deployment
- `projects/work-tracker/dist-subdomain/` - For subdomain deployment

### Step 3: Configure DNS for Subdomain (One-time)

To activate `work-tracker.palpal.live`, you need to add a DNS CNAME record:

**In your DNS provider (e.g., Cloudflare, Route53, GoDaddy):**

| Type | Name | Value |
|------|------|-------|
| CNAME | `work-tracker` | `work-tracker-subdomain.web.app` |

Or if using a subdomain wildcard:

| Type | Name | Value |
|------|------|-------|
| CNAME | `*.palpal.live` | `palpal-541342.web.app` |

### Step 4: Configure Custom Domain in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project `palpal-541342`
3. Navigate to **Hosting** → **Domains**
4. Click **Add custom domain**
5. Enter `work-tracker.palpal.live`
6. Follow Firebase's verification steps

### Step 5: Deploy

**Deploy all targets:**

```bash
firebase deploy --only hosting
```

**Or deploy specific targets:**

```bash
# Deploy main domain + subdirectory
firebase deploy --only hosting:palpal-live,hosting:work-tracker

# Deploy subdomain only
firebase deploy --only hosting:work-tracker-subdomain
```

## Verification

After deployment, verify both URLs work:

- ✅ `https://palpal.live/projects/work-tracker/`
- ✅ `https://work-tracker.palpal.live/`

Both should serve the same application with identical functionality.

## Environment Variables

The build uses `VITE_BASE_PATH` environment variable:

```bash
# For subdirectory build
VITE_BASE_PATH=/projects/work-tracker/ npm run build:subdirectory

# For subdomain build
VITE_BASE_PATH=/ npm run build:subdomain
```

## Troubleshooting

### Subdomain not resolving

1. Verify DNS CNAME record is set correctly
2. Allow 24-48 hours for DNS propagation
3. Check Firebase custom domain settings

### Build fails

```bash
# Clear build artifacts
rm -rf dist/ dist-subdomain/ node_modules/
npm install
npm run build
```

### Firebase deployment fails

```bash
# Re-authenticate
firebase logout
firebase login

# Verify configuration
firebase use palpal-541342
firebase target:list

# Deploy with verbose output
firebase deploy --only hosting --debug
```

## Development

For local development, use:

```bash
npm run dev
```

This uses the subdirectory base path by default (`/projects/work-tracker/`).

To test with subdomain paths:

```bash
VITE_BASE_PATH=/ npm run dev
```

## CI/CD Integration

If using GitHub Actions or similar, update your workflow to:

1. Build all targets: `npm run build`
2. Deploy all hosting targets: `firebase deploy --only hosting`

Example workflow snippet:

```yaml
- name: Build Work Tracker
  run: |
    cd projects/work-tracker
    npm install
    npm run build

- name: Deploy to Firebase Hosting
  run: firebase deploy --only hosting
```
