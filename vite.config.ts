import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import autoprefixer from 'autoprefixer';
import path from 'path';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // const buildTimestamp = getFormattedTimestamp();
  // const shouldCompressAsset = (file: string) => /\.(js|css)$/i.test(file) && !/index\.html$/i.test(file);

  server: {
    host: true,
    open: true
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()]
    }
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    // vitePreload(),
    // ViteImageOptimizer({
    //   test: /\.(jpe?g|png|gif|tiff|webp|svg)$/i,
    //   includePublic: true,
    //   logStats: true,
    //   png: {
    //     quality: 70,
    //     compressionLevel: 8
    //   },
    //   jpeg: {
    //     quality: 70,
    //     progressive: true
    //   },
    //   jpg: {
    //     quality: 70,
    //     progressive: true
    //   },
    //   webp: {
    //     lossless: false,
    //     quality: 75,
    //     alphaQuality: 85
    //   }
    // }),
    // compression({
    //   algorithm: 'gzip', // 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw'
    //   ext: '.gz', // 압축된 파일의 확장자
    //   threshold: 10240, // 압축이 시작되는 최소 파일 크기 (bytes)
    //   filter: shouldCompressAsset,
    //   deleteOriginFile: false, // 원본 파일 삭제 여부
    //   verbose: true // 로그 출력 여부
    // }),
    // compression({
    //   algorithm: 'brotliCompress',
    //   ext: '.br',
    //   threshold: 10240, // 10KB
    //   filter: shouldCompressAsset,
    //   deleteOriginFile: false,
    //   verbose: true
    // }),
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'yaksonhealthcare',
      project: 'therapist'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    // outDir: mode === 'production' ? 'dist/dist_prod' : 'dist/dist_dev',
    // assetsDir: `assets/${buildTimestamp}`,
    // rollupOptions: {
    //   output: {
    //     manualChunks: (id) => {
    //       if (id.includes('node_modules/@mui')) {
    //         return 'mui';
    //       }
    //       if (id.includes('node_modules/firebase')) {
    //         return 'firebase';
    //       }
    //       if (id.includes('node_modules/react-router')) {
    //         return 'react-router';
    //       }
    //       if (id.includes('node_modules/dayjs')) {
    //         return 'dayjs';
    //       }
    //       if (id.includes('node_modules')) {
    //         return 'vendor';
    //       }
    //     }
    //   }
    // },
    // chunkSizeWarningLimit: 1000,
    sourcemap: true
    // minify: 'terser',
    // terserOptions: {
    //   compress: {
    //     drop_console: true,
    //     drop_debugger: true
    //   },
    //   mangle: {
    //     keep_fnames: true,
    //     safari10: true
    //   },
    //   format: {
    //     comments: false,
    //     ecma: 2020
    //   }
    // }
  }
});
