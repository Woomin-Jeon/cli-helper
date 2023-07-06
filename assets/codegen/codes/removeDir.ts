/**
 * @description 디렉터리를 안전하게 제거하는 함수
 */
const removeDir = (dirPath: string) => {
  try {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);

      if (fs.statSync(filePath).isDirectory()) {
        removeDir(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });

    fs.rmdirSync(dirPath);
  } catch {
    //
  }
};
