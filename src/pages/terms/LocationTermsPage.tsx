import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import { sampleTerms } from "./ServiceTermsPage.tsx"

const LocationTermsPage = () => {
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
      <p className={"font-b text-24px"}>{"위치기반 서비스 이용약관"}</p>
      <p className={"whitespace-pre-wrap text-gray-600"}>{sampleTerms}</p>
    </div>
  )
}

export default LocationTermsPage
