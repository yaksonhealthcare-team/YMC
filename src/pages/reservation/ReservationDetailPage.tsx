import { useEffect } from "react"
import { useLayout } from "contexts/LayoutContext"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import { useNavigate } from "react-router-dom"
const ReservationDetailPage = () => {
  const { setHeader, setNavigation } = useLayout()

  const navigate = useNavigate()

  useEffect(() => {
    setHeader({
      display: true,
      title: "약손명가 강남구청역점",
      left: (
        <div onClick={() => navigate(-1)}>
          <CaretLeftIcon className="w-5 h-5" />
        </div>
      ),
      backgroundColor: "white",
    })
    setNavigation({ display: false })
  }, [])

  return (
    <div className="flex flex-col px-5 py-6 gap-4 bg-white">
    </div>
  )
}

export default ReservationDetailPage
