import clsx from "clsx"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import { Button } from "@components/Button.tsx"
import { Chip } from "@components/Chip"

interface ReserveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "pre" | "ing" | "post"
  store: string
  title: string
  count: number
  date: string
  time: string
  dDay?: number
  onClick?: () => void
}

export const ReserveCard = (props: ReserveCardProps) => {
  const { type, store, title, count, date, time, dDay, onClick, className } =
    props

  return (
    <>
      <div
        onClick={onClick}
        className={clsx(
          `flex justify-between bg-white p-5 border border-gray-100 shadow-card rounded-[20px]`,
          className,
        )}
      >
        <div>
          <span className="font-b text-16px text-gray-700">{store}</span>
          <div className="mt-1">
            <span className="font-r text-14px text-gray-700">{title}</span>
            <span className="ml-1.5 font-sb text-14px text-primary">
              {count}회차
            </span>
          </div>
          <div className="mt-3 flex items-center">
            <CalendarIcon className="w-3.5 h-3.5 text-gray-300" />
            <span className="font-r text-12px text-gray-500 ml-1.5">
              {date}
            </span>
            <span className="text-12px text-gray-500 mx-1.5">|</span>
            <span className="font-r text-12px text-gray-500">{time}</span>
          </div>
        </div>
        <div className="flex flex-col justify-between items-end">
          {type === "pre" && <Chip type="default" title={`D-${dDay}`} />}
          {type === "ing" && (
            <>
              <Chip type="default" title={`D-day`} />
              <Button variantType="primary" sizeType="xs">
                방문완료
              </Button>
            </>
          )}
          {type === "post" && (
            <>
              <Chip type="finish" title="방문완료" />
              <Button variantType="primary" sizeType="xs">
                만족도 작성
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
