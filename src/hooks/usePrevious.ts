import { useEffect, useRef } from "react";

/**
 * Tracks and returns the previous value of any state or prop.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
