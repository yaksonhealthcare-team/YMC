import { RadioCard } from "@components/RadioCard"
import { MembershipItem } from "../../../types/Membership"

interface MembershipRadioCardProps {
  membership: MembershipItem
  checked: boolean
  value: string
}

export const MembershipRadioCard = ({
  membership,
  checked,
  value,
}: MembershipRadioCardProps) => {
  const option = membership.options[0] // 첫 번째 옵션 사용

  return (
    <RadioCard
      checked={checked}
      value={value}
      className="!h-[124px] items-start"
    >
      <div className="w-[206px] flex-col justify-start items-start gap-4">
        <div className="self-stretch flex-col justify-start items-start gap-3">
          <div className="self-stretch h-[50px] flex-col justify-start items-start gap-2">
            <h3 className="text-gray-700 text-16px font-sb">
              {membership.s_name}
            </h3>

            <div className="flex items-center gap-[6px] mt-[8px]">
              <span className="text-gray-600 text-12px">
                {option ? `${option.ss_count}회` : "0회"}
              </span>
              <div className="w-[2px] h-[12px] bg-gray-200" />
              <span className="text-gray-600 text-12px">
                {membership.s_time}분
              </span>
            </div>
          </div>
        </div>
      </div>
    </RadioCard>
  )
}
