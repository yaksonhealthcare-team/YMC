import { RadioCard } from "@components/RadioCard"
import { MembershipItem } from "../../../types/Membership"
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
  return (
    <RadioCard
      checked={checked}
      value={value}
      className="!h-[124px] items-start"
    >
      <div className="w-[206px] flex-col justify-start items-start gap-4">
        <div className="self-stretch flex-col justify-start items-start gap-3">
          {(membership.isAllBranch || membership.isReady) && (
            <div className="flex gap-1.5 mb-[12px]">
              {membership.isAllBranch && <Tag type="rect" title="전지점" />}
              {membership.isReady && (
                <Tag type="red" title="준비중" className="rounded-[0.25rem]" />
              )}
            </div>
          )}

          <div className="self-stretch h-[50px] flex-col justify-start items-start gap-2">
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
