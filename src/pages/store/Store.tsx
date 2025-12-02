import { getAccessToken } from '@/_domain/auth';
import LoadingIndicator from '@/components/LoadingIndicator';
import { useLayout } from '@/stores/LayoutContext';
import { useEffect, useRef, useState } from 'react';

const STORE_URL = import.meta.env.VITE_HOMECARE_MALL_URL;

const Store = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { setHeader, setNavigation } = useLayout();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHeader({ display: false, backgroundColor: 'bg-white' });
    setNavigation({ display: true });
  }, [setHeader, setNavigation]);

  useEffect(() => {
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
        STORE_URL
      );
      setIsLoading(false);
    };

    iframeEl.addEventListener('load', onLoad);
    return () => {
      iframeEl.removeEventListener('load', onLoad);
    };
  }, []);

  return (
    <div className="bg-white" style={{ width: '100%', height: 'calc(100vh - 82px)' }}>
      {isLoading && (
        <div className="flex justify-center items-center h-full w-full absolute top-0 left-0 z-10 bg-white opacity-50">
          <LoadingIndicator />
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={STORE_URL}
        style={{
          width: '100%',
          height: '100%',
          border: 'none'
        }}
        title="Zippy Store"
      />
    </div>
  );
};

export default Store;
