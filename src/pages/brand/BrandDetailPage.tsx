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
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pb-[100px]">
        {brandDetail?.descriptionImageUrls?.map((url, index) => (
          <div key={index} className="w-full">
            <Image
              src={url}
              alt={`${brandName} 설명 이미지 ${index + 1}`}
              className="w-full object-cover border-8 border-white"
            />
          </div>
        ))}
      </div>

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
