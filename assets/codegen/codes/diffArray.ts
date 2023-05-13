/**
 * @description 두 배열에 대해 바뀐 부분을 반환하는 함수
 */
const diffArray = <T extends string | number>(aList: T[], bList: T[]) => {
  const aMap = aList.reduce<Record<T, boolean>>((map, cur) => ({ ...map, [cur]: true }), {} as any);
  const bMap = bList.reduce<Record<T, boolean>>((map, cur) => ({ ...map, [cur]: true }), {} as any);

  const removed: T[] = [];
  const remained: T[] = [];
  const created: T[] = [];

  const deduplicatedABList = [...new Set([...aList, ...bList]).values()];
  deduplicatedABList.forEach((v) => {
    if (aMap[v] && bMap[v]) {
      remained.push(v);
      return;
    }

    if (aMap[v] && !bMap[v]) {
      removed.push(v);
      return;
    }

    if (!aMap[v] && bMap[v]) {
      created.push(v);
    }
  });

  return { removed, remained, created };
};
