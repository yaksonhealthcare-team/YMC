import { useEffect, useRef } from 'react';

const isDev = import.meta.env.MODE !== 'production';
const isAppWebView = () => !!(window as any).ReactNativeWebView;

// 조건: 앱 웹뷰 + (개발이거나 ENV 켠 경우)
export function useVConsole() {
  const inited = useRef(false);

  useEffect(() => {
    if (inited.current) return;

    if (isAppWebView() && isDev) {
      (async () => {
        const { default: VConsole } = await import('vconsole');
        const v = new VConsole({ theme: 'light' });
        (window as any).__VCONSOLE__ = v;
        inited.current = true;
      })();
    }
  }, []);
}
