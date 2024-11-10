import { useEffect, useState } from "react"
import CustomTextField from "@components/CustomTextField.tsx"
import { useNavigate } from "react-router-dom"
import { Button } from "@components/Button.tsx"

import EyeIcon from "../../assets/icons/EyeIcon.svg?react"
import EyeSlashIcon from "../../assets/icons/EyeSlashIcon.svg?react"
import { useLayout } from "../../contexts/LayoutContext.tsx"

export const EmailPassword = () => {
  const { setHeader, setNavigation } = useLayout()

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
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  const navigate = useNavigate()
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

        <div className="flex flex-col gap-1">
          <CustomTextField
            label="비밀번호"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="비밀번호 입력"
            iconRight={
              <button onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            }
          />
          <span className="text-12px text-[#0A84FF] ml-2">
            영문 대문자, 소문자, 숫자, 특수문자를 조합하여 최소 10자리 이상
          </span>
        </div>

        <div className="flex flex-col gap-1">
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
                {showPasswordConfirm ? <EyeSlashIcon /> : <EyeIcon />}
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
      </div>

      <Button
        variantType="primary"
        sizeType="l"
        disabled={
          !form.email ||
          !form.password ||
          form.password !== form.passwordConfirm
        }
        onClick={() => navigate("/signup/profile")}
      >
        다음
      </Button>
    </div>
  )
}

export default EmailPassword
