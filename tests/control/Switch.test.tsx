import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Switch, Case, Default } from "../../src/control/Switch";

describe("<Switch>", () => {
  it("renders the matching Case", () => {
    render(
      <Switch value="admin">
        <Case is="user"><div>User View</div></Case>
        <Case is="admin"><div>Admin View</div></Case>
        <Default><div>Default View</div></Default>
      </Switch>
    );

    expect(screen.getByText("Admin View")).toBeInTheDocument();
    expect(screen.queryByText("User View")).not.toBeInTheDocument();
    expect(screen.queryByText("Default View")).not.toBeInTheDocument();
  });

  it("renders Default when no Case matches", () => {
    render(
      <Switch value="guest">
        <Case is="user"><div>User View</div></Case>
        <Case is="admin"><div>Admin View</div></Case>
        <Default><div>Default View</div></Default>
      </Switch>
    );

    expect(screen.getByText("Default View")).toBeInTheDocument();
  });

  it("matches array of values in Case", () => {
    render(
      <Switch value="editor">
        <Case is={["admin", "editor"]}><div>Staff View</div></Case>
        <Default><div>Public View</div></Default>
      </Switch>
    );

    expect(screen.getByText("Staff View")).toBeInTheDocument();
  });
});
