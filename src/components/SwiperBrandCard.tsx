import { BrandCard } from "@components/BrandCard.tsx"
import { useBrands } from "../queries/useBrandQueries.tsx"

interface SwiperBrandCardProps {
  className?: string
  onBrandClick: (brandCode: string) => void
  selectedBrandCodes?: string[]
}

export const SwiperBrandCard = ({
  className,
  onBrandClick,
  selectedBrandCodes,
}: SwiperBrandCardProps) => {
  const { data: brands } = useBrands()

  return (
    <div className={`w-full overflow-x-auto scrollbar-hide ${className}`}>
      <div className="flex gap-4 pb-2 pr-5">
        {brands &&
          brands.map((brand, index) => (
            <div
              key={`${brand.code}-${index}`}
              className={index === brands.length - 1 ? "pr-5" : ""}
            >
              <BrandCard
                name={brand.name}
                brandSrc={brand.imageUrl || ""}
                onClick={() => onBrandClick(brand.code)}
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
