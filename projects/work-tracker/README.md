# PalPal Work Tracker

A minimal, powerful time tracking application built with React, TypeScript, and Vite. Designed to help you optimize your productivity with ease.

## ✨ Features

- **Efficient Time Tracking**: Simple clock-in / clock-out interface.
- **Activity Tagging**: Categorizes your work sessions with custom tags.
- **Detailed Reports**: Export your data in CSV or JSON formats for analysis.
- **Dual Persistence**:
  - **Local Mode**: Complete privacy. Data is stored entirely in your browser's local storage.
  - **Cloud Sync**: Securely synchronize your data across devices using PalPal shared services.
- **Google Integration**: Quick cloud connection via Google Sign-In.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your Firebase credentials.
4. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production
To generate an optimized build:
```bash
npm run build
```
The assets will be available in the `dist/` directory.

---

## 🔒 Privacy & Security

Work Tracker is built with a "Privacy First" mindset. In **Local Mode**, no data ever leaves your computer. When you choose to use **Cloud Sync**, your data is protected by industry-standard Firebase security rules, ensuring it remains isolated and accessible only to you.

---

Part of the [PalPal.live](https://palpal.live) ecosystem.
