import { spawn } from 'child_process';
import { createWriteStream } from 'fs';
import { join } from 'path';

const logStream = createWriteStream('build_node.log');

console.log('Starting build...');

const build = spawn('cmd.exe', ['/c', 'gradlew.bat', 'assembleDebug'], {
  cwd: process.cwd(),
  stdio: ['ignore', 'pipe', 'pipe']
});

build.stdout.pipe(logStream);
build.stderr.pipe(logStream);

build.on('close', (code) => {
  console.log(`Build exited with code ${code}`);
  logStream.end();
});

build.on('error', (err) => {
  console.error('Failed to start build process:', err);
  logStream.write(`Failed to start: ${err.message}\n`);
  logStream.end();
});
