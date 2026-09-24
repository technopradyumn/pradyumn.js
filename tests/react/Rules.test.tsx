import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Rules } from "../../src/react/Rules";
import { not } from "../../src/core/combinators";

describe("<Rules>", () => {
  // ─── all mode ───────────────────────────────────────────────────────────────

  describe("all mode", () => {
    it("renders children when every rule passes", () => {
      render(
        <Rules all={[() => true, () => true]}>
          <span>allowed</span>
        </Rules>,
      );
      expect(screen.getByText("allowed")).toBeInTheDocument();
    });

    it("renders fallback when any rule fails", () => {
      render(
        <Rules all={[() => true, () => false]} fallback={<span>denied</span>}>
          <span>allowed</span>
        </Rules>,
      );
      expect(screen.getByText("denied")).toBeInTheDocument();
      expect(screen.queryByText("allowed")).not.toBeInTheDocument();
    });

    it("renders children with empty all array (vacuous truth)", () => {
      render(<Rules all={[]}><span>ok</span></Rules>);
      expect(screen.getByText("ok")).toBeInTheDocument();
    });

    it("accepts boolean rules", () => {
      render(<Rules all={[true, true]}><span>ok</span></Rules>);
      expect(screen.getByText("ok")).toBeInTheDocument();
    });
  });

  // ─── any mode ───────────────────────────────────────────────────────────────

  describe("any mode", () => {
    it("renders children when at least one rule passes", () => {
      render(
        <Rules any={[() => false, () => true]}>
          <span>allowed</span>
        </Rules>,
      );
      expect(screen.getByText("allowed")).toBeInTheDocument();
    });

    it("renders fallback when all rules fail", () => {
      render(
        <Rules
          any={[() => false, () => false]}
          fallback={<span>denied</span>}
        >
          <span>allowed</span>
        </Rules>,
      );
      expect(screen.getByText("denied")).toBeInTheDocument();
    });

    it("renders fallback with empty any array (vacuous falsehood)", () => {
      render(
        <Rules any={[]} fallback={<span>none</span>}>
          <span>allowed</span>
        </Rules>,
      );
      expect(screen.getByText("none")).toBeInTheDocument();
    });
  });

  // ─── Composition with not() ─────────────────────────────────────────────────

  describe("composition with not()", () => {
    it("renders when loggedIn AND NOT banned", () => {
      render(
        <Rules all={[() => true, not(() => false)]}>
          <span>welcome</span>
        </Rules>,
      );
      expect(screen.getByText("welcome")).toBeInTheDocument();
    });

    it("does not render when loggedIn AND banned", () => {
      render(
        <Rules all={[() => true, not(() => true)]} fallback={<span>banned</span>}>
          <span>welcome</span>
        </Rules>,
      );
      expect(screen.getByText("banned")).toBeInTheDocument();
    });
  });

  // ─── Error handling ─────────────────────────────────────────────────────────

  describe("error handling", () => {
    it("renders fallback when a rule in all mode throws (fail-closed)", () => {
      render(
        <Rules
          all={[
            () => true,
            () => {
              throw new Error("boom");
            },
          ]}
          fallback={<span>safe</span>}
        >
          <span>ok</span>
        </Rules>,
      );
      expect(screen.getByText("safe")).toBeInTheDocument();
    });

    it("renders fallback when a rule in any mode throws (fail-closed)", () => {
      render(
        <Rules
          any={[
            () => {
              throw new Error("boom");
            },
          ]}
          fallback={<span>safe</span>}
        >
          <span>ok</span>
        </Rules>,
      );
      expect(screen.getByText("safe")).toBeInTheDocument();
    });
  });
});
