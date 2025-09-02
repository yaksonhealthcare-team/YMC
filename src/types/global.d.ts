import { KakaoSDK } from './kakao';
import { NaverLoginWithNaverId } from './naver';

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
      onMessage: (value: string) => void;
    };
    webkit?: {
      messageHandlers: {
        openExternalLink: {
          postMessage: (url: string) => void;
        };
      };
    };
    Android?: {
      openExternalLink: (url: string) => void;
    };
    setNativeSafeAreaColors?: (top: string, bottom: string) => void;
    fcmToken?: string;
    osType?: 'android' | 'ios' | 'web';
    Kakao?: KakaoSDK;
    naver: {
      LoginWithNaverId: NaverLoginWithNaverId;
    };
  }
}

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}
