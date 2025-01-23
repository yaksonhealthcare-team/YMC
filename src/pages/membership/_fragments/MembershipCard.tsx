import { MembershipItem } from "../../../types/Membership"
import ClockIcon from "@assets/icons/ClockIcon.svg?react"

interface MembershipCardProps {
  membership: MembershipItem
  onClick?: () => void
}

export const MembershipCard = ({
  membership,
  onClick,
}: MembershipCardProps) => {
  const lowestOption = membership.options.reduce((lowest, current) => {
    return current.option_price < lowest.option_price ? current : lowest
  })

  return (
    <div
      className="p-5 border border-gray-200 rounded-xl cursor-pointer hover:border-primary"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-700 text-base font-semibold">
          {membership.service_name}
        </h3>
        <div className="flex items-center gap-1 text-gray-500">
          <ClockIcon className="w-4 h-4" />
          <span className="text-sm">{membership.service_time}분</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-500 line-clamp-2">
          {membership.service_description}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-gray-900 font-bold text-lg">
            {lowestOption.option_price.toLocaleString()}원
          </span>
          <span className="text-gray-900 text-xs">부터~</span>
        </div>
      </div>
    </div>
  )
}
