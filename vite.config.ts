import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  plugins: [react(), tsconfigPaths(), svgr()],
  resolve: {
    alias: {
      "@assets": "/src/assets",
      "@components": "/src/components",
      "@hooks": "/src/hooks",
      "@pages": "/src/pages",
      "@router": "/src/router",
      "@utils": "/src/utils",
      "@apis": "/src/apis",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["@mui/material", "@emotion/react", "@emotion/styled"],
          "branch-vendor": ["@components/MapView", "@components/BranchCard"],
          "swiper-vendor": ["swiper", "swiper/react", "swiper/modules"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: true,
  },
})
