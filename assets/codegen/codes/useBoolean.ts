const useBoolean = (
  initialState = false,
): [
  boolean,
  () => void,
  () => void
] => {
  const [state, setState] = useState(initialState);

  const handleStateToTrue = useCallback(() => setState(true), []);
  const handleStateToFalse = useCallback(() => setState(false), []);

  return useMemo(() => [state, handleStateToTrue, handleStateToFalse], [state]);
};
