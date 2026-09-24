import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  treeshake: true,
  sourcemap: true,
  clean: true,
  // Never bundle React — it must come from the host app (peerDependency)
  external: ["react", "react-dom", "react/jsx-runtime"],
});
