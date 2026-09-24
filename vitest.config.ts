import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**"],
      exclude: ["src/index.ts"], // re-export barrel has nothing to unit-test
    },
  },
  // Vitest v5 uses oxc by default. JSX transform is read automatically
  // from tsconfig.json ("jsx": "react-jsx") — no extra config needed.
});

