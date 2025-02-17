import { useNavigate } from "react-router-dom"
import { Title } from "@components/Title"
import { SwiperBrandCard } from "@components/SwiperBrandCard"

export const BrandSection = () => {
  const navigate = useNavigate()

  const handleBrandClick = (brandCode: string, brandName: string) => {
    navigate(`/brand/${brandCode}/${brandName}`)
  }

  return (
    <div className="mt-6">
      <Title className="px-5" title="브랜드 관" />
      <SwiperBrandCard className="mt-2 px-5" onBrandClick={handleBrandClick} />
    </div>
  )
}
