import { BrandCard } from "@components/BrandCard.tsx"
import { useDisplayBrands } from "../hooks/useDisplayBrands"

interface SwiperBrandCardProps {
  className?: string
  onBrandClick: (brandCode: string, brandName: string) => void
  selectedBrandCodes?: string[]
}

export const SwiperBrandCard = ({
  className,
  onBrandClick,
  selectedBrandCodes,
}: SwiperBrandCardProps) => {
  const { displayedBrands } = useDisplayBrands()

  return (
    <div className={`w-full overflow-x-auto scrollbar-hide ${className}`}>
      <div className="flex gap-4 pb-2 pr-5">
        {displayedBrands &&
          displayedBrands.map((brand, index) => (
            <div
              key={`${brand.code}-${index}`}
              className={index === displayedBrands.length - 1 ? "pr-5" : ""}
            >
              <BrandCard
                name={brand.name}
                brandSrc={brand.imageUrl || ""}
                onClick={() => onBrandClick(brand.code, brand.name)}
                selected={
                  selectedBrandCodes
                    ? selectedBrandCodes?.includes(brand.code)
                    : false
                }
              />
            </div>
          ))}
      </div>
    </div>
  )
}
