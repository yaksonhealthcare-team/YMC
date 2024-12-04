import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import { sampleTerms } from "./ServiceTermsPage.tsx"

const MarketingTermsPage = () => {
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({
      left: "back",
      backgroundColor: "bg-white",
      display: true,
    })
    setNavigation({ display: false })
  }, [])

  return (
    <div className={"px-5 py-4"}>
      <p className={"font-b text-24px"}>{"마케팅 정보 수신 정책"}</p>
      <p className={"whitespace-pre-wrap text-gray-600"}>{sampleTerms}</p>
    </div>
  )
}

export default MarketingTermsPage
