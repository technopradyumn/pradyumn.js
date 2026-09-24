import { describe, it, expect, vi } from "vitest";
import { all, any, not } from "../../src/core/combinators";

// ─── all ──────────────────────────────────────────────────────────────────────

describe("all", () => {
  it("returns true when every rule passes", () => {
    const rule = all(
      () => true,
      () => true,
    );
    expect(rule()).toBe(true);
  });

  it("returns false when any rule fails", () => {
    const rule = all(
      () => true,
      () => false,
    );
    expect(rule()).toBe(false);
  });

  it("returns true for no rules (vacuous truth)", () => {
    expect(all()()).toBe(true);
  });

  it("short-circuits on the first failing rule", () => {
    const second = vi.fn(() => true);
    const rule = all(
      () => false,
      second,
    );
    expect(rule()).toBe(false);
    expect(second).not.toHaveBeenCalled();
  });

  it("works with boolean inputs", () => {
    expect(all(true, true)()).toBe(true);
    expect(all(true, false)()).toBe(false);
  });

  it("propagates an error thrown by a rule function", () => {
    const rule = all(
      () => true,
      () => {
        throw new Error("boom");
      },
    );
    expect(() => rule()).toThrow("boom");
  });

  it("is composable: all inside all", () => {
    const inner = all(
      () => true,
      () => true,
    );
    const outer = all(inner, () => true);
    expect(outer()).toBe(true);
  });
});

// ─── any ──────────────────────────────────────────────────────────────────────

describe("any", () => {
  it("returns true when at least one rule passes", () => {
    const rule = any(
      () => false,
      () => true,
    );
    expect(rule()).toBe(true);
  });

  it("returns false when all rules fail", () => {
    const rule = any(
      () => false,
      () => false,
    );
    expect(rule()).toBe(false);
  });

  it("returns false for no rules (vacuous falsehood)", () => {
    expect(any()()).toBe(false);
  });

  it("short-circuits on the first passing rule", () => {
    const second = vi.fn(() => true);
    const rule = any(
      () => true,
      second,
    );
    expect(rule()).toBe(true);
    expect(second).not.toHaveBeenCalled();
  });

  it("works with boolean inputs", () => {
    expect(any(false, true)()).toBe(true);
    expect(any(false, false)()).toBe(false);
  });

  it("propagates an error thrown by a rule function", () => {
    const rule = any(
      () => false,
      () => {
        throw new Error("boom");
      },
    );
    expect(() => rule()).toThrow("boom");
  });

  it("is composable: any inside all", () => {
    const canEdit = any(
      () => false,
      () => true,
    );
    const gated = all(canEdit, () => true);
    expect(gated()).toBe(true);
  });
});

// ─── not ──────────────────────────────────────────────────────────────────────

describe("not", () => {
  it("inverts true to false", () => {
    expect(not(() => true)()).toBe(false);
  });

  it("inverts false to true", () => {
    expect(not(() => false)()).toBe(true);
  });

  it("works with boolean true", () => {
    expect(not(true)()).toBe(false);
  });

  it("works with boolean false", () => {
    expect(not(false)()).toBe(true);
  });

  it("is composable inside all", () => {
    // loggedIn AND NOT banned
    const rule = all(
      () => true,
      not(() => false),
    );
    expect(rule()).toBe(true);
  });

  it("propagates an error thrown by the rule", () => {
    const rule = not(() => {
      throw new Error("boom");
    });
    expect(() => rule()).toThrow("boom");
  });
});
