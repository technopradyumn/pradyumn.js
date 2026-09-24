import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Show } from "../../src/control/Show";

describe("<Show>", () => {
  it("renders children when condition is true", () => {
    render(
      <Show when={true} fallback={<div>Fallback Content</div>}>
        <div>Main Content</div>
      </Show>
    );

    expect(screen.getByText("Main Content")).toBeInTheDocument();
    expect(screen.queryByText("Fallback Content")).not.toBeInTheDocument();
  });

  it("renders fallback when condition is false", () => {
    render(
      <Show when={false} fallback={<div>Fallback Content</div>}>
        <div>Main Content</div>
      </Show>
    );

    expect(screen.queryByText("Main Content")).not.toBeInTheDocument();
    expect(screen.getByText("Fallback Content")).toBeInTheDocument();
  });

  it("evaluates a rule function correctly", () => {
    const isAllowed = () => 5 > 2;

    render(
      <Show when={isAllowed} fallback={<div>Denied</div>}>
        <div>Allowed</div>
      </Show>
    );

    expect(screen.getByText("Allowed")).toBeInTheDocument();
  });
});
