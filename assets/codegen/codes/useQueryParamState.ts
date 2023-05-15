interface Params<S> {
  initialState: S | (() => S)
  setQueryParamOnSetState: (state: S) => Record<string, string | undefined | null>
}

type SetStateActionFunction<T> = (prevState: T) => T
type SetStateAction<T> = T | SetStateActionFunction<T>
const isSetStateActionFunciton = <T>(
  setStateAction: SetStateAction<T>,
): setStateAction is SetStateActionFunction<T> => typeof setStateAction === 'function';

export const useQueryParamState = <S>({ initialState, setQueryParamOnSetState }: Params<S>) => {
  const router = useRouter();
  const [state, setState] = useState(initialState);

  const setQueryStringState = useCallback(
    (setStateAction: SetStateAction<S>) => {
      const { pathname, search } = window.location;
      const searchParams = new URLSearchParams(search);

      const updatedState = isSetStateActionFunciton(setStateAction) ? setStateAction(state) : setStateAction;

      const queryParams = setQueryParamOnSetState(updatedState);
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) {
          searchParams.set(key, value);
        } else {
          searchParams.delete(key);
        }
      });

      const queryStrings = searchParams.toString();
      const newPath = queryStrings ? `${pathname}?${queryStrings}` : pathname;

      router.replace(newPath, undefined, { shallow: true });
      setState(updatedState);
    },
    [router, setQueryParamOnSetState, state],
  );

  return useMemo<[state: S, setQueryStringState:(
    setStateAction: SetStateAction<S>) => void]>(
    () => [state, setQueryStringState],
    [setQueryStringState, state],
    );
};
