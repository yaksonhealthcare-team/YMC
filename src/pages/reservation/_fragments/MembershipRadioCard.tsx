import { RadioCard } from "@components/RadioCard"
import {
  MembershipItem,
  MembershipStatus,
  membershipStatusLabel,
} from "../../../types/Membership"
import { Tag } from "@components/Tag"

interface MembershipRadioCardProps {
  membership: MembershipItem
  checked: boolean
  value: number | string
}

export const MembershipRadioCard = ({
  membership,
  checked,
  value,
}: MembershipRadioCardProps) => {
  const getStatusTagType = (status: MembershipStatus) => {
    switch (status) {
      case MembershipStatus.AVAILABLE:
        return "unused" as const
      case MembershipStatus.COMPLETED:
        return "used" as const
      case MembershipStatus.EXPIRED:
        return "used" as const
    }
  }

  return (
    <RadioCard
      checked={checked}
      value={value}
      className="!h-[124px] items-start"
    >
      <div className="w-[206px] flex-col justify-start items-start gap-4">
        <div className="self-stretch flex-col justify-start items-start gap-3">
          <div className="flex gap-1.5">
            <Tag
              type={getStatusTagType(membership.status)}
              title={membershipStatusLabel[membership.status]}
            />
            {membership.isAllBranch && <Tag type="rect" title="전지점" />}
          </div>

          <div className="self-stretch h-[50px] flex-col justify-start items-start gap-2 mt-[12px]">
            <h3 className="text-gray-700 text-16px font-sb">
              {membership.title}
            </h3>

            <div className="flex items-center gap-[6px] mt-[8px]">
              <span className="text-gray-600 text-12px">
                {membership.count}
              </span>
              <div className="w-[2px] h-[12px] bg-gray-200" />
              <span className="text-gray-600 text-12px">
                {membership.startAt} - {membership.endAt}
              </span>
            </div>
          </div>
        </div>
      </div>
    </RadioCard>
  )
}
