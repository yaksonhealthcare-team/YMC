import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext"
import { useOverlay } from "../../contexts/ModalContext"
import { TextArea } from "@components/TextArea"
import { Button } from "@components/Button"
import { Divider } from "@components/Divider"
import FixedButtonContainer from "@components/FixedButtonContainer"

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
  const { showAlert, openMessageBox } = useOverlay()
  const [cancelReason, setCancelReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [reservation, setReservation] = useState<ReservationDetail>({
    branchName: "약손명가 강남구청역점",
    programName: "K-beauty 연예인 관리 A 코스",
    duration: "120분",
    additionalServices: ["얼굴 집중 케어", "콜라겐 집중 관리", "붓기 관리"],
    totalPrice: 100000,
    request: "한달 전 턱 보톡스를 맞았어요! 참고 부탁드립니다 :-)",
  })

  useEffect(() => {
    setHeader({
      display: true,
      title: "예약 취소",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [id])

  const handleCancel = async () => {
    if (cancelReason.length < 5) {
      showAlert("취소 사유를 5자 이상 입력해주세요.")
      return
    }

    openMessageBox("예약을 취소하시겠습니까?", {
      buttons: [
        {
          text: "취소",
          onClick: () => {},
          variant: "text",
        },
        {
          text: "확인",
          onClick: handleConfirmCancel,
          variant: "contained",
        },
      ],
    })
  }

  const handleConfirmCancel = async () => {
    try {
      setIsLoading(true)
      // TODO: API 연동
      // await cancelReservation(id, cancelReason)

      showAlert("예약이 취소되었습니다")
      navigate(-1)
    } catch (error) {
      showAlert("예약 취소에 실패했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCancelReason(e.target.value)
  }

  return (
    <div className="flex flex-col pb-[120px]">
      {/* 예약 정보 카드 */}
      <div className="px-[20px] pt-[16px] pb-[24px] flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <h2 className="font-b text-18px text-gray-700">
            {reservation.branchName}
          </h2>
        </div>

        <Divider type="s_100" />

        <div className="flex flex-col gap-4">
          {/* 관리 프로그램 */}
          <div className="flex flex-col gap-1.5">
            <span className="font-sb text-14px text-gray-500">
              관리 프로그램
            </span>
            <span className="font-r text-14px text-gray-700">
              {reservation.programName}
            </span>
          </div>

          {/* 소요시간 */}
          <div className="flex flex-col gap-1.5">
            <span className="font-sb text-14px text-gray-500">소요시간</span>
            <span className="font-r text-14px text-gray-700">
              {reservation.duration}
            </span>
          </div>

          {/* 추가관리 */}
          <div className="flex flex-col gap-1.5">
            <span className="font-sb text-14px text-gray-500">추가관리</span>
            <span className="font-r text-14px text-gray-700">
              {reservation.additionalServices.join(" / ")}
            </span>
            <span className="font-sb text-14px text-gray-700">
              총 {reservation.totalPrice.toLocaleString()}원
            </span>
          </div>

          {/* 요청사항 */}
          {reservation.request && (
            <div className="flex flex-col gap-1.5">
              <span className="font-sb text-14px text-gray-500">요청사항</span>
              <span className="font-r text-14px text-gray-700">
                {reservation.request}
              </span>
            </div>
          )}
        </div>
      </div>

      <Divider type="m" />

      {/* 취소 사유 입력 */}
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

      {/* 안내 문구 */}
      <div className="flex gap-1 px-[20px] pb-[40px]">
        <span className="text-gray-500">*</span>
        <p className="font-r text-14px text-gray-500">
          예약 당일 취소, 노쇼의 경우 예약시 차감된 회원권 횟수가 반환되지
          않습니다.
        </p>
      </div>

      {/* 하단 버튼 영역 */}
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
