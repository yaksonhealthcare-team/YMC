import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"
import svgr from "vite-plugin-svgr"
import compression from "vite-plugin-compression"
import vitePreload from "vite-plugin-preload"
import { ViteImageOptimizer } from "vite-plugin-image-optimizer"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    server: {
      host: true,
      open: true,
    },
    plugins: [
      react(),
      tsconfigPaths(),
      svgr(),
      vitePreload(),
      ViteImageOptimizer({
        test: /\.(jpe?g|png|gif|tiff|webp|svg)$/i,
        includePublic: true,
        logStats: true,
        png: {
          quality: 70,
          compressionLevel: 8,
        },
        jpeg: {
          quality: 70,
          progressive: true,
        },
        jpg: {
          quality: 70,
          progressive: true,
        },
        webp: {
          lossless: false,
          quality: 75,
          alphaQuality: 85,
        },
      }),
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
          manualChunks: (id) => {
            if (id.includes("node_modules/@mui")) {
              return "mui"
            }
            if (id.includes("node_modules/firebase")) {
              return "firebase"
            }
            if (id.includes("node_modules/react-router")) {
              return "react-router"
            }
            if (id.includes("node_modules/dayjs")) {
              return "dayjs"
            }
            // date-fns 관련 청크 제거
            // if (id.includes("node_modules/date-fns")) {
            //   if (id.includes("locale")) {
            //     return "date-fns-locale"
            //   }
            //   return "date-fns-core"
            // }
            // 나머지 node_modules는 vendor 청크로 분리
            if (id.includes("node_modules")) {
              return "vendor"
            }
          },
        },
      },
      outDir: mode === "production" ? "dist/dist_prod" : "dist/dist_dev",
      chunkSizeWarningLimit: 1000,
      sourcemap: true,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        // 변수명 매핑 및 전역 변수 보존 설정
        mangle: {
          keep_fnames: true,
          safari10: true,
        },
        format: {
          comments: false,
          ecma: 2020,
        },
      },
    },
  }
})
