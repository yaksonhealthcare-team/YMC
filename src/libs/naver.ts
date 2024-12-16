const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID
const NAVER_REDIRECT_URI = `${window.location.origin}/oauth/callback/naver`

export const initializeNaverLogin = () => {
  const naverLogin = new window.naver.LoginWithNaverId({
    clientId: NAVER_CLIENT_ID,
    callbackUrl: NAVER_REDIRECT_URI,
    isPopup: false,
    loginButton: { color: "green", type: 3, height: 60 },
  })
  naverLogin.init()
  return naverLogin
}

export const getNaverToken = async (
  code: string,
  state: string,
): Promise<string> => {
  try {
    const response = await fetch(
      `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${import.meta.env.VITE_NAVER_CLIENT_SECRET}&code=${code}&state=${state}`,
      {
        method: "GET",
      },
    )
    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("Naver token error:", error)
    throw error
  }
}
