import { useChannelTalk } from '@/shared/lib/hooks/useChannelTalk';
import { setSentryUser } from '@/shared/lib/utils/sentry.utils';
import { useGetUser } from '@/entities/user';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

export const Initialization = () => {
  const { data, isSuccess } = useQuery({ ...useGetUser() });

  const user = useMemo(() => {
    const body = data?.data?.body;
    return Array.isArray(body) && body.length > 0 ? body[0] : null;
  }, [data]);

  useChannelTalk(isSuccess && user ? { userId: user?.id, userName: user?.name, mobileNumber: user?.hp } : null);

  useEffect(() => {
    if (!user) return;

    setSentryUser(user);
  }, [user]);

  return null;
};
