import { Button } from '@/components/Button';
import Logo from '@/components/Logo';
import { requestNotificationPermission } from '@/libs/firebase';
import { getKakaoLoginUrl } from '@/libs/kakao';
import { CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppleIcon from '../../assets/icons/AppleIcon.svg?react';
import GoogleIcon from '../../assets/icons/GoogleIcon.svg?react';
import KakaoIcon from '../../assets/icons/KakaoIcon.svg?react';
import NaverIcon from '../../assets/icons/NaverIcon.svg?react';
import { useLayout } from '../../contexts/LayoutContext';
import { getAppleLoginUrl } from '../../libs/apple';
import { getGoogleLoginUrl } from '../../libs/google';
import { getNaverLoginUrl } from '../../libs/naver';

const Login = () => {
  const { setHeader, setNavigation } = useLayout();
  const navigate = useNavigate();
  const [osType] = useState<'ios' | 'android' | 'web' | undefined>(() => {
    const savedOsType = localStorage.getItem('osType');
    if (window.osType) {
      localStorage.setItem('osType', window.osType);
      return window.osType;
    }
    if (savedOsType === 'ios' || savedOsType === 'android') {
      return savedOsType;
    }
    return undefined;
  });
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  useEffect(() => {
    setHeader({
      display: false,
      backgroundColor: 'bg-system-bg'
    });
    setNavigation({ display: false });
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (osType) {
      localStorage.setItem('osType', osType);
    }
  }, [osType]);

  const handleSocialLogin = async (provider: 'kakao' | 'naver' | 'google' | 'apple') => {
    setLoadingProvider(provider);
    try {
      if (provider !== 'naver' && provider !== 'apple' && window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'SOCIAL_LOGIN',
            provider
          })
        );
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
    } catch (error) {
      console.error('소셜 로그인 에러:', error);
    } finally {
      setLoadingProvider(null);
    }
  };

  const renderSocialLoginButton = (
    provider: 'kakao' | 'naver' | 'google' | 'apple',
    icon: React.ReactNode,
    text: string,
    bgColor: string,
    textColor: string = 'text-[#262626]',
    borderColor: string = bgColor
  ) => {
    const isLoading = loadingProvider === provider;
    return (
      <Button
        onClick={() => handleSocialLogin(provider)}
        fullCustom
        sizeType="l"
        disabled={isLoading}
        className={`${bgColor} border-${borderColor} ${textColor} font-b flex items-center px-5 py-[13.75px] rounded-[12px] relative ${
          isLoading ? 'opacity-70' : ''
        }`}
      >
        {isLoading ? (
          <CircularProgress
            size={24}
            className={`absolute left-5 ${textColor === 'text-white' ? 'text-white' : 'text-[#9E9E9E]'}`}
          />
        ) : (
          <div className="absolute left-5">{icon}</div>
        )}
        <span className="flex-1 text-center text-16px">{text}</span>
      </Button>
    );
  };

  return (
    <div className="flex flex-col min-h-[100vh] bg-[#F8F5F2]">
      {/* 로고 */}
      <div className="mt-[30%] mb-[10%] flex justify-center">
        <Logo text size={191} />
      </div>

      {/* 로그인 버튼 그룹 */}
      <div className="flex flex-col gap-3 px-5 mt-auto mb-auto">
        {/* 카카오 로그인 */}
        {renderSocialLoginButton('kakao', <KakaoIcon className="w-6 h-6" />, '카카오톡으로 로그인', 'bg-[#FEE500]')}

        {/* 네이버 로그인 */}
        {renderSocialLoginButton(
          'naver',
          <NaverIcon className="w-6 h-6 text-white" />,
          '네이버로 로그인',
          'bg-[#03C75A]',
          'text-white'
        )}

        {/* 구글 로그인 (웹 또는 Android에서만 표시) */}
        {(!osType || osType === 'android') &&
          renderSocialLoginButton(
            'google',
            <GoogleIcon className="w-6 h-6" />,
            'Google로 로그인',
            'bg-white',
            'text-[#212121]',
            '[#ECECEC]'
          )}

        {/* 애플 로그인 (웹 또는 iOS에서만 표시) */}
        {(!osType || osType === 'ios') &&
          renderSocialLoginButton(
            'apple',
            <AppleIcon className="w-6 h-6 text-white" />,
            'Apple로 로그인',
            'bg-[#000000]',
            'text-white'
          )}

        {/* 이메일 로그인 */}
        <Button
          fullCustom
          sizeType="l"
          className="bg-primary border-primary text-white font-b flex items-center px-5 h-[52px] rounded-[12px] relative"
          onClick={() => navigate('/login/email')}
        >
          <div className="w-6 h-6 absolute left-5" />
          <span className="flex-1 text-center text-16px">이메일로 로그인</span>
        </Button>
      </div>
      <div className="mb-[7%] flex justify-center items-center gap-5">
        <Typography className="text-gray-500 font-sb text-16px">처음이신가요?</Typography>
        <button onClick={() => navigate('/signup/terms')} className="text-primary font-sb text-16px underline">
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Login;
