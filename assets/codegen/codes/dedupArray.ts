/**
 * @description 객체를 요소로 갖는 배열에 대해 인자로 받는 key를 기반으로 중복 제거된 배열을 반환하는 함수
 */
const dedupArray = <T extends { [key: string]: any }, K extends keyof T>(array: T[], key: K) => {
  const data: T[] = [];
  const flags = [];

  for (let i = 0; i < array.length; i += 1) {
    if (flags[array[i][key]]) continue;
    flags[array[i][key]] = true;
    data.push(array[i]);
  }

  return data;
};
