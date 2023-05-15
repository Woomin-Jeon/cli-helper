export const useGetBoundingClientRectEffect = (
  ref: RefObject<HTMLElement>,
  callback: (rect: DOMRect) => void,
  dependencyList: DependencyList = [],
) => {
  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      callback({} as DOMRect);
      return;
    }

    const rect = element.getBoundingClientRect();
    callback(rect);
  }, dependencyList);
};
