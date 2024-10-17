import clsx from "clsx"
import { Button } from "@components/Button.tsx"
import { Tag } from "@components/Tag"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"

interface MembershipProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "default" | "reserve" | "used"
  title: string
  count: string
  date: string
  onClick?: () => void
}

export const MembershipCard = (props: MembershipProps) => {
  const { type, title, count, date, onClick, className } = props

  return (
    <>
      <div
        onClick={onClick}
        className={clsx(
          `flex justify-between bg-white p-5 border border-gray-100 shadow-card rounded-[20px]`,
          className,
        )}
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1.5">
            {type === "used" ? (
              <Tag type="used" title="사용완료" />
            ) : (
              <Tag type="unused" title="사용가능" />
            )}
            <Tag type="rect" title="전지점" />
          </div>
          <span className="font-b text-16px text-gray-700">{title}</span>
          <div className="flex items-center">
            <span className="font-r text-12px text-gray-600">{count}</span>
            <span className="text-12px text-gray-200 mx-1.5">|</span>
            <span className="font-r text-12px text-gray-600">{date}</span>
          </div>
        </div>
        <div className="flex flex-col justify-between items-end">
          <div className="flex items-center">
            <span className="font-r text-12px text-gray-500"> 이용내역 </span>
            <CaretRightIcon className="w-3 h-3" />
          </div>
          {type === "reserve" && (
            <Button variantType="primary" sizeType="xs">
              예약하기
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
