import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const CHANNEL_TALK_VISIBLE_PATHS = ['/mypage', '/store'];

export const useChannelTalkVisibility = () => {
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);

  // boot 완료 감지: 이벤트(1차) + polling(fallback)
  useEffect(() => {
    if (ready) return;

    const markReady = () => setReady(true);

    // 1차: boot 콜백 이벤트
    window.addEventListener('channeltalk:booted', markReady);

    // 2차: polling fallback (콜백이 안 먹힐 경우 대비)
    const check = () => {
      if (window.ChannelIOInitialized && window.ChannelIO) {
        markReady();
      }
    };
    check();
    const id = setInterval(check, 500);

    return () => {
      window.removeEventListener('channeltalk:booted', markReady);
      clearInterval(id);
    };
  }, [ready]);

  const applyVisibility = useCallback(() => {
    if (!window.ChannelIO) return;

    const shouldShow = CHANNEL_TALK_VISIBLE_PATHS.some((p) => pathname.startsWith(p));

    if (shouldShow) {
      window.ChannelIO('showChannelButton');
    } else {
      window.ChannelIO('hideChannelButton');
      window.ChannelIO('hideMessenger');
    }
  }, [pathname]);

  // show/hide 적용 + boot 완료 타이밍 대비 재시도
  useEffect(() => {
    if (!ready || !window.ChannelIO) return;

    applyVisibility();
    const retry = setTimeout(applyVisibility, 2000);

    return () => clearTimeout(retry);
  }, [pathname, ready, applyVisibility]);

  return null;
};
