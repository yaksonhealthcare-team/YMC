import { Swiper, SwiperSlide } from "swiper/react"
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
    <div className={`overflow-x-auto ${className}`}>
      <Swiper spaceBetween={16} slidesPerView={"auto"} className="gap-4">
        {brands &&
          brands.map((brand) => (
            <SwiperSlide key={brand.code} className="!w-auto">
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
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  )
}
