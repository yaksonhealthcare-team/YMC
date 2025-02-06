import { AxiosError } from "axios"
import { useOverlay } from "../contexts/ModalContext"
import { getErrorMessage } from "../types/Error"

export const useErrorHandler = () => {
  const { showToast } = useOverlay()

  const handleError = (error: unknown, defaultMessage?: string) => {
    if (error instanceof AxiosError) {
      const errorCode = error.response?.data?.resultCode || ""
      const errorMessage =
        error.response?.data?.resultMessage || getErrorMessage(errorCode)
      showToast(errorMessage)
      return
    }

    if (error instanceof Error) {
      showToast(error.message)
      return
    }

    showToast(defaultMessage || "알 수 없는 오류가 발생했습니다")
  }

  return { handleError }
}
