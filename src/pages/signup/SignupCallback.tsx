import { useOverlay } from "contexts/ModalContext"
import { useSignup } from "contexts/SignupContext"
import { useEffect, useCallback, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Gender } from "utils/gender"
import { useNiceAuthCallback } from "utils/niceAuth"
import { CircularProgress } from "@mui/material"
import { useProfileSetupSubmit } from "../../hooks/useProfileSetupSubmit"

const SignupCallback = () => {
  const [hasSignUpData, setHasSignUpData] = useState(false)
  const { signupData, setSignupData } = useSignup()
  const [searchParams] = useSearchParams()
  const { openModal } = useOverlay()
  const navigate = useNavigate()
  const { parseNiceAuthData } = useNiceAuthCallback()
  const isProcessing = useRef(false)
  const { handleSubmit } = useProfileSetupSubmit()

  const handleVerification = useCallback(
    async (jsonData: string) => {
      if (isProcessing.current) return
      isProcessing.current = true

      try {
        // 공통 유틸리티로 나이스 인증 데이터 파싱
        const userData = parseNiceAuthData(jsonData, "/signup/terms")
        if (!userData) return

        const storedSignupData = sessionStorage.getItem("signupData")
        if (storedSignupData) {
          const parsedData = JSON.parse(storedSignupData)
          setSignupData((prev) => ({
            ...prev,
            ...parsedData,
            name: userData.name,
            mobileNumber: userData.hp,
            birthDate: userData.birthdate,
            gender: userData.sex as Gender,
            di: userData.di,
            tokenVersionId: userData.token_version_id,
            isSocialExist: userData.is_social_exist,
            isIdExist: userData.is_id_exist,
          }))
        } else {
          setSignupData((prev) => ({
            ...prev,
            name: userData.name,
            mobileNumber: userData.hp,
            birthDate: userData.birthdate,
            gender: userData.sex as Gender,
            di: userData.di,
            tokenVersionId: userData.token_version_id,
            isSocialExist: userData.is_social_exist,
            isIdExist: userData.is_id_exist,
          }))
        }
      } catch (error) {
        console.error("회원가입 처리 오류:", error)
        openModal({
          title: "오류",
          message: "회원가입 정보 처리에 실패했습니다.",
          onConfirm: () => {
            navigate("/signup/terms", { replace: true })
          },
        })
      } finally {
        setHasSignUpData(true)
        isProcessing.current = false
      }
    },
    [navigate, openModal, parseNiceAuthData, setSignupData],
  )

  useEffect(() => {
    const jsonData = searchParams.get("jsonData")
    if (jsonData && !isProcessing.current) {
      handleVerification(jsonData)
    }
  }, []) // 빈 의존성 배열로 한 번만 실행

  useEffect(() => {
    if (!hasSignUpData || !signupData) return
    // 소셜 계정 존재 여부 확인
    const isSocialExist: { [key: string]: string } = signupData.isSocialExist
    const socialSignupInfo = JSON.parse(
      sessionStorage.getItem("socialSignupInfo") ?? "{}",
    )

    if (socialSignupInfo.provider) {
      if (isSocialExist[socialSignupInfo.provider] === "Y") {
        openModal({
          title: "알림",
          message: "이미 가입된 회원입니다.",
          onConfirm: () => {
            navigate("/login", { replace: true })
          },
        })
        return
      }

      if (
        isSocialExist["K"] === "Y" ||
        isSocialExist["N"] === "Y" ||
        isSocialExist["G"] === "Y" ||
        isSocialExist["A"] === "Y"
      ) {
        handleSubmit()
        return
      }
    }

    navigate("/signup/email")
  }, [hasSignUpData, signupData])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <CircularProgress color="primary" size={48} />
        <p className="mt-4 text-16px font-medium text-[#212121]">
          본인 인증 정보를 처리 중입니다...
        </p>
      </div>
    </div>
  )
}

export default SignupCallback
