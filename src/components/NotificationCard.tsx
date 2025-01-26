import clsx from "clsx"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import { Notification, ReadStatus } from "../types/Notification.ts"

const STYLES = {
  container:
    "flex flex-col justify-between bg-white p-5 border border-gray-100 shadow-card rounded-[20px]",
  header: {
    wrapper: "flex justify-between",
    title: {
      wrapper: "flex items-center",
      text: {
        base: "font-m text-14px",
        read: "text-gray-400",
        unread: "text-primary",
      },
      dot: "ml-1.5 w-1 h-1 bg-primary rounded-full",
    },
    date: "font-r text-12px text-gray-400",
  },
  store: {
    base: "mt-2 font-b text-16px",
    read: "text-gray-500",
    unread: "text-gray-700",
  },
  title: {
    base: "mt-1 font-r text-14px",
    read: "text-gray-500",
    unread: "text-gray-700",
  },
  footer: {
    wrapper: "mt-3 flex items-center font-r text-12px",
    read: "text-gray-500",
    unread: "text-gray-700",
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
        <span
          className={clsx(
            STYLES.header.title.text.base,
            notification.readStatus === ReadStatus.READ
              ? STYLES.header.title.text.read
              : STYLES.header.title.text.unread,
          )}
        >
          {notification.subCategory}
        </span>
        {!notification.readStatus && (
          <div className={STYLES.header.title.dot} />
        )}
      </div>
      <span className={STYLES.header.date}>{notification.pushDate}</span>
    </div>

    <span
      className={clsx(
        STYLES.store.base,
        notification.readStatus ? STYLES.store.read : STYLES.store.unread,
      )}
    >
      {notification.brandName}
    </span>

    <span
      className={clsx(
        STYLES.title.base,
        notification.readStatus ? STYLES.title.read : STYLES.title.unread,
      )}
    >
      {notification.title}
    </span>

    {notification.reservationDate && (
      <div
        className={clsx(
          STYLES.footer.wrapper,
          notification.readStatus ? STYLES.footer.read : STYLES.footer.unread,
        )}
      >
        <CalendarIcon className={STYLES.footer.icon} />
        <span className={STYLES.footer.date}>
          {notification.reservationDate}
        </span>
      </div>
    )}
  </div>
)

NotificationCard.displayName = "NotificationCard"
