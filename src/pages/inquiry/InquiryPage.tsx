import Header from '@/components/Header';
import { XIcon } from '@/components/icons/XIcon';
import { useLayout } from '@/stores/LayoutContext';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const InquiryPage = () => {
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { setNavigation, setHeader } = useLayout();
  useEffect(() => {
    // iframe 로딩 이후 스크롤 이슈 방지
    const handleIframeLoad = () => {
      if (iframeRef.current) {
        iframeRef.current.style.height = 'calc(100vh - 48px)';
      }
    };

    const iframe = iframeRef.current;
    iframe?.addEventListener('load', handleIframeLoad);

    setNavigation({
      display: false
    });
    setHeader({
      display: false
    });
    return () => {
      iframe?.removeEventListener('load', handleIframeLoad);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header type="title_right_icon" title="1:1 문의" iconRight={<XIcon />} onClickRight={() => navigate(-1)} />
      <div className="flex-1 bg-white">
        <iframe
          ref={iframeRef}
          src="https://o33vp.channel.io"
          title="1:1 문의"
          className="w-full h-full border-none"
          allow="microphone; camera"
        />
      </div>
    </div>
  );
};

export default InquiryPage;
