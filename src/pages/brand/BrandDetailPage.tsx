import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useBrand } from "../../queries/useBrandQueries.tsx"
import { Button } from "@components/Button.tsx"
import { Image } from "@components/common/Image"

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
    <div className="relative w-full h-full">
      {brandDetail?.descriptionImageUrls?.map((url, index) => (
        <Image
          key={index}
          src={url}
          alt={`${brandName} 설명 이미지 ${index + 1}`}
          className="w-full h-full border-8"
        />
      ))}

      <div className="fixed bottom-0 w-full px-[20px] pb-[30px] pt-[12px] bg-white">
        <Button
          className="w-full !rounded-[12px]"
          onClick={() =>
            navigate("/reservation/form", {
              state: {
                originalPath: location.pathname,
                fromBrandDetail: true,
                brandCode: brandCode,
              },
            })
          }
        >
          예약하기
        </Button>
      </div>
    </div>
  )
}

export default BrandDetailPage
