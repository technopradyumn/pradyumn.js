import { useEffect, useRef, useState } from "react";

/**
 * Throttles any value so it only updates at most once in every interval limit.
 */
export function useThrottle<T>(value: T, interval = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (Date.now() >= lastExecuted.current + interval) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [value, interval]);

  return throttledValue;
}
