const hash = (str: unknown[]) => str.join('');

export const makeSequantialSubGroups = (array: unknown[], options: { minSubGroupLength?: number } = {}) => {
  const subGroups = [];

  const minSubGroupLength = options.minSubGroupLength ?? 0;

  for (let i = 0; i < array.length; i += 1) {
    for (let j = i; j < array.length; j += 1) {
      const start = i;
      const end = j + 1;
      const distance = end - start;

      if (distance < minSubGroupLength) {
        continue;
      }

      subGroups.push(array.slice(start, end));
    }
  }

  return subGroups;
};

export const createSubGroupKeys = (search: string) => {
  const words = search.split(' ');

  const subGroups = words.flatMap((word) => makeSequantialSubGroups(word.split(''), { minSubGroupLength: 2 }));
  const subGroupKeys = subGroups.map(hash);

  return subGroupKeys;
};

export const createSearchEngine = <V>(params: {
  pool: V[]
  id: (value: V) => string
  keyword: (value: V) => string
}) => {
  const data = params.pool.map((value) => ({
    id: params.id(value),
    keyword: params.keyword(value),
  }));

  const searchBaseData = data.map(({ id, keyword }) => {
    const subGroupKeys = createSubGroupKeys(keyword);

    return { id, subGroupKeys };
  });

  return {
    search: (searchKeyword: string) => {
      const searchKeywordSubGroupKeys = createSubGroupKeys(searchKeyword);

      const result = searchBaseData.map((baseData) => {
        const allSubGroupKeys = [
          ...new Set(baseData.subGroupKeys).values(),
          ...new Set(searchKeywordSubGroupKeys).values(),
        ];
        const deduplicatedSubGroupKeySet = new Set(allSubGroupKeys);

        const matchedCount = allSubGroupKeys.length - deduplicatedSubGroupKeySet.size;

        return { id: baseData.id, score: matchedCount };
      });

      const maxScore = Math.max(...result.map((v) => v.score));

      return {
        ids: maxScore > 0 ? result.filter((v) => v.score === maxScore).map((v) => v.id) : [],
      };
    },
  };
};
