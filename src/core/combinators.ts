import type { RuleInput, RuleFn } from "./types";
import { evaluate } from "./evaluate";

/**
 * Returns a rule that passes only when **every** supplied rule passes.
 * Equivalent to logical AND.
 *
 * Short-circuits on the first failing rule (same semantics as `Array.every`).
 *
 * Vacuous truth: `all()` with no arguments returns `true`.
 *
 * @example
 * const rule = all(
 *   () => user.isLoggedIn,
 *   () => user.plan === "pro",
 * );
 * // use standalone
 * rule(); // boolean
 *
 * // or compose into <Rule>
 * <Rule when={all(() => a, () => b)}>...</Rule>
 */
export function all(...rules: RuleInput[]): RuleFn {
  return () => rules.every((rule) => evaluate(rule));
}

/**
 * Returns a rule that passes when **at least one** supplied rule passes.
 * Equivalent to logical OR.
 *
 * Short-circuits on the first passing rule (same semantics as `Array.some`).
 *
 * Vacuous falsehood: `any()` with no arguments returns `false`.
 *
 * @example
 * const rule = any(
 *   () => user.role === "admin",
 *   () => user.role === "editor",
 * );
 */
export function any(...rules: RuleInput[]): RuleFn {
  return () => rules.some((rule) => evaluate(rule));
}

/**
 * Returns a rule that inverts the result of the given rule.
 * Equivalent to logical NOT.
 *
 * @example
 * const rule = not(() => user.isBanned);
 * // passes only when user is NOT banned
 *
 * // Combine with all/any:
 * <Rules all={[() => user.isLoggedIn, not(() => user.isBanned)]}>
 */
export function not(rule: RuleInput): RuleFn {
  return () => !evaluate(rule);
}
