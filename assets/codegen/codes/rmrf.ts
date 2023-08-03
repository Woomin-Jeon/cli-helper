/**
 * @description 특정 디렉터리를 포함해서 그 하위의 모든 파일들을 제거하는 함수 = rm -rf
 */
const rmrf = (directoryPath: string) => {
  if (!fs.existsSync(directoryPath)) {
    return;
  }

  const files = fs.readdirSync(directoryPath);

  files.forEach((file: string) => {
    const currentPath = path.join(directoryPath, file);

    if (fs.lstatSync(currentPath).isDirectory()) {
      rmrf(currentPath);
    } else {
      fs.unlinkSync(currentPath);
    }
  });

  fs.rmdirSync(directoryPath);
};
