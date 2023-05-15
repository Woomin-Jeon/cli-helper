const IGNORE_Y_OFFSET = 50;
const IGNORE_X_OFFSET = 50;

export const PASS_TO_BLOCK_CLICK_EVENT = 'pass-to-blick-click-event';

export const useBlockClickEvent = () => {
  const blockElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blockClickEvent = (e: MouseEvent) => {
      const { target } = e;

      if (target instanceof HTMLButtonElement && target.classList.contains(PASS_TO_BLOCK_CLICK_EVENT)) {
        return;
      }

      if (IGNORE_Y_OFFSET < e.clientY || IGNORE_X_OFFSET < e.clientX) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const element = blockElementRef.current;
    element?.addEventListener('click', blockClickEvent, { capture: true });

    return () => element?.removeEventListener('click', blockClickEvent, { capture: true });
  }, []);

  return blockElementRef;
};
