import { getUser, UserSchema } from '@/_domain/auth';
import { logout as fetchLogout } from '@/apis/auth.api';
import { useStartupPopups } from '@/queries/useContentQueries';
import { usePopupActions } from '@/stores/popupStore';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface AuthContextType {
  user: UserSchema | null;
  login: (userData: { user: UserSchema | null }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * @deprecated
 * 점진적 제거
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { openPopup } = usePopupActions();

  const { data: popupData, isLoading: isPopupLoading } = useStartupPopups({ enabled: !!user });

  useEffect(() => {
    if (user && !isLoading && !isPopupLoading && popupData && popupData.length > 0) {
      setTimeout(() => {
        openPopup(popupData);
      }, 500);
    }
  }, [user, isLoading, isPopupLoading, popupData, openPopup]);

  useEffect(() => {
    /**
     * @deprecated
     * NewRouter의 loader로 점진적 대체
     */
    const initializeAuth = async () => {
      try {
        const response = await getUser();
        const userData = response.data.body[0];

        if (userData) setUser(userData);
      } catch (error) {
        console.error('AuthProvider fetchUser error', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = useCallback(async ({ user: userData }: { user: UserSchema | null }) => {
    if (userData) {
      setUser(userData);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetchLogout();
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
    }
  }, []);

  const authValue = useMemo(
    () => ({ user, login, logout, isLoading, setIsLoading }),
    [user, login, logout, isLoading, setIsLoading]
  );

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
