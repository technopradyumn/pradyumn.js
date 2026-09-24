import { evaluate } from "../core/evaluate";
import type { RuleInput } from "../core/types";

/**
 * The result object returned by `useRule`.
 *
 * Errors are surfaced explicitly rather than swallowed, giving callers
 * the choice to log, display, or ignore them.
 */
export interface UseRuleResult {
  /**
   * The boolean result of the rule evaluation.
   * `false` when the rule fails OR when an error occurs (fail-closed).
   */
  result: boolean;
  /**
   * The error thrown during rule evaluation, or `null` if evaluation succeeded.
   */
  error: Error | null;
}

/**
 * Evaluates a rule synchronously inside a React component.
 *
 * The rule is re-evaluated on every render. For expensive rules,
 * stabilize the function reference with `useCallback`.
 *
 * @returns `{ result, error }` — errors are exposed, not swallowed.
 *
 * @example
 * const { result: isAdmin } = useRule(() => user.role === "admin");
 *
 * @example
 * // Observe errors
 * const { result, error } = useRule(canEditDocument);
 * if (error) console.error("[Rule error]", error);
 *
 * @remarks
 * Client-side rules are NOT authorization.
 * Protect sensitive backend operations server-side.
 */
export function useRule(rule: RuleInput): UseRuleResult {
  // Evaluate synchronously. Rules in v0.1 are always synchronous.
  // Memoization is intentionally omitted: rules are fast boolean expressions,
  // and memoizing by function reference would silently break non-memoized callers.
  // Callers who need memoization can use useCallback on their rule function.
  try {
    const result = evaluate(rule);
    return { result, error: null };
  } catch (err) {
    return {
      result: false, // fail-closed
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}
