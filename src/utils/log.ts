import path from 'path';
import fs from 'fs';
import { exec } from './exec';

export const getLogInfo = () => {
  const tempPath = path.resolve(__dirname, 'temp.log.txt');

  exec(`git log -n 3 > ${tempPath}`);
  const fileData = fs.readFileSync(tempPath, { encoding: 'utf-8' });
  fs.unlinkSync(tempPath);

  return {
    log: fileData,
  };
};
