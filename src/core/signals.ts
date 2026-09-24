/**
 * Reactive Signal primitives for Pradyumn.js.
 * Ultra-simple, high-performance state management without dependency array bugs.
 */

export type Subscriber<T> = (value: T) => void;
export type Unsubscribe = () => void;

export interface Signal<T> {
  /** Get current value without subscribing */
  get(): T;
  /** Set a new value and notify all subscribers */
  set(newValue: T): void;
  /** Update value using a transform function */
  update(fn: (prev: T) => T): void;
  /** Subscribe to value changes */
  subscribe(fn: Subscriber<T>): Unsubscribe;
}

/**
 * Creates a reactive signal.
 *
 * @example
 * const count = signal(0);
 * count.get(); // 0
 * count.set(1);
 * count.update(n => n + 1);
 */
export function signal<T>(initialValue: T): Signal<T> {
  let value = initialValue;
  const subscribers = new Set<Subscriber<T>>();

  return {
    get() {
      return value;
    },
    set(newValue: T) {
      if (!Object.is(value, newValue)) {
        value = newValue;
        subscribers.forEach((fn) => fn(value));
      }
    },
    update(fn: (prev: T) => T) {
      this.set(fn(value));
    },
    subscribe(fn: Subscriber<T>): Unsubscribe {
      subscribers.add(fn);
      // Immediately call with initial value
      fn(value);
      return () => {
        subscribers.delete(fn);
      };
    },
  };
}

/**
 * Creates an auto-computed derived signal based on other signals.
 *
 * @example
 * const count = signal(2);
 * const double = derived(() => count.get() * 2, [count]);
 */
export function derived<T>(compute: () => T, dependencies: Signal<unknown>[] = []): Signal<T> {
  const result = signal<T>(compute());

  const updateComputed = () => {
    result.set(compute());
  };

  dependencies.forEach((sig) => {
    sig.subscribe(updateComputed);
  });

  return {
    get() {
      return result.get();
    },
    set() {
      throw new Error("Derived signals are read-only.");
    },
    update() {
      throw new Error("Derived signals are read-only.");
    },
    subscribe(fn: Subscriber<T>) {
      return result.subscribe(fn);
    },
  };
}

/**
 * Creates a signal that automatically synchronizes with browser localStorage.
 *
 * @example
 * const theme = persistentSignal('app_theme', 'dark');
 */
export function persistentSignal<T>(key: string, initialValue: T): Signal<T> {
  let startingValue = initialValue;

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        startingValue = JSON.parse(stored) as T;
      }
    } catch {
      // Fallback to initial value
    }
  }

  const sig = signal<T>(startingValue);

  sig.subscribe((val) => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.setItem(key, JSON.stringify(val));
      } catch {
        // Ignore storage quotas / access errors
      }
    }
  });

  return sig;
}

export type ActionCreator<TState, TActions> = (
  getState: () => TState,
  setState: (updater: Partial<TState> | ((prev: TState) => TState)) => void
) => TActions;

export interface Store<TState, TActions> {
  getState(): TState;
  subscribe(fn: Subscriber<TState>): Unsubscribe;
  actions: TActions;
}

/**
 * Creates a lightweight, typed global store.
 *
 * @example
 * const store = createStore({ count: 0 }, (get, set) => ({
 *   increment: () => set(s => ({ count: s.count + 1 })),
 *   reset: () => set({ count: 0 })
 * }));
 */
export function createStore<TState extends object, TActions extends object>(
  initialState: TState,
  actionCreator: ActionCreator<TState, TActions>
): Store<TState, TActions> {
  const stateSignal = signal<TState>(initialState);

  const setState = (updater: Partial<TState> | ((prev: TState) => TState)) => {
    stateSignal.update((prev) => {
      if (typeof updater === "function") {
        return (updater as (prev: TState) => TState)(prev);
      }
      return { ...prev, ...updater };
    });
  };

  const actions = actionCreator(
    () => stateSignal.get(),
    setState
  );

  return {
    getState: () => stateSignal.get(),
    subscribe: (fn) => stateSignal.subscribe(fn),
    actions,
  };
}
