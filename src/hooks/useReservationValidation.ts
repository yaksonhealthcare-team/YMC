import { Dayjs } from "dayjs"
import { AdditionalManagement } from "types/Membership"
import { TimeSlot } from "types/Schedule"
import { useErrorHandler } from "./useErrorHandler"

interface ReservationFormData {
  item?: string
  branch?: string
  date: Dayjs | null
  timeSlot: TimeSlot | null
  request: string
  additionalServices: AdditionalManagement[]
}

export const useReservationValidation = () => {
  const { handleError } = useErrorHandler()

  const validateReservationData = (data: ReservationFormData) => {
    if (!data.item) {
      handleError(new Error("회원권을 먼저 선택해주세요."))
      return false
    }
    if (!data.date || !data.timeSlot) {
      handleError(new Error("예약 날짜와 시간을 선택해주세요."))
      return false
    }
    if (!data.branch) {
      handleError(new Error("지점을 선택해주세요."))
      return false
    }
    return true
  }

  return {
    validateReservationData,
  }
}
