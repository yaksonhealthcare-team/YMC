import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useBrand } from "../../queries/useBrandQueries.tsx"
import { Button } from "@components/Button.tsx"

export const BrandDetailPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const { brandCode, brandName } = useParams()
  const { data: brandDetail } = useBrand(brandCode)
  const navigate = useNavigate()

  useEffect(() => {
    setHeader({
      display: true,
      title: brandName,
      left: "back",
      backgroundColor: "bg-white",
      onClickBack: () => navigate(-1),
    })
    setNavigation({ display: false })
  }, [brandDetail])

  return (
    <div className="relative w-full">
      {brandDetail?.descriptionImageUrls?.map((url, index) => (
        <img
          key={index}
          src={url}
          alt=""
          className="w-full h-full border-8"
        />
      ))}

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
