import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useBrand } from "../../queries/useBrandQueries.tsx"
import { Button } from "@components/Button.tsx"

export const BrandDetailPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const { brandCode } = useParams()
  const { data: brand } = useBrand(brandCode)
  const [brandImage, setBrandImage] = useState<string | undefined>()
  const navigate = useNavigate()

  useEffect(() => {
    setHeader({
      display: true,
      title: brand ? brand[0].name : "Brand",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })

    brand && setBrandImage(brand[0].imageUrl)
  }, [brand])

  return (
    <div className="relative w-full">
      {/*TODO brand detail api 응답데이터에 image 데이터 추가 될 시, /assets/brand_example.png 제거 */}
      <img
        src={brandImage ? brandImage : "/assets/brand_example.png"}
        alt=""
        className="w-full h-full"
      />

      <div className="sticky bottom-0 w-full px-[20px] pb-[30px] pt-[12px] bg-white">
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
