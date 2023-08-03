import { execSync, spawnSync } from 'child_process';

export const exec = (command: string) => {
  try {
    execSync(command);
  } catch (error: any) {
    const childProcessErrorMessage = error.stderr.toString();
    console.error(childProcessErrorMessage);
  }
};

export const spawn = (command: string) => {
  const [cmd, ...args] = command.split(' ');

  try {
    spawnSync(cmd, args, { stdio: 'inherit' });
  } catch (error: any) {
    const childProcessErrorMessage = error.stderr.toString();
    console.error(childProcessErrorMessage);
  }
};
