const KAKAO_KEY = import.meta.env.VITE_KAKAO_CLIENT_ID

export const initKakao = () => {
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_KEY)
  }
}

export const getKakaoToken = async (code: string): Promise<string> => {
  try {
    const response = await fetch(`https://kauth.kakao.com/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: KAKAO_KEY,
        redirect_uri: `${window.location.origin}/oauth/callback/kakao`,
        code,
      }),
    })
    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("Kakao token error:", error)
    throw error
  }
}
