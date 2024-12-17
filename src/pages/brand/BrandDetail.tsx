import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useBrand } from "../../queries/useBrandQueries.tsx"

export const BrandDetailPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const { brandCode } = useParams()
  const { data: brand } = useBrand(brandCode)

  useEffect(() => {
    setHeader({
      display: true,
      title: brand ? brand[0].name : "",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [brand])

  return <>BRAND 소개 페이지 입니다.</>
}
