import { useNavigate } from "react-router-dom"
import ResetPassword from "@components/resetPassword/ResetPassword.tsx"
import { resetPassword } from "../../apis/auth.api.ts"
import { useEffect, useState } from "react"

const FindAccountResetPassword = () => {
  const [email, setEmail] = useState<string>("")
  const navigate = useNavigate()

  useEffect(() => {
    setEmail("coolkyung@nate.com")
  }, [])

  const handleChangePassword = async (password: string) => {
    try {
      // TODO: 비밀번호 찾기 시 본인인증 API를 사용하여 email 가져오기
      await resetPassword(email, password)
      navigate("complete")
    } catch (error) {
      console.error(error)
    }
  }

  return <ResetPassword requestPasswordChange={handleChangePassword} />
}

export default FindAccountResetPassword
