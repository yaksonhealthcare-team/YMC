import { useState } from "react"
import { useOverlay } from "../contexts/ModalContext"

export const useProfileSetupValidation = () => {
  const { showToast } = useOverlay()
  const [nameError, setNameError] = useState("")

  const validateName = (name: string) => {
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(name)) {
      setNameError("이름에는 특수문자와 숫자를 사용할 수 없습니다")
      return false
    }
    setNameError("")
    return true
  }

  const validateForm = (name: string) => {
    if (!validateName(name)) {
      showToast("이름을 올바르게 입력해주세요")
      return false
    }
    return true
  }

  return {
    nameError,
    validateName,
    validateForm,
  }
}
