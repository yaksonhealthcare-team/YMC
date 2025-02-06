import { axiosClient } from "../queries/clients"

const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID
const NAVER_REDIRECT_URI = "https://devapi.yaksonhc.com/api/auth/naver_callback"

// TODO: 백엔드 API 추가 필요
// 1. GET /auth/naver/init - 로그인 URL 반환
// 2. 콜백 처리 - /api/auth/naver_callback

export const getNaverLoginUrl = () => {
  const state = Math.random().toString(36).substr(2, 11)
  localStorage.setItem("naverState", state)

  return `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${state}`
}

export const getNaverToken = async (code: string) => {
  const { data } = await axiosClient.post("/auth/signin/social", {
    thirdPartyType: "N",
    SocialAccessToken: code,
    device_token: window.fcmToken || '',
    device_type: window.osType || 'android'
  })

  return data.body[0].accessToken
}
