import { useNavigate } from "react-router-dom"
import { AdditionalManagement } from "types/Membership"
import { Dayjs } from "dayjs"
import { TimeSlot } from "types/Schedule"
import { useErrorHandler } from "./useErrorHandler"
import { Dispatch, SetStateAction } from "react"

interface FormDataType {
  item: undefined | string
  branch: undefined | string
  date: null | Dayjs
  timeSlot: null | TimeSlot
  request: string
  additionalServices: AdditionalManagement[]
}

interface UseReservationHandlersProps {
  data: FormDataType
  setData: Dispatch<SetStateAction<FormDataType>>
  brandCode: string
}

export const useReservationHandlers = ({
  data,
  setData,
  brandCode,
}: UseReservationHandlersProps) => {
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()

  const handleOnChangeItem = (value: string) => {
    setData((prev) => ({
      ...prev,
      item: value,
      date: null,
      timeSlot: null,
      additionalServices: [],
    }))
  }

  const handleDateTimeSelect = (
    date: Dayjs | null,
    timeSlot: TimeSlot | null,
  ) => {
    setData((prev) => ({
      ...prev,
      date,
      timeSlot,
    }))
  }

  const handleAdditionalServiceChange = (
    checked: boolean,
    service: AdditionalManagement,
  ) => {
    setData((prev) => {
      const newServices = checked
        ? [...prev.additionalServices, service]
        : prev.additionalServices.filter((s) => s.s_idx !== service.s_idx)

      return {
        ...prev,
        additionalServices: newServices,
      }
    })
  }

  const handleNavigateBranchSelect = () => {
    if (!data.item) {
      handleError(new Error("회원권을 먼저 선택해주세요."))
      return
    }
    navigate("/membership/select-branch", {
      state: {
        returnPath: "/reservation/form",
        selectedItem: data.item,
        brand_code: brandCode,
      },
    })
  }

  return {
    handleOnChangeItem,
    handleDateTimeSelect,
    handleAdditionalServiceChange,
    handleNavigateBranchSelect,
  }
}
