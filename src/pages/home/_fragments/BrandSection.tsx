import { useNavigate } from "react-router-dom"
import { Title } from "@components/Title"
import { SwiperBrandCard } from "@components/SwiperBrandCard"

export const BrandSection = () => {
  const navigate = useNavigate()

  const handleBrandClick = (brandCode: string) => {
    navigate(`/brand/${brandCode}`)
  }

  return (
    <div className="mt-6">
      <Title className="px-5" title="브랜드 관" />
      <SwiperBrandCard className="mt-2 px-5" onBrandClick={handleBrandClick} />
    </div>
  )
}
