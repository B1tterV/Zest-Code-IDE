import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import { fileURLToPath, URL } from "node:url";

const host = process.env.TAURI_DEV_HOST;

const fPath = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [
    react(),
    tailwindcss(),
    // Colors Icons
    svgr({
      svgrOptions: {
        exportType: 'named',
        namedExport: 'ReactComponent',
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: { overrides: { removeViewBox: false, convertColors: false } },
            },
          ],
        },
      },
      include: /\.svg\?skip-colors$/,
    }),
    // currentColor Icons
    svgr({
      svgrOptions: {
        exportType: 'named',
        namedExport: 'ReactComponent',
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: { overrides: { removeViewBox: false, convertColors: { currentColor: true } } },
            },
          ],
        },
      },
      include: /\.svg$/,
      exclude: /\.svg\?skip-colors$/,
    }),
  ],

  resolve: {
    alias: {
      "@/icons": fPath("./src/shared/assets/icons"),
      "@/styles": fPath("./src/shared/assets/styles"),
      "@/images": fPath("./src/shared/assets/images"),
      "@/fonts": fPath("./src/shared/assets/fonts"),
      "@": fPath("./src"),
    },
  },

  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
