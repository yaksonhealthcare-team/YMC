import { MembershipItem } from "../../../types/Membership"
import ClockIcon from "@assets/icons/ClockIcon.svg?react"
import { Tag } from "@components/Tag"
import { formatPrice, parsePrice } from "../../../utils/format"
import calculateDiscountRate from "../../../utils/calculateDiscountRate"
import clsx from "clsx"

interface MembershipCardProps {
  membership: MembershipItem
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export const MembershipCard = ({
  membership,
  onClick,
  className,
  disabled = false,
}: MembershipCardProps) => {
  const firstOption = membership.options?.[0]
  const hasDiscount = firstOption?.original_price && firstOption?.ss_price
  const discountRate = hasDiscount
    ? calculateDiscountRate(
        parsePrice(firstOption.ss_price),
        parsePrice(firstOption.original_price),
      )
    : 0

  return (
    <button
      className={clsx(
        "p-5 rounded-xl bg-white shadow-[0_2px_8px_0px_rgba(46,43,41,0.15)]",
        "focus:outline-none focus:ring-2 focus:ring-[#F37165] focus:ring-offset-2",
        "transition-colors duration-200",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-[0_4px_12px_0px_rgba(46,43,41,0.2)]",
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={`${membership.brand_name} ${membership.s_name} ${membership.s_type?.replace("회원권", "").trim()} ${membership.s_time !== "0" ? `${membership.s_time}분 소요` : ""} ${firstOption ? `${formatPrice(firstOption.ss_price)}원부터` : ""} ${hasDiscount ? `${discountRate}% 할인` : ""}${disabled ? " (비활성화됨)" : ""}`}
      aria-disabled={disabled}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <Tag
            type="rect"
            title={membership.s_type?.replace("회원권", "").trim()}
          />
          {membership.s_time !== "0" && (
            <div className="flex items-center gap-1 text-gray-500">
              <ClockIcon
                className="w-4 h-4 text-[#F37165]"
                aria-hidden="true"
              />
              <span
                className="text-sm"
                aria-label={`소요 시간 ${membership.s_time}분`}
              >
                {membership.s_time}분 소요
              </span>
            </div>
          )}
        </div>
        <span
          className="text-14px mb-1"
          aria-label={`브랜드: ${membership.brand_name}`}
        >
          {membership.brand_name}
        </span>
        <div className="flex justify-between items-start">
          <h3
            className="text-gray-700 text-base font-semibold"
            aria-label={`서비스명: ${membership.s_name}`}
          >
            {membership.s_name}
          </h3>
        </div>
      </div>

      {firstOption && (
        <div className="mt-4 flex flex-col">
          {hasDiscount && (
            <div className="flex justify-end">
              <span
                className="text-gray-400 font-r text-14px line-through"
                aria-label={`정상가 ${formatPrice(firstOption.original_price)}원`}
              >
                {formatPrice(firstOption.original_price)}원
              </span>
            </div>
          )}
          <div
            className={`flex ${hasDiscount ? "justify-between" : "justify-end"} items-center mt-1`}
          >
            {hasDiscount && (
              <span
                className="text-primary font-b text-18px"
                aria-label={`${discountRate}% 할인`}
              >
                {discountRate}%
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span
                className="text-gray-900 font-b text-18px"
                aria-label={`할인가 ${formatPrice(firstOption.ss_price)}원`}
              >
                {formatPrice(firstOption.ss_price)}원
              </span>
              <span
                className="text-gray-900 font-r text-12px"
                aria-hidden="true"
              >
                부터~
              </span>
            </div>
          </div>
        </div>
      )}
    </button>
  )
}
