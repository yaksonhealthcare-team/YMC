/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*.svg?url" {
  const content: string
  export default content
}

interface ImportMetaEnv {
  // readonly VITE_KAKAO_JAVASCRIPT_KEY: string
  // readonly VITE_KAKAO_REST_API_KEY: string
  // readonly VITE_KAKAO_REDIRECT_URI: string
}

// interface Window {
//   Kakao: {
//     init: (key: string) => void
//     isInitialized: () => boolean
//     Auth: {
//       authorize: (params: any) => void
//     }
//   }
// }
