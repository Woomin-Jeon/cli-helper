const ONE_SECOND = 1000;

export type TimerStatus = 'INITIAL' | 'RUNNING' | 'END'

export const useTimer = ({ endTime, forceEnd, onEnd }: { endTime: Date; forceEnd?: boolean; onEnd?: () => void }) => {
  const initialRestMiliseconds = useMemo(() => endTime.getTime() - Date.now(), [endTime]);

  const [restMiliseconds, setRestMiliseconds] = useState(initialRestMiliseconds);
  const [status, setStatus] = useState<TimerStatus>(() => (initialRestMiliseconds <= 0 ? 'END' : 'INITIAL'));

  useEffect(() => {
    if (status === 'END') {
      onEnd?.();
    }
  }, [onEnd, status]);

  useEffect(() => {
    if (status === 'END' || forceEnd) {
      return;
    }

    setStatus('RUNNING');

    const intervalId = setInterval(() => {
      const restMiliseconds = endTime.getTime() - Date.now();

      if (restMiliseconds < 1) {
        clearInterval(intervalId);
        setStatus('END');
      }

      setRestMiliseconds(restMiliseconds);
    }, ONE_SECOND);

    return () => {
      clearInterval(intervalId);
    };
  }, [endTime, status, forceEnd, restMiliseconds]);

  return { restMiliseconds, status };
};
