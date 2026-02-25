import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const CHANNEL_TALK_VISIBLE_PATHS = ['/mypage', '/store'];

export const useChannelTalkVisibility = () => {
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;

    const check = () => {
      if (window.ChannelIOInitialized && window.ChannelIO) {
        setReady(true);
      }
    };

    check();
    const id = setInterval(check, 500);
    return () => clearInterval(id);
  }, [ready]);

  useEffect(() => {
    if (!ready || !window.ChannelIO) return;

    const shouldShow = CHANNEL_TALK_VISIBLE_PATHS.some((p) => pathname.startsWith(p));

    if (shouldShow) {
      window.ChannelIO('showChannelButton');
    } else {
      window.ChannelIO('hideChannelButton');
      window.ChannelIO('hideMessenger');
    }
  }, [pathname, ready]);

  return null;
};
