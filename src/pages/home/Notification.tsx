import SettingIcon from '@/assets/icons/SettingIcon.svg?react';
import { Filter } from '@/shared/ui/filter/Filter';
import { NotificationCard } from '@/components/NotificationCard';
import { useLayout } from '@/stores/LayoutContext';
import { useIntersectionObserver } from '@/shared/lib/hooks/useIntersectionObserver';
import { useNotifications, useReadNotification } from '@/entities/notification/api/useNotificationQueries';
import { getSearchType, NotificationFilter, NotificationSearchType } from '@/entities/notification/model/Notification';
import { Container } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const filters = [
  { label: NotificationFilter.ALL, type: 'default' },
  { label: NotificationFilter.RESERVATION, type: 'default' },
  { label: NotificationFilter.MEMBERSHIP, type: 'default' },
  { label: NotificationFilter.POINT, type: 'default' },
  { label: NotificationFilter.NOTIFICATION, type: 'default' },
  { label: NotificationFilter.EVENT, type: 'default' }
];

export const Notification = () => {
  const { setHeader, setNavigation } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    setHeader({
      display: true,
      title: '알림',
      right: (
        <button onClick={() => navigate('/settings/notifications')} className=" rounded" aria-label="알림 설정">
          <SettingIcon className="w-6 h-6" />
        </button>
      ),
      left: 'back',
      onClickBack: () => navigate(-1),
      backgroundColor: 'bg-system-bg'
    });
    setNavigation({ display: false });
  }, []);

  const [activeFilter, setActiveFilter] = useState<NotificationFilter>(NotificationFilter.ALL);

  const handleFilterClick = (label: NotificationFilter) => {
    setActiveFilter(label);
  };

  const {
    data: notifications,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useNotifications({
    page: 1,
    searchType: activeFilter ? getSearchType(activeFilter) : NotificationSearchType.ALL
  });

  const { mutate: markAsRead } = useReadNotification();

  const handleNotificationClick = (notificationId: number) => {
    // 이미 읽은 알림이 아닌 경우에만 API 호출
    const notification = notifications?.pages.flatMap((page) => page).find((item) => item.id === notificationId);

    if (notification && !notification.isRead) {
      markAsRead(notificationId);
    }
  };

  const observerTarget = useRef<HTMLDivElement>(null);
  useIntersectionObserver(observerTarget, () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  return (
    <Container className={'relative w-full bg-system-bg py-4 h-full overflow-y-scroll'}>
      <div className="py-4 px-5 flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
        {filters.map((filter) => (
          <Filter
            key={filter.label}
            label={filter.label}
            type={filter.type as 'default' | 'arrow' | 'reload'}
            state={activeFilter === filter.label ? 'activeNoShrink' : 'defaultNoShrink'}
            onClick={() => handleFilterClick(filter.label)}
          />
        ))}
      </div>

      <ul>
        {(notifications?.pages.flatMap((page) => page) || []).length === 0 ? (
          <div className="flex justify-center items-center h-[200px] text-gray-400 font-r text-14px">
            알림이 없습니다
          </div>
        ) : (
          <>
            {(notifications?.pages.flatMap((page) => page) || []).map((notification, index) => (
              <li key={index} className={`${index && 'mt-4'}`}>
                <NotificationCard
                  notification={notification}
                  onClick={() => handleNotificationClick(notification.id)}
                />
              </li>
            ))}
            <div ref={observerTarget} className={'h-4'} />
          </>
        )}
      </ul>
    </Container>
  );
};

export default Notification;
