const KAKAO_KEY = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY

export const initializeKakao = () => {
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_KEY)
  }
}

export const getKakaoToken = async (code: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://devapi.yaksonhc.com/api/auth/kakao_callback?code=${code}`,
    )
    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("Kakao token error:", error)
    throw error
  }
}
