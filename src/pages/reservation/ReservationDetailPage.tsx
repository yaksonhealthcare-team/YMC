import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useLayout } from "contexts/LayoutContext"
import { Button } from "@components/Button"
import Divider from "@mui/material/Divider"
import {
  useReservationDetail,
  useCompleteVisit,
} from "queries/useReservationQueries"
import ReservationSummary from "./_fragments/ReservationSummary"
import Location from "./_fragments/Location"
import MembershipUsage from "./_fragments/MembershipUsage"
import FixedButtonContainer from "@components/FixedButtonContainer"
import { ReservationStatus, ReservationType } from "types/Reservation"
import { Skeleton } from "@mui/material"
import { useOverlay } from "contexts/ModalContext"

const LoadingSkeleton = () => (
  <div className="flex-1 px-[20px] pt-[16px] pb-[150px] bg-system-bg">
    {/* 예약 정보 스켈레톤 */}
    <div className="flex flex-col gap-2">
      <Skeleton variant="rectangular" width={100} height={24} />
      <Skeleton variant="rectangular" width="100%" height={120} />
    </div>

    {/* 예약 문진 버튼 스켈레톤 */}
    <Skeleton
      variant="rectangular"
      width="100%"
      height={40}
      className="mt-[24px]"
    />

    {/* 위치 정보 스켈레톤 */}
    <div className="mt-[24px]">
      <Skeleton variant="rectangular" width={80} height={24} />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={200}
        className="mt-[16px]"
      />
      <div className="mt-[16px] flex flex-col gap-[12px]">
        <Skeleton variant="rectangular" width="100%" height={40} />
        <Skeleton variant="rectangular" width="100%" height={40} />
      </div>
    </div>

    <Divider className="my-[24px] border-gray-100" />

    {/* 회원권 정보 스켈레톤 */}
    <div className="flex flex-col gap-2">
      <Skeleton variant="rectangular" width={120} height={24} />
      <Skeleton variant="rectangular" width="100%" height={80} />
    </div>
  </div>
)

const ReservationDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const { mutate: completeVisit } = useCompleteVisit()
  const { openModal } = useOverlay()
  const {
    data: reservation,
    isLoading,
    isError,
    error,
  } = useReservationDetail(id || "")

  useEffect(() => {
    setHeader({
      display: true,
      title: "예약 상세",
      left: "back",
      backgroundColor: "bg-system-bg",
    })
    setNavigation({ display: false })
  }, [navigate, setHeader, setNavigation])

  const handleCompleteVisit = () => {
    openModal({
      title: "방문 완료",
      message: "방문을 완료하시겠습니까?",
      onConfirm: () => {
        if (id) {
          completeVisit(id)
        }
      },
    })
  }

  const renderActionButtons = () => {
    if (!reservation) return null

    switch (reservation.status) {
      case ReservationStatus.CONFIRMED:
        return (
          <Button
            variantType="primary"
            sizeType="l"
            className="w-full"
            onClick={() => navigate(`/reservation/${id}/cancel`)}
          >
            예약 취소하기
          </Button>
        )

      case ReservationStatus.CUSTOMER_CANCELLED:
      case ReservationStatus.STORE_CANCELLED:
        return (
          <Button
            variantType="primary"
            sizeType="l"
            className="w-full"
            onClick={() => navigate("/reservation")}
          >
            다시 예약하기
          </Button>
        )

      case ReservationStatus.IN_PROGRESS:
        return (
          <Button
            variantType="primary"
            sizeType="l"
            className="w-full"
            onClick={handleCompleteVisit}
          >
            방문 완료하기
          </Button>
        )

      case ReservationStatus.COMPLETED:
        return (
          <div className="flex gap-[8px]">
            <Button
              variantType="line"
              sizeType="l"
              className="flex-1"
              onClick={() => navigate("/reservation")}
            >
              다시 예약하기
            </Button>
            <Button
              variantType="primary"
              sizeType="l"
              className="flex-1"
              onClick={() => navigate(`/reservation/${id}/satisfaction`)}
            >
              만족도 작성
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) return <LoadingSkeleton />
  if (isError)
    return (
      <div className="p-5 text-red-500">
        에러가 발생했습니다:{" "}
        {error instanceof Error ? error.message : "알 수 없는 에러"}
      </div>
    )
  if (!reservation)
    return <div className="p-5">예약 정보를 찾을 수 없습니다.</div>

  return (
    <div className="flex-1 px-[20px] pt-[16px] pb-[150px] bg-system-bg">
      <ReservationSummary reservation={reservation} />
      <Button
        variantType="line"
        sizeType="s"
        className="w-full mt-[24px]"
        onClick={() => navigate("/mypage/questionnaire/reservation")}
      >
        예약 문진 확인하기
      </Button>
      <Location reservation={reservation} />
      <Divider className="my-[24px] border-gray-100" />
      {reservation.type === ReservationType.MANAGEMENT && (
        <MembershipUsage
          membershipName={reservation.membershipName}
          branchName={reservation.branchName}
          remainingCount={reservation.remainingCount}
        />
      )}
      <FixedButtonContainer className="z-[200]">
        {renderActionButtons()}
      </FixedButtonContainer>
    </div>
  )
}

export default ReservationDetailPage
