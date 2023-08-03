/**
 * @description path에 대해 디렉터리인지 확인하는 함수
 */
export const isDirectory = (path: string) => {
  try {
    const stat = fs.statSync(path);
    return stat.isDirectory();
  } catch (err) {
    return false;
  }
};
