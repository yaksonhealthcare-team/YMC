import { MembershipItem } from "../../../types/Membership"
import ClockIcon from "@assets/icons/ClockIcon.svg?react"
import calculateDiscountRate from "../../../utils/calculateDiscountRate"
import { Tag } from "@components/Tag"

interface MembershipCardProps {
  membership: MembershipItem
  onClick?: () => void
}

export const MembershipCard = ({
  membership,
  onClick,
}: MembershipCardProps) => {
  const firstOption = membership.options?.[0]
  const hasDiscount = firstOption?.original_price && firstOption?.ss_price

  return (
    <div
      className="p-5 rounded-xl cursor-pointer bg-white shadow-[0_2px_8px_0px_rgba(46,43,41,0.15)]"
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Tag 
            type="rect" 
            title={membership.s_type?.replace("회원권", "").trim()} 
          />
          {membership.s_time !== "0" && (
            <div className="flex items-center gap-1 text-gray-500">
              <ClockIcon className="w-4 h-4 text-[#F37165]" />
              <span className="text-sm">{membership.s_time}분 소요</span>
            </div>
          )}
        </div>
        <span className="text-primary font-sb text-14px">
          {membership.brand_name}
        </span>
        <div className="flex justify-between items-start">
          <h3 className="text-gray-700 text-base font-semibold">
            {membership.s_name}
          </h3>
        </div>
      </div>

      {firstOption && (
        <div className="mt-4 flex flex-col">
          {hasDiscount && (
            <div className="flex justify-end">
              <span className="text-gray-400 font-r text-14px line-through">
                {firstOption.original_price}원
              </span>
            </div>
          )}
          <div className={`flex ${hasDiscount ? 'justify-between' : 'justify-end'} items-center mt-1`}>
            {hasDiscount && (
              <span className="text-primary font-b text-18px">
                {calculateDiscountRate(
                  Number(firstOption.ss_price.replace(/,/g, "")),
                  Number(firstOption.original_price.replace(/,/g, "")),
                )}
                %
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-gray-900 font-b text-18px">
                {firstOption.ss_price}원
              </span>
              <span className="text-gray-900 font-r text-12px">부터~</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
