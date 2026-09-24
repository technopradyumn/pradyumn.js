import { Children, isValidElement, ReactElement, ReactNode } from "react";

export interface CaseProps<T> {
  /** Value to match against Switch value */
  is: T | T[] | ((val: T) => boolean);
  children: ReactNode | (() => ReactNode);
}

export function Case<T>({ children }: CaseProps<T>): ReactNode {
  return typeof children === "function" ? (children as () => ReactNode)() : children;
}

export interface DefaultProps {
  children: ReactNode | (() => ReactNode);
}

export function Default({ children }: DefaultProps): ReactNode {
  return typeof children === "function" ? (children as () => ReactNode)() : children;
}

export interface SwitchProps<T> {
  value: T;
  children: ReactNode;
}

/**
 * Declarative pattern-matching component in JSX.
 * Replaces nested ternaries with clean, expressive branches.
 *
 * @example
 * <Switch value={status}>
 *   <Case is="loading"><Spinner /></Case>
 *   <Case is="success"><Dashboard /></Case>
 *   <Case is={["error", "failed"]}><ErrorAlert /></Case>
 *   <Default><Welcome /></Default>
 * </Switch>
 */
export function Switch<T>({ value, children }: SwitchProps<T>): ReactNode {
  let defaultElement: ReactElement | null = null;
  const elements = Children.toArray(children) as ReactElement[];

  for (const child of elements) {
    if (!isValidElement(child)) continue;

    if (child.type === Default) {
      defaultElement = child;
      continue;
    }

    if (child.type === Case) {
      const { is, children: caseContent } = child.props as CaseProps<T>;
      let matches = false;

      if (typeof is === "function") {
        matches = (is as (v: T) => boolean)(value);
      } else if (Array.isArray(is)) {
        matches = is.includes(value);
      } else {
        matches = Object.is(value, is);
      }

      if (matches) {
        return typeof caseContent === "function"
          ? (caseContent as () => ReactNode)()
          : caseContent;
      }
    }
  }

  if (defaultElement) {
    const defaultContent = (defaultElement.props as DefaultProps).children;
    return typeof defaultContent === "function"
      ? (defaultContent as () => ReactNode)()
      : defaultContent;
  }

  return null;
}
