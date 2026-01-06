# PalPal Project Structure

## Quick Reference

```
PalPal.live/
│
├── 📄 Root Configuration Files
│   ├── package.json              - Project dependencies
│   ├── .env                      - Environment variables (Git ignored)
│   ├── .env.example              - Template for .env
│   ├── firebase.json             - Firebase configuration
│   ├── firestore.rules           - Firestore security rules
│   ├── docker-compose.yml        - Docker compose config
│   ├── Dockerfile                - Docker configuration
│   └── nginx.conf                - Nginx configuration
│
├── 📁 public/                    - Public landing page and shared assets
│   ├── index.html                - Main landing page
│   ├── about.html                - About page
│   ├── auth.html                 - Authentication page
│   ├── index.css                 - ⚠️ DEPRECATED - use css/main.css
│   │
│   ├── 📁 css/                   - Modular CSS files
│   │   ├── main.css              - Entry point (imports all)
│   │   ├── base.css              - Reset and base styles
│   │   ├── navbar.css            - Navigation bar
│   │   ├── mobile-menu.css       - Mobile menu
│   │   ├── typography.css        - Fonts and text
│   │   ├── buttons.css           - Button components
│   │   ├── projects.css          - Projects section
│   │   ├── footer.css            - Footer
│   │   └── responsive.css        - Media queries
│   │
│   ├── 📁 js/                    - JavaScript modules
│   │   ├── app-init.js           - Application initializer
│   │   │
│   │   ├── 📁 modules/           - Core modules
│   │   │   ├── index.js          - Module reference docs
│   │   │   ├── config.js         - Firebase config
│   │   │   ├── auth.js           - Authentication
│   │   │   ├── database.js       - Firestore operations
│   │   │   ├── navigation.js     - Page navigation UI
│   │   │   ├── mobile-menu.js    - Mobile menu component
│   │   │   ├── nav-auth.js       - Navigation auth UI
│   │   │   └── utils.js          - Shared utilities
│   │   │
│   │   └── 📁 pages/             - Page-specific scripts (future)
│   │
│   ├── 📁 assets/                - Images, icons, fonts
│   │   └── logo.png
│   │
│   └── 📁 projects/              - Project links (symlinks to /projects)
│
├── 📁 projects/                  - Multi-project workspace
│   ├── INTEGRATION_GUIDE.md      - How to integrate with public
│   │
│   ├── 📁 shared/                - Shared code across projects
│   │   ├── palpal-auth.js        - Shared auth helpers
│   │   ├── palpal-db.js          - Shared database helpers
│   │   └── styles.css            - Shared styles
│   │
│   └── 📁 work-tracker/          - Work tracking application
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
│       ├── 📁 src/               - Source code
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   ├── AppWithAuth.tsx
│       │   ├── index.css
│       │   ├── 📁 components/
│       │   ├── 📁 utils/
│       │   ├── 📁 types/
│       │   └── 📁 assets/
│       └── 📁 public/
│
├── 📁 .github/                   - GitHub configuration
│   └── workflows/                - CI/CD workflows
│
├── 📁 .vscode/                   - VS Code settings
│
├── 📄 Documentation Files
│   ├── README.md                 - Project overview
│   ├── MODULARIZATION_GUIDE.md   - This modularization guide
│   ├── SETUP_PROGRESS.md         - Setup tracking
│   ├── CONTRIBUTING.md           - Contributing guidelines
│   ├── SECURITY.md               - Security guidelines
│   ├── firebase-setup-guide.md   - Firebase setup
│   ├── DOCKER_INSTRUCTIONS.md    - Docker setup
│   └── SUBDOMAIN_DEPLOYMENT.md   - Deployment guide
│
└── 🔗 Configuration Files
    ├── palpal.live.code-workspace - VS Code workspace
    ├── .gitignore
    ├── .firebaserc
    └── CNAME
```

## Key Directories Explained

### /public
The main landing page and public-facing assets. This is deployed to the root domain.

**What's here:**
- Landing page (index.html)
- CSS modules
- Shared JavaScript modules
- Firebase configuration
- Public assets (images, etc.)

### /projects
Multi-project workspace for different applications.

**What's here:**
- work-tracker/ - Time tracking application
- shared/ - Code shared across all projects

### Key Files

| File | Purpose |
|------|---------|
| `package.json` | Root dependencies and scripts |
| `.env.example` | Template for environment variables |
| `firebase.json` | Firebase project configuration |
| `firestore.rules` | Database security rules |
| `Dockerfile` | Container image definition |
| `docker-compose.yml` | Multi-container orchestration |
| `nginx.conf` | Web server configuration |

## Module Loading Order

```
1. HTML Page Load
2. Firebase SDK (async)
3. Modules (in dependency order):
   - config.js
   - auth.js
   - database.js
   - utils.js
   - navigation.js
   - mobile-menu.js
   - nav-auth.js
4. app-init.js (orchestrator)
```

## Development Workflow

### Common Tasks

**Working on landing page:**
```bash
# Edit HTML
→ public/index.html

# Edit CSS
→ public/css/*.css
→ Update in public/css/main.css

# Edit JavaScript
→ public/js/modules/*.js
→ Update loading order in index.html
```

**Working on work-tracker:**
```bash
cd projects/work-tracker
npm install
npm run dev
```

**Shared code:**
```bash
# Used by all projects
→ projects/shared/
```

## Important Notes

⚠️ **Deprecated Files** - Don't use these anymore:
- ❌ `public/firebase-config.js` → Use `public/js/modules/config.js`
- ❌ `public/firebase-auth.js` → Use `public/js/modules/auth.js`
- ❌ `public/firebase-db.js` → Use `public/js/modules/database.js`
- ❌ `public/index.css` → Use `public/css/main.css`

✅ **Best Practices**:
- Always use modular files
- Keep modules focused on single responsibility
- Use environment variables for secrets
- Follow the load order in index.html
- Update this guide when changing structure

## Need Help?

See `MODULARIZATION_GUIDE.md` for detailed documentation on each module.
