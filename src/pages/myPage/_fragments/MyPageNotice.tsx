import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import MegaPhoneIcon from "@assets/icons/MegaPhoneIcon.svg?react"
import NoticesSummarySlider from "@components/NoticesSummarySlider.tsx"

const MyPageNotice = () => {
  return (
    <div className="flex gap-2 items-center px-5 h-[40px] mx-5 my-5 rounded-[8px] bg-white text-primary">
      <MegaPhoneIcon className="min-w-5 h-5" />
      <NoticesSummarySlider
        className="w-full h-[21px] overflow-hidden text-ellipsis whitespace-nowrap"
        right={
          <CaretRightIcon className="flex-shrink-0 min-w-[4px] h-4 ml-auto" />
        }
      />
    </div>
  )
}

export default MyPageNotice
