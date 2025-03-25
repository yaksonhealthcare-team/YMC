import { useLayout } from "contexts/LayoutContext"
import { useEffect, useCallback, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import { MembershipCard } from "@components/MembershipCard"
import { MembershipStatus, MembershipDetailWithHistory } from "types/Membership"
import DateAndTime from "@components/DateAndTime"
import CartIcon from "@components/icons/CartIcon.tsx"
import { fetchMembershipUsageHistory } from "../../apis/membership.api"
import { CircularProgress } from "@mui/material"

interface ReservationThumbnailProps {
  title: string
  date: Date
  onClick: () => void
}

const ReservationThumbnail = ({
  title,
  date,
  onClick,
}: ReservationThumbnailProps) => {
  return (
    <div
      className={
        "flex flex-col gap-[12px] justify-between bg-white p-5 border border-gray-100 shadow-card rounded-[20px]"
      }
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <span className="font-b text-gray-700">{title}</span>
        <CaretRightIcon className="w-[16px] h-[16px]" />
      </div>
      <DateAndTime date={date} />
    </div>
  )
}

const MembershipUsageHistory = () => {
  const { setHeader, setNavigation } = useLayout()
  const { id } = useParams<{ id: string }>()
  const [memberShipDetail, setMemberShipDetail] =
    useState<MembershipDetailWithHistory>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const page = 1
  const pageSize = 50

  const navigate = useNavigate()

  const fetchData = useCallback(async () => {
    if (!id) return
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchMembershipUsageHistory(id, page, pageSize)
      setMemberShipDetail(data)
    } catch (error) {
      console.error("Failed to fetch membership history:", error)
      setError(
        error instanceof Error
          ? error.message
          : "회원권 이용내역을 불러오는데 실패했습니다.",
      )
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    setHeader({
      display: true,
      title: "회원권 이용내역",
      left: "back",
      right: <CartIcon />,
    })
    setNavigation({
      display: true,
      activeTab: "예약/회원권",
    })
    fetchData()
  }, [setHeader, setNavigation, fetchData])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-82px)]">
        <CircularProgress />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-82px)] text-gray-500">
        <p>{error}</p>
      </div>
    )
  }

  if (!memberShipDetail) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-82px)] text-gray-500">
        <p>내역이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="px-[20px] pt-[16px] pb-[100px] overflow-y-scroll min-h-[calc(100vh-82px)] bg-system-bg">
      <MembershipCard
        id={parseInt(memberShipDetail.mp_idx)}
        title={memberShipDetail.service_name || memberShipDetail.s_type}
        count={`${memberShipDetail.remain_amount}회 / ${memberShipDetail.buy_amount}회`}
        startDate={
          memberShipDetail.pay_date
            ? memberShipDetail.pay_date.split(" ")[0]
            : ""
        }
        endDate={
          memberShipDetail.expiration_date
            ? memberShipDetail.expiration_date.split(" ")[0]
            : ""
        }
        status={
          memberShipDetail.status === "사용가능"
            ? MembershipStatus.ACTIVE
            : memberShipDetail.status === "사용완료"
              ? MembershipStatus.INACTIVE
              : MembershipStatus.EXPIRED
        }
        serviceType={memberShipDetail.s_type.replace("회원권", "").trim()}
        showReserveButton={false}
        showHistoryButton={false}
      />
      <div>
        <p className="text-[14px] font-sb mt-[40px] mb-[16px]">
          <span className="text-primary-300">
            {memberShipDetail.reservations?.length || 0}건
          </span>
          의 이용내역이 있습니다.
        </p>
      </div>
      <div className="flex flex-col gap-[12px]">
        {memberShipDetail.reservations?.map((history) => (
          <ReservationThumbnail
            key={`history-${history.r_idx}`}
            title={history.ps_name}
            date={new Date(history.r_date)}
            onClick={() => navigate(`/reservation/${history.r_idx}`)}
          />
        ))}
      </div>
    </div>
  )
}

export default MembershipUsageHistory
