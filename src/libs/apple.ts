import { axiosClient } from "../queries/clients"

const APPLE_CLIENT_ID = "com.yaksonhc.devapi"
const APPLE_REDIRECT_URI = "https://devapi.yaksonhc.com/api/auth/apple_callback"

// TODO: 백엔드 API 추가 필요
// 1. GET /auth/apple/init - 로그인 URL 반환
// 2. 콜백 처리 - /api/auth/apple_callback

export const getAppleLoginUrl = () => {
  const state = Math.random().toString(36).substr(2, 11)
  localStorage.setItem("appleState", state)

  return `https://appleid.apple.com/auth/authorize?client_id=${APPLE_CLIENT_ID}&redirect_uri=${APPLE_REDIRECT_URI}&response_type=code%20id_token&scope=name%20email&response_mode=form_post&state=${state}`
}

export const getAppleToken = async (code: string) => {
  const { data } = await axiosClient.post("/auth/signin/social", {
    thirdPartyType: "A",
    SocialAccessToken: code,
    device_token: window.fcmToken || '',
    device_type: window.osType || 'android'
  })

  return data.body[0].accessToken
}
