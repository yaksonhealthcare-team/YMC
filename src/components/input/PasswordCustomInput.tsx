import { useEffect, useState } from "react"
import CustomTextField from "../CustomTextField"
import EyeIcon from "../../assets/icons/EyeIcon.svg?react"
import EyeSlashIcon from "../../assets/icons/EyeSlashIcon.svg?react"
import validatePassword from "../../utils/passwordValidator"

interface props {
  onPasswordChange: (value: string) => void
  onPasswordConfirmChange: (value: string) => void
  passwordError?: string
  passwordConfirmError?: string
}

const PasswordCustomInput = ({
  onPasswordChange,
  onPasswordConfirmChange,
  passwordError,
  passwordConfirmError,
}: props) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")

  useEffect(() => {
    onPasswordChange(password)
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
          state={
            passwordError
              ? "error"
              : password && !validatePassword(password)
                ? "error"
                : "default"
          }
          helperText={passwordError}
          iconRight={
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
            </button>
          }
        />
        {!passwordError && password && (
          <span
            className={`text-12px ml-2 ${
              validatePassword(password) ? "text-success" : "text-error"
            }`}
          >
            10-20자, 영문 대/소문자, 숫자, 특수문자 포함
          </span>
        )}
        {!passwordError && !password && (
          <span className="text-12px text-gray-400 ml-2">
            10-20자, 영문 대/소문자, 숫자, 특수문자 포함
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 mt-6">
        <CustomTextField
          label="비밀번호 재확인"
          type={showPasswordConfirm ? "text" : "password"}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="비밀번호 재입력"
          state={
            passwordConfirmError
              ? "error"
              : password && passwordConfirm && password !== passwordConfirm
                ? "error"
                : "default"
          }
          helperText={passwordConfirmError}
          iconRight={
            <button
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            >
              {showPasswordConfirm ? <EyeIcon /> : <EyeSlashIcon />}
            </button>
          }
        />
        {!passwordConfirmError && password && passwordConfirm && (
          <span
            className={`text-12px ml-2 ${
              password === passwordConfirm ? "text-success" : "text-error"
            }`}
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
