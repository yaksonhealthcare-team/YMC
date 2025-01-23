import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useLayout } from "contexts/LayoutContext"
import { Button } from "@components/Button"
import Divider from "@mui/material/Divider"
import { useReservationDetail } from "queries/useReservationQueries"
import SplashScreen from "@components/Splash"
import ReservationSummary from "./_fragments/ReservationSummary"
import Location from "./_fragments/Location"
import MembershipUsage from "./_fragments/MembershipUsage"
import FixedButtonContainer from "@components/FixedButtonContainer"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import { ReservationStatus } from "types/Reservation"

const ReservationDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const { data: reservation, isLoading } = useReservationDetail(id || "")

  useEffect(() => {
    setHeader({
      display: true,
      title: "예약 상세",
      left: (
        <button onClick={() => navigate(-1)} className="p-2">
          <CaretLeftIcon className="w-5 h-5 text-gray-900" />
        </button>
      ),
      backgroundColor: "bg-system-bg",
    })
    setNavigation({ display: false })
  }, [])

  if (isLoading) return <SplashScreen />

  const emptyReservation = {
    id: id || "",
    status: ReservationStatus.CONFIRMED,
    store: "",
    programName: "",
    visit: 0,
    date: new Date(),
    duration: 0,
    request: "",
    additionalServices: [],
  }

  return (
    <div className="flex-1 px-[20px] pt-[16px] pb-[150px] bg-system-bg">
      <ReservationSummary reservation={reservation || emptyReservation} />
      <Button
        variantType="gray"
        sizeType="s"
        className="w-full mt-[24px]"
        onClick={() => navigate("/mypage/questionnaire/reservation")}
      >
        예약 문진 확인하기
      </Button>
      <Location />
      <Divider className="my-[24px] border-gray-100" />
      <MembershipUsage />
      <FixedButtonContainer>
        {(reservation?.status === ReservationStatus.CONFIRMED ||
          !reservation) && (
          <Button
            variantType="primary"
            sizeType="l"
            className="w-full"
            onClick={() => navigate(`/reservation/${id}/cancel`)}
          >
            예약 취소하기
          </Button>
        )}
      </FixedButtonContainer>
    </div>
  )
}

export default ReservationDetailPage
