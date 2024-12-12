import { useEffect, useState } from "react"
import { useLayout } from "contexts/LayoutContext"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import { useNavigate } from "react-router-dom"
import { Button } from "@components/Button"
import Location from "./_fragments/Location"
import { Divider } from "@mui/material"
import MembershipUsage from "./_fragments/MembershipUsage"
import { useOverlay } from "contexts/ModalContext"
import CounselingCancelBottomSheetContent from "./_fragments/CounselingCancelBottomSheetContent"
import CancelConfirmBottomSheetContent from "./_fragments/CancelConfirmBottomSheetContent"

const ReservationDetailPage = () => {
  const { setHeader, setNavigation } = useLayout()
  // const [reservationStatus, setReservationStatus] =
  //   useState<ReservationStatus>()
  const { closeOverlay, openBottomSheet } = useOverlay()

  const navigate = useNavigate()

  // useEffect(() => {
  //   setReservationStatus(ReservationStatus.COMPLETED)
  // }, [])

  const handleCancel = async () => {
    openBottomSheet(
      <CounselingCancelBottomSheetContent
        onConfirm={handleConfirmCancel}
        onCancel={closeOverlay}
      />,
    )
  }

  const handleConfirmCancel = async () => {
    // TODO: Call Cancel API
    openBottomSheet(
      <CancelConfirmBottomSheetContent onConfirm={closeOverlay} />,
    )
  }

  // const renderButton = () => {
  //   switch (reservationStatus) {
  //     case ReservationStatus.UPCOMING:
  //       return (
  //         <Button
  //           className="w-full rounded-xl"
  //           onClick={() => {
  //             // TODO: pass the correct reservation id
  //             navigate("/reservation/0/cancel")
  //           }}
  //         >
  //           예약 취소하기
  //         </Button>
  //       )

  //     case ReservationStatus.CANCELED:
  //       return (
  //         <Button className="w-full rounded-xl" onClick={() => {}}>
  //           다시 예약하기
  //         </Button>
  //       )

  //     case ReservationStatus.IN_PROGRESS:
  //       return (
  //         <Button className="w-full rounded-xl" onClick={() => {}}>
  //           방문 완료하기
  //         </Button>
  //       )

  //     case ReservationStatus.COMPLETED:
  //       return (
  //         <div className="flex gap-[8px] ">
  //           <Button
  //             className="flex-1 rounded-xl"
  //             variantType="line"
  //             onClick={() => {
  //               navigate("/review/form")
  //             }}
  //           >
  //             만족도 작성
  //           </Button>
  //           {/* TODO: Show view buttom if review is already written */}
  //           {/* <Button
  //             className="flex-1 rounded-xl"
  //             variantType="line"
  //             onClick={() => {
  //               navigate("/review/0")
  //             }}
  //           >
  //             만족도 보기
  //           </Button> */}
  //           <Button
  //             className="flex-1 rounded-xl"
  //             onClick={() => {
  //               // TODO: pass the correct reservation id and branch id
  //               navigate("/reservation/form")
  //             }}
  //           >
  //             다시 예약하기
  //           </Button>
  //         </div>
  //       )

  //     case ReservationStatus.COUNSELING_CONFIRMED:
  //       return (
  //         <Button className="w-full rounded-xl" onClick={handleCancel}>
  //           예약 취소하기
  //         </Button>
  //       )

  //     case ReservationStatus.COUNSELING_CANCELED:
  //       return null

  //     default:
  //       return null
  //   }
  // }

  useEffect(() => {
    setHeader({
      display: true,
      title: "약손명가 강남구청역점",
      left: (
        <div onClick={() => navigate(-1)}>
          <CaretLeftIcon className="w-5 h-5" />
        </div>
      ),
    })
    setNavigation({ display: false })
  }, [])

  return (
    <div className="flex-1 px-[20px] pt-[16px] pb-[150px] bg-system-bg">
      {/* {reservationStatus && (
        <ReservationSummary reservationStatus={reservationStatus} />
      )} */}
      <Button variantType="gray" sizeType="s" className="w-full mt-[24px]">
        예약 문진 확인하기
      </Button>
      <Location />
      <Divider className="my-[24px] border-gray-100" />
      <MembershipUsage />
      {/* <FixedButtonContainer>{renderButton()}</FixedButtonContainer> */}
    </div>
  )
}

export default ReservationDetailPage
