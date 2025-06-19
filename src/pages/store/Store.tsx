import { useEffect, useRef, useState } from 'react';
import { useLayout } from 'contexts/LayoutContext';
import { axiosClient } from 'queries/clients';
import LoadingIndicator from '@components/LoadingIndicator';

const Store = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { setHeader, setNavigation } = useLayout();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHeader({ display: false, backgroundColor: 'bg-white' });
    setNavigation({ display: true });
  }, []);

  useEffect(() => {
    // iframe이 로드된 후에 메시지 전송
    const sendTokenToStore = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'AUTH_TOKEN',
            accessToken: axiosClient.defaults.headers.common.Authorization
          },
          'https://mall.yaksonhc.com/'
        );
        setIsLoading(false);
      }
    };

    // iframe이 로드되면 토큰 전송
    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', sendTokenToStore);
    }

    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', sendTokenToStore);
      }
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
        src="https://mall.yaksonhc.com/"
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
