#!/usr/bin/env node

/**
 * Validate deployment readiness
 * Checks that all required files exist for Firebase deployment
 */

import { existsSync } from 'fs';
import { resolve } from 'path';

const requiredFiles = [
  // Main site files (served from public/)
  'public/index.html',
  'public/auth.html',
  'public/firebase-auth.js',
  'public/firebase-db.js',
  'public/projects/shared/palpal-auth.js',
  'public/projects/shared/palpal-db.js',
  'public/projects/shared/styles.css',
  
  // Work tracker files (served from projects/work-tracker/)
  'projects/work-tracker/index.html',
  'projects/work-tracker/assets/index-C4ghx7R1.css',
  'projects/work-tracker/assets/index-DaartGS0.js',
];

console.log('🔍 Validating deployment files...\n');

let allValid = true;
const missingFiles = [];

for (const file of requiredFiles) {
  const fullPath = resolve(file);
  const exists = existsSync(fullPath);
  
  if (!exists) {
    console.error(`❌ Missing: ${file}`);
    missingFiles.push(file);
    allValid = false;
  } else {
    console.log(`✅ Found: ${file}`);
  }
}

console.log('');

if (allValid) {
  console.log('✅ All required files are present. Ready for deployment!');
  process.exit(0);
} else {
  console.error(`❌ Deployment validation failed. ${missingFiles.length} file(s) missing.`);
  console.error('\nMissing files:');
  missingFiles.forEach(file => console.error(`  - ${file}`));
  process.exit(1);
}
