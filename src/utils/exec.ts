import { execSync } from 'child_process';

export const exec = (command: string) => {
  try {
    execSync(command);
  } catch (error: any) {
    const childProcessErrorMessage = error.stderr.toString();
    console.error(childProcessErrorMessage);
  }
};
