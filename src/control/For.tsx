import { ReactNode } from "react";

export interface ForProps<T> {
  /** Array of items to iterate over */
  each: readonly T[] | null | undefined;
  /** Fallback to render if array is empty or null/undefined */
  fallback?: ReactNode;
  /** Render function for each item */
  children: (item: T, index: number) => ReactNode;
}

/**
 * Declarative list rendering component with built-in empty fallback.
 * Eliminates repetitive `{items.length > 0 ? items.map(...) : <Empty />}` patterns.
 *
 * @example
 * <For each={users} fallback={<p>No users found</p>}>
 *   {(user, index) => <UserCard key={user.id} user={user} />}
 * </For>
 */
export function For<T>({ each, fallback = null, children }: ForProps<T>): ReactNode {
  if (!each || each.length === 0) {
    return fallback;
  }

  return each.map((item, index) => children(item, index));
}
