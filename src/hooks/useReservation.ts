import { useState } from "react"
import { Dayjs } from "dayjs"
import { AdditionalManagement } from "types/Membership"
import { TimeSlot } from "types/Schedule"
import { useCreateReservationMutation } from "queries/useReservationQueries"
import { useErrorHandler } from "./useErrorHandler"
import { formatDateForAPI } from "utils/date"
import { toNumber } from "utils/number"
import { useReservationValidation } from "./useReservationValidation"
import { useOverlay } from "contexts/ModalContext"
import { useNavigate } from "react-router-dom"

interface FormDataType {
  item: undefined | string
  branch: undefined | string
  date: null | Dayjs
  timeSlot: null | TimeSlot
  request: string
  additionalServices: AdditionalManagement[]
}

export const useReservation = () => {
  const navigate = useNavigate()
  const { openModal } = useOverlay()
  const { handleError } = useErrorHandler()
  const { validateReservationData } = useReservationValidation()
  const { mutateAsync: createReservation } = useCreateReservationMutation()

  const [data, setData] = useState<FormDataType>({
    item: undefined,
    branch: undefined,
    date: null,
    timeSlot: null,
    request: "",
    additionalServices: [],
  })

  const handleConsultationReservation = async (returnPath?: string) => {
    try {
      if (!validateReservationData(data)) return

      const response = await createReservation({
        r_gubun: "C",
        b_idx: data.branch!,
        r_date: formatDateForAPI(data.date?.toDate() || null),
        r_stime: data.timeSlot!.time,
        r_memo: data.request,
      })

      if (response.resultCode !== "00") {
        handleError(new Error(response.resultMessage))
        return
      }

      openModal({
        title: "예약 완료",
        message: "상담 예약이 완료되었습니다.",
        onConfirm: () => {
          if (returnPath) {
            navigate(returnPath, {
              state: {
                type: data.item,
                branch: data.branch,
                date: formatDateForAPI(data.date?.toDate() || null),
                time: data.timeSlot?.time,
                additionalServices: data.additionalServices,
                request: data.request,
              },
            })
          }
        },
      })
    } catch (error) {
      handleError(error, "상담 예약에 실패했습니다. 다시 시도해주세요.")
    }
  }

  const handleMembershipReservation = async () => {
    try {
      if (!validateReservationData(data)) return

      const response = await createReservation({
        r_gubun: "R",
        mp_idx: data.item,
        b_idx: data.branch!,
        r_date: formatDateForAPI(data.date?.toDate() || null),
        r_stime: data.timeSlot!.time,
        add_services: data.additionalServices.map((service) =>
          toNumber(service.s_idx),
        ),
        r_memo: data.request,
      })

      if (response.resultCode !== "00") {
        handleError(new Error(response.resultMessage))
        return
      }

      navigate("/payment", {
        state: {
          type: "membership",
          item: data.item,
          branch: data.branch,
          date: formatDateForAPI(data.date?.toDate() || null),
          time: data.timeSlot?.time,
          additionalServices: data.additionalServices,
          request: data.request,
        },
      })
    } catch (error) {
      handleError(error, "예약에 실패했습니다. 다시 시도해주세요.")
    }
  }

  return {
    data,
    setData,
    handleConsultationReservation,
    handleMembershipReservation,
  }
}
