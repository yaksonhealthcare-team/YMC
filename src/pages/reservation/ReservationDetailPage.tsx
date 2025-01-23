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

// 테스트용 임시 데이터
const mockReservation = {
  id: "35439",
  status: ReservationStatus.CONFIRMED, // 상태는 enum 타입이어야 함
  store: "", // 매장명 없음 테스트
  programName: "", // 프로그램명 없음 테스트
  visit: 1,
  date: new Date("invalid date"), // 날짜 정보 없음 테스트
  duration: 0, // 소요시간 없음 테스트
  request: "", // 요청사항 없음 테스트
  branchId: "1",
  address: "", // 주소 없음 테스트
  latitude: 0, // 위치 정보 없음 테스트
  longitude: 0,
  phone: "", // 전화번호 없음 테스트
  additionalServices: [], // 추가 관리 없음 테스트
}

// 테스트용 회원권 데이터
const mockMembership = {
  membershipName: "", // 회원권명 없음 테스트
  branchName: "", // 지점명 없음 테스트
  remainingCount: "", // 잔여 횟수 없음 테스트
}

const ReservationDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const {
    data: reservation,
    isLoading,
    isError,
  } = useReservationDetail(id || "")

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

  // 테스트를 위해 mockReservation 사용
  const currentReservation = mockReservation // reservation || mockReservation

  return (
    <div className="flex-1 px-[20px] pt-[16px] pb-[150px] bg-system-bg">
      <ReservationSummary reservation={currentReservation} />
      <Button
        variantType="gray"
        sizeType="s"
        className="w-full mt-[24px]"
        onClick={() => navigate("/mypage/questionnaire/reservation")}
      >
        예약 문진 확인하기
      </Button>
      <Location reservation={currentReservation} />
      <Divider className="my-[24px] border-gray-100" />
      <MembershipUsage
        membershipName={mockMembership.membershipName}
        branchName={mockMembership.branchName}
        remainingCount={mockMembership.remainingCount}
      />
      <FixedButtonContainer>
        {currentReservation.status === ReservationStatus.CONFIRMED && (
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
