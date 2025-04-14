import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"
import svgr from "vite-plugin-svgr"
import compression from "vite-plugin-compression"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    compression({
      algorithm: "gzip", // 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw'
      ext: ".gz", // 압축된 파일의 확장자
      threshold: 10240, // 압축이 시작되는 최소 파일 크기 (bytes)
      deleteOriginFile: false, // 원본 파일 삭제 여부
      verbose: true, // 로그 출력 여부
    }),
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 10240, // 10KB
      deleteOriginFile: false,
      verbose: true,
    }),
  ],
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
