import { useEffect, useState } from "react"
import CustomTextField from "@components/CustomTextField.tsx"
import { useNavigate } from "react-router-dom"
import { Button } from "@components/Button.tsx"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useSignup } from "../../contexts/SignupContext.tsx"
import PasswordCustomInput from "@components/input/PasswordCustomInput.tsx"
import validatePassword from "../../utils/passwordValidator.ts"
import validateEmail from "../../utils/emailValidator.ts"

export const EmailPassword = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const { setSignupData } = useSignup()

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      backgroundColor: "white",
    })
    setNavigation({ display: false })
  }, [])

  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
  })

  const [isFormValid, setIsFormValid] = useState(false)

  const handlePasswordChange = (value: string) => {
    setForm((prev) => ({ ...prev, password: value }))
  }

  const handlePasswordConfirmChange = (value: string) => {
    setForm((prev) => ({ ...prev, passwordConfirm: value }))
  }

  useEffect(() => {
    if (!form.email || !form.password || !form.passwordConfirm) {
      setIsFormValid(false)
      return
    }

    if (!validateEmail(form.email)) {
      setIsFormValid(false)
      return
    }

    if (form.password !== form.passwordConfirm) {
      setIsFormValid(false)
      return
    }

    if (!validatePassword(form.password)) {
      setIsFormValid(false)
      return
    }

    setIsFormValid(true)
  }, [form])

  const handleNavigateToNext = () => {
    setSignupData((prev) => ({
      ...prev,
      email: form.email,
      password: form.password,
    }))

    navigate("/signup/profile")
  }

  return (
    <div className="flex flex-col px-5 pt-5 pb-7 gap-10">
      <h1 className="text-[20px] font-bold leading-[30px] text-[#212121]">
        이메일과 비밀번호를
        <br />
        설정해주세요
      </h1>

      <div className="flex flex-col gap-6">
        <CustomTextField
          label="이메일"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="이메일 계정 입력"
        />

        <PasswordCustomInput
          onPasswordChange={handlePasswordChange}
          onPasswordConfirmChange={handlePasswordConfirmChange}
        />
      </div>

      <Button
        variantType="primary"
        sizeType="l"
        disabled={!isFormValid}
        onClick={handleNavigateToNext}
      >
        다음
      </Button>
    </div>
  )
}

export default EmailPassword
