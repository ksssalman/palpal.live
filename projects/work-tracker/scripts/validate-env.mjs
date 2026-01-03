/**
 * Work Tracker Environment Validation
 * Checks that Firebase is properly configured before app loads
 */

import fs from "fs";

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

const required = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

let hasErrors = false;

console.log(`\n${colors.cyan}Work Tracker Environment Check${colors.reset}\n`);

if (!fs.existsSync(".env")) {
  console.log(`${colors.red}✗ Missing .env file${colors.reset}`);
  console.log(
    `${colors.yellow}  Create from .env.example: cp .env.example .env${colors.reset}`
  );
  hasErrors = true;
} else {
  const content = fs.readFileSync(".env", "utf-8");

  required.forEach((key) => {
    const regex = new RegExp(`^${key}=.+$`, "m");
    if (regex.test(content)) {
      console.log(`${colors.green}✓ ${key}${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ ${key} not configured${colors.reset}`);
      hasErrors = true;
    }
  });
}

console.log("");

if (hasErrors) {
  console.log(`${colors.red}Environment validation failed${colors.reset}`);
  process.exit(1);
} else {
  console.log(`${colors.green}Environment validation passed${colors.reset}\n`);
}
