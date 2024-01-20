import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import * as path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    nodePolyfills(),
    dts({
      rollupTypes: true,
      entryRoot: "src",
      tsconfigPath: path.join(__dirname, "tsconfig.json"),
    }),
  ],
  resolve: {
    alias: [
      {
        find: "~",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
  build: {
    minify: false,
    rollupOptions: {
      external: [
        "@orbifold/utils",
        "lodash"],
    },
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: "index",
      // es is for browser, cjs is for node
      formats: ["es", "cjs"],
    },
  },
});
