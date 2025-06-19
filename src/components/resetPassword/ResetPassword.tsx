import { useLayout } from '../../contexts/LayoutContext.tsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CaretLeftIcon from '@assets/icons/CaretLeftIcon.svg?react';
import { Button } from '@components/Button.tsx';
import validatePassword from '../../utils/passwordValidator.ts';
import PasswordCustomInput from '@components/input/PasswordCustomInput.tsx';

interface ResetPasswordProps {
  requestPasswordChange: (password: string) => void;
}

const ResetPassword = ({ requestPasswordChange }: ResetPasswordProps) => {
  const [form, setForm] = useState({
    password: '',
    passwordConfirm: ''
  });
  const [errors, setErrors] = useState({
    password: '',
    passwordConfirm: ''
  });

  const { setHeader, setNavigation } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    setHeader({ display: false });
    setNavigation({ display: false });
  }, []);

  const validateForm = () => {
    const newErrors = {
      password: '',
      passwordConfirm: ''
    };

    if (!validatePassword(form.password)) {
      newErrors.password = '비밀번호는 영문, 숫자, 특수문자 중 2종류 이상을 조합하여 10자리 이상이어야 합니다';
    }

    if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const submitPasswordChange = () => {
    if (validateForm()) {
      requestPasswordChange(form.password);
    }
  };

  const handlePasswordChange = (value: string) => {
    setForm((prev) => ({ ...prev, password: value }));
    setErrors((prev) => ({ ...prev, password: '' }));
  };

  const handlePasswordConfirmChange = (value: string) => {
    setForm((prev) => ({ ...prev, passwordConfirm: value }));
    setErrors((prev) => ({ ...prev, passwordConfirm: '' }));
  };

  return (
    <div className={'flex flex-col w-full h-full'}>
      <button className={'px-5 py-4'} onClick={() => navigate(-1)}>
        <CaretLeftIcon className={'w-5 h-5'} />
      </button>
      <div className={'flex flex-col p-5'}>
        <p className={'text-20px font-b'}>
          {'비밀번호를'}
          <br />
          {'재설정해주세요'}
        </p>

        <div className="mt-10">
          <PasswordCustomInput
            onPasswordChange={handlePasswordChange}
            onPasswordConfirmChange={handlePasswordConfirmChange}
            passwordError={errors.password}
            passwordConfirmError={errors.passwordConfirm}
          />
        </div>

        <Button
          className={'mt-10'}
          variantType="primary"
          sizeType="l"
          disabled={
            !form.password ||
            !form.passwordConfirm ||
            !validatePassword(form.password) ||
            form.password !== form.passwordConfirm
          }
          onClick={submitPasswordChange}
        >
          변경하기
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;
