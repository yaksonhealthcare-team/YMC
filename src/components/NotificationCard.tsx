import CalendarIcon from '@/assets/icons/CalendarIcon.svg?react';
import { Notification } from '@/types/Notification';
import clsx from 'clsx';

interface NotificationCardProps {
  notification: Notification;
  onClick?: () => void;
  className?: string;
}

export const NotificationCard = ({ notification, onClick, className }: NotificationCardProps) => {
  const STYLES = {
    container: `flex flex-col justify-between ${!notification.isRead ? 'bg-[#F8F8F8]' : 'bg-white'} p-5 border border-gray-100 shadow-card rounded-[20px]`,
    header: {
      wrapper: 'flex justify-between',
      title: {
        wrapper: 'flex items-center',
        text: `font-m text-14px ${notification.isRead ? 'text-gray-400' : 'text-primary flex gap-2 items-center'}`,
        circle: 'w-[4px] h-[4px] bg-red-500 rounded-full'
      },
      date: 'font-r text-12px text-gray-400'
    },
    store: {
      base: `mt-2 font-b text-16px ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`
    },
    title: {
      base: `mt-1 font-r text-14px ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`
    },
    content: {
      base: `mt-1 font-r text-14px ${notification.isRead ? 'text-gray-400' : 'text-gray-600'}`
    },
    message: {
      base: `mt-1 font-r text-12px ${notification.isRead ? 'text-gray-400' : 'text-gray-500'}`
    },
    footer: {
      wrapper: `mt-3 flex items-center font-r text-12px ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`,
      icon: 'w-3.5 h-3.5',
      date: 'ml-1.5',
      divider: 'h-3 border-l border-gray-300 mx-1.5'
    }
  } as const;

  return (
    <div
      onClick={onClick}
      className={clsx(STYLES.container, className)}
      aria-label={`${notification.subCategory} 알림${!notification.isRead ? ' (새 알림)' : ' (읽음)'}: ${notification.title}. ${notification.content}${notification.message ? `. ${notification.message}` : ''}${notification.reservationDate ? `. 예약일: ${notification.reservationDate}` : ''}`}
      aria-pressed={!notification.isRead}
    >
      <div className={STYLES.header.wrapper}>
        <div className={STYLES.header.title.wrapper}>
          <span className={STYLES.header.title.text}>
            {notification.subCategory}
            {!notification.isRead && (
              <div className={STYLES.header.title.circle} role="status" aria-label="읽지 않음" />
            )}
          </span>
        </div>
        <span className={STYLES.header.date} aria-label={`작성일: ${notification.pushDate}`}>
          {notification.pushDate}
        </span>
      </div>

      <span className={STYLES.store.base}>{notification.title}</span>

      <span className={STYLES.content.base}>{notification.content}</span>

      {notification.message && <span className={STYLES.message.base}>{notification.message}</span>}

      {notification.reservationDate && (
        <div className={STYLES.footer.wrapper}>
          <CalendarIcon className={STYLES.footer.icon} aria-hidden="true" />
          <span className={STYLES.footer.date} aria-label={`예약일: ${notification.reservationDate}`}>
            {notification.reservationDate}
          </span>
        </div>
      )}
    </div>
  );
};

NotificationCard.displayName = 'NotificationCard';
