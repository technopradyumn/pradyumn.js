import { useEffect, useState } from "react";

/**
 * Hook for subscribing to CSS media queries.
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 768px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQueryList = window.matchMedia(query);
    const updateMatches = (e: MediaQueryListEvent) => setMatches(e.matches);

    setMatches(mediaQueryList.matches);

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", updateMatches);
      return () => mediaQueryList.removeEventListener("change", updateMatches);
    } else {
      // Legacy fallback
      mediaQueryList.addListener(updateMatches);
      return () => mediaQueryList.removeListener(updateMatches);
    }
  }, [query]);

  return matches;
}
