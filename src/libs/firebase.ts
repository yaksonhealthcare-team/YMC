import { initializeApp } from "@firebase/app"
import { getAuth } from "@firebase/auth"
import { getMessaging, getToken, onMessage } from "firebase/messaging"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Firebase 초기화는 앱에서 한 번만 해야 함
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// 알림 권한 요청
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    if (!("Notification" in window)) {
      console.log("이 브라우저는 알림을 지원하지 않습니다.")
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === "granted"
  } catch (error) {
    console.error("알림 권한 요청 중 오류 발생:", error)
    return false
  }
}

// FCM 토큰 가져오기
export async function requestForToken() {
  try {
    if (window.ReactNativeWebView) {
      return null
    }

    // ServiceWorker API 지원 확인
    const hasServiceWorker = "serviceWorker" in navigator

    if (hasServiceWorker) {
      // 알림 권한 요청
      const permissionGranted = await requestNotificationPermission()
      if (!permissionGranted) {
        return null
      }

      const currentToken = await getToken(getMessaging(app), {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      })
      return currentToken
    }

    return null
  } catch (error) {
    console.log("An error occurred while retrieving token:", error)
    return null
  }
}

// FCM 메시지 수신 핸들러
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(getMessaging(app), (payload) => {
      resolve(payload)
    })
  })
