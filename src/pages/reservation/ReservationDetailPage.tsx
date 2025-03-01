import { useEffect, useState } from "react"
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
import { ReservationType } from "types/Reservation"
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
  const { mutate } = useCompleteVisit()
  const { openModal, openBottomSheet, closeOverlay, overlayState } =
    useOverlay()
  const {
    data: reservation,
    isLoading,
    isError,
    error,
  } = useReservationDetail(id || "")
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  useEffect(() => {
    setHeader({
      display: true,
      title: "예약 상세",
      left: "back",
      backgroundColor: "bg-system-bg",
    })
    setNavigation({ display: false })
  }, [navigate, setHeader, setNavigation])

  // 바텀 시트 상태 감지
  useEffect(() => {
    if (overlayState.isOpen && overlayState.type === "bottomSheet") {
      setIsBottomSheetOpen(true)
    } else {
      setIsBottomSheetOpen(false)
    }
  }, [overlayState])

  const handleCompleteVisit = () => {
    openModal({
      title: "방문 완료",
      message: "방문을 완료하시겠습니까?",
      onConfirm: () => {
        if (id) {
          mutate(id, {
            onSuccess: () => {
              openModal({
                title: "완료",
                message: "방문 완료 처리되었습니다.",
                onConfirm: () => {},
              })
            },
            onError: (error) => {
              openModal({
                title: "오류",
                message:
                  error instanceof Error
                    ? error.message
                    : "방문 완료 처리에 실패했습니다.",
                onConfirm: () => {},
              })
            },
          })
        }
      },
    })
  }

  const handleCancelReservation = () => {
    openBottomSheet(
      <div className="flex flex-col">
        <p className="mx-5 mt-5 font-sb text-18px">취소하시겠습니까?</p>
        <p className="mx-5 mt-2 font-r text-16px text-gray-900">
          예약 취소 시 차감된 상담 횟수는 복원됩니다.
        </p>
        <div className="mt-10 border-t border-gray-50 flex gap-2 py-3 px-5">
          <Button
            className="w-full"
            variantType="line"
            onClick={() => {
              closeOverlay()
              navigate(`/reservation/${id}/cancel`, {
                state: {
                  r_idx: reservation?.id,
                  r_date: reservation?.date.toISOString(),
                  b_name: reservation?.store,
                  ps_name: reservation?.programName,
                },
              })
            }}
          >
            취소하기
          </Button>
          <Button
            className="w-full"
            variantType="primary"
            onClick={(e) => {
              e.preventDefault()
              closeOverlay()
            }}
          >
            돌아가기
          </Button>
        </div>
      </div>,
    )
  }

  const renderActionButtons = () => {
    if (!reservation) return null

    const now = new Date()
    const reservationEndTime = new Date(reservation.date)
    const [hours, minutes] = reservation.duration.split(":").map(Number)
    reservationEndTime.setHours(reservationEndTime.getHours() + (hours || 0))
    reservationEndTime.setMinutes(
      reservationEndTime.getMinutes() + (minutes || 0),
    )

    switch (reservation.status) {
      case "000": // 관리완료
        return (
          <div className="flex gap-[8px]">
            <Button
              variantType="line"
              sizeType="l"
              className="flex-1"
              onClick={() =>
                navigate(`/reservation/${id}/satisfaction`, {
                  state: {
                    r_idx: reservation.id,
                    r_date: reservation.date.toISOString(),
                    b_name: reservation.store,
                    ps_name: reservation.programName,
                    review_items: [
                      { rs_idx: "1", rs_type: "시술만족도" },
                      { rs_idx: "2", rs_type: "친절도" },
                      { rs_idx: "3", rs_type: "청결도" },
                    ],
                  },
                })
              }
            >
              만족도 작성
            </Button>
            <Button
              variantType="primary"
              sizeType="l"
              className="flex-1"
              onClick={() => navigate("/reservation/form")}
            >
              다시 예약하기
            </Button>
          </div>
        )

      case "001": // 예약완료
        if (now > reservationEndTime) {
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
        }
        return (
          <Button
            variantType="primary"
            sizeType="l"
            className="w-full"
            onClick={handleCancelReservation}
          >
            예약 취소하기
          </Button>
        )

      case "008": // 관리중
        if (now > reservationEndTime) {
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
        }
        return null

      case "002": // 방문완료
        return (
          <div className="flex gap-[8px]">
            <Button
              variantType="line"
              sizeType="l"
              className="flex-1"
              onClick={() =>
                navigate(`/reservation/${id}/satisfaction`, {
                  state: {
                    r_idx: reservation.id,
                    r_date: reservation.date.toISOString(),
                    b_name: reservation.store,
                    ps_name: reservation.programName,
                    review_items: [
                      { rs_idx: "1", rs_type: "시술만족도" },
                      { rs_idx: "2", rs_type: "친절도" },
                      { rs_idx: "3", rs_type: "청결도" },
                    ],
                  },
                })
              }
            >
              만족도 작성
            </Button>
            <Button
              variantType="primary"
              sizeType="l"
              className="flex-1"
              onClick={() => navigate("/reservation/form")}
            >
              다시 예약하기
            </Button>
          </div>
        )

      case "003": // 예약취소
        return (
          <Button
            variantType="primary"
            sizeType="l"
            className="w-full"
            onClick={() => navigate("/reservation/form")}
          >
            다시 예약하기
          </Button>
        )

      default:
        console.log("Status not handled:", reservation.status)
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
      {!isBottomSheetOpen && (
        <FixedButtonContainer className="z-[200]">
          {renderActionButtons()}
        </FixedButtonContainer>
      )}
    </div>
  )
}

export default ReservationDetailPage
