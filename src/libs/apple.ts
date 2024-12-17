import { axiosClient } from "../queries/clients"

const APPLE_CLIENT_ID = "com.yaksonhc.devapi"
const APPLE_REDIRECT_URI = "https://devapi.yaksonhc.com/api/auth/apple_callback"

// TODO: 애플 로그인 관련 백엔드 API 추가 필요
// 1. GET /auth/apple/init - 애플 로그인 URL 반환
// 2. 콜백 처리 - /api/auth/apple_callback

export const getAppleLoginUrl = () => {
  const state = Math.random().toString(36).substr(2, 11)
  localStorage.setItem("appleState", state)

  return `https://appleid.apple.com/auth/authorize?client_id=${APPLE_CLIENT_ID}&redirect_uri=${APPLE_REDIRECT_URI}&response_type=code%20id_token&scope=name%20email&response_mode=form_post&state=${state}`
}

export const getAppleToken = async (code: string) => {
  // TODO: 백엔드에서 애플 토큰 처리 방식 확인 필요
  const { data } = await axiosClient.post("/auth/signin/social", {
    thirdPartyType: "A",
    SocialAccessToken: code,
    device_token: "TODO: FCM 토큰 추가",
    device_type: "TODO: 디바이스 타입 추가",
  })

  return data.body[0].accessToken
}
