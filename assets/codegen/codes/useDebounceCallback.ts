const createDebounce = <P extends unknown[]>() => {
  let timerId: any = null;

  return (callback: (...params: P) => void, ms: number) => (...params: P) => {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      callback(...params);
    }, ms);
  };
};

export const useDebounceCallback = <P extends unknown[]>(
  callback: (...params: P) => void,
  ms: number,
  dependencyList: DependencyList = [],
) => {
  const debounce = useMemo(() => createDebounce<P>(), []);

  return useCallback(debounce(callback, ms), dependencyList);
};
