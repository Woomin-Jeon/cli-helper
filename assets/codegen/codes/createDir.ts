/**
 * @description 디렉터리를 안전하게 생성하는 함수
 */
const createDir = (path: string) => {
  if (!fs.existsSync(path)) {
    try {
      fs.mkdirSync(path);
    } catch {
      const pathElements = path.split('/');
      const parentPath = pathElements.slice(0, pathElements.length - 1).join('/');

      createDir(parentPath);
      createDir(path);
    }
  }
};
