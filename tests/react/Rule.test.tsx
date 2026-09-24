import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Rule } from "../../src/react/Rule";
import { all, not } from "../../src/core/combinators";

describe("<Rule>", () => {
  // ─── Boolean when ───────────────────────────────────────────────────────────

  describe("boolean condition", () => {
    it("renders children when when=true", () => {
      render(<Rule when={true}><span>allowed</span></Rule>);
      expect(screen.getByText("allowed")).toBeInTheDocument();
    });

    it("does not render children when when=false", () => {
      render(<Rule when={false}><span>allowed</span></Rule>);
      expect(screen.queryByText("allowed")).not.toBeInTheDocument();
    });

    it("renders fallback when when=false and fallback is provided", () => {
      render(
        <Rule when={false} fallback={<span>denied</span>}>
          <span>allowed</span>
        </Rule>,
      );
      expect(screen.getByText("denied")).toBeInTheDocument();
      expect(screen.queryByText("allowed")).not.toBeInTheDocument();
    });

    it("renders nothing when when=false and no fallback", () => {
      const { container } = render(
        <Rule when={false}><span>allowed</span></Rule>,
      );
      expect(container.firstChild).toBeNull();
    });
  });

  // ─── Function when ──────────────────────────────────────────────────────────

  describe("function condition", () => {
    it("renders children when the rule function returns true", () => {
      render(<Rule when={() => true}><span>ok</span></Rule>);
      expect(screen.getByText("ok")).toBeInTheDocument();
    });

    it("does not render children when the rule function returns false", () => {
      render(<Rule when={() => false}><span>ok</span></Rule>);
      expect(screen.queryByText("ok")).not.toBeInTheDocument();
    });

    it("uses pre-defined rule functions (reusable pattern)", () => {
      const isAdmin = () => true;
      render(<Rule when={isAdmin}><span>admin panel</span></Rule>);
      expect(screen.getByText("admin panel")).toBeInTheDocument();
    });
  });

  // ─── Combinators ────────────────────────────────────────────────────────────

  describe("with combinators", () => {
    it("renders children when all(...) passes", () => {
      render(
        <Rule when={all(() => true, () => true)}>
          <span>ok</span>
        </Rule>,
      );
      expect(screen.getByText("ok")).toBeInTheDocument();
    });

    it("renders fallback when all(...) fails", () => {
      render(
        <Rule
          when={all(() => true, () => false)}
          fallback={<span>denied</span>}
        >
          <span>ok</span>
        </Rule>,
      );
      expect(screen.getByText("denied")).toBeInTheDocument();
    });

    it("renders children with not() combinator", () => {
      render(<Rule when={not(() => false)}><span>ok</span></Rule>);
      expect(screen.getByText("ok")).toBeInTheDocument();
    });
  });

  // ─── Error handling ─────────────────────────────────────────────────────────

  describe("error handling", () => {
    it("renders fallback when the rule function throws (fail-closed)", () => {
      const errorRule = () => {
        throw new Error("evaluation failed");
      };
      render(
        <Rule when={errorRule} fallback={<span>safe fallback</span>}>
          <span>should not appear</span>
        </Rule>,
      );
      expect(screen.getByText("safe fallback")).toBeInTheDocument();
      expect(screen.queryByText("should not appear")).not.toBeInTheDocument();
    });

    it("renders nothing on error when no fallback provided", () => {
      const errorRule = () => {
        throw new Error("boom");
      };
      const { container } = render(
        <Rule when={errorRule}><span>content</span></Rule>,
      );
      expect(container.firstChild).toBeNull();
    });
  });

  // ─── Rerenders ──────────────────────────────────────────────────────────────

  describe("rerenders", () => {
    it("updates when the condition changes from false to true", () => {
      const { rerender } = render(
        <Rule when={false} fallback={<span>denied</span>}>
          <span>allowed</span>
        </Rule>,
      );
      expect(screen.getByText("denied")).toBeInTheDocument();

      rerender(
        <Rule when={true} fallback={<span>denied</span>}>
          <span>allowed</span>
        </Rule>,
      );
      expect(screen.getByText("allowed")).toBeInTheDocument();
      expect(screen.queryByText("denied")).not.toBeInTheDocument();
    });

    it("updates when the condition changes from true to false", () => {
      const { rerender } = render(
        <Rule when={true}><span>allowed</span></Rule>,
      );
      expect(screen.getByText("allowed")).toBeInTheDocument();

      rerender(
        <Rule when={false} fallback={<span>denied</span>}>
          <span>allowed</span>
        </Rule>,
      );
      expect(screen.getByText("denied")).toBeInTheDocument();
    });
  });
});
