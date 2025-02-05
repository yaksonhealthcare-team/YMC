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
      <div className="flex gap-4 px-5 pb-2">
        {brands &&
          brands.map((brand) => (
            <div key={brand.code}>
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
