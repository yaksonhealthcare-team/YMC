import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect, useRef } from "react"
import { sampleTerms } from "./ServiceTermsPage.tsx"

const PrivacyTermsPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHeader({
      left: "back",
      backgroundColor: "bg-white",
      display: true,
    })
    setNavigation({ display: false })
  }, [])

  useEffect(() => {
    // 컴포넌트가 마운트된 직후 실행
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "auto", block: "start" })
    }
  }, [])

  return (
    <div ref={contentRef} className={"px-5 py-4"}>
      <p className={"font-b text-24px"}>{"개인정보 수집 이용"}</p>
      <p className={"whitespace-pre-wrap text-gray-600"}>{sampleTerms}</p>
    </div>
  )
}

export default PrivacyTermsPage
