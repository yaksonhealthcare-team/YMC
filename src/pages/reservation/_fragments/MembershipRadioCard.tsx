import { RadioCard } from "@components/RadioCard"
import { MyMembership } from "../../../types/Membership"

interface MembershipRadioCardProps {
  membership: MyMembership
  checked: boolean
  value: string
}

export const MembershipRadioCard = ({
  membership,
  checked,
  value,
}: MembershipRadioCardProps) => {
  const formatDateWithDots = (date: string) => {
    return date.split(" ")[0].replace(/-/g, ".")
  }

  return (
    <RadioCard
      checked={checked}
      value={value}
      className="items-start"
    >
      <div className="w-[206px] flex-col justify-start items-start gap-4">
        <div className="self-stretch flex-col justify-start items-start gap-3">
          <div className="px-[6px] py-[2px] bg-gray-100 rounded-[4px] justify-center items-center inline-flex mb-3">
          <div className="text-center text-gray-500 text-12px font-m">
              {membership.s_type}
            </div>
          </div>
          <div className="self-stretch flex-col justify-start items-start gap-2">
            <h3 className="text-gray-700 text-16px font-sb">
              {membership.service_name || "회원권명"}
            </h3>

            <div className="flex items-center gap-[6px] mt-[8px]">
              <span className="text-gray-600 text-12px">
                {`${membership.remain_amount}회 / ${membership.buy_amount}회`}
              </span>
              <div className="w-[2px] h-[12px] bg-gray-200" />
              <span className="text-gray-600 text-12px">
                {`${formatDateWithDots(membership.pay_date)} - ${formatDateWithDots(membership.expiration_date)}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </RadioCard>
  )
}
