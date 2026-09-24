import { useEffect, useState } from "react";
import { Signal } from "../core/signals";

/**
 * Subscribes a React component to a Signal.
 * Causes re-render only when the signal value actually changes.
 *
 * @example
 * const count = signal(0);
 * function Counter() {
 *   const value = useSignal(count);
 *   return <button onClick={() => count.update(c => c + 1)}>{value}</button>;
 * }
 */
export function useSignal<T>(sig: Signal<T>): T {
  const [value, setValue] = useState<T>(() => sig.get());

  useEffect(() => {
    return sig.subscribe(setValue);
  }, [sig]);

  return value;
}
