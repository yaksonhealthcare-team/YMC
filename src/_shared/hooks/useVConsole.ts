import { useEffect, useRef } from 'react';

export function useVConsole() {
  const inited = useRef(false);
  const isDev = import.meta.env.MODE !== 'production';
  const isAppWebView = !!(window as any).ReactNativeWebView;

  useEffect(() => {
    if (inited.current) return;

    if (isAppWebView && isDev) {
      (async () => {
        const { default: VConsole } = await import('vconsole');
        const v = new VConsole({ theme: 'light' });
        (window as any).__VCONSOLE__ = v;
        inited.current = true;
      })();
    }
  }, [isAppWebView, isDev]);
}
