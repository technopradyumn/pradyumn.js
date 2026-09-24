import type { ReactNode } from "react";
import { evaluate } from "../core/evaluate";
import type { RuleInput } from "../core/types";

export interface RuleProps {
  /**
   * The condition that controls rendering.
   *
   * - Pass a boolean for pre-evaluated conditions:
   *   `when={user.role === "admin"}`
   *
   * - Pass a function for composable, testable rules:
   *   `when={canEditDocument}`
   *   `when={all(() => user.isLoggedIn, () => !user.isBanned)}`
   *
   * On evaluation error the condition is treated as `false` (fail-closed).
   */
  when: RuleInput;
  /**
   * Rendered when `when` evaluates to `true`.
   */
  children: ReactNode;
  /**
   * Rendered when `when` evaluates to `false` (or on error).
   * Defaults to `null` (renders nothing).
   */
  fallback?: ReactNode;
}

/**
 * Conditionally renders `children` when `when` is truthy,
 * or `fallback` otherwise.
 *
 * @example
 * // Simple boolean
 * <Rule when={user.isLoggedIn} fallback={<Login />}>
 *   <Dashboard />
 * </Rule>
 *
 * @example
 * // Composable rule function
 * <Rule when={all(() => user.isLoggedIn, () => user.plan === "pro")}>
 *   <ProFeature />
 * </Rule>
 *
 * @remarks
 * Client-side rules control what the UI **shows**.
 * They are NOT authorization. Protect sensitive backend operations server-side.
 */
export function Rule({ when, children, fallback = null }: RuleProps): ReactNode {
  let result: boolean;

  try {
    result = evaluate(when);
  } catch {
    // Fail-closed: an evaluation error must never accidentally grant access.
    result = false;
  }

  return result ? children : fallback;
}
