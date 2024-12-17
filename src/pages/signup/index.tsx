import React, { useNavigate } from "react-router-dom"
import { signup, signupWithSocial } from "../../api/auth"

const Signup = () => {
  const navigate = useNavigate()

  const handleSubmit = async (formData: any) => {
    try {
      if (socialInfo) {
        // 소셜 회원가입
        await signupWithSocial({
          provider: socialInfo.provider,
          accessToken: socialInfo.accessToken,
          userInfo: formData,
        })
      } else {
        // 일반 회원가입
        await signup(formData)
      }
      // 성공 처리
    } catch (error) {
      // 에러 처리
    }
  }

  // ...
}

export default Signup
