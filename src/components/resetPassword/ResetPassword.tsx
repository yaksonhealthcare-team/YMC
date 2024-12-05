import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import { Button } from "@components/Button.tsx"
import validatePassword from "../../utils/passwordValidator.ts"
import PasswordCustomInput from "@components/input/PasswordCustomInput.tsx"

interface props {
  requestPasswordChange: (password: string) => void
}

const ResetPassword = ({ requestPasswordChange }: props) => {
  const [form, setForm] = useState({
    password: "",
    passwordConfirm: "",
  })

  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()

  useEffect(() => {
    setHeader({ display: false })
    setNavigation({ display: false })
  }, [])

  const submitPasswordChange = () => {
    requestPasswordChange(form.password)
  }

  const handlePasswordChange = (value: string) => {
    setForm((prev) => ({ ...prev, password: value }))
  }

  const handlePasswordConfirmChange = (value: string) => {
    setForm((prev) => ({ ...prev, passwordConfirm: value }))
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

        <div className="mt-10">
          <PasswordCustomInput
            onPasswordChange={handlePasswordChange}
            onPasswordConfirmChange={handlePasswordConfirmChange}
          />
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
          onClick={submitPasswordChange}
        >
          변경하기
        </Button>
      </div>
    </div>
  )
}

export default ResetPassword
