import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext"
import { useOverlay } from "../../contexts/ModalContext"
import { TextArea } from "@components/TextArea"
import { Button } from "@components/Button"
import FixedButtonContainer from "@components/FixedButtonContainer"
import ReservationCancelBottomSheetContent from "./_fragments/ReservationCancelBottomSheetContent"
import { Divider } from "@mui/material"
import { useCancelReservation } from "queries/useReservationQueries"

interface ReservationDetail {
  branchName: string
  programName: string
  duration: string
  additionalServices: string[]
  totalPrice: number
  request?: string
}

const ReservationCancelPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { setHeader, setNavigation } = useLayout()
  const { showToast, openBottomSheet } = useOverlay()
  const [cancelReason, setCancelReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [reservation, setReservation] = useState<ReservationDetail>()
  const { mutate: cancelReservation } = useCancelReservation()

  useEffect(() => {
    setHeader({
      display: true,
      title: "예약 취소",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [id])

  const handleConfirmCancel = async () => {
    try {
      setIsLoading(true)
      if (id) {
        cancelReservation(
          {
            reservationId: id,
            cancelMemo: cancelReason,
          },
          {
            onSuccess: () => {
              const closeOverlay = document.querySelector(
                '[aria-label="close"]',
              )
              if (closeOverlay instanceof HTMLElement) {
                closeOverlay.click()
              }
              showToast("예약이 취소되었습니다")
              navigate(`/reservation/${id}`)
            },
            onError: (error) => {
              console.error("예약 취소 실패:", error)
              showToast("예약 취소에 실패했습니다")
            },
            onSettled: () => {
              setIsLoading(false)
            },
          },
        )
      }
    } catch (error) {
      console.error("예약 취소 중 오류 발생:", error)
      showToast("예약 취소에 실패했습니다")
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    if (cancelReason.length < 5) {
      showToast("취소 사유를 5자 이상 입력해주세요.")
      return
    }

    openBottomSheet(
      <ReservationCancelBottomSheetContent onConfirm={handleConfirmCancel} />,
    )
  }

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCancelReason(e.target.value)
  }

  useEffect(() => {
    setReservation({
      branchName: "약손명가 강남구청역점",
      programName: "K-beauty 연예인 관리 A 코스",
      duration: "120분",
      additionalServices: ["얼굴 집중 케어", "콜라겐 집중 관리", "붓기 관리"],
      totalPrice: 100000,
      request: "한달 전 턱 보톡스를 맞았어요! 참고 부탁드립니다 :-)",
    })
  }, [])

  return (
    <div className="w-full flex flex-col pb-[120px]">
      <div className="w-full px-[20px] pt-[16px] pb-[24px] flex flex-col gap-5">
        <h2 className="font-b text-18px text-gray-700">
          {reservation?.branchName}
        </h2>

        <Divider className="my-[24px] border-gray-100" />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="font-sb text-14px text-gray-500">
              관리 프로그램
            </span>
            <span className="font-r text-14px text-gray-700">
              {reservation?.programName}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-sb text-14px text-gray-500">소요시간</span>
            <span className="font-r text-14px text-gray-700">
              {reservation?.duration}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-sb text-14px text-gray-500">추가관리</span>
            <span className="font-r text-14px text-gray-700">
              {reservation?.additionalServices.join(" / ")}
            </span>
            <span className="font-sb text-14px text-gray-700">
              총 {reservation?.totalPrice.toLocaleString()}원
            </span>
          </div>

          {reservation?.request && (
            <div className="flex flex-col gap-1.5">
              <span className="font-sb text-14px text-gray-500">요청사항</span>
              <span className="font-r text-14px text-gray-700">
                {reservation?.request}
              </span>
            </div>
          )}
        </div>
      </div>

      <Divider className="my-[24px] border-gray-50 border-b-[8px]" />

      <div className="flex flex-col gap-3 px-[20px] py-[24px]">
        <h3 className="font-sb text-16px text-gray-700">취소 사유</h3>
        <TextArea
          placeholder="취소 사유를 입력해주세요"
          value={cancelReason}
          onChange={handleTextAreaChange}
          maxLength={100}
          helperText="5자 이상 작성해주세요."
        />
      </div>

      <div className="flex gap-1 px-[20px] pb-[40px]">
        <span className="text-gray-500">*</span>
        <p className="font-r text-14px text-gray-500">
          예약 당일 취소, 노쇼의 경우 예약시 차감된 회원권 횟수가 반환되지
          않습니다.
        </p>
      </div>

      <FixedButtonContainer className="!bg-white">
        <Button
          variantType="primary"
          sizeType="l"
          disabled={cancelReason.length < 5 || isLoading}
          onClick={handleCancel}
          className="w-full"
        >
          예약 취소하기
        </Button>
      </FixedButtonContainer>
    </div>
  )
}

export default ReservationCancelPage
