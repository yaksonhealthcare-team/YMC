import { useUserStore } from '@/_domain/auth';
import CaretLeftIcon from '@/assets/icons/CaretLeftIcon.svg?react';
import CheckCircle from '@/assets/icons/CheckCircle.svg?react';
import { Button } from '@/components/Button';
import { useLayout } from '@/stores/LayoutContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPasswordComplete = () => {
  const { user } = useUserStore();
  const { setHeader, setNavigation } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    setHeader({ display: false });
    setNavigation({ display: false });
  }, [setHeader, setNavigation]);

  const navigateToLogin = () => {
    if (user) {
      navigate('/logout', { replace: true });
    }
    navigate('/login', { replace: true });
  };

  return (
    <>
      <div className={'flex flex-col w-full'}>
        <button className={'px-5 py-4'} onClick={navigateToLogin}>
          <CaretLeftIcon className={'w-5 h-5'} />
        </button>
        <div className={'flex flex-col h-full w-full items-stretch justify-center p-5 mt-[120px]'}>
          <div className="self-center w-[60px] h-[60px] flex items-center justify-center">
            <CheckCircle className="w-[60px] h-[60px] text-primary" />
          </div>
          <p className={'font-sb text-20px text-center mt-7'}>
            {'비밀번호가 변경되었어요'}
            <br />
            {'다시 로그인해주세요'}
          </p>
          <Button className={'mt-10'} variantType={'primary'} onClick={navigateToLogin}>
            로그인 페이지로 이동
          </Button>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordComplete;
