# PalPal.live Ecosystem

PalPal.live is a modular ecosystem of productivity tools designed to help you organize and track your daily life, one moment at a time.

## 🚀 Overview

The PalPal ecosystem provides a unified platform for various micro-applications, featuring:
- **Unified Authentication**: Single sign-on across the entire ecosystem.
- **Shared Data Layer**: Seamless data persistence and synchronization.
- **Modular Design**: Independent applications that work together or standalone.
- **Modern User Experience**: Premium glassmorphism design system.

## 🛠️ The Workspace

The project is structured to serve multiple sub-applications under a primary domain.

### Primary Domain: [palpal.live](https://palpal.live)
The main site serves as the gateway to the ecosystem, providing project discovery and centralized authentication.

### Sub-Applications
- **Work Tracker**: A robust time tracking tool with "Local Mode" for privacy and "Cloud Sync" for multi-device productivity.

---

## 💻 Tech Stack

- **Frontend**: Vanilla HTML/JS, React, TypeScript
- **Styling**: Modern CSS (Glassmorphism)
- **Backend/Hosting**: Firebase (Hosting, Auth, Firestore)
- **Build Tools**: Vite

---

## ⚡ Quick Start

### Standard Setup
1. Clone the repository.
2. Configure your Firebase settings in `firebase-config.js`.
3. Deploy to Firebase Hosting:
   ```bash
   firebase deploy
   ```

### Docker Setup
The ecosystem is container-ready. To run the entire platform locally:
```bash
docker compose up --build
```
Access the application at `http://localhost:8080`.

---

## 🔒 Security

We prioritize your data security and privacy:
- **Mandatory Email Verification**: All cloud accounts require a verified email.
- **Data Isolation**: Firestore rules ensure that you only ever access your own data.
- **Standalone Privacy**: Tools like Work Tracker support "Local Mode", keeping your data entirely within your browser.

---

© 2025 PalPal.live - Moment by Moment.
