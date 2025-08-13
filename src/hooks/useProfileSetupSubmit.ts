import { getUser, saveAccessToken, SigninEmailBody, useSigninEmailMutation, useUserStore } from '@/_domain/auth';
import { signinWithSocial, signup, signupWithSocial } from '@/apis/auth.api';
import { useOverlay } from '@/stores/ModalContext';
import { useSignup } from '@/stores/SignupContext';
import { requestForToken } from '@/libs/firebase';
import { UserSignup } from '@/types/User';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

type SocialProvider = 'N' | 'K' | 'G' | 'A';

export interface SocialSignupInfo {
  email?: string;
  socialId: string;
  di: string;
  thirdPartyType: SocialProvider;
  token_version_id: string;
  id_token?: string;
  SocialRefreshToken?: string;
  deviceToken?: string;
  deviceType?: 'android' | 'ios' | 'web';
  next_action_type?: 'signup';
}

export const useProfileSetupSubmit = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const { showToast } = useOverlay();
  const { signupData: storedSignupData, cleanup } = useSignup();
  const { mutateAsync: loginMutateAsync } = useSigninEmailMutation();

  const handleSocialSignup = async (socialInfo: SocialSignupInfo, signupData: UserSignup) => {
    const response = await signupWithSocial({
      thirdPartyType: socialInfo.thirdPartyType,
      userInfo: {
        ...socialInfo,
        name: signupData.name,
        email: signupData.email,
        mobileno: signupData.mobileNumber,
        birthdate: signupData.birthDate,
        gender: signupData.gender,
        di: signupData.di,
        token_version_id: signupData.tokenVersionId,
        post: signupData.postCode,
        addr1: signupData.address1,
        addr2: signupData.address2 || '',
        marketing_yn: socialInfo.SocialRefreshToken ? 'Y' : 'N',
        brand_code: signupData.brandCodes || [],
        profileUrl: signupData.profileUrl,
        profileURL: signupData.profileUrl
      }
    });

    if (!response?.body?.length || !response.body[0]?.accessToken) {
      throw new Error(response?.resultMessage ?? '회원가입 응답이 올바르지 않습니다');
    }

    const signinResponse = await signinWithSocial({
      thirdPartyType: socialInfo.thirdPartyType,
      SocialAccessToken: response.body[0].accessToken,
      socialId: socialInfo.socialId,
      id_token: socialInfo.id_token,
      SocialRefreshToken: socialInfo.SocialRefreshToken,
      deviceToken: socialInfo.deviceToken ?? (await requestForToken()),
      deviceType: socialInfo.deviceType ?? window.osType ?? 'web'
    });

    const accessToken = signinResponse.data.body[0].accessToken;

    if (!accessToken) throw new Error('회원가입에 실패했습니다. 계속 문제가 발생할 경우 고객센터에 문의해 주세요.');
    saveAccessToken(accessToken);

    const data = await getUser();
    const user = data.data.body[0];
    setUser(user);
    cleanup();
    navigate('/signup/complete', { replace: true });
  };

  const handleEmailSignup = async (signupData: UserSignup) => {
    const signupFormData = {
      userInfo: {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        mobileno: signupData.mobileNumber,
        birthdate: signupData.birthDate,
        gender: signupData.gender,
        addr1: signupData.address1,
        addr2: signupData.address2 || '',
        marketing_yn: signupData.marketingYn,
        post: signupData.postCode,
        nationalinfo: '0',
        brand_code: signupData.brandCodes || [],
        profileUrl: signupData.profileUrl,
        profileURL: signupData.profileUrl
      },
      authData: {
        di: signupData.di,
        token_version_id: signupData.tokenVersionId
      },
      optional: {
        recom: signupData.referralCode
      }
    };

    await signup(signupFormData);

    const body: SigninEmailBody = {
      username: signupData.email,
      password: signupData.password,
      deviceToken: await requestForToken(),
      deviceType: window.osType ?? 'web'
    };
    const loginResponse = await loginMutateAsync(body);
    const accessToken = loginResponse.data.body[0]?.accessToken;

    if (!accessToken) throw new Error(loginResponse.data.resultMessage || '로그인에 실패했습니다.');
    saveAccessToken(accessToken);

    const data = await getUser();
    const user = data.data.body[0];
    setUser(user);
    cleanup();
    navigate('/signup/complete', { replace: true });
  };

  const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.resultMessage;
      showToast(errorMessage || '회원가입에 실패했습니다. 계속 문제가 발생할 경우 고객센터에 문의해 주세요.');
    } else if (error instanceof Error) {
      showToast(error.message || '회원가입에 실패했습니다. 계속 문제가 발생할 경우 고객센터에 문의해 주세요.');
    } else {
      showToast('회원가입에 실패했습니다. 계속 문제가 발생할 경우 고객센터에 문의해 주세요.');
    }
  };

  const handleSubmit = async (signupData?: UserSignup) => {
    try {
      const socialInfo = sessionStorage.getItem('socialSignupInfo');
      if (socialInfo) {
        const socialSignupInfo: SocialSignupInfo = JSON.parse(socialInfo);
        if (signupData) {
          await handleSocialSignup(socialSignupInfo, signupData);
          return;
        }

        await handleSocialSignup(socialSignupInfo, storedSignupData);
        return;
      }

      if (signupData) {
        await handleEmailSignup(signupData);
        return;
      }

      await handleEmailSignup(storedSignupData);
      return;
    } catch (error: unknown) {
      handleError(error);
    }
  };

  return {
    handleSubmit
  };
};
