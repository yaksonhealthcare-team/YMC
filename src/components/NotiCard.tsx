import clsx from "clsx"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"

interface NotiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  read?: boolean
  store: string
  title: string
  date: string
  time: string
  reserveTitle: string
  reserveDate: string
  onClick?: () => void
}

export const NotiCard = (props: NotiCardProps) => {
  const {
    read,
    store,
    title,
    date,
    time,
    reserveTitle,
    reserveDate,
    onClick,
    className,
  } = props

  return (
    <>
      <div
        onClick={onClick}
        className={clsx(
          `flex flex-col justify-between bg-white p-5 border border-gray-100 shadow-card rounded-[20px]`,
          className,
        )}
      >
        <div className="flex justify-between">
          <div className="flex items-center">
            <span
              className={clsx(
                "font-m text-14px",
                read ? "text-gray-400" : "text-primary",
              )}
            >
              {reserveTitle}
            </span>
            {!read && (
              <div className="ml-1.5 w-1 h-1 bg-primary rounded-full"></div>
            )}
          </div>
          <span className="font-r text-12px text-gray-400">{reserveDate}</span>
        </div>
        <span
          className={clsx(
            "mt-2 font-b text-16px",
            read ? "text-gray-500" : "text-gray-700",
          )}
        >
          {store}
        </span>
        <span
          className={clsx(
            "mt-1font-r text-14px",
            read ? "text-gray-500" : "text-gray-700",
          )}
        >
          {title}
        </span>
        <div
          className={clsx(
            "mt-3 flex items-center font-r text-12px",
            read ? "text-gray-500" : "text-gray-700",
          )}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          <span className="ml-1.5">{date}</span>
          <div className="h-3 border-l border-gray-300 mx-1.5"></div>
          <span className="">{time}</span>
        </div>
      </div>
    </>
  )
}
