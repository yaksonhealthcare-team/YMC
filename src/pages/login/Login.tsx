import { Button } from '@/_shared';
import AppleIcon from '@/assets/icons/AppleIcon.svg?react';
import GoogleIcon from '@/assets/icons/GoogleIcon.svg?react';
import KakaoIcon from '@/assets/icons/KakaoIcon.svg?react';
import NaverIcon from '@/assets/icons/NaverIcon.svg?react';
import Logo from '@/components/Logo';
import { useLayout } from '@/stores/LayoutContext';
import { useOverlay } from '@/stores/ModalContext';
import { getAppleLoginUrl } from '@/libs/apple';
import { requestNotificationPermission } from '@/libs/firebase';
import { getGoogleLoginUrl } from '@/libs/google';
import { getKakaoLoginUrl } from '@/libs/kakao';
import { getNaverLoginUrl } from '@/libs/naver';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loadingProvider, setLoadingProvider] = useState<'kakao' | 'naver' | 'google' | 'apple' | null>(null);
  const [isAndroid, setIsAndroid] = useState(false);

  const { setHeader, setNavigation } = useLayout();
  const { showToast } = useOverlay();
  const navigate = useNavigate();

  useEffect(() => {
    setHeader({ display: false, backgroundColor: 'bg-system-bg' });
    setNavigation({ display: false });

    const setInit = async () => {
      const ua = navigator.userAgent || '';
      setIsAndroid(/android/i.test(ua));
      await requestNotificationPermission();
    };

    setInit();
  }, [setHeader, setNavigation]);

  const handleSocialLogin = async (provider: 'kakao' | 'naver' | 'google' | 'apple') => {
    setLoadingProvider(provider);
    try {
      const isApp = !!window.ReactNativeWebView;
      if (isApp) {
        window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'SOCIAL_LOGIN', provider }));
        return;
      }
      let url = '';

      switch (provider) {
        case 'naver':
          url = getNaverLoginUrl();
          break;
        case 'google':
          url = await getGoogleLoginUrl();
          break;
        case 'apple':
          url = getAppleLoginUrl();
          break;
        case 'kakao':
          url = getKakaoLoginUrl();
          break;
      }

      if (url) window.location.href = url;
    } catch {
      showToast('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex flex-col min-h-[100vh] bg-[#F8F5F2]">
      <div className="mt-[30%] mb-[10%] flex justify-center">
        <Logo text size={191} />
      </div>

      <div className="flex flex-col gap-3 px-5 mt-auto mb-auto">
        <Button
          className="relative flex items-center bg-[#FEE500]"
          onClick={() => handleSocialLogin('kakao')}
          isLoading={loadingProvider === 'kakao'}
        >
          <KakaoIcon className="w-6 h-6 absolute" />
          <p className="flex-1 text-gray-700">카카오로 로그인</p>
        </Button>

        <Button
          className="relative flex items-center bg-[#03C75A]"
          onClick={() => handleSocialLogin('naver')}
          isLoading={loadingProvider === 'naver'}
        >
          <NaverIcon className="w-6 h-6 absolute" />
          <p className="flex-1 text-white">네이버로 로그인</p>
        </Button>

        <Button
          className="relative flex items-center bg-white"
          onClick={() => handleSocialLogin('google')}
          isLoading={loadingProvider === 'google'}
        >
          <GoogleIcon className="w-6 h-6 absolute" />
          <p className="flex-1 text-gray-700">Google로 로그인</p>
        </Button>

        {!isAndroid && (
          <Button
            className="relative flex items-center bg-black"
            onClick={() => handleSocialLogin('apple')}
            isLoading={loadingProvider === 'apple'}
          >
            <AppleIcon className="w-6 h-6 absolute" />
            <p className="flex-1 text-white">Apple로 로그인</p>
          </Button>
        )}

        <Button onClick={() => navigate('/login/email')}>
          <p className="flex-1">이메일로 로그인</p>
        </Button>
      </div>

      <div className="mb-[7%] flex justify-center items-center gap-5">
        <p className="text-gray-500 font-sb text-16px">처음이신가요?</p>
        <button onClick={() => navigate('/signup/terms')} className="text-primary font-sb text-16px underline">
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Login;
