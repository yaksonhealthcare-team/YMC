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
          // 핵심 리액트 라이브러리
          "react-core": ["react", "react-dom"],

          // 라우팅 관련 모듈 분리
          "react-router": ["react-router-dom"],

          // MUI 코어 기능만 포함
          "mui-core": [
            "@mui/material/styles",
            "@emotion/react",
            "@emotion/styled",
          ],

          // 자주 사용되는 MUI 컴포넌트들을 별도 청크로 분리
          "mui-common": [
            "@mui/material/Button",
            "@mui/material/TextField",
            "@mui/material/Box",
            "@mui/material/Typography",
            "@mui/material/Container",
            "@mui/material/Grid",
            "@mui/material/Card",
            "@mui/material/Paper",
            "@mui/material/IconButton",
          ],

          // 사용량이 적은 MUI 컴포넌트들은 다른 청크로 분리
          "mui-complex": [
            "@mui/material/Autocomplete",
            "@mui/material/Slider",
            "@mui/material/Tooltip",
          ],

          // 탭, 칩 등 특정 UI 컴포넌트 그룹화
          "mui-navigation": [
            "@mui/material/Tabs",
            "@mui/material/Tab",
            "@mui/material/Drawer",
            "@mui/material/AppBar",
            "@mui/material/Menu",
            "@mui/material/MenuItem",
          ],

          // 폼 관련 컴포넌트 그룹화
          "mui-forms": [
            "@mui/material/InputBase",
            "@mui/material/Select",
            "@mui/material/Checkbox",
            "@mui/material/Radio",
            "@mui/material/FormControl",
            "@mui/material/FormGroup",
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
    },
  },
})
