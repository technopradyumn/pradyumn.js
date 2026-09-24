import type { RuleInput } from "./types";

/**
 * Evaluates a `RuleInput` and returns its boolean result.
 *
 * - If `rule` is a boolean, it is returned as-is.
 * - If `rule` is a function, it is called and its return value is returned.
 *
 * This function does NOT catch errors. Callers are responsible for error
 * handling so that their own error semantics (log, fallback, rethrow) are
 * preserved. The safe default for UI permission rules is to catch and return
 * `false` (fail-closed).
 *
 * @throws Re-throws any error thrown by the rule function.
 */
export function evaluate(rule: RuleInput): boolean {
  if (typeof rule === "boolean") {
    return rule;
  }
  return rule();
}
