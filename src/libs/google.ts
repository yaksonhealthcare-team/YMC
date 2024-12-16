import { axiosClient } from "../queries/clients"

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_REDIRECT_URI =
  "https://devapi.yaksonhc.com/api/auth/google_callback"

// TODO: 구글 로그인 관련 백엔드 API 추가 필요
// 1. GET /auth/google/init - 구글 로그인 URL 반환
// 2. 콜백 처리 - /api/auth/google_callback

export const getGoogleLoginUrl = async () => {
  // TODO: 백엔드 API 준비될 때까지 프론트엔드에서 URL 생성
  const state = Math.random().toString(36).substr(2, 11)
  localStorage.setItem("googleState", state)

  return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&scope=email%20profile&state=${state}`
}

export const getGoogleToken = async (code: string) => {
  // TODO: 백엔드에서 구글 토큰 처리 방식 확인 필요
  const { data } = await axiosClient.post("/auth/signin/social", {
    thirdPartyType: "G",
    SocialAccessToken: code,
    device_token: "TODO: FCM 토큰 추가",
    device_type: "TODO: 디바이스 타입 추가",
  })

  return data.body[0].accessToken
}
