import { resetPassword } from '@/apis/auth.api';
import { FindPasswordResponse, findPasswordWithDecryptData } from '@/apis/decrypt-result.api';
import { Button } from '@/components/Button';
import LoadingIndicator from '@/components/LoadingIndicator';
import ResetPassword from '@/components/resetPassword/ResetPassword';
import { useLayout } from '@/contexts/LayoutContext';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FindAccountResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const verifiedData = location.state?.verifiedData;
  const { setHeader, setNavigation } = useLayout();
  const [isLoading, setIsLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState<FindPasswordResponse>();

  useEffect(() => {
    const getLoginInfo = async () => {
      const loginInfo = await findPasswordWithDecryptData({
        token_version_id: verifiedData.token_version_id,
        di: verifiedData.di
      });

      setLoginInfo(loginInfo);
      setIsLoading(false);
    };

    setHeader({
      backgroundColor: 'bg-white'
    });
    setNavigation({ display: false });
    // 본인인증 데이터가 없으면 계정찾기 페이지로 이동
    if (!verifiedData) {
      navigateToLogin();
      return;
    }

    getLoginInfo();
  }, []);

  const handleChangePassword = async (password: string) => {
    try {
      await resetPassword(password, verifiedData.token_version_id, verifiedData.di);
      navigate('complete');
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToLogin = () => {
    navigate('/login', { replace: true });
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!loginInfo) {
    return (
      <div className="px-[20px] mt-[28px]">
        <p className="flex flex-col justify-center items-center font-[600] text-20px text-[#212121]">
          계정을 찾을 수 없습니다.
        </p>

        <Button
          variantType="primary"
          sizeType="l"
          className="h-[52px] mt-[40px] font-[700] text-16px w-full"
          onClick={navigateToLogin}
        >
          로그인 페이지로 이동
        </Button>
      </div>
    );
  }

  if (!loginInfo.thirdPartyType) {
    return (
      <div className="px-[20px] mt-[28px]">
        <p className="flex flex-col justify-center items-center font-[600] text-20px text-[#212121]">
          계정을 찾을 수 없습니다.
        </p>

        <Button
          variantType="primary"
          sizeType="l"
          className="h-[52px] mt-[40px] font-[700] text-16px w-full"
          onClick={navigateToLogin}
        >
          로그인 페이지로 이동
        </Button>
      </div>
    );
  }

  if (loginInfo.thirdPartyType !== 'E') {
    return (
      <div className="px-[20px] mt-[28px]">
        <p className="flex flex-col justify-center items-center font-[600] text-20px text-[#212121]">
          {`${loginInfo.thirdPartyType} 계정으로 가입되어 있습니다.`}
        </p>
        <Button
          variantType="primary"
          sizeType="l"
          className="h-[52px] mt-[40px] font-[700] text-16px w-full"
          onClick={navigateToLogin}
        >
          로그인 페이지로 이동
        </Button>
      </div>
    );
  }

  if (loginInfo.thirdPartyType === 'E' && !loginInfo.email) {
    return (
      <div className="px-[20px] mt-[28px]">
        <p className="flex flex-col justify-center items-center font-[600] text-20px text-[#212121]">
          계정을 찾을 수 없습니다.
        </p>
        <Button
          variantType="primary"
          sizeType="l"
          className="h-[52px] mt-[40px] font-[700] text-16px w-full"
          onClick={navigateToLogin}
        >
          로그인 페이지로 이동
        </Button>
      </div>
    );
  }

  return <ResetPassword requestPasswordChange={handleChangePassword} />;
};

export default FindAccountResetPassword;
