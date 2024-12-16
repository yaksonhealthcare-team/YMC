import { axiosClient } from "../queries/clients"

const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID
const NAVER_CLIENT_SECRET = import.meta.env.VITE_NAVER_CLIENT_SECRET
const NAVER_REDIRECT_URI = `${window.location.origin}/oauth/callback/naver`

export const getNaverLoginUrl = () => {
  const state = Math.random().toString(36).substr(2, 11)
  localStorage.setItem("naverState", state)

  return `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${state}`
}

export const getNaverToken = async (code: string, state: string) => {
  // TODO: 백엔드에서 네이버 토큰을 받아오는 API 추가 필요
  // POST /auth/naver/token
  // Request: { code, state, redirectUri }
  // Response: { access_token, refresh_token, token_type, expires_in }

  // 임시로 프론트엔드에서 직접 네이버 토큰 받기
  const tokenResponse = await fetch(
    `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&code=${code}&state=${state}`,
    { method: "GET" },
  )
  const tokenData = await tokenResponse.json()

  // 소셜 로그인
  const { data } = await axiosClient.post("/auth/signin/social", {
    thirdPartyType: "N",
    SocialAccessToken: tokenData.access_token,
    device_token: "TODO: FCM 토큰 추가",
    device_type: "TODO: 디바이스 타입 추가",
  })

  return data.body[0].accessToken
}
