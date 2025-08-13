import { useLogoutMutation, useUserStore } from '@/_domain/auth';
import Logo from '@/components/Logo';
import { useLayout } from '@/contexts/LayoutContext';
import { Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { resetUser } = useUserStore();
  const { mutateAsync } = useLogoutMutation();
  const { setHeader, setNavigation } = useLayout();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await mutateAsync();
    localStorage.clear();
    sessionStorage.clear();
    resetUser();

    navigate('/login', { replace: true });
  }, [mutateAsync, navigate, resetUser]);

  useEffect(() => {
    setHeader({
      display: false,
      backgroundColor: 'bg-system-bg'
    });
    setNavigation({ display: false });
    handleLogout();
  }, [handleLogout, setHeader, setNavigation]);

  return (
    <div className={'flex flex-col h-full w-full justify-center items-center bg-system-bg p-14'}>
      <div className={'py-48'}>
        <Logo text size={191} />

        <div className={'flex justify-center'}>
          <Typography variant="body2" className={'p-4'}>
            안전하게 로그아웃 중입니다.
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Logout;
