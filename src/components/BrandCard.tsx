import clsx from "clsx"
import { Image } from "./common/Image"

const BRAND_CONTAINER_STYLES = {
  default: "border-gray-100 bg-white hover:bg-gray-50",
  selected: "border-primary bg-[#FEF2F1] hover:bg-[#FDE7E5]",
} as const

interface BrandCardProps {
  brandSrc: string
  name?: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

export const BrandCard = ({
  brandSrc,
  name,
  onClick,
  selected = false,
  className,
}: BrandCardProps) => {
  const brandName = name ?? "브랜드"

  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex flex-col items-center gap-2 p-2",
        "focus:outline-none focus:ring-2 focus:ring-[#F37165] focus:ring-offset-2",
        "rounded-lg transition-colors duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      aria-label={`${brandName} ${selected ? "선택됨" : "선택"}`}
      aria-pressed={selected}
      disabled={!onClick}
    >
      <div
        className={clsx(
          "flex items-center justify-center w-[84px] h-[84px] rounded-full border transition-colors duration-200",
          selected
            ? BRAND_CONTAINER_STYLES.selected
            : BRAND_CONTAINER_STYLES.default,
        )}
        role="img"
        aria-label={`${brandName} 로고`}
      >
        <Image
          src={brandSrc}
          alt={`${brandName} 로고 이미지`}
          className="w-full h-full object-contain p-2"
        />
      </div>
      <span
        className={clsx(
          "font-m text-12px transition-colors duration-200",
          selected ? "text-primary font-semibold" : "text-gray-600",
        )}
      >
        {brandName}
      </span>
    </button>
  )
}

BrandCard.displayName = "BrandCard"
