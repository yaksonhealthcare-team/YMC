import clsx from "clsx"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import { Notification } from "../types/Notification.ts"

const STYLES = {
  container:
    "flex flex-col justify-between bg-white p-5 border border-gray-100 shadow-card rounded-[20px]",
  header: {
    wrapper: "flex justify-between",
    title: {
      wrapper: "flex items-center",
      text: "font-m text-14px text-gray-400",
    },
    date: "font-r text-12px text-gray-400",
  },
  store: {
    base: "mt-2 font-b text-16px text-gray-500",
  },
  title: {
    base: "mt-1 font-r text-14px text-gray-500",
  },
  footer: {
    wrapper: "mt-3 flex items-center font-r text-12px text-gray-500",
    icon: "w-3.5 h-3.5",
    date: "ml-1.5",
    divider: "h-3 border-l border-gray-300 mx-1.5",
  },
} as const

interface NotificationCardProps {
  notification: Notification
  onClick?: () => void
  className?: string
}

export const NotificationCard = ({
  notification,
  onClick,
  className,
}: NotificationCardProps) => (
  <div onClick={onClick} className={clsx(STYLES.container, className)}>
    <div className={STYLES.header.wrapper}>
      <div className={STYLES.header.title.wrapper}>
        <span className={STYLES.header.title.text}>
          {notification.subCategory}
        </span>
      </div>
      <span className={STYLES.header.date}>{notification.pushDate}</span>
    </div>

    <span className={STYLES.store.base}>{notification.brandName}</span>

    <span className={STYLES.title.base}>{notification.title}</span>

    {notification.reservationDate && (
      <div className={STYLES.footer.wrapper}>
        <CalendarIcon className={STYLES.footer.icon} />
        <span className={STYLES.footer.date}>
          {notification.reservationDate}
        </span>
      </div>
    )}
  </div>
)

NotificationCard.displayName = "NotificationCard"
