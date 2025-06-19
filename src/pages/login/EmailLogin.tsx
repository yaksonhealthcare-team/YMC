import { DeviceType, fetchUser, loginWithEmail } from '@/apis/auth.api';
import { Button } from '@/components/Button';
import CustomTextField from '@/components/CustomTextField';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EyeIcon from '../../assets/icons/EyeIcon.svg?react';
import EyeSlashIcon from '../../assets/icons/EyeSlashIcon.svg?react';
import { useAuth } from '../../contexts/AuthContext';
import { useLayout } from '../../contexts/LayoutContext';
import { useOverlay } from '../../contexts/ModalContext';
import { requestForToken } from '../../libs/firebase';

interface LoginForm {
  email: string;
  password: string;
}

const EmailLogin = () => {
  const { setHeader, setNavigation } = useLayout();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useOverlay();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isFormValid = formData.email.length > 0 && formData.password.length > 0;

  useEffect(() => {
    setHeader({
      display: true,
      title: '이메일 로그인',
      left: 'back',
      backgroundColor: 'bg-white'
    });
    setNavigation({ display: false });
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!formData.email || !validateEmail(formData.email)) {
        showToast('올바른 이메일을 입력해주세요');
        return;
      }
      if (!formData.password) {
        showToast('비밀번호를 입력해주세요');
        return;
      }

      let accessToken = '';

      if (window.ReactNativeWebView) {
        const loginResponse = await loginWithEmail({
          username: formData.email,
          password: formData.password,
          deviceToken: localStorage.getItem(LOCAL_STORAGE_KEYS.FCM_TOKEN) ?? '',
          deviceType: localStorage.getItem('DEVICE_TYPE') as DeviceType
        });

        if (!loginResponse.accessToken) {
          throw new Error('로그인에 실패했습니다');
        }

        accessToken = loginResponse.accessToken;

        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'LOGIN_SUCCESS',
            data: {
              accessToken: accessToken
            }
          })
        );
      } else {
        const response = await loginWithEmail({
          username: formData.email,
          password: formData.password,
          deviceToken: await requestForToken(),
          deviceType: 'web'
        });

        if (!response.accessToken) {
          throw new Error('로그인에 실패했습니다');
        }
      }

      const user = await fetchUser();

      login({
        user: user
      });
      navigate('/', { replace: true });
    } catch {
      showToast('로그인에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex flex-col px-5">
      <div className="mt-[84px] flex flex-col gap-6">
        {/* 이메일 입력 */}
        <div className="flex flex-col gap-2">
          <span className="font-m text-14px text-[#212121]">이메일</span>
          <CustomTextField name="email" placeholder="이메일 계정 입력" value={formData.email} onChange={handleChange} />
        </div>

        {/* 비밀번호 입력 */}
        <CustomTextField
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호 입력"
          value={formData.password}
          onChange={handleChange}
          iconRight={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-6 h-6 text-[#BDBDBD]" />
              ) : (
                <EyeIcon className="w-6 h-6 text-[#BDBDBD]" />
              )}
            </button>
          }
        />

        {/* 로그인 버튼 */}
        <Button
          variantType="primary"
          sizeType="l"
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
          className={!isFormValid || isLoading ? 'bg-[#ECECEC] !text-[#9E9E9E] hover:bg-[#ECECEC]' : ''}
          aria-label="로그인"
        >
          {isLoading ? <CircularProgress size={24} className="text-[#9E9E9E]" /> : '로그인'}
        </Button>
      </div>

      {/* 이메일/비밀번호 찾기 */}
      <div className="flex justify-end mt-10">
        <button
          onClick={() => navigate('/find-account')}
          className="font-m text-16px text-[#757575]"
          aria-label="이메일 비밀번호 찾기"
        >
          이메일 / 비밀번호 찾기
        </button>
      </div>
    </div>
  );
};

export default EmailLogin;
