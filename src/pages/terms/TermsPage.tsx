import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import { useNavigate } from "react-router-dom"

const TermsPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()

  useEffect(() => {
    setHeader({
      left: "back",
      title: "이용약관",
      backgroundColor: "bg-white",
      display: true,
    })
    setNavigation({ display: false })
  }, [])

  return (
    <div className={"flex flex-col px-5 divide-y divide-gray-100"}>
      <div
        className={"flex justify-between py-6"}
        onClick={() => navigate("/terms/service")}
      >
        <p>{"서비스 이용약관"}</p>
        <CaretRightIcon className={"w-4 h-4"} />
      </div>
      <div
        className={"flex justify-between py-6"}
        onClick={() => navigate("/terms/privacy")}
      >
        <p>{"개인정보 수집 이용"}</p>
        <CaretRightIcon className={"w-4 h-4"} />
      </div>

      <div
        className={"flex justify-between py-6"}
        onClick={() => navigate("/terms/location")}
      >
        <p>{"위치기반 서비스 이용약관"}</p>

        <CaretRightIcon className={"w-4 h-4"} />
      </div>

      <div
        className={"flex justify-between py-6"}
        onClick={() => navigate("/terms/marketing")}
      >
        <p>{"마케팅 정보 수신 정책"}</p>
        <CaretRightIcon className={"w-4 h-4"} />
      </div>
    </div>
  )
}

export default TermsPage
