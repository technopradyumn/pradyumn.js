import { describe, it, expect, vi } from "vitest";
import { signal, derived, persistentSignal, createStore } from "../../src/core/signals";

describe("signal", () => {
  it("initializes with starting value", () => {
    const count = signal(0);
    expect(count.get()).toBe(0);
  });

  it("updates value and notifies subscribers", () => {
    const count = signal(10);
    const fn = vi.fn();
    count.subscribe(fn);

    expect(fn).toHaveBeenCalledWith(10);

    count.set(20);
    expect(count.get()).toBe(20);
    expect(fn).toHaveBeenCalledWith(20);

    count.update((n) => n + 5);
    expect(count.get()).toBe(25);
    expect(fn).toHaveBeenCalledWith(25);
  });

  it("unsubscribes cleanly", () => {
    const text = signal("hello");
    const fn = vi.fn();
    const unsub = text.subscribe(fn);

    text.set("world");
    expect(fn).toHaveBeenCalledWith("world");

    unsub();
    text.set("pradyumn");
    expect(fn).not.toHaveBeenCalledWith("pradyumn");
  });
});

describe("derived", () => {
  it("computes derived value from dependencies", () => {
    const a = signal(2);
    const b = signal(3);
    const sum = derived(() => a.get() + b.get(), [a, b]);

    expect(sum.get()).toBe(5);

    a.set(10);
    expect(sum.get()).toBe(13);
  });
});

describe("createStore", () => {
  it("creates a reactive state store with actions", () => {
    const store = createStore({ count: 0 }, (get, set) => ({
      increment: () => set((s) => ({ count: s.count + 1 })),
      reset: () => set({ count: 0 }),
    }));

    expect(store.getState().count).toBe(0);

    store.actions.increment();
    expect(store.getState().count).toBe(1);

    store.actions.increment();
    expect(store.getState().count).toBe(2);

    store.actions.reset();
    expect(store.getState().count).toBe(0);
  });
});
