import { setSentryUser, useChannelTalk } from '@/_shared';
import { useGetUser } from '@/entities/user';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const Initialization = () => {
  const { data } = useQuery({ ...useGetUser() });

  const user = data?.data.body[0] ?? null;

  useChannelTalk({
    userId: user?.id,
    userName: user?.name,
    mobileNumber: user?.hp
  });

  useEffect(() => {
    if (!user) return;

    setSentryUser(user);
  }, [user]);

  return null;
};
