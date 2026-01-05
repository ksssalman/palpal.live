# Security Policy

## Overview

This document outlines the security practices and policies for the PalPal project, including credential management, dependency vulnerabilities, and secure development guidelines.

## 1. Credential Management

### Environment Variables

- **Never commit credentials** to the repository
- Always use environment variables for sensitive data (API keys, tokens, passwords)
- Use `.env` files locally (gitignored)
- Use GitHub Secrets for CI/CD pipelines

### Firebase Credentials

- Store all Firebase configuration in `.env` file
- Use `.env.example` as a template with placeholder values
- Rotate credentials immediately if exposed
- Use project-specific credentials - never share across projects

### Git Configuration

```bash
# Verify .env and sensitive files are in .gitignore
git check-ignore .env
git check-ignore firebase-config.js

# Never add ignored files forcefully
# NEVER use: git add -f .env
```

## 2. Secrets Management

### GitHub Secrets

For CI/CD pipelines and deployments:

1. Go to Repository → Settings → Secrets and variables → Actions
2. Add secrets for:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_MEASUREMENT_ID`

### Accessing Secrets in GitHub Actions

```yaml
- name: Build with Firebase
  env:
    VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
    VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
    # ... other secrets
  run: npm run build
```

## 3. Code Review Requirements

### Branch Protection Rules

Enable on the `main` branch:

1. **Require pull request reviews before merging**

   - Dismiss stale pull request approvals when new commits are pushed
   - Require code review from CODEOWNERS
   - Require at least 1 approval

2. **Require status checks to pass**

   - Require branches to be up to date before merging
   - Require security scanning to pass
   - Require all required checks to pass

3. **Require conversation resolution before merging**

4. **Signed commits (Optional but Recommended)**
   - Signing commits with a GPG key is recommended but not required
   - Helps verify commit authenticity
   - See setup instructions below if you want to enable it

### Commit Signing (Optional)

GPG commit signing is **optional** for this repository. However, if you want to sign your commits for added security:

```bash
# Generate a GPG key (if you don't have one)
gpg --full-generate-key

# List your GPG keys
gpg --list-secret-keys --keyid-format=long

# Configure Git to sign commits
git config --global commit.gpgsign true
git config --global user.signingkey YOUR_GPG_KEY_ID

# Or sign individual commits
git commit -S -m "Your commit message"

# Add your GPG public key to GitHub
# 1. Export: gpg --armor --export YOUR_GPG_KEY_ID
# 2. GitHub Settings → SSH and GPG keys → New GPG key
```

**Troubleshooting GPG Issues:**

If you encounter GPG signing errors and don't want to use it, you can disable it:

```bash
# Disable for this repository
git config commit.gpgsign false

# Or disable globally
git config --global commit.gpgsign false
```

## 4. Dependency Security

### Regular Updates

- Run `npm audit` regularly to check for vulnerabilities
- Update dependencies: `npm update`
- Review and merge Dependabot PRs

### Vulnerability Scanning

Enable GitHub's dependency scanning:

1. Go to Repository → Settings → Code security and analysis
2. Enable:
   - Dependency graph
   - Dependabot alerts
   - Dependabot security updates
   - Secret scanning
   - Code scanning (if available in your plan)

### Checking for Vulnerabilities

```bash
# Audit dependencies
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Check specific package
npm audit --json | grep vulnerability_name
```

## 5. Access Control

### Team Permissions

- **Maintain**: Can manage, but not delete repository
- **Write**: Can write, but not manage repository settings
- **Read**: Can read and pull, but not push

### Two-Factor Authentication (2FA)

- Required for all contributors with write access
- Set up at https://github.com/settings/security

## 6. Secure Development Practices

### Before Committing

```bash
# Check for staged secrets
git diff --staged | grep -i "api_key\|password\|token\|secret"

# Use pre-commit hooks
# Create .git/hooks/pre-commit to prevent credential commits
```

### Pre-commit Hook Example

Create `.git/hooks/pre-commit` (executable):

```bash
#!/bin/bash
# Prevent commits containing credentials

files_to_check=$(git diff --cached --name-only)
forbidden_patterns=("apiKey" "password" "token" "secret" "FIREBASE_API_KEY")

for file in $files_to_check; do
    for pattern in "${forbidden_patterns[@]}"; do
        if git diff --cached "$file" | grep -q "$pattern"; then
            echo "❌ Error: Potential credential found in $file"
            echo "Do not commit credentials. Use .env files instead."
            exit 1
        fi
    done
done

exit 0
```

### Code Quality

- Run linters before committing
- Use ESLint for JavaScript/TypeScript
- Format code with Prettier
- Run tests before pushing

## 7. Incident Response

### If Credentials Are Exposed

1. **Immediately:**

   - Rotate all exposed credentials in Firebase Console
   - Remove the commit history using `git filter-branch` or `git filter-repo`
   - Force push to repository (requires admin permissions)

2. **Steps to Remove from History:**

```bash
# Remove a file from all git history
git filter-branch --tree-filter 'rm -f firebase-config.js' HEAD

# Or use git filter-repo (faster, safer)
git filter-repo --path firebase-config.js

# Force push to remove from remote
git push origin --force --all
```

3. **Notify:**
   - Alert all team members
   - Audit Firebase project activity logs
   - Monitor for unauthorized access

## 8. Third-Party Security

### Trusted Dependencies Only

- Verify packages before installing
- Check package downloads and popularity
- Review GitHub reputation of maintainers
- Use `npm risk` to understand dependency risks

### Publishing

- Do not publish credentials in public repositories
- Use npm with private packages if needed
- Verify package integrity with checksums

## 9. Security Checklist

Before each release:

- [ ] All secrets are in environment variables
- [ ] No hardcoded API keys or tokens in code
- [ ] `.env` and `.env.*` are in `.gitignore`
- [ ] Dependencies are up to date with `npm audit` passing
- [ ] Code review completed
- [ ] Commits are signed
- [ ] No debugging console.logs with sensitive data
- [ ] HTTPS is enforced for all endpoints
- [ ] Firebase security rules are reviewed and appropriate
- [ ] No unintended files in git history

## 10. GitHub Repository Settings

### Essential Settings

1. **Repository → Settings → General**

   - Make repository private if needed
   - Disable allowing auto-merge if not using
   - Disable force pushes on default branch

2. **Repository → Settings → Branch protection rules**

   - Protect the `main` branch (see Branch Protection Rules)

3. **Repository → Settings → Code security and analysis**

   - Enable all available security features

4. **Repository → Settings → Actions**
   - Restrict GitHub Actions to approved actions

## 11. Resources

- [GitHub Security Documentation](https://docs.github.com/en/code-security)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## 12. Security Contacts

For security issues or vulnerabilities discovered:

- **Report privately**: Use GitHub Security Advisory
- **Email**: security@palpal.live (if applicable)
- **Do NOT** open public issues for security vulnerabilities

---

**Last Updated**: December 5, 2025
**Version**: 1.0
