interface Options {
  ref: RefObject<HTMLElement>
  onHide?: () => void
  onShow?: () => void
}

export const useObserveHideElement = ({ ref, onHide, onShow }: Options, deps: DependencyList) => {
  useEffect(() => {
    if (ref.current) {
      const onIntersect = ([entry]: IntersectionObserverEntry[]) => {
        if (entry.intersectionRatio === 0) {
          onHide?.();
        }

        if (entry.isIntersecting) {
          onShow?.();
        }
      };
      const observer = new IntersectionObserver(onIntersect, { threshold: 0 });
      observer.observe(ref.current);
      return () => observer.disconnect();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
