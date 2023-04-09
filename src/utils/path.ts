import fs from 'fs';
import { isDirectory } from './file';

export const mergePath = (p1: string, p2: string) => `${p1}/${p2}`;

export const getParentPath = (currentPath: string) => {
  const pathArray = currentPath.split('/');
  const parentPath = pathArray.slice(0, pathArray.length - 1).join('/');

  if (!parentPath) {
    return null;
  }

  return parentPath;
};

export const getChildDirPathes = (currentPath: string) => {
  const dirs = fs.readdirSync(currentPath);
  return dirs.map((dir) => mergePath(currentPath, dir)).filter(isDirectory);
};
