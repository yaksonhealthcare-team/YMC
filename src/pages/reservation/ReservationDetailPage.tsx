import { useEffect } from "react"
import { useLayout } from "contexts/LayoutContext"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import { useNavigate } from "react-router-dom"
import ReservationSummary from "./_fragments/ReservationSummary"
import { Button } from "@components/Button"

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
    })
    setNavigation({ display: false })
  }, [])

  return (
    <div className="flex-1 px-[20px] pt-[16px] pb-[104px] bg-system-bg">
      <ReservationSummary />
      <Button variantType="gray" sizeType="s" className="w-full mt-[24px]">
        예약 문진 확인하기
      </Button>
    </div>
  )
}

export default ReservationDetailPage
