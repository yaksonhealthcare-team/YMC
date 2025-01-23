import clsx from "clsx"
import { useNavigate } from "react-router-dom"
import { Button } from "@components/Button"
import { Tag } from "@components/Tag"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import MembershipTag from "./MembershipTag"
import { MembershipStatus } from "types/Membership"

const STYLES = {
  container:
    "flex justify-between bg-white p-5 border border-gray-100 shadow-card rounded-[20px]",
  content: "flex flex-col gap-1.5",
  tags: "flex gap-1.5",
  title: "font-b text-16px text-gray-700",
  info: {
    wrapper: "flex items-center",
    text: "font-r text-12px text-gray-600",
    divider: "text-12px text-gray-200 mx-1.5",
  },
  actions: {
    wrapper: "flex flex-col justify-between items-end",
    history: "flex items-center cursor-pointer",
    historyText: "font-r text-12px text-gray-500",
    historyIcon: "w-3 h-3",
  },
} as const

interface MembershipProps {
  id: number
  title: string
  count: string
  date: string
  status: MembershipStatus
  serviceType?: string
  showReserveButton?: boolean
  showHistoryButton?: boolean
  className?: string
}

export const MembershipCard = ({
  id,
  title,
  count,
  date,
  status,
  serviceType,
  showReserveButton = false,
  showHistoryButton = true,
  className,
}: MembershipProps) => {
  const navigate = useNavigate()

  const showReservationButton =
    showReserveButton && status === MembershipStatus.ACTIVE

  const getStatusText = (status: MembershipStatus) => {
    switch (status) {
      case MembershipStatus.ACTIVE:
        return "사용가능"
      case MembershipStatus.INACTIVE:
        return "사용완료"
      case MembershipStatus.EXPIRED:
        return "만료됨"
      default:
        return ""
    }
  }

  return (
    <div className={clsx(STYLES.container, className)}>
      <div className={STYLES.content}>
        <div className={STYLES.tags}>
          <MembershipTag status={status} />
          {serviceType && <Tag type="rect" title={serviceType} />}
        </div>

        <span className={STYLES.title}>{title}</span>

        <div className={STYLES.info.wrapper}>
          <span className={STYLES.info.text}>{count}</span>
          <span className={STYLES.info.divider}>|</span>
          <span className={STYLES.info.text}>{date}</span>
        </div>
      </div>

      <div className={STYLES.actions.wrapper}>
        {showHistoryButton && (
          <div
            className={STYLES.actions.history}
            onClick={() => navigate(`/membership/usage/${id}`)}
          >
            <span className={STYLES.actions.historyText}>이용내역</span>
            <CaretRightIcon className={STYLES.actions.historyIcon} />
          </div>
        )}
        {/* TODO: 예약 필요 정보와 함께 이동 필요 */}
        {showReservationButton && (
          <Button
            variantType="primary"
            sizeType="xs"
            onClick={() => navigate("/reservation/form")}
          >
            예약하기
          </Button>
        )}
      </div>
    </div>
  )
}

MembershipCard.displayName = "MembershipCard"
