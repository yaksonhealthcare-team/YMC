import { useNavigate, useLocation } from "react-router-dom"
import ResetPassword from "@components/resetPassword/ResetPassword.tsx"
import { resetPassword } from "../../apis/auth.api.ts"
import { useEffect } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"

const FindAccountResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const verifiedData = location.state?.verifiedData
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
    // 본인인증 데이터가 없으면 계정찾기 페이지로 이동
    if (!verifiedData) {
      navigate("/find-account")
    }
  }, [])

  const handleChangePassword = async (password: string) => {
    try {
      // TODO: 본인인증 데이터로 이메일 찾기 API 호출 후 비밀번호 변경
      await resetPassword("coolkyung@nate.com", password)
      navigate("complete")
    } catch (error) {
      console.error(error)
    }
  }

  return <ResetPassword requestPasswordChange={handleChangePassword} />
}

export default FindAccountResetPassword
