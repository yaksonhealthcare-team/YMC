import NotificationIcon from '@/assets/_icons/notification.svg?react';
import { NotificationButtonProps } from './NotificationButton.types';

const NotificationButton = ({ notiCount, onClick }: NotificationButtonProps) => {
  const count = notiCount > 99 ? '99+' : notiCount;

  return (
    <button
      className="relative w-11 h-11 bg-primary-300 rounded-full shadow-lg flex justify-center items-center hover:bg-primary-400 transition-colors duration-200"
      onClick={onClick}
    >
      <NotificationIcon className="text-white w-6 h-6" />
      {notiCount > 0 && (
        <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-white border border-primary rounded-full flex items-center justify-center px-1">
          <span className="text-primary text-[10px] leading-none font-m">{count}</span>
        </div>
      )}
    </button>
  );
};

export default NotificationButton;
