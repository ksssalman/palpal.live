# Contributing to PalPal.live

Thank you for considering contributing to PalPal.live! This document provides guidelines and instructions for contributors.

## Getting Started

### Prerequisites

- **Git**: Version 2.x or higher
- **Node.js**: Version 20.x or higher
- **npm**: Version 10.x or higher
- **Firebase CLI**: Install with `npm install -g firebase-tools`

### Initial Setup

1. **Fork and Clone the Repository**

   First, fork the repository on GitHub by clicking the "Fork" button at the top right of the repository page.

   Then clone your fork:

   ```bash
   git clone https://github.com/YOUR_USERNAME/palpal.live
   cd palpal.live
   ```

   > **Note on Directory Naming**: We recommend cloning the project into a directory without spaces to avoid potential path conflicts with build tools. A PascalCase name like `PalPalLiveFiles` or `PalPalLive` is recommended for your workspace container.

2. **Configure Git (Required)**

   Before making any commits, configure your git identity:

   ```bash
   git config user.name "Your Name"
   git config user.email "your.email@example.com"
   ```

   > **Note**: These settings are required for all commits. VS Code and other git clients will fail without them.

3. **Install Dependencies**

   ```bash
   npm install
   cd projects/work-tracker && npm install
   ```

## Making Changes

### Development Workflow

1. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**

   - Write clean, maintainable code
   - Follow existing code style and conventions
   - Test your changes locally

3. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

   **Commit Message Format:**

   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

4. **Push Your Changes**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**

   Go to GitHub and create a pull request from your branch to the `main` branch.

## Common Issues

### Git Commits Failing in VS Code

If you're experiencing commit failures in VS Code, try these solutions:

#### Issue 1: Missing Git Configuration

**Error:** `Author identity unknown` or similar

**Solution:**

```bash
# Set your git identity (required)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Verify the configuration
git config --list | grep user
```

#### Issue 2: GPG Signing Errors

**Error:** `gpg failed to sign the data` or `failed to write commit object`

**Solution:**

GPG commit signing is **optional** for this repository. If you don't want to use GPG signing:

```bash
# Disable GPG signing for this repository
git config commit.gpgsign false

# Or globally
git config --global commit.gpgsign false
```

If you **want** to use GPG signing, follow these steps:

1. **Generate a GPG key** (if you don't have one):

   ```bash
   gpg --full-generate-key
   ```

2. **List your GPG keys**:

   ```bash
   gpg --list-secret-keys --keyid-format=long
   ```

3. **Configure git to use your GPG key**:

   ```bash
   git config user.signingkey YOUR_GPG_KEY_ID
   git config commit.gpgsign true
   ```

4. **Add your GPG key to GitHub**:
   - Copy your public key: `gpg --armor --export YOUR_GPG_KEY_ID`
   - Go to GitHub Settings → SSH and GPG keys → New GPG key
   - Paste your public key

#### Issue 3: VS Code Not Using Correct Git Configuration

**Solution:**

The repository includes `.vscode/settings.json` with recommended settings:

- Commit signing is disabled by default (`"git.enableCommitSigning": false`)
- Smart commits are enabled for easier workflow

If you're still having issues:

1. Restart VS Code
2. Check VS Code's Git output panel for specific errors
3. Try committing from the command line to isolate the issue

#### Issue 4: Line Ending Issues

**Error:** Files showing changes due to line endings

**Solution:**

```bash
# Configure git to handle line endings automatically
git config core.autocrlf true   # Windows
git config core.autocrlf input  # Mac/Linux
```

### Build Issues

#### Work Tracker Build Fails

```bash
cd projects/work-tracker
npm run build
```

Check for:

- Missing dependencies: `npm install`
- TypeScript errors: `npm run validate`
- Vite configuration issues

## Code Style Guidelines

### JavaScript/TypeScript

- Use modern ES6+ syntax
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing patterns in the codebase

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Handle errors gracefully

### CSS

- Use existing glassmorphism design patterns
- Maintain consistent spacing and colors
- Write mobile-responsive styles

## Testing

Before submitting a pull request:

1. **Run linting** (if applicable):

   ```bash
   cd projects/work-tracker && npm run lint
   ```

2. **Build the project**:

   ```bash
   npm run build:all
   ```

3. **Test locally**:
   ```bash
   npm run dev
   # or
   firebase serve
   ```

## Security

- **Never commit credentials** or sensitive data
- Use `.env` files for local secrets (they're gitignored)
- Review `SECURITY.md` for security best practices
- Report security vulnerabilities privately to the maintainers

## Documentation

- Update README.md if you add new features
- Update configuration documentation if you change settings
- Add code comments for complex logic
- Update this CONTRIBUTING.md if you find gaps

## Questions?

- Check existing issues and pull requests
- Create a new issue for bugs or feature requests
- Be respectful and follow the code of conduct

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing to PalPal.live! 🎉
