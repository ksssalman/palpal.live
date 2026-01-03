# Deployment Guide

This guide explains how to deploy PalPal.live to Firebase Hosting.

## Prerequisites

- Node.js (v18 or higher)
- Firebase CLI installed globally: `npm install -g firebase-tools`
- Firebase project access (project ID: `palpal-541342`)
- Firebase service account credentials (for CI/CD)
- Firebase configuration file (`firebase-config.js` - see setup below)

## Firebase Configuration Setup

Before deploying, you need to create a `firebase-config.js` file with your Firebase project settings:

1. Copy the template:
   ```bash
   cp firebase-config.template.js firebase-config.js
   ```

2. Get your Firebase config from [Firebase Console](https://console.firebase.google.com):
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Copy the configuration object

3. Update `firebase-config.js` with your actual values:
   ```javascript
   window.firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id",
     measurementId: "your-measurement-id"
   };
   ```

4. Copy it to the public directory:
   ```bash
   cp firebase-config.js public/
   ```

**Note**: `firebase-config.js` is gitignored for security. For production deployment, configure this file via Firebase Hosting or environment variables.

## Deployment Architecture

PalPal.live uses Firebase Hosting with multiple targets:

1. **Main Site** (`palpal-live` target)
   - Serves from: `public/` directory
   - Includes: Landing page, authentication, shared services
   - URL: https://palpal.live

2. **Work Tracker** (`work-tracker` target)
   - Serves from: `projects/work-tracker/` directory
   - Includes: Built work tracker application
   - URL: https://work-tracker.palpal.live
   - Note: Custom domain must be configured in Firebase Console (Hosting > Add custom domain)

## Custom Domain Setup

To configure the custom domain for work tracker:

1. Go to [Firebase Console](https://console.firebase.google.com) > Hosting
2. Select the `work-tracker-36911` site
3. Click "Add custom domain"
4. Enter `work-tracker.palpal.live`
5. Follow the DNS verification steps
6. Add the required DNS records to your domain provider

Once configured, the work tracker will be accessible at https://work-tracker.palpal.live

## Local Testing

Test the site locally before deploying:

```bash
# Install dependencies
npm ci

# Validate deployment files
npm run validate

# Start Firebase emulator
firebase serve
```

Visit http://localhost:5000 to test the site locally.

## Manual Deployment

To deploy manually from your local machine:

```bash
# 1. Validate all files are present
npm run build

# 2. Login to Firebase (first time only)
firebase login

# 3. Deploy to hosting
npm run deploy
```

This will deploy both the main site and work tracker to their respective hosting targets.

### Deploy Specific Targets

Deploy only the main site:
```bash
firebase deploy --only hosting:palpal-live
```

Deploy only the work tracker:
```bash
firebase deploy --only hosting:work-tracker
```

## Automated Deployment (GitHub Actions)

Deployments are automated via GitHub Actions:

### On Pull Request
- Workflow: `.github/workflows/firebase-hosting-pull-request.yml`
- Triggers: When a PR is opened or updated
- Action: Creates a preview channel for testing
- Preview URL is posted as a comment on the PR

### On Merge to Main
- Workflow: `.github/workflows/firebase-hosting-merge.yml`
- Triggers: When code is merged to `main` branch
- Action: Deploys to production (live site)
- Deploys to the `live` channel

### Required Secrets

The following GitHub secrets must be configured:
- `FIREBASE_SERVICE_ACCOUNT_PALPAL_541342`: Service account key for Firebase deployment
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

## Build Process

The build process validates that all required deployment files exist:

```bash
npm run build
```

This runs `scripts/validate-deployment.mjs` which checks for:
- Main site files in `public/`
- Work tracker files in `projects/work-tracker/`
- All necessary assets and scripts

### Required Files

**Main Site (`public/`)**:
- `index.html` - Landing page
- `auth.html` - Authentication page
- `firebase-auth.js` - Auth utilities
- `firebase-db.js` - Database utilities
- `projects/shared/` - Shared services and styles

**Work Tracker (`projects/work-tracker/`)**:
- `index.html` - Application entry point
- `assets/` - Built application assets (JS, CSS)
- `vite.svg` - Favicon

## Updating Work Tracker

The work tracker source code is maintained in a separate repository. To update it:

1. Build the work tracker from its source repository:
   ```bash
   cd /path/to/work-tracker-repo
   npm run build
   ```

2. Copy the `dist/` contents to `projects/work-tracker/`:
   ```bash
   cp -r dist/* /path/to/palpal.live/projects/work-tracker/
   ```

3. Commit and push the changes:
   ```bash
   cd /path/to/palpal.live
   git add projects/work-tracker/
   git commit -m "Update work tracker build"
   git push
   ```

4. The GitHub Actions workflow will automatically deploy the changes.

## Docker Deployment

For local development with Docker:

```bash
# Build and run
docker compose up --build

# Access at http://localhost:8080
```

See [DOCKER_INSTRUCTIONS.md](DOCKER_INSTRUCTIONS.md) for more details.

## Troubleshooting

### Build fails with missing files

Run the validation script to see which files are missing:
```bash
npm run validate
```

### Firebase deploy fails

1. Check that you're logged in: `firebase login`
2. Verify project ID: `firebase use --add`
3. Check Firebase console for any quota or permission issues

### Work tracker not loading

1. Check that all asset files are present in `projects/work-tracker/assets/`
2. Verify the paths in `projects/work-tracker/index.html` match the actual file names
3. Check browser console for errors

### GitHub Actions deployment fails

1. Verify the `FIREBASE_SERVICE_ACCOUNT_PALPAL_541342` secret is configured
2. Check that the service account has necessary permissions in Firebase Console
3. Review the workflow run logs in GitHub Actions

## Security Considerations

- Never commit `firebase-config.js` with actual credentials
- Use environment variables for sensitive configuration
- Firebase security rules enforce user data isolation
- All deployments require proper authentication

## Support

For issues or questions:
- Check existing [Issues](https://github.com/ksssalman/palpal.live/issues)
- Review [Firebase Hosting documentation](https://firebase.google.com/docs/hosting)
- See [SECURITY.md](SECURITY.md) for security-related concerns
