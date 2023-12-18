/**
 * @description 배열에서 특정 인덱스의 값을 타겟 인덱스로 옮기는 함수
 */
export const arrayMove = <T>(array: T[], from: number, to: number): T[] => {
  const newArray = array.slice();
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);

  return newArray;
};
