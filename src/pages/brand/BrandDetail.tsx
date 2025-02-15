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
      title: brand && brand.length > 0 ? brand[0].name : "Brand",
      left: "back",
      backgroundColor: "bg-white",
      onClickBack: () => navigate(-1),
    })
    setNavigation({ display: false })
  }, [brand])

  return (
    <div className="relative w-full">
      {/*TODO brand detail api 아사나 요청사항 확인후 재 변경 필요, /assets/brand_example.png 제거 후 imageUrl이 아예 존재 하지 않은 경우 처리 필요 */}
      <img
        src={brand && brand.length && brand[0].imageUrl ? brand[0].imageUrl : "/assets/brand_example.png"}
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
