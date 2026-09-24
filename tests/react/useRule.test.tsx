import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRule } from "../../src/react/useRule";
import { all, not } from "../../src/core/combinators";

describe("useRule", () => {
  // ─── Boolean rules ──────────────────────────────────────────────────────────

  describe("boolean rules", () => {
    it("returns { result: true, error: null } for boolean true", () => {
      const { result } = renderHook(() => useRule(true));
      expect(result.current.result).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it("returns { result: false, error: null } for boolean false", () => {
      const { result } = renderHook(() => useRule(false));
      expect(result.current.result).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  // ─── Function rules ─────────────────────────────────────────────────────────

  describe("function rules", () => {
    it("returns { result: true, error: null } when rule passes", () => {
      const { result } = renderHook(() => useRule(() => true));
      expect(result.current.result).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it("returns { result: false, error: null } when rule fails", () => {
      const { result } = renderHook(() => useRule(() => false));
      expect(result.current.result).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  // ─── Error handling ─────────────────────────────────────────────────────────

  describe("error handling", () => {
    it("returns { result: false, error: Error } when rule throws", () => {
      const { result } = renderHook(() =>
        useRule(() => {
          throw new Error("rule failed");
        }),
      );
      expect(result.current.result).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe("rule failed");
    });

    it("wraps non-Error throwables in an Error", () => {
      const { result } = renderHook(() =>
        useRule(() => {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw "string error";
        }),
      );
      expect(result.current.result).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  // ─── Rerenders ──────────────────────────────────────────────────────────────

  describe("rerenders", () => {
    it("re-evaluates when a boolean condition changes", () => {
      const { result, rerender } = renderHook(
        ({ condition }: { condition: boolean }) => useRule(condition),
        { initialProps: { condition: true } },
      );
      expect(result.current.result).toBe(true);

      rerender({ condition: false });
      expect(result.current.result).toBe(false);
    });

    it("re-evaluates when a stable rule reference changes to false", () => {
      const passRule = () => true;
      const failRule = () => false;

      const { result, rerender } = renderHook(
        ({ rule }: { rule: () => boolean }) => useRule(rule),
        { initialProps: { rule: passRule } },
      );
      expect(result.current.result).toBe(true);

      rerender({ rule: failRule });
      expect(result.current.result).toBe(false);
    });
  });

  // ─── Combinators ────────────────────────────────────────────────────────────

  describe("with combinators", () => {
    it("works with all()", () => {
      const rule = all(
        () => true,
        () => true,
      );
      const { result } = renderHook(() => useRule(rule));
      expect(result.current.result).toBe(true);
    });

    it("works with not()", () => {
      const { result } = renderHook(() => useRule(not(() => false)));
      expect(result.current.result).toBe(true);
    });
  });
});
