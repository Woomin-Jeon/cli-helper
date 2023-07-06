/**
 * @description 파일이름에 대해 주어진 현재 경로를 바탕으로 부모 디렉터리로 재귀적으로 올라가면서 찾는 함수
 */
const findFileByASC = (fileName: string, currentDir: string): string | null => {
  const getParentPath = (currentPath: string) => {
    const pathArray = currentPath.split('/');
    const parentPath = pathArray.slice(0, pathArray.length - 1).join('/');

    if (!parentPath) {
      return null;
    }

    return parentPath;
  };

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
