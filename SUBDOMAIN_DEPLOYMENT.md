# Subdomain Deployment Guide

## Overview

Work Tracker is configured to be deployed exclusively to the subdomain:
- **Subdomain**: `work-tracker.palpal.live`

This dedicated subdomain deployment provides better isolation and independent deployment capabilities.

## Architecture

### Build Configuration

The build process creates a single output for subdomain deployment:

```
npm run build
└── dist/ (base path: /)
```

### Firebase Hosting Target

Single Firebase hosting target configured in `firebase.json`:

```json
{
  "target": "work-tracker",
  "public": "projects/work-tracker/dist",
  ...
}
```

## Setup Instructions

### Step 1: Ensure Dependencies Are Installed

```bash
cd projects/work-tracker
npm install
```

### Step 2: Build

```bash
npm run build
```

This generates:
- `projects/work-tracker/dist/` - For subdomain deployment

### Step 3: Configure DNS for Subdomain (One-time)

To activate `work-tracker.palpal.live`, add a DNS CNAME record:

**In your DNS provider (e.g., Cloudflare, Route53, GoDaddy):**

| Type | Name | Value |
|------|------|-------|
| CNAME | `work-tracker` | `work-tracker-132026.web.app` |

### Step 4: Configure Custom Domain in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project `palpal-541342`
3. Navigate to **Hosting** → **Domains**
4. Click **Add custom domain**
5. Enter `work-tracker.palpal.live`
6. Follow Firebase's verification steps

### Step 5: Deploy

**Deploy work-tracker hosting:**

```bash
firebase deploy --only hosting:work-tracker
```

**Or deploy all hosting targets:**

```bash
firebase deploy --only hosting
```

## Verification

After deployment, verify the subdomain works:

- ✅ `https://work-tracker.palpal.live/`

The application should load with full functionality.

## Environment Variables

The build uses a fixed base path of `/` for subdomain deployment.

No environment variables are required for standard deployment.

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

This serves the application at `http://localhost:5173/` with the correct base path for subdomain deployment.

## CI/CD Integration

If using GitHub Actions or similar, update your workflow to:

1. Build: `npm run build`
2. Deploy: `firebase deploy --only hosting`

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
