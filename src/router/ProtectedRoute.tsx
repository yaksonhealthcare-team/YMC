import { fetchUser } from '@/apis/auth.api';
import SplashScreen from '@/components/Splash';
import { useAuth } from '@/contexts/AuthContext';
import { useLayout } from '@/contexts/LayoutContext';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoading, login } = useAuth();
  const navigate = useNavigate();
  const { setNavigation } = useLayout();
  const location = useLocation();

  const loadUser = async () => {
    try {
      const user = await fetchUser();
      if (user) {
        login({ user });
      } else {
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('사용자 정보 조회 실패', error);
    }
  };

  useEffect(() => {
    loadUser();
  }, [location.pathname]);

  useEffect(() => {
    if (isLoading) {
      setNavigation({ display: false });
    }
  }, [isLoading, navigate]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return children;
};

export default ProtectedRoute;
