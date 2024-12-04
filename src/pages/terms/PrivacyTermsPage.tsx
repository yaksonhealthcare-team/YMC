import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import { sampleTerms } from "./ServiceTermsPage.tsx"

const PrivacyTermsPage = () => {
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
      <p className={"font-b text-24px"}>{"개인정보 수집 이용"}</p>
      <p className={"whitespace-pre-wrap text-gray-600"}>{sampleTerms}</p>
    </div>
  )
}

export default PrivacyTermsPage
