import { spawn } from 'node:child_process';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const testResultsDir = path.resolve(projectRoot, 'test-results');
const playwrightCommand = process.execPath;
const playwrightCli = path.join(projectRoot, 'node_modules', 'playwright', 'cli.js');
const args = [playwrightCli, 'test', ...process.argv.slice(2)];

function isProjectTestResultsDir(target) {
  return target === testResultsDir && target.startsWith(`${projectRoot}${path.sep}`);
}

async function cleanTestResults() {
  if (!isProjectTestResultsDir(testResultsDir)) {
    throw new Error(`Refusing to delete unexpected path: ${testResultsDir}`);
  }

  await rm(testResultsDir, { recursive: true, force: true });
}

const child = spawn(playwrightCommand, args, {
  cwd: projectRoot,
  stdio: 'inherit',
});

child.on('close', async (code) => {
  let exitCode = code ?? 1;

  try {
    await cleanTestResults();
  } catch (error) {
    exitCode = exitCode || 1;
    console.error(error);
  }

  process.exit(exitCode);
});
