import fs from 'fs';
import { getParentPath, getChildDirPathes } from './path';

export const isDirectory = (path: string) => fs.lstatSync(path).isDirectory();

export const findFileByASC = (fileName: string, currentDir: string): string | null => {
  const hasFile = fs.readdirSync(currentDir).find((v) => v === fileName);
  if (hasFile) {
    return `${currentDir}/${fileName}`;
  }

  const parentPath = getParentPath(currentDir);
  if (!parentPath) {
    return null;
  }

  return findFileByASC(fileName, parentPath);
};

export const findFilesByDESC = (fileName: string, currentDir: string): string[] => {
  const hasFile = fs.readdirSync(currentDir).find((v) => v === fileName);
  if (hasFile) {
    return [`${currentDir}/${fileName}`];
  }

  const childPathes = getChildDirPathes(currentDir);
  if (childPathes.length === 0) {
    return [];
  }

  return childPathes.flatMap((childPath: string) => findFilesByDESC(fileName, childPath));
};

export const parseJSONFile = (path: string) => {
  try {
    const jsonFile = fs.readFileSync(path, 'utf-8');
    return JSON.parse(jsonFile);
  } catch {
    return null;
  }
};

export const readFile = (filePath: string) => new Promise<string>((resolve, reject) => {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    err ? reject(err) : resolve(data);
  });
});

export const readBulkFiles = (filePathes: string[]) => Promise.all(filePathes.map((filePath) => readFile(filePath)));

export const readDirectory = (dirPath: string) => new Promise<string[]>((resolve, reject) => {
  fs.readdir(dirPath, (err, files) => {
    if (err) reject(err);

    resolve(files);
  });
});

export const writeFile = (filePath: string, data:string) => new Promise((resolve, reject) => {
  fs.writeFile(filePath, data, (err) => {
    if (err) reject(err);

    resolve(true);
  });
});
