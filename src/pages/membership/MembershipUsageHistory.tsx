import { useLayout } from "contexts/LayoutContext"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import { MembershipCard } from "@components/MembershipCard"
import { MembershipDetail, MembershipStatus } from "types/Membership"
import DateAndTime from "@components/DateAndTime"

const sampleMembershipDetail = {
  id: 0,
  status: MembershipStatus.AVAILABLE,
  title: "K-BEAUTY 연예인관리",
  count: "4회 / 20",
  startAt: "2024.04.01",
  endAt: "2024.12.31",
  history: [
    {
      id: 0,
      store: "달리아스파 건대점",
      date: new Date(),
    },
    {
      id: 1,
      store: "달리아스파 건대점",
      date: new Date(),
    },
    {
      id: 2,
      store: "달리아스파 건대점",
      date: new Date(),
    },
    {
      id: 3,
      store: "달리아스파 건대점",
      date: new Date(),
    },
    {
      id: 4,
      store: "달리아스파 건대점",
      date: new Date(),
    },
  ],
}

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
  //   const { id } = useParams<{ id: string }>()
  const [memberShipDetail, setMemberShipDetail] = useState<MembershipDetail>()

  const navigate = useNavigate()

  useEffect(() => {
    setHeader({
      display: true,
      title: "회원권 이용내역",
      left: (
        <div onClick={() => navigate(-1)}>
          <CaretLeftIcon className="w-5 h-5" />
        </div>
      ),
      right: <>{/* TODO: 장바구니 아이콘 추가*/}</>,
    })
    setNavigation({ display: true })

    // TODO: fetch membership detail by id
    setMemberShipDetail(sampleMembershipDetail)
  }, [])

  return (
    <>
      {memberShipDetail && (
        <div className="px-[20px] pt-[16px] pb-[100px] overflow-y-scroll min-h-[calc(100vh-82px)] bg-system-bg">
          <MembershipCard
            id={memberShipDetail?.id}
            title={memberShipDetail.title}
            count={memberShipDetail.count}
            date={`${memberShipDetail.startAt} - ${memberShipDetail.endAt}`}
            status={MembershipStatus.AVAILABLE}
            isAllBranch={memberShipDetail.isAllBranch}
            showReserveButton={false}
            showHistoryButton={false}
          />
          <div>
            <p className="text-[14px] font-sb mt-[40px] mb-[16px]">
              <span className="text-primary-300">
                {memberShipDetail.history.length}건
              </span>
              의 이용내역이 있습니다.
            </p>
          </div>
          <div className="flex flex-col gap-[12px]">
            {memberShipDetail.history.map((history) => (
              <ReservationThumbnail
                key={`history-${history.id}`}
                title={history.store}
                date={history.date}
                onClick={() => navigate(`/reservation/${history.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default MembershipUsageHistory
