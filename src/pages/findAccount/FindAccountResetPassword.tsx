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
      await resetPassword(
        password,
        verifiedData.token_version_id,
        verifiedData.di,
      )
      navigate("complete")
    } catch (error) {
      console.error(error)
    }
  }

  return <ResetPassword requestPasswordChange={handleChangePassword} />
}

export default FindAccountResetPassword
