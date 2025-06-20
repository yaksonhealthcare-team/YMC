import { Button } from '@/components/Button';
import { useLayout } from '@/contexts/LayoutContext';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
  error: string;
  code: string;
}

const PaymentFailedPage = () => {
  const { setHeader, setNavigation } = useLayout();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  useEffect(() => {
    setHeader({
      display: true,
      title: '결제 실패',
      left: 'back',
      backgroundColor: 'bg-white'
    });
    setNavigation({
      display: false
    });
  }, []);

  const handleRetry = () => {
    navigate('/cart');
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 items-center justify-center p-5">
        <h1 className="text-20px font-sb text-gray-700 mb-2">결제에 실패했습니다</h1>
        <p className="text-14px font-r text-gray-500 text-center mb-2">
          {state?.error || '결제 중 오류가 발생했습니다.'}
        </p>
        {state?.code && <p className="text-12px font-r text-gray-400">오류 코드: {state.code}</p>}
      </div>

      <div className="bg-white flex gap-1 p-5">
        <Button variantType="grayLine" sizeType="l" onClick={handleGoHome} fullWidth>
          홈으로
        </Button>
        <Button variantType="primary" sizeType="l" onClick={handleRetry} fullWidth>
          돌아가기
        </Button>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
