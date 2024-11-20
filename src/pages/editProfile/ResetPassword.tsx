import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import CustomTextField from "@components/CustomTextField.tsx"
import EyeIcon from "../../assets/icons/EyeIcon.svg?react"
import EyeSlashIcon from "../../assets/icons/EyeSlashIcon.svg?react"
import { Button } from "@components/Button.tsx"
import { useAuth } from "../../contexts/AuthContext.tsx"
import { resetPassword } from "../../apis/auth.apis.ts"
import validatePassword from "../../utils/passwordValidator.ts"

const ResetPassword = () => {
  const [form, setForm] = useState({
    password: "",
    passwordConfirm: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  const { user } = useAuth()
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()

  useEffect(() => {
    setHeader({ display: false })
    setNavigation({ display: false })
  }, [])

  const handleChangePassword = async () => {
    if (!user) return
    try {
      await resetPassword(user.email, form.password)
      navigate("/profile/reset-password/complete")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={"flex flex-col w-full h-full"}>
      <button className={"px-5 py-4"} onClick={() => navigate(-1)}>
        <CaretLeftIcon className={"w-5 h-5"} />
      </button>
      <div className={"flex flex-col p-5"}>
        <p className={"text-20px font-b"}>
          {"비밀번호를"}
          <br />
          {"재설정해주세요"}
        </p>
        <div className="flex flex-col gap-1 mt-10">
          <CustomTextField
            label="비밀번호"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="비밀번호 입력"
            iconRight={
              <button onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
              </button>
            }
          />
          <span className="text-12px text-[#0A84FF] ml-2">
            영문, 숫자, 특수문자 중 2종류 이상을 조합하여 최소 10자리 이상
          </span>
        </div>
        <div className="flex flex-col gap-1 mt-6">
          <CustomTextField
            label="비밀번호 재확인"
            type={showPasswordConfirm ? "text" : "password"}
            value={form.passwordConfirm}
            onChange={(e) =>
              setForm({ ...form, passwordConfirm: e.target.value })
            }
            placeholder="비밀번호 재입력"
            iconRight={
              <button
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              >
                {showPasswordConfirm ? <EyeIcon /> : <EyeSlashIcon />}
              </button>
            }
          />
          {form.password && form.passwordConfirm && (
            <span
              className="text-12px ml-2"
              style={{
                color:
                  form.password === form.passwordConfirm
                    ? "#0A84FF"
                    : "#FF453A",
              }}
            >
              {form.password === form.passwordConfirm
                ? "비밀번호가 일치합니다"
                : "비밀번호가 일치하지 않습니다"}
            </span>
          )}
        </div>
        <Button
          className={"mt-10"}
          variantType="primary"
          sizeType="l"
          disabled={
            !form.password ||
            form.password !== form.passwordConfirm ||
            !validatePassword(form.password)
          }
          onClick={handleChangePassword}
        >
          변경하기
        </Button>
      </div>
    </div>
  )
}

export default ResetPassword
