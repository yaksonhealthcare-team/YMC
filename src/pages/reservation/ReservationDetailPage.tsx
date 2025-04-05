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
import dayjs from "dayjs"

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
  } = useReservationDetail(id ?? "")
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (reservation) {
      console.log("Reservation loaded, initializing map with:", {
        branchId: reservation.branchId,
        branchName: reservation.branchName,
        store: reservation.store,
        status: reservation.statusCode,
      })
    }
  }, [reservation])

  useEffect(() => {
    setHeader({
      display: true,
      title: "예약 상세",
      left: "back",
      backgroundColor: "bg-system-bg",
    })
    setNavigation({ display: false })
  }, [navigate, setHeader, setNavigation])

  // 오버레이 상태 감지
  useEffect(() => {
    if (overlayState.isOpen) {
      if (overlayState.type === "bottomSheet") {
        setIsBottomSheetOpen(true)
      } else if (overlayState.type === "modal") {
        setIsModalOpen(true)
      }
    } else {
      setIsBottomSheetOpen(false)
      setIsModalOpen(false)
    }
  }, [overlayState])

  const handleVisitSuccess = () => {
    openModal({
      title: "완료",
      message: "방문 완료 처리되었습니다.",
      onConfirm: () => {},
    })
  }

  const handleVisitError = (error: unknown) => {
    openModal({
      title: "오류",
      message:
        error instanceof Error
          ? error.message
          : "방문 완료 처리에 실패했습니다.",
      onConfirm: () => {},
    })
  }

  const handleVisitConfirm = () => {
    if (id) {
      mutate(id, {
        onSuccess: handleVisitSuccess,
        onError: handleVisitError,
      })
    }
  }

  const handleCompleteVisit = () => {
    openModal({
      title: "방문 완료",
      message: "방문을 완료하시겠습니까?",
      onConfirm: handleVisitConfirm,
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
                replace: true,
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
            onClick={() => closeOverlay()}
          >
            돌아가기
          </Button>
        </div>
      </div>,
    )
  }

  const handleNavigateToReservationForm = () => {
    if (!reservation) return

    // 현재 경로 가져오기
    const currentPath = window.location.pathname

    const state = {
      fromReservation: {
        item:
          reservation.type === ReservationType.MANAGEMENT
            ? reservation.membershipId
            : "상담 예약",
        branch: reservation.branchId,
        date: dayjs(reservation.date).format("YYYY-MM-DD"),
        timeSlot: { time: reservation.duration },
        request: reservation.request || "",
        additionalServices: reservation.additionalServices || [],
        remainingCount: reservation.remainingCount,
        membershipId: reservation.membershipId,
      },
      membershipId: reservation.membershipId,
      fromReservationDetail: true,
      originalPath: currentPath,
      selectedBranch: {
        b_idx: reservation.branchId,
        b_name: reservation.store,
      },
    }
    navigate("/reservation/form", { state })
  }

  const renderActionButtons = () => {
    if (!reservation) return null

    const now = new Date()

    // 원본 날짜를 복제하여 사용
    const reservationDate = new Date(reservation.date)

    // 날짜가 올바르게 파싱되었는지 확인 (예약 날짜가 유효한지)
    if (isNaN(reservationDate.getTime())) {
      console.error("예약 날짜가 유효하지 않습니다:", reservation.date)
      return null
    }

    // 소요 시간을 파싱
    let hours = 0
    let minutes = 0
    if (reservation.duration) {
      const durationParts = reservation.duration.split(":")
      hours = parseInt(durationParts[0], 10) || 0
      minutes = parseInt(durationParts[1], 10) || 0
    }

    // 예약 종료 시간 계산 (별도의 변수로 저장)
    const reservationEndTime = new Date(reservationDate)
    reservationEndTime.setHours(reservationEndTime.getHours() + hours)
    reservationEndTime.setMinutes(reservationEndTime.getMinutes() + minutes)

    // 현재 시간이 예약 날짜(시작 시간)보다 이후인지 확인
    const isReservationDatePassed = now.getTime() > reservationDate.getTime()

    switch (reservation.statusCode) {
      case "000": // 전체
      case "002": // 방문완료
        return (
          <div className="flex gap-[8px]">
            {reservation.reviewPositiveYn === "Y" ? (
              <>
                <Button
                  variantType="line"
                  sizeType="l"
                  className={`flex-1 ${isModalOpen ? "opacity-50 cursor-not-allowed" : ""}`}
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
                  disabled={isModalOpen}
                >
                  만족도 작성
                </Button>
                <Button
                  variantType="primary"
                  sizeType="l"
                  className={`flex-1 ${isModalOpen ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={handleNavigateToReservationForm}
                  disabled={isModalOpen}
                >
                  다시 예약하기
                </Button>
              </>
            ) : (
              <Button
                variantType="primary"
                sizeType="l"
                className={`w-full ${isModalOpen ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleNavigateToReservationForm}
                disabled={isModalOpen}
              >
                다시 예약하기
              </Button>
            )}
          </div>
        )

      case "001": // 예약완료
        if (isReservationDatePassed) {
          return (
            <Button
              variantType="primary"
              sizeType="l"
              className={`w-full ${isModalOpen ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleCompleteVisit}
              disabled={isModalOpen}
            >
              방문 완료하기
            </Button>
          )
        }
        return (
          <Button
            variantType="primary"
            sizeType="l"
            className={`w-full ${isModalOpen ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleCancelReservation}
            disabled={isModalOpen}
          >
            예약 취소하기
          </Button>
        )

      case "008": // 관리중
        if (isReservationDatePassed) {
          return (
            <Button
              variantType="primary"
              sizeType="l"
              className={`w-full ${isModalOpen ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleCompleteVisit}
              disabled={isModalOpen}
            >
              방문 완료하기
            </Button>
          )
        }
        return null

      case "003": // 예약취소
        return (
          <Button
            variantType="primary"
            sizeType="l"
            className={`w-full ${isModalOpen ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleNavigateToReservationForm}
            disabled={isModalOpen}
          >
            다시 예약하기
          </Button>
        )

      default:
        console.log("Status not handled:", reservation.statusCode)
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
          membershipId={reservation.mp_idx}
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
