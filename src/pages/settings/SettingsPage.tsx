import { useLayout } from '../../contexts/LayoutContext.tsx';
import { useEffect } from 'react';
import Switch from '@components/Switch.tsx';
import { useNotificationSettings, useUpdateNotificationSettings } from '../../queries/useNotificationQueries';
import { NotificationSettings } from '../../types/Notification';

const SettingsPage = () => {
  const { setHeader, setNavigation } = useLayout();
  const { data: settings, isLoading } = useNotificationSettings();
  const { mutate: updateSettings } = useUpdateNotificationSettings();

  useEffect(() => {
    setHeader({
      left: 'back',
      title: '알림설정',
      backgroundColor: 'bg-white',
      display: true
    });
    setNavigation({ display: true });
  }, []);

  if (isLoading) {
    return (
      <div className={'flex flex-col px-5 divide-y divide-gray-100 pb-[82px]'}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between py-6">
            <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
            <div className="w-10 h-5 bg-gray-200 animate-pulse rounded" />
          </div>
        ))}
      </div>
    );
  }

  const handleToggle = (key: keyof NotificationSettings, value: boolean) => {
    if (!settings) return;

    updateSettings({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className={'flex flex-col px-5 divide-y divide-gray-100 pb-[82px]'}>
      <div className={'flex justify-between py-6'}>
        <p>{'예약 알림'}</p>
        <Switch.IOS
          checked={settings?.reservations ?? false}
          onChange={(event) => {
            handleToggle('reservations', event.target.checked);
          }}
        />
      </div>

      <div className={'flex justify-between py-6'}>
        <p>{'회원권 알림'}</p>
        <Switch.IOS
          checked={settings?.membership ?? false}
          onChange={(event) => {
            handleToggle('membership', event.target.checked);
          }}
        />
      </div>

      <div className={'flex justify-between py-6'}>
        <p>{'포인트 알림'}</p>
        <Switch.IOS
          checked={settings?.points ?? false}
          onChange={(event) => {
            handleToggle('points', event.target.checked);
          }}
        />
      </div>

      <div className={'flex justify-between py-6'}>
        <p>{'공지 알림'}</p>
        <Switch.IOS
          checked={settings?.notices ?? false}
          onChange={(event) => {
            handleToggle('notices', event.target.checked);
          }}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
