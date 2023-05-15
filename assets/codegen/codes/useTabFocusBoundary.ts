/**
 * @description 접근성을 위해 특정 엘리먼트에 대한 포커스를 다시 잡아주는 훅
 */
type FocusableElement = HTMLButtonElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
const FOCUSABLE_ELEMENT_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface UseTabFocusBoundaryParams {
  deps?: DependencyList
}

export const useTabFocusBoundary = ({ deps = [] }: UseTabFocusBoundaryParams = {}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const focusableElements = Array.from(element.querySelectorAll(FOCUSABLE_ELEMENT_SELECTOR)) as FocusableElement[];

    const handleKeydown = (e: KeyboardEvent) => {
      const isTabPressed = e.key === 'Tab';
      const isTabPressedWithShift = isTabPressed && e.shiftKey;
      if (!isTabPressed) {
        return;
      }

      const focus = (element?: FocusableElement) => {
        e.preventDefault();
        element?.focus();
      };

      const currentActiveElementIndex = focusableElements.findIndex((element) => element === document.activeElement);
      const currentActiveElement = focusableElements[currentActiveElementIndex];

      if (isTabPressedWithShift) {
        if (!currentActiveElement) {
          const lastFocusableElement = focusableElements[focusableElements.length - 1];
          focus(lastFocusableElement);
          return;
        }

        const isFirstElementFocused = currentActiveElementIndex === 0;
        if (isFirstElementFocused) {
          const lastFocusableElement = focusableElements[focusableElements.length - 1];
          focus(lastFocusableElement);
          return;
        }

        const prevActiveElement = focusableElements[currentActiveElementIndex - 1];
        focus(prevActiveElement);
      } else {
        if (!currentActiveElement) {
          const firstFocusableElement = focusableElements[0];
          focus(firstFocusableElement);
          return;
        }

        const isLastElementFocused = currentActiveElementIndex === focusableElements.length - 1;
        if (isLastElementFocused) {
          const firstFocusableElement = focusableElements[0];
          focus(firstFocusableElement);
          return;
        }

        const nextActiveElement = focusableElements[currentActiveElementIndex + 1];
        focus(nextActiveElement);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, deps);

  return ref;
};
