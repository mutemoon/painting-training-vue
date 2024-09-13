import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import path from "path";
import tailwind from "tailwindcss";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vue-router"],
      dirs: ["./src/composables"],
      dts: "./src/auto-imports.d.ts",
    }),
    Components({
      dts: "./src/components.d.ts",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
