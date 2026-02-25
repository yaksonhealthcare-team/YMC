import { useChannelTalk } from '@/shared/lib/hooks/useChannelTalk';
import { setSentryUser } from '@/shared/lib/utils/sentry.utils';
import { useUserStore } from '@/features/auth/model/user.store';
import { useEffect } from 'react';

export const Initialization = () => {
  const user = useUserStore((state) => state.user);

  useChannelTalk(user ? { userId: user.id, userName: user.name, mobileNumber: user.hp } : null);

  useEffect(() => {
    if (!user) return;

    setSentryUser(user);
  }, [user]);

  return null;
};
