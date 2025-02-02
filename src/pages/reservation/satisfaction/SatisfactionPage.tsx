import { useEffect } from "react"
import { useLayout } from "contexts/LayoutContext"
import { useNavigate, useParams } from "react-router-dom"

const SatisfactionPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({
      display: true,
      title: "만족도 작성",
      left: "back",
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation])

  return (
    <div className="flex flex-col min-h-screen bg-white p-5">
      <h1 className="text-gray-700 text-16px font-sb">
        관리는 어떠셨나요?
      </h1>
      {/* TODO: 만족도 작성 폼 구현 */}
    </div>
  )
}

export default SatisfactionPage 