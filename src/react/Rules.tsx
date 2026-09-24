import type { ReactNode } from "react";
import { all, any } from "../core/combinators";
import type { RuleInput } from "../core/types";

/**
 * Props for `<Rules>` when using the `all` (AND) mode.
 * Exactly one of `all` or `any` must be provided — enforced at the type level.
 */
interface RulesAllProps {
  /** All rules in this array must pass. Logical AND. */
  all: RuleInput[];
  any?: never;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Props for `<Rules>` when using the `any` (OR) mode.
 */
interface RulesAnyProps {
  /** At least one rule in this array must pass. Logical OR. */
  any: RuleInput[];
  all?: never;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * The `RulesProps` discriminated union enforces that exactly one group
 * (`all` or `any`) is provided. TypeScript will reject `{ all: [...], any: [...] }`.
 * This eliminates ambiguous multi-group combinations at compile time.
 */
export type RulesProps = RulesAllProps | RulesAnyProps;

/**
 * Combines multiple rules and conditionally renders `children`.
 *
 * Sugar over `<Rule when={all(...)} />` or `<Rule when={any(...)} />`.
 *
 * @example
 * // All rules must pass
 * <Rules all={[() => user.isLoggedIn, () => user.emailVerified]}>
 *   <Account />
 * </Rules>
 *
 * @example
 * // At least one rule must pass
 * <Rules
 *   any={[() => user.role === "admin", () => user.role === "editor"]}
 *   fallback={<AccessDenied />}
 * >
 *   <EditButton />
 * </Rules>
 *
 * @example
 * // Combine with not():
 * <Rules all={[() => user.isLoggedIn, not(() => user.isBanned)]}>
 *   <Feed />
 * </Rules>
 *
 * @remarks
 * Equivalent patterns:
 * ```tsx
 * <Rules all={[ruleA, ruleB]} />
 * <Rule when={all(ruleA, ruleB)} />
 * ```
 * Both are correct. Use whichever is more readable.
 */
export function Rules({
  all: allRules,
  any: anyRules,
  fallback = null,
  children,
}: RulesProps): ReactNode {
  let result: boolean;

  try {
    if (allRules !== undefined) {
      result = all(...allRules)();
    } else {
      // anyRules must be defined here — guaranteed by the discriminated union.
      result = any(...anyRules)();
    }
  } catch {
    // Fail-closed: evaluation errors never accidentally grant access.
    result = false;
  }

  return result ? children : fallback;
}
