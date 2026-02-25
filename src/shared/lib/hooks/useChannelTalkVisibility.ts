import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const CHANNEL_TALK_VISIBLE_PATHS = ['/mypage', '/store'];

export const useChannelTalkVisibility = () => {
  const { pathname } = useLocation();
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const handleBooted = () => setBooted(true);
    window.addEventListener('channeltalk:booted', handleBooted);
    return () => window.removeEventListener('channeltalk:booted', handleBooted);
  }, []);

  useEffect(() => {
    if (!booted || !window.ChannelIO) return;

    const shouldShow = CHANNEL_TALK_VISIBLE_PATHS.some((p) => pathname.startsWith(p));

    if (shouldShow) {
      window.ChannelIO('showChannelButton');
    } else {
      window.ChannelIO('hideChannelButton');
      window.ChannelIO('hideMessenger');
    }
  }, [pathname, booted]);

  return null;
};
