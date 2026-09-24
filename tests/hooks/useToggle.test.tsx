import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToggle } from "../../src/hooks/useToggle";

describe("useToggle", () => {
  it("initializes with provided value and toggles cleanly", () => {
    const { result } = renderHook(() => useToggle(false));
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](); // toggle
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[4](); // setFalse
    });
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[3](); // setTrue
    });
    expect(result.current[0]).toBe(true);
  });
});
