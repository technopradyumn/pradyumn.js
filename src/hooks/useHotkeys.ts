import { useEffect } from "react";

/**
 * Global keyboard shortcut listener hook.
 *
 * @example
 * useHotkeys("ctrl+k", () => openSearchModal());
 * useHotkeys("Escape", () => closeModal());
 */
export function useHotkeys(
  shortcut: string,
  callback: (e: KeyboardEvent) => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const parts = shortcut.toLowerCase().split("+").map((s) => s.trim());

    const handleKeyDown = (e: KeyboardEvent) => {
      const matchCtrl = parts.includes("ctrl") ? e.ctrlKey || e.metaKey : true;
      const matchShift = parts.includes("shift") ? e.shiftKey : true;
      const matchAlt = parts.includes("alt") ? e.altKey : true;

      const nonModifierKey = parts.find(
        (p) => p !== "ctrl" && p !== "meta" && p !== "shift" && p !== "alt"
      );

      const matchKey =
        !nonModifierKey ||
        e.key.toLowerCase() === nonModifierKey ||
        e.code.toLowerCase() === nonModifierKey;

      if (matchCtrl && matchShift && matchAlt && matchKey) {
        e.preventDefault();
        callback(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcut, callback, enabled]);
}
