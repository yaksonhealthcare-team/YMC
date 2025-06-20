import { checkEmail } from '@/apis/auth.api';
import { Button } from '@/components/Button';
import CustomTextField from '@/components/CustomTextField';
import PasswordCustomInput from '@/components/input/PasswordCustomInput';
import { useLayout } from '@/contexts/LayoutContext';
import { useOverlay } from '@/contexts/ModalContext';
import { useSignup } from '@/contexts/SignupContext';
import validateEmail from '@/utils/emailValidator';
import validatePassword from '@/utils/passwordValidator';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const EmailPassword = () => {
  const { setHeader, setNavigation } = useLayout();
  const navigate = useNavigate();
  const { signupData, setSignupData } = useSignup();
  const { showToast, openModal } = useOverlay();
  const isSocialSignup = !!sessionStorage.getItem('socialSignupInfo');
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    email: signupData.email || '',
    password: '',
    passwordConfirm: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    passwordConfirm: ''
  });

  useEffect(() => {
    setHeader({
      display: true,
      left: 'back',
      backgroundColor: 'bg-white',
      onClickBack: () => {
        navigate('/login', { replace: true });
      }
    });
    setNavigation({ display: false });

    if (isSocialSignup) {
      const socialInfo = JSON.parse(sessionStorage.getItem('socialSignupInfo') || '{}');
      if (socialInfo.email) {
        setForm((prev) => ({
          ...prev,
          email: socialInfo.email
        }));
      }
    }

    if (!signupData.di) {
      openModal({
        title: '알림',
        message: '회원가입 정보가 초기화되었습니다. 처음부터 다시 시작해주세요.',
        onConfirm: () => {
          navigate('/login', { replace: true });
        }
      });
    }
  }, []);

  const validateEmailField = (email: string) => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: '이메일을 입력해주세요' }));
      return false;
    }
    if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: '올바른 이메일 형식이 아닙니다' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: '' }));
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setForm((prev) => ({ ...prev, email: newEmail }));
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      passwordConfirm: ''
    };

    // 이메일 검증
    if (!validateEmailField(form.email)) {
      newErrors.email = '이메일을 입력해주세요';
    }

    // 소셜 로그인이 아닌 경우에만 비밀번호 검증
    if (!isSocialSignup) {
      // 비밀번호 검증
      if (!form.password) {
        newErrors.password = '비밀번호를 입력해주세요';
      } else {
        if (!validatePassword(form.password)) {
          newErrors.password = '비밀번호는 10~20자 영문 대/소문자, 숫자, 특수문자(@$!%*?&#)를 포함해야 합니다.';
        }
      }

      // 비밀번호 확인 검증
      if (!form.passwordConfirm) {
        newErrors.passwordConfirm = '비밀번호 재확인을 입력해주세요';
      } else if (form.password !== form.passwordConfirm) {
        newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다';
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleNavigateToNext = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    if (isSocialSignup) {
      setSignupData((prev) => ({
        ...prev,
        email: form.email
      }));
      navigate('/signup/profile');
      return;
    }

    try {
      // 이메일 중복 확인
      const exists = await checkEmail(form.email);
      if (exists) {
        showToast('이미 사용중인 이메일입니다');
        setErrors((prev) => ({ ...prev, email: '이미 사용중인 이메일입니다' }));
        setIsLoading(false);
        return;
      }

      setSignupData((prev) => ({
        ...prev,
        email: form.email,
        ...(isSocialSignup ? {} : { password: form.password })
      }));
      navigate('/signup/profile');
    } catch (error) {
      console.error('이메일 중복확인 에러:', error);
      showToast('일시적인 오류가 발생했습니다. 다시 시도해주세요');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col px-5 pt-5 pb-7 gap-10">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <CircularProgress color="primary" size={48} />
            <p className="mt-4 text-16px font-medium text-[#212121]">처리 중...</p>
          </div>
        </div>
      )}

      <h1 className="text-[20px] font-bold leading-[30px] text-[#212121]">
        {isSocialSignup ? '이메일을' : '이메일과 비밀번호를'}
        <br />
        설정해주세요
      </h1>

      <div className="flex flex-col gap-6">
        <CustomTextField
          label="이메일"
          value={form.email}
          disabled={isSocialSignup}
          onChange={handleEmailChange}
          placeholder="이메일 계정 입력"
          state={errors.email ? 'error' : 'default'}
          helperText={errors.email}
        />

        {!isSocialSignup && (
          <PasswordCustomInput
            onPasswordChange={(value) => {
              setForm((prev) => ({ ...prev, password: value }));
              setErrors((prev) => ({ ...prev, password: '' }));
            }}
            onPasswordConfirmChange={(value) => {
              setForm((prev) => ({ ...prev, passwordConfirm: value }));
              setErrors((prev) => ({ ...prev, passwordConfirm: '' }));
            }}
            passwordError={errors.password}
            passwordConfirmError={errors.passwordConfirm}
          />
        )}
      </div>

      <Button variantType="primary" sizeType="l" onClick={handleNavigateToNext} disabled={isLoading}>
        다음
      </Button>
    </div>
  );
};

export default EmailPassword;
