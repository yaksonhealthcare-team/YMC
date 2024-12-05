import CustomTextField from "@components/CustomTextField.tsx"
import { useEffect, useState } from "react"
import EyeIcon from "../../assets/icons/EyeIcon.svg?react"
import EyeSlashIcon from "../../assets/icons/EyeSlashIcon.svg?react"
import validatePassword from "../../utils/passwordValidator.ts"

interface props {
  onPasswordChange: (value: string) => void
  onPasswordConfirmChange: (value: string) => void
}

const PasswordCustomInput = ({
  onPasswordChange,
  onPasswordConfirmChange,
}: props) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")

  const [isValidationPassword, setIsValidationPassword] = useState(false)

  useEffect(() => {
    onPasswordChange(password)
    setIsValidationPassword(validatePassword(password))
  }, [password])

  useEffect(() => {
    onPasswordConfirmChange(passwordConfirm)
  }, [passwordConfirm])

  return (
    <div>
      <div className="flex flex-col gap-1">
        <CustomTextField
          label="비밀번호"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
          iconRight={
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
            </button>
          }
        />
        <span
          className={`text-12px ${isValidationPassword ? "text-success" : "text-error"} ml-2`}
        >
          영문, 숫자, 특수문자 중 2종류 이상을 조합하여 최소 10자리 이상
        </span>
      </div>

      <div className="flex flex-col gap-1 mt-6">
        <CustomTextField
          label="비밀번호 재확인"
          type={showPasswordConfirm ? "text" : "password"}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="비밀번호 재입력"
          iconRight={
            <button
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            >
              {showPasswordConfirm ? <EyeIcon /> : <EyeSlashIcon />}
            </button>
          }
        />
        {password && passwordConfirm && (
          <span
            className={`text-12px ml-2 ${password === passwordConfirm ? "text-success" : "text-error"}`}
          >
            {password === passwordConfirm
              ? "비밀번호가 일치합니다"
              : "비밀번호가 일치하지 않습니다"}
          </span>
        )}
      </div>
    </div>
  )
}

export default PasswordCustomInput
