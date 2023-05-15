interface Options {
  ref: RefObject<HTMLElement>
  callback: () => void
  threshold?: number
}

export const useObserveShowElement = ({ callback, ref, threshold = 1 }: Options, deps: DependencyList) => {
  useEffect(() => {
    if (ref.current) {
      const onIntersect = ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          callback();
        }
      };
      const observer = new IntersectionObserver(onIntersect, { threshold });
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, deps);
};

export const useImpression = <R extends HTMLElement = HTMLElement>({
  onImpression,
  ref: paramRef,
  threshold = 1,
}: {
  onImpression: () => void
  ref?: RefObject<R>
  threshold?: number
}) => {
  const _ref = useRef<R>(null);
  const hasAlreadyBeenShownRef = useRef(false);

  const ref = paramRef ?? _ref;

  useObserveShowElement(
    {
      ref,
      callback: () => {
        if (hasAlreadyBeenShownRef.current) {
          return;
        }

        onImpression();
        hasAlreadyBeenShownRef.current = true;
      },
      threshold,
    },
    [],
  );

  return ref;
};
