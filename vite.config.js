import { defineConfig } from "vite";

export default defineConfig({
  build: {
    sourcemap: false,
    minify: "oxc",
    target: "es2020",
    cssMinify: true,
    reportCompressedSize: false,
  },
});
