const createThrottle = <P extends unknown[]>() => {
  let waiting = false;

  return (callback: (...params: P) => void, ms: number) => (...params: P) => {
    if (waiting) {
      return;
    }

    callback(...params);
    waiting = true;
    setTimeout(() => {
      waiting = false;
    }, ms);
  };
};

export const useThrottleCallback = <P extends unknown[]>(
  callback: (...params: P) => void,
  ms: number,
  dependencyList: DependencyList = [],
) => {
  const throttle = useMemo(() => createThrottle<P>(), []);

  return useCallback(throttle(callback, ms), dependencyList);
};
