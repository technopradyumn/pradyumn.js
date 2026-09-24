import { useCallback, useState } from "react";

export type UseToggleResult = [
  boolean,
  () => void,
  (forcedValue?: boolean) => void,
  () => void,
  () => void
];

/**
 * Quick boolean toggle hook.
 *
 * @example
 * const [isOpen, toggle, setToggle, open, close] = useToggle(false);
 */
export function useToggle(initialValue = false): UseToggleResult {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setToggle = useCallback(
    (forced?: boolean) => setValue(forced !== undefined ? forced : (v) => !v),
    []
  );
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, setToggle, setTrue, setFalse];
}
