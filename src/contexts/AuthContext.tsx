import { logout as fetchLogout, fetchUser } from '@/apis/auth.api';
import { axiosClient } from '@/queries/clients';
import { useStartupPopups } from '@/queries/useContentQueries';
import { usePopupActions } from '@/stores/popupStore';
import { User } from '@/types/User';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface AuthContextType {
  user: User | null;
  login: (userData: { user: User | null }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { openPopup } = usePopupActions();

  const { data: popupData, isLoading: isPopupLoading } = useStartupPopups({
    enabled: !!user
  });

  useEffect(() => {
    if (user && !isLoading && !isPopupLoading && popupData && popupData.length > 0) {
      console.log('User authenticated and popup data loaded, attempting to open popup.');
      setTimeout(() => {
        openPopup(popupData);
      }, 500);
    }
  }, [user, isLoading, isPopupLoading, popupData, openPopup]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = await fetchUser();
        if (userData) setUser(userData);
      } catch (error) {
        console.error('AuthProvider fetchUser error', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async ({ user: userData }: { user: User | null }) => {
    if (userData) {
      setUser(userData);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await fetchLogout();
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    } finally {
      delete axiosClient.defaults.headers.common.Authorization;
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
    }
  };

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
