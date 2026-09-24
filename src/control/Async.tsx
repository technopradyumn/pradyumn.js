import { ReactNode, useEffect, useState } from "react";

export interface AsyncProps<T> {
  /** Promise or function returning a promise */
  promise: Promise<T> | (() => Promise<T>);
  /** Loading state component */
  loading?: ReactNode;
  /** Error state component */
  error?: (err: Error, retry: () => void) => ReactNode;
  /** Success render prop */
  children: (data: T) => ReactNode;
}

/**
 * Declarative component for resolving async promises with loading and error states.
 *
 * @example
 * <Async
 *   promise={() => fetchUser(id)}
 *   loading={<Spinner />}
 *   error={(err, retry) => <button onClick={retry}>Retry: {err.message}</button>}
 * >
 *   {(user) => <UserProfile user={user} />}
 * </Async>
 */
export function Async<T>({
  promise,
  loading = null,
  error,
  children,
}: AsyncProps<T>): ReactNode {
  const [data, setData] = useState<T | null>(null);
  const [err, setErr] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  const retry = () => setKey((k) => k + 1);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setErr(null);

    const activePromise = typeof promise === "function" ? promise() : promise;

    activePromise
      .then((result) => {
        if (isMounted) {
          setData(result);
          setIsLoading(false);
        }
      })
      .catch((caughtError: unknown) => {
        if (isMounted) {
          setErr(
            caughtError instanceof Error
              ? caughtError
              : new Error(String(caughtError))
          );
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [promise, key]);

  if (isLoading) return loading;
  if (err && error) return error(err, retry);
  if (err) return null;
  if (data !== null) return children(data);

  return null;
}
