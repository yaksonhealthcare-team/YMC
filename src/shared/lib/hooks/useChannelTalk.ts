import { captureSentryError } from '@/shared/lib/utils/sentry.utils';
import { useEffect, useRef } from 'react';

type ChannelUser = {
  userId?: string;
  userName?: string;
  mobileNumber?: string;
};

const CHANNEL_PLUGIN_KEY = import.meta.env.VITE_CHANNEL_PLUGIN_KEY;

let channelLoadPromise: Promise<void> | null = null;

const loadChannelIOOnce = (): Promise<void> => {
  if (window.ChannelIOInitialized) return Promise.resolve();
  if (channelLoadPromise) return channelLoadPromise;

  channelLoadPromise = new Promise((resolve, reject) => {
    const SCRIPT_SRC = 'https://cdn.channel.io/plugin/ch-plugin-web.js';

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('ChannelIO script load failed')));
      return;
    }

    if (!window.ChannelIO) {
      const ch: any = function (...args: any[]) {
        (ch.q = ch.q || []).push(args);
      };
      window.ChannelIO = ch;
    }

    const s = document.createElement('script');
    s.async = true;
    s.src = SCRIPT_SRC;
    s.onload = () => {
      window.ChannelIOInitialized = true;
      resolve();
    };
    s.onerror = () => reject(new Error('ChannelIO script load failed'));
    document.head.appendChild(s);
  });

  return channelLoadPromise;
};

export const useChannelTalk = (user: ChannelUser | null) => {
  const bootedRef = useRef(false);

  useEffect(() => {
    if (!user?.userId) return;

    let cancelled = false;

    (async () => {
      try {
        await loadChannelIOOnce();
        if (cancelled) return;
        if (!CHANNEL_PLUGIN_KEY) throw new Error('VITE_CHANNEL_PLUGIN_KEY is missing');

        if (!bootedRef.current) {
          bootedRef.current = true;

          window.ChannelIO?.('boot', {
            pluginKey: CHANNEL_PLUGIN_KEY,
            memberId: user.userId,
            profile: {
              name: user.userName,
              mobileNumber: user.mobileNumber
            },
            hideChannelButtonOnBoot: true
          });
        }
      } catch (error) {
        captureSentryError(error, {
          tags: { feature: 'channel_talk', action: 'boot_failed' },
          context: { where: 'useChannelTalk_boot', userId: user.userId }
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.userId]);

  useEffect(() => {
    if (!bootedRef.current) return;
    if (!window.ChannelIO) return;
    if (!user?.userId) return;

    try {
      window.ChannelIO('updateUser', {
        memberId: user.userId,
        profile: {
          name: user.userName,
          mobileNumber: user.mobileNumber
        }
      });
    } catch (error) {
      captureSentryError(error, {
        tags: { feature: 'channel_talk', action: 'update_user_failed' },
        context: {
          userId: user.userId,
          userName: user.userName ?? null,
          where: 'useChannelTalk_updateUser'
        }
      });
    }
  }, [user?.mobileNumber, user?.userName]);
};
