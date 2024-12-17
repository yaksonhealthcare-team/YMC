import { axiosClient } from "../queries/clients"

const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID
const NAVER_REDIRECT_URI = "https://devapi.yaksonhc.com/api/auth/naver_callback"

// TODO: 네이버 로그인 관련 백엔드 API 추가 필요
// 1. GET /auth/naver/init - 네이버 로그인 URL 반환
// 2. 콜백 처리 - /api/auth/naver_callback

export const getNaverLoginUrl = () => {
  const state = Math.random().toString(36).substr(2, 11)
  localStorage.setItem("naverState", state)

  return `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${state}`
}

export const getNaverToken = async (code: string) => {
  // TODO: 백엔드에서 네이버 토큰 처리 방식 확인 필요
  const { data } = await axiosClient.post("/auth/signin/social", {
    thirdPartyType: "N",
    SocialAccessToken: code,
    device_token: "TODO: FCM 토큰 추가",
    device_type: "TODO: 디바이스 타입 추가",
  })

  return data.body[0].accessToken
}
