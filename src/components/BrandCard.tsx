import clsx from "clsx"

const BRAND_CONTAINER_STYLES = {
  default: "border-gray-100 bg-white",
  selected: "border-primary bg-[#FEF2F1]",
} as const

interface BrandCardProps {
  brandSrc: string
  name?: string
  selected?: boolean
  onClick?: () => void
}

export const BrandCard = ({
  brandSrc,
  name,
  onClick,
  selected = false,
}: BrandCardProps) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2">
    <div
      className={clsx(
        "flex items-center w-[84px] h-[84px] px-[7px] py-[28px] rounded-full border",
        selected
          ? BRAND_CONTAINER_STYLES.selected
          : BRAND_CONTAINER_STYLES.default,
      )}
    >
      <img src={brandSrc} alt={name || "Brand image"} />
    </div>
    <span
      className={clsx(
        "font-m text-12px",
        selected ? "text-primary font-semibold" : "text-gray-600",
      )}
    >
      {name}
    </span>
  </button>
)

BrandCard.displayName = "BrandCard"
