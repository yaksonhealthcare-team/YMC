import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useBrand } from "../../queries/useBrandQueries.tsx"
import { Button } from "@components/Button.tsx"

export const BrandDetailPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const { brandCode } = useParams()
  const { data: brand } = useBrand(brandCode)
  const navigate = useNavigate()

  useEffect(() => {
    setHeader({
      display: true,
      title: brand ? brand.name : "Brand",
      left: "back",
      backgroundColor: "bg-system-bg",
    })
    setNavigation({ display: false })
  }, [brand])

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      <div className="flex-1">
        {brand?.pictures?.map((picture, index) => (
          <img
            key={index}
            src={picture.fileurl}
            alt=""
            className="w-full object-contain"
          />
        ))}
        {!brand?.pictures?.length && brand?.thumbnail && (
          <img
            src={brand.thumbnail.fileurl}
            alt=""
            className="w-full object-contain"
          />
        )}
        {!brand?.pictures?.length && !brand?.thumbnail && (
          <img
            src="/assets/brand_example.png"
            alt=""
            className="w-full object-contain"
          />
        )}
      </div>

      {brand?.description && (
        <div className="px-[20px] py-[12px] bg-white">
          <p className="text-sm text-gray-700">{brand.description}</p>
        </div>
      )}

      <div className="w-full px-[20px] pb-[30px] pt-[12px] bg-white">
        <Button
          className="w-full !rounded-[12px]"
          onClick={() => navigate("/reservation/form")}
        >
          예약하기
        </Button>
      </div>
    </div>
  )
}

export default BrandDetailPage
