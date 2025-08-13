import { getUser, useUserStore } from '@/_domain/auth';
import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { setUser } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  const loadUser = useCallback(async () => {
    try {
      const data = await getUser();
      const user = data.data.body[0];
      if (user) {
        setUser(user);
      } else {
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('사용자 정보 조회 실패', error);
    }
  }, [navigate, setUser]);

  useEffect(() => {
    loadUser();
  }, [loadUser, location.pathname]);

  return children;
};

export default ProtectedRoute;
