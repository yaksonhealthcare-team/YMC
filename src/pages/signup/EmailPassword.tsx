import { useEffect, useState } from "react"
import CustomTextField from "@components/CustomTextField.tsx"
import { useNavigate } from "react-router-dom"
import { Button } from "@components/Button.tsx"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useSignup } from "../../contexts/SignupContext.tsx"
import PasswordCustomInput from "@components/input/PasswordCustomInput.tsx"
import validateEmail from "../../utils/emailValidator.ts"

export const EmailPassword = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const { signupData, setSignupData } = useSignup()
  const isSocialSignup = !!sessionStorage.getItem("socialSignupInfo")

  const [form, setForm] = useState({
    email: signupData.email || "",
    password: "",
    passwordConfirm: "",
  })

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
  })

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      backgroundColor: "white",
    })
    setNavigation({ display: false })
  }, [])

  useEffect(() => {
    if (isSocialSignup) {
      const socialInfo = JSON.parse(
        sessionStorage.getItem("socialSignupInfo") || "{}",
      )
      if (socialInfo.email) {
        setForm((prev) => ({
          ...prev,
          email: socialInfo.email,
        }))
      }
    }
  }, [])

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "비밀번호는 8자 이상이어야 합니다"
    }
    if (!/[a-z]/.test(password)) {
      return "비밀번호는 영문자를 포함해야 합니다"
    }
    if (!/[0-9]/.test(password)) {
      return "비밀번호는 숫자를 포함해야 합니다"
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "비밀번호는 특수문자를 포함해야 합니다"
    }
    return ""
  }

  const validateEmailField = (email: string) => {
    if (!email) {
      setErrors(prev => ({ ...prev, email: "이메일을 입력해주세요" }))
      return false
    }
    if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: "올바른 이메일 형식이 아닙니다" }))
      return false
    }
    setErrors(prev => ({ ...prev, email: "" }))
    return true
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setForm(prev => ({ ...prev, email: newEmail }))
    validateEmailField(newEmail)
  }

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      passwordConfirm: "",
    }

    // 이메일 검증
    if (!validateEmailField(form.email)) {
      newErrors.email = "이메일을 입력해주세요"
    }

    // 소셜 로그인이 아닌 경우에만 비밀번호 검증
    if (!isSocialSignup) {
      // 비밀번호 검증
      if (!form.password) {
        newErrors.password = "비밀번호를 입력해주세요"
      } else {
        const passwordError = validatePassword(form.password)
        if (passwordError) {
          newErrors.password = passwordError
        }
      }

      // 비밀번호 확인 검증
      if (!form.passwordConfirm) {
        newErrors.passwordConfirm = "비밀번호 재확인을 입력해주세요"
      } else if (form.password !== form.passwordConfirm) {
        newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다"
      }
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== "")
  }

  const handleNavigateToNext = () => {
    if (validateForm()) {
      setSignupData((prev) => ({
        ...prev,
        email: form.email,
        ...(isSocialSignup ? {} : { password: form.password }),
      }))
      navigate("/signup/profile")
    }
  }

  return (
    <div className="flex flex-col px-5 pt-5 pb-7 gap-10">
      <h1 className="text-[20px] font-bold leading-[30px] text-[#212121]">
        {isSocialSignup ? "이메일을" : "이메일과 비밀번호를"}
        <br />
        설정해주세요
      </h1>

      <div className="flex flex-col gap-6">
        <CustomTextField
          label="이메일"
          value={form.email}
          onChange={handleEmailChange}
          placeholder="이메일 계정 입력"
          state={errors.email ? "error" : "default"}
          helperText={errors.email}
        />

        {!isSocialSignup && (
          <PasswordCustomInput
            onPasswordChange={(value) => {
              setForm((prev) => ({ ...prev, password: value }))
              setErrors((prev) => ({ ...prev, password: "" }))
            }}
            onPasswordConfirmChange={(value) => {
              setForm((prev) => ({ ...prev, passwordConfirm: value }))
              setErrors((prev) => ({ ...prev, passwordConfirm: "" }))
            }}
            passwordError={errors.password}
            passwordConfirmError={errors.passwordConfirm}
          />
        )}
      </div>

      <Button variantType="primary" sizeType="l" onClick={handleNavigateToNext}>
        다음
      </Button>
    </div>
  )
}

export default EmailPassword
