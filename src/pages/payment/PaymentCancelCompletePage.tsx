import CheckCircle from '@/assets/icons/CheckCircle.svg?react';
import { Button } from '@/shared/ui/button/Button';
import { useLayout } from '@/stores/LayoutContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancelCompletePage = () => {
  const { setHeader, setNavigation } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    setHeader({
      left: 'back',
      backgroundColor: 'bg-white',
      display: true
    });
    setNavigation({ display: false });
  }, []);

  return (
    <div className={'w-full h-full flex flex-col justify-between'}>
      <div className={'flex flex-col items-center gap-7 mt-32'}>
        <CheckCircle />
        <p className={'font-sb text-20px'}>{'취소 요청이 접수되었습니다.'}</p>
      </div>
      <div className={'border-t border-gray-100 px-5 pt-3 pb-8'}>
        <Button className={'w-full'} onClick={() => navigate('/payment')}>
          {'결제 내역으로'}
        </Button>
      </div>
    </div>
  );
};

export default PaymentCancelCompletePage;
