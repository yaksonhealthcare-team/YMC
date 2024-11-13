import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import CustomTextField from "@components/CustomTextField.tsx"
import { Button } from "@components/Button"
import { useOverlay } from "../../contexts/ModalContext"
import { useLayout } from "../../contexts/LayoutContext"
import EyeIcon from "../../assets/icons/EyeIcon.svg?react"
import EyeSlashIcon from "../../assets/icons/EyeSlashIcon.svg?react"
import { fetchUser, loginWithEmail } from "../../apis/auth.apis.ts"

interface LoginForm {
  email: string
  password: string
}

const EmailLogin = () => {
  const { setHeader, setNavigation } = useLayout()
  const { login } = useAuth()
  const navigate = useNavigate()
  const { showAlert } = useOverlay()
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)

  const isFormValid = formData.email.length > 0 && formData.password.length > 0

  useEffect(() => {
    setHeader({
      display: true,
      title: "이메일 로그인",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async () => {
    if (!formData.email || !validateEmail(formData.email)) {
      showAlert("올바른 이메일을 입력해주세요")
      return
    }
    if (!formData.password) {
      showAlert("비밀번호를 입력해주세요")
      return
    }

    try {
      const { accessToken } = await loginWithEmail({ username: formData.email, password: formData.password })
      const user = await fetchUser(accessToken)

      login({
        user: user,
        token: accessToken,
      })
      navigate("/")
    } catch (error) {
      showAlert("로그인에 실패했습니다")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="flex flex-col px-5">
      <div className="mt-[84px] flex flex-col gap-6">
        {/* 이메일 입력 */}
        <div className="flex flex-col gap-2">
          <span className="font-m text-14px text-[#212121]">이메일</span>
          <CustomTextField
            name="email"
            placeholder="이메일 계정 입력"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* 비밀번호 입력 */}
        <CustomTextField
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호 입력"
          value={formData.password}
          onChange={handleChange}
          iconRight={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-6 h-6 text-[#BDBDBD]" />
              ) : (
                <EyeIcon className="w-6 h-6 text-[#BDBDBD]" />
              )}
            </button>
          }
        />

        {/* 로그인 버튼 */}
        <Button
          variantType="primary"
          sizeType="l"
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={
            !isFormValid
              ? "bg-[#ECECEC] !text-[#9E9E9E] hover:bg-[#ECECEC]"
              : ""
          }
        >
          로그인
        </Button>
      </div>

      {/* 이메일/비밀번호 찾기 */}
      <div className="flex justify-end mt-10">
        <button
          onClick={() => navigate("/find-credentials")}
          className="font-m text-16px text-[#757575]"
        >
          이메일 / 비밀번호 찾기
        </button>
      </div>
    </div>
  )
}

export default EmailLogin
