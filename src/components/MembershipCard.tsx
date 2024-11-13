import clsx from "clsx"
import { Button } from "@components/Button.tsx"
import { Tag } from "@components/Tag"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import MembershipTag from "./MembershipTag"
import { MembershipStatus } from "types/Membership"
import { useNavigate } from "react-router-dom"

interface MembershipProps {
  id: number
  title: string
  count: string
  date: string
  status: MembershipStatus
  isAllBranch?: boolean
  showReserveButton?: boolean
  className?: string
}

export const MembershipCard = (props: MembershipProps) => {
  const {
    id,
    title,
    count,
    date,
    status,
    isAllBranch = true,
    showReserveButton = false,
    className,
  } = props

  const navigate = useNavigate()

  return (
    <>
      <div
        className={clsx(
          `flex justify-between bg-white p-5 border border-gray-100 shadow-card rounded-[20px]`,
          className,
        )}
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1.5">
            <MembershipTag status={status} />
            {isAllBranch && <Tag type="rect" title="전지점" />}
          </div>
          <span className="font-b text-16px text-gray-700">{title}</span>
          <div className="flex items-center">
            <span className="font-r text-12px text-gray-600">{count}</span>
            <span className="text-12px text-gray-200 mx-1.5">|</span>
            <span className="font-r text-12px text-gray-600">{date}</span>
          </div>
        </div>
        <div className="flex flex-col justify-between items-end">
          <div
            className="flex items-center"
            onClick={() => navigate(`/membership/usage/${id}`)}
          >
            <span className="font-r text-12px text-gray-500"> 이용내역 </span>
            <CaretRightIcon className="w-3 h-3" />
          </div>
          {showReserveButton && status === MembershipStatus.AVAILABLE && (
            <Button variantType="primary" sizeType="xs">
              예약하기
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
