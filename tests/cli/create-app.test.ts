import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parseCreateOptions, writeNextAppTemplate, writeSocialAppTemplate } from "../../scripts/cli";

describe("parseCreateOptions", () => {
  it("preserves a selected native target regardless of option order", () => {
    expect(parseCreateOptions(["commonplace-android", "--platform", "android", "--fast"])).toEqual({
      projectName: "commonplace-android",
      platform: "android",
      fastScaffold: true,
    });
    expect(parseCreateOptions(["--fast", "commonplace-android", "--platform", "android"])).toEqual({
      projectName: "commonplace-android",
      platform: "android",
      fastScaffold: true,
    });
  });

  it("uses web-only output when fast mode is selected without a platform", () => {
    expect(parseCreateOptions(["commonplace", "--fast"])).toEqual({
      projectName: "commonplace",
      platform: "web",
      fastScaffold: true,
    });
  });

  it("rejects unknown platform targets instead of falling back to Next.js", () => {
    expect(() => parseCreateOptions(["commonplace", "--platform", "windows"])).toThrow(/Choose a platform/);
  });
});

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

describe("writeSocialAppTemplate", () => {
  let projectPath: string;

  afterEach(() => {
    if (projectPath) {
      rmSync(projectPath, { recursive: true, force: true });
    }
  });

  it("writes a Tauri cross-platform social app with Pradyumn local persistence", () => {
    projectPath = mkdtempSync(path.join(os.tmpdir(), "pradyumn-social-app-"));

    writeSocialAppTemplate(projectPath);

    const app = readFileSync(path.join(projectPath, "src/SocialApp.tsx"), "utf8");
    const platform = readFileSync(path.join(projectPath, "src/platform.ts"), "utf8");
    const rust = readFileSync(path.join(projectPath, "src-tauri/src/main.rs"), "utf8");
    const config = JSON.parse(readFileSync(path.join(projectPath, "src-tauri/tauri.conf.json"), "utf8")) as {
      identifier: string;
    };
    const packageJson = JSON.parse(readFileSync(path.join(projectPath, "package.json"), "utf8")) as {
      name: string;
      scripts: Record<string, string>;
      dependencies: Record<string, string>;
    };

    expect(app).toContain('persistentSignal<Post[]>("pradyumn.social.posts.v1"');
    expect(app).toContain("postsSignal.update");
    expect(app).toContain("function removePost");
    expect(app).toContain("<For each={visiblePosts}");
    expect(platform).toContain('import("@tauri-apps/api/core")');
    expect(rust).toContain('target_os = "android"');
    expect(rust).toContain('target_os = "ios"');
    expect(config.identifier).toBe(`com.pradyumn.${packageJson.name}`);
    expect(packageJson.scripts["android:dev"]).toBe("tauri android dev");
    expect(packageJson.scripts["ios:dev"]).toBe("tauri ios dev");
    expect(packageJson.scripts["desktop:dev"]).toBe("tauri dev");
    expect(packageJson.dependencies["pradyumn"]).toBe("latest");
  });

  it("omits native files and dependencies from a web-only scaffold", () => {
    projectPath = mkdtempSync(path.join(os.tmpdir(), "pradyumn-web-app-"));

    writeSocialAppTemplate(projectPath, "web");

    const platform = readFileSync(path.join(projectPath, "src/platform.ts"), "utf8");
    const packageJson = JSON.parse(readFileSync(path.join(projectPath, "package.json"), "utf8")) as {
      scripts: Record<string, string>;
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };

    expect(platform).toContain('return "web"');
    expect(packageJson.dependencies["@tauri-apps/api"]).toBeUndefined();
    expect(packageJson.devDependencies["@tauri-apps/cli"]).toBeUndefined();
    expect(packageJson.scripts["android:dev"]).toBeUndefined();
    expect(packageJson.scripts["ios:dev"]).toBeUndefined();
  });
});
