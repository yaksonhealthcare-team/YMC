import { MembershipItem } from "../../../types/Membership"
import { calculateDiscountRate } from "../../../utils/number"
import { formatPrice, parsePrice } from "../../../utils/format"
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
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-primary font-sb text-14px">
              {membership.brand_name || "약손명가"}
            </span>
            <div className="px-[6px] py-[2px] bg-gray-100 rounded-[4px] justify-center items-center inline-flex">
              <span className="text-gray-500 text-12px font-m">
                {membership.s_type?.replace("회원권", "").trim()}
              </span>
            </div>
          </div>
          <h3 className="text-gray-900 font-sb text-16px">
            {membership.s_name || "데이터가 없습니다"}
          </h3>
        </div>
        {firstOption && (
          <div className="flex items-baseline gap-2">
            {hasDiscount && (
              <span className="text-primary font-b text-18px">
                {discountRate}%
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-gray-900 font-b text-18px">
                {formatPrice(firstOption.ss_price)}원
              </span>
              <span className="text-gray-900 font-r text-12px">부터~</span>
            </div>
            {hasDiscount && (
              <span className="text-gray-400 font-r text-14px line-through">
                {formatPrice(firstOption.original_price)}원
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  )
}
