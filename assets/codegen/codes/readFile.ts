/**
 * @description 파일을 안전하게 읽는 함수
 */
const readFile = (path: string) => {
  try {
    return fs.readFileSync(path, 'utf-8');
  } catch {
    return null;
  }
};
