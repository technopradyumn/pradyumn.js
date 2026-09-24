import { ReactNode } from "react";
import { RuleInput } from "../core/types";
import { evaluate } from "../core/evaluate";

export interface ShowProps {
  /** Condition or zero-argument rule function */
  when: RuleInput;
  /** Optional fallback to render when condition is false */
  fallback?: ReactNode;
  /** Content to render when condition is true */
  children: ReactNode | (() => ReactNode);
}

/**
 * Declarative conditional rendering component.
 * Replaces `{condition && <Component />}` with explicit, readable JSX.
 *
 * @example
 * <Show when={isLoggedIn} fallback={<LoginButton />}>
 *   <UserProfile />
 * </Show>
 */
export function Show({ when, fallback = null, children }: ShowProps): ReactNode {
  let isTrue = false;
  try {
    isTrue = evaluate(when);
  } catch {
    isTrue = false;
  }

  if (isTrue) {
    return typeof children === "function" ? (children as () => ReactNode)() : children;
  }

  return fallback;
}
