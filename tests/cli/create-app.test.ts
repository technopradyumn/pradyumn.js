import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { writeNextAppTemplate } from "../../scripts/cli";

describe("writeNextAppTemplate", () => {
  let projectPath: string;

  afterEach(() => {
    if (projectPath) {
      rmSync(projectPath, { recursive: true, force: true });
    }
  });

  it("writes a TypeScript Next.js App Router starter with a responsive UI", () => {
    projectPath = mkdtempSync(path.join(os.tmpdir(), "pradyumn-next-app-"));

    writeNextAppTemplate(projectPath);

    const page = readFileSync(path.join(projectPath, "src/app/page.tsx"), "utf8");
    const layout = readFileSync(path.join(projectPath, "src/app/layout.tsx"), "utf8");
    const styles = readFileSync(path.join(projectPath, "src/app/globals.css"), "utf8");

    expect(page).toContain('"use client"');
    expect(page).toContain('from "pradyumn"');
    expect(page).toContain("<Rule");
    expect(page).toContain("Workspace permissions");
    expect(layout).toContain("Metadata");
    expect(styles).toContain("@media (max-width: 760px)");
    expect(styles).toContain("prefers-reduced-motion");
  });
});
