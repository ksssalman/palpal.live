#!/usr/bin/env node

/**
 * Validate deployment readiness
 * Checks that all required files exist for Firebase deployment
 */

import { existsSync, readdirSync } from 'fs';
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
];

// Check for asset files (they may have version hashes)
const requiredAssetPatterns = [
  { dir: 'projects/work-tracker/assets', pattern: /^index-.*\.css$/, description: 'Work Tracker CSS' },
  { dir: 'projects/work-tracker/assets', pattern: /^index-.*\.js$/, description: 'Work Tracker JS' },
];

console.log('🔍 Validating deployment files...\n');

let allValid = true;
const missingFiles = [];

// Check regular files
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

// Check for asset files with version hashes
for (const { dir, pattern, description } of requiredAssetPatterns) {
  const fullPath = resolve(dir);
  
  if (!existsSync(fullPath)) {
    console.error(`❌ Missing directory: ${dir}`);
    missingFiles.push(dir);
    allValid = false;
    continue;
  }
  
  const files = readdirSync(fullPath);
  const matchingFiles = files.filter(file => pattern.test(file));
  
  if (matchingFiles.length === 0) {
    console.error(`❌ Missing ${description} matching pattern ${pattern} in ${dir}`);
    missingFiles.push(`${dir}/${pattern}`);
    allValid = false;
  } else {
    console.log(`✅ Found: ${dir}/${matchingFiles[0]} (${description})`);
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
