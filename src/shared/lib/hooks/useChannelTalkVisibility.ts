import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CHANNEL_TALK_VISIBLE_PATHS = ['/mypage', '/store'];

export const useChannelTalkVisibility = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!window.ChannelIO) return;

    const shouldShow = CHANNEL_TALK_VISIBLE_PATHS.some((p) => pathname.startsWith(p));

    if (shouldShow) {
      window.ChannelIO('showChannelButton');
    } else {
      window.ChannelIO('hideChannelButton');
      window.ChannelIO('hideMessenger');
    }
  }, [pathname]);

  return null;
};
