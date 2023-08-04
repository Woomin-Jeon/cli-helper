import path from 'path';
import fs from 'fs';
import { exec } from './exec';

export const getCommitInfo = (options?: { size?: number }) => {
  const size = options?.size ?? 10;

  const tempPath = path.resolve(__dirname, 'temp.commits.txt');

  exec(`git log -n ${size} --pretty=format:"%s" > ${tempPath}`);
  const fileData = fs.readFileSync(tempPath, { encoding: 'utf-8' });
  fs.unlinkSync(tempPath);

  const commits = fileData.split('\n').map((commit) => commit.trim()).filter(Boolean);

  return {
    commits,
  };
};
