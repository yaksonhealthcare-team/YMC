import { initializeApp } from "@firebase/app"
import { getAuth, GoogleAuthProvider, OAuthProvider } from "@firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBfgTaIp8DbdpsZOQMgSKTwAIlMx7RwIcE",
  authDomain: "therapist-dd196.firebaseapp.com",
  projectId: "therapist-dd196",
  storageBucket: "therapist-dd196.firebasestorage.app",
  messagingSenderId: "39001505358",
  appId: "1:39001505358:web:a68d1851390d2e766d4d1f",
  measurementId: "G-EW5VLV8E8J",
}

// Firebase 초기화는 앱에서 한 번만 해야 함
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// 로그인 제공업체 설정
export const googleProvider = new GoogleAuthProvider()
export const appleProvider = new OAuthProvider("apple.com")
