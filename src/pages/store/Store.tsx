import { getAccessToken } from '@/entities/user/lib/token.utils';
import LoadingIndicator from '@/shared/ui/loading/LoadingIndicator';
import { useForceUpdateModal } from '@/shared/lib/hooks/useForceUpdateModal';
import { useAppInfoStore } from '@/shared/lib/stores/appInfo.store';
import { useLayout } from '@/widgets/layout/model/LayoutContext';
import { isLowerVersion } from '@/shared/lib/utils/isLowerVersion';
import { useEffect, useMemo, useRef, useState } from 'react';

const STORE_URL = import.meta.env.VITE_HOMECARE_MALL_URL;
const LATEST_APP_VERSION = import.meta.env.VITE_LATEST_APP_VERSION;

const Store = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const openedModalRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { appInfo } = useAppInfoStore();
  const { openForceUpdateModal } = useForceUpdateModal();
  const { setHeader, setNavigation, storeKey } = useLayout();

  const STORE_ORIGIN = useMemo(() => new URL(STORE_URL).origin, []);

  useEffect(() => {
    setHeader({ display: false, backgroundColor: 'bg-white' });
    setNavigation({ display: true });
  }, [setHeader, setNavigation]);

  useEffect(() => {
    setAllowed(false);

    if (!window.ReactNativeWebView) {
      setAllowed(true);
      return;
    }

    const shouldBlock = !appInfo || isLowerVersion(appInfo.appVersion, LATEST_APP_VERSION);

    if (shouldBlock) {
      if (!openedModalRef.current) {
        openedModalRef.current = true;
        setIsLoading(false);
        openForceUpdateModal();
      }
      return;
    }

    openedModalRef.current = false;
    setAllowed(true);
  }, [appInfo, storeKey, openForceUpdateModal]);

  useEffect(() => {
    if (!allowed) return;

    setIsLoading(true);

    const iframeEl = iframeRef.current;
    if (!iframeEl) return;

    const onLoad = () => {
      const win = iframeEl.contentWindow;
      if (!win) return;

      win.postMessage(
        {
          type: 'AUTH_TOKEN',
          accessToken: getAccessToken()
        },
        STORE_ORIGIN
      );
      setIsLoading(false);
    };

    iframeEl.addEventListener('load', onLoad);
    return () => {
      iframeEl.removeEventListener('load', onLoad);
    };
  }, [storeKey, STORE_ORIGIN, allowed]);

  return (
    <div className="bg-white" style={{ width: '100%', height: 'calc(100vh - 82px)' }}>
      {isLoading && (
        <div className="flex justify-center items-center h-full w-full absolute top-0 left-0 z-10 bg-white opacity-50">
          <LoadingIndicator />
        </div>
      )}
      {allowed && (
        <iframe
          key={storeKey}
          ref={iframeRef}
          src={STORE_URL}
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          title="Zippy Store"
        />
      )}
    </div>
  );
};

export default Store;
