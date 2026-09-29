import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    cli: "scripts/cli.ts",
  },
  format: ["esm"],
  dts: true,
  treeshake: true,
  minify: true,
  sourcemap: true,
  clean: true,
  // Never bundle React — it must come from the host app (peerDependency)
  external: ["react", "react-dom", "react/jsx-runtime"],
});
