import { useState } from "react";

export interface UseClipboardResult {
  hasCopied: boolean;
  copy: (text: string) => Promise<boolean>;
}

/**
 * Hook for copying text to the clipboard with automatic timeout reset for `hasCopied`.
 */
export function useClipboard(timeout = 2000): UseClipboardResult {
  const [hasCopied, setHasCopied] = useState(false);

  const copy = async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), timeout);
      return true;
    } catch {
      setHasCopied(false);
      return false;
    }
  };

  return { hasCopied, copy };
}
