import { useEffect, useRef } from "react";

/**
 * Updates document title on mount/change, and optionally restores the original title on unmount.
 */
export function useDocumentTitle(title: string, restoreOnUnmount = true): void {
  const previousTitle = useRef<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (previousTitle.current === null) {
      previousTitle.current = document.title;
    }

    document.title = title;

    return () => {
      if (restoreOnUnmount && previousTitle.current !== null) {
        document.title = previousTitle.current;
      }
    };
  }, [title, restoreOnUnmount]);
}
