import { spawn } from 'child_process';

const MAX_OS_COPY_COMMAND = 'pbcopy';

export const clipboard = {
  copy: (text: string) => {
    const child = spawn(MAX_OS_COPY_COMMAND);
    child.stdin.end(Buffer.from(text, 'utf-8'));
  },
};
