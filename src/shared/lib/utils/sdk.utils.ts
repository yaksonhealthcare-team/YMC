import { initializeApp } from '@firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

export const getKakaoLoginUrl = () => {
  return `${import.meta.env.VITE_KAKAO_REDIRECT_URI}?scope=account_email`;
};

export const getAppleLoginUrl = () => {
  const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID;
  const APPLE_REDIRECT_URI = import.meta.env.VITE_APPLE_REDIRECT_URI;
  const state = Math.random().toString(36).substr(2, 11);

  return `https://appleid.apple.com/auth/authorize?client_id=${APPLE_CLIENT_ID}&redirect_uri=${APPLE_REDIRECT_URI}&response_type=code%20id_token&scope=name%20email&response_mode=form_post&state=${state}`;
};

export const getNaverLoginUrl = () => {
  const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
  const NAVER_REDIRECT_URI = import.meta.env.VITE_NAVER_REDIRECT_URI;
  const state = Math.random().toString(36).substr(2, 11);

  return `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${state}`;
};

export const getGoogleLoginUrl = async () => {
  const GOOGLE_CLIENT_ID = '39001505358-fosqvj6oti6qgiud6ispraraoo7niut6.apps.googleusercontent.com';
  const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  const state = Math.random().toString(36).substr(2, 11);

  return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&scope=email%20profile&state=${state}`;
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Firebase 초기화는 앱에서 한 번만 해야 함
const app = initializeApp(firebaseConfig);

// 알림 권한 요청
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    if (window.ReactNativeWebView) {
      return false;
    }

    if (!('Notification' in window)) {
      console.log('이 브라우저는 알림을 지원하지 않습니다.');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('알림 권한 요청 중 오류 발생:', error);
    return false;
  }
}

// FCM 토큰 가져오기
export async function requestForToken() {
  try {
    if (window.ReactNativeWebView) {
      return localStorage.getItem('FCM_TOKEN');
    }

    // ServiceWorker API 지원 확인
    const hasServiceWorker = 'serviceWorker' in navigator;

    if (hasServiceWorker) {
      const currentToken = await getToken(getMessaging(app), {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      return currentToken;
    }

    return null;
  } catch {
    return null;
  }
}
