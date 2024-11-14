import clsx from "clsx"

const BRAND_CONTAINER_STYLES = {
  default: "border-gray-100",
  selected: "border-primary bg-primary-100",
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
        "flex items-center w-[84px] h-[84px] px-[7px] py-[28px] bg-white rounded-full border",
        selected
          ? BRAND_CONTAINER_STYLES.selected
          : BRAND_CONTAINER_STYLES.default,
      )}
    >
      <img src={brandSrc} alt={name || "Brand image"} />
    </div>
    <span className="font-m text-12px text-gray-600">{name}</span>
  </button>
)

BrandCard.displayName = "BrandCard"
