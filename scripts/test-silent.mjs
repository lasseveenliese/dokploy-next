import { spawn } from 'node:child_process';

const steps = [
  { name: 'build', command: 'npm', args: ['run', '-s', 'build'] },
  { name: 'format:check', command: 'npm', args: ['run', '-s', 'format:check'] },
  { name: 'lint', command: 'npm', args: ['run', '-s', 'lint'] },
  { name: 'typecheck', command: 'npm', args: ['run', '-s', 'typecheck'] },
];

const runStep = (step) =>
  new Promise((resolve) => {
    const child = spawn(step.command, step.args, {
      shell: false,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let output = '';
    child.stdout.on('data', (chunk) => {
      output += chunk;
    });
    child.stderr.on('data', (chunk) => {
      output += chunk;
    });

    child.on('close', (code) => {
      resolve({ code, output });
    });
  });

const main = async () => {
  for (const step of steps) {
    const { code, output } = await runStep(step);
    if (code !== 0) {
      console.error(`[test] ${step.name} failed`);
      const trimmed = output.trim();
      if (trimmed) {
        console.error(trimmed);
      }
      process.exit(code || 1);
    }
  }

  console.log('[test] all checks passed');
};

main().catch((error) => {
  console.error('[test] unexpected error');
  if (error?.stack) {
    console.error(error.stack);
  } else if (error) {
    console.error(String(error));
  }
  process.exit(1);
});
