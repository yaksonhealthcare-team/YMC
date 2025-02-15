import { DecryptRequest, fetchDecryptResult } from "@apis/decrypt-result.api"
import { AxiosError } from "axios"
import { useOverlay } from "contexts/ModalContext"
import { useSignup } from "contexts/SignupContext"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const SignupCallback = () => {
  const { setSignupData } = useSignup()
  const location = useLocation()
  const { openModal } = useOverlay()
  const socialInfo = location.state?.social
  const navigate = useNavigate()

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)

    const tokenVersionId = queryParams.get("token_version_id")
    const encData = queryParams.get("enc_data")
    const integrityValue = queryParams.get("integrity_value")

    const handleVerification = async () => {
      try {
        if (!tokenVersionId || !encData || !integrityValue) {
          throw new Error("본인인증 정보가 없습니다.")
        }

        const request: DecryptRequest = {
          token_version_id: tokenVersionId,
          enc_data: encData,
          integrity_value: integrityValue,
        }
        const response = await fetchDecryptResult(request)
        const userData = response.body

        console.log(userData)
        setSignupData((prev) => ({
          ...prev,
          name: userData.name,
          mobileNumber: userData.hp,
          birthDate: userData.birthdate,
          gender: userData.sex === "M" ? "male" : "female",
          di: userData.di,
          ...(socialInfo && {
            social: {
              provider: socialInfo.provider,
              accessToken: socialInfo.accessToken,
            },
          }),
        }))
        navigate(socialInfo ? "/signup/profile" : "/signup/email")
      } catch (error) {
        if (error instanceof AxiosError) {
          openModal({
            title: "오류",
            message:
              error.response?.data?.resultMessage || "본인인증에 실패했습니다.",
            onConfirm: () => {
              navigate("/signup/terms", { replace: true })
            },
          })
          return
        }
        openModal({
          title: "오류",
          message: "본인인증에 실패했습니다.",
          onConfirm: () => {
            navigate("/signup/terms", { replace: true })
          },
        })
      }
    }

    handleVerification()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>처리중입니다...</p>
      </div>
    </div>
  )
}

export default SignupCallback
