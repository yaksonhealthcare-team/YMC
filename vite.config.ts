import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"
import svgr from "vite-plugin-svgr"
import compression from "vite-plugin-compression"
import vitePreload from "vite-plugin-preload"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    vitePreload(),
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
          // 핵심 리액트 라이브러리
          "react-core": ["react", "react-dom"],

          // 라우팅 관련 모듈 분리
          "react-router": ["react-router-dom"],

          // MUI 모든 모듈을 하나의 청크로 통합
          "mui-all": [
            "@mui/material",
            "@mui/material/styles",
            "@emotion/react",
            "@emotion/styled",
            "@mui/x-date-pickers",
          ],

          // date-fns 관련 모듈 최적화
          "date-fns-core": [
            "date-fns/parseISO",
            "date-fns/format",
            "date-fns/formatDistance",
          ],

          // date-fns 로케일은 실제 사용하는 것만 포함
          "date-fns-locale": ["date-fns/locale/ko"],

          // 스와이퍼 코어 기능
          "swiper-core": ["swiper/react", "swiper/modules"],

          // Firebase 관련 모듈
          "firebase": ["firebase/app", "firebase/auth", "firebase/messaging"],

          // API 호출 관련 모듈
          "api-client": ["axios", "@tanstack/react-query"],

          // 공통 컴포넌트 그룹화
          "common-components": [
            "@components/LoadingIndicator",
            "@components/ErrorPage",
          ],

          // 지도 관련 컴포넌트 (필요시에만 로드)
          "map-components": ["@components/MapView"],
        },
      },
    },
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
})
