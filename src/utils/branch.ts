import path from 'path';
import fs from 'fs';
import { exec } from './exec';

export const getBranchInfo = () => {
  const tempPath = path.resolve(__dirname, 'temp.branches.txt');

  exec(`git branch > ${tempPath}`);
  const fileData = fs.readFileSync(tempPath, { encoding: 'utf-8' });
  fs.unlinkSync(tempPath);

  const branches = fileData.split('\n').map((branch) => branch.trim()).filter(Boolean);
  const headBranchIndex = branches.findIndex((branch) => branch.startsWith('*'));

  return {
    branches: branches.map((branch) => branch.replace(/\* /, '')),
    headBranchIndex,
  };
};
