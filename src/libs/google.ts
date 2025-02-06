import { axiosClient } from "../queries/clients"

const GOOGLE_CLIENT_ID =
  "39001505358-fosqvj6oti6qgiud6ispraraoo7niut6.apps.googleusercontent.com"
const GOOGLE_REDIRECT_URI =
  "https://devapi.yaksonhc.com/api/auth/google_callback"

// TODO: 백엔드 API 추가 필요
// 1. GET /auth/google/init - 로그인 URL 반환
// 2. 콜백 처리 - /api/auth/google_callback

export const getGoogleLoginUrl = async () => {
  const state = Math.random().toString(36).substr(2, 11)
  localStorage.setItem("googleState", state)

  return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&scope=email%20profile&state=${state}`
}

export const getGoogleToken = async (code: string) => {
  const { data } = await axiosClient.post("/auth/signin/social", {
    thirdPartyType: "G",
    SocialAccessToken: code,
    device_token: window.fcmToken || '',
    device_type: window.osType || 'android'
  })

  return data.body[0].accessToken
}
