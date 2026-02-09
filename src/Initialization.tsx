import { setSentryUser, useChannelTalk } from '@/_shared';
import { useGetUser } from '@/entities/user';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

export const Initialization = () => {
  const { data, isSuccess } = useQuery({ ...useGetUser() });

  const user = useMemo(() => data?.data.body[0] ?? null, [data]);

  useChannelTalk(isSuccess ? { userId: user?.id, userName: user?.name, mobileNumber: user?.hp } : null);

  useEffect(() => {
    if (!user) return;

    setSentryUser(user);
  }, [user]);

  return null;
};
