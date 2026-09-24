import { describe, it, expect, vi } from "vitest";
import { evaluate } from "../../src/core/evaluate";

describe("evaluate", () => {
  describe("boolean rules", () => {
    it("returns true for boolean true", () => {
      expect(evaluate(true)).toBe(true);
    });

    it("returns false for boolean false", () => {
      expect(evaluate(false)).toBe(false);
    });
  });

  describe("function rules", () => {
    it("calls the function and returns its result", () => {
      expect(evaluate(() => true)).toBe(true);
      expect(evaluate(() => false)).toBe(false);
    });

    it("calls the function exactly once per evaluation", () => {
      const fn = vi.fn(() => true);
      evaluate(fn);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("throws when the rule function throws", () => {
      const rule = () => {
        throw new Error("rule error");
      };
      expect(() => evaluate(rule)).toThrow("rule error");
    });

    it("does not catch non-Error throwables", () => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      const rule = () => {
        throw "string error";
      };
      expect(() => evaluate(rule)).toThrow("string error");
    });
  });
});
