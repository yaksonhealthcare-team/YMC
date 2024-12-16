import { useLocation } from "react-router-dom"
import { signupWithSocial } from "../../apis/auth.api"

const SocialSignup = () => {
  const location = useLocation()
  const { provider, accessToken } = location.state

  const handleSubmit = async (formData: any) => {
    try {
      await signupWithSocial({
        provider,
        accessToken,
        userInfo: formData
      })
      // 회원가입 성공 후 처리
    } catch (error) {
      // 에러 처리
    }
  }

  return (
    // 회원가입 폼 구현
  )
}

export default SocialSignup 