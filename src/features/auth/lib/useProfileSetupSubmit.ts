import {
  getUser,
  saveAccessToken,
  SigninEmailBody,
  useSigninEmailMutation,
  useSigninSocialMutation,
  useUserStore
} from '@/_domain/auth';
import { requestForToken } from '@/_shared';
import { signup, signupWithSocial } from '@/entities/user/api/auth.api';
import { useOverlay } from '@/shared/ui/modal/ModalContext';
import { useSignup } from '@/features/auth/model/SignupContext';
import { UserSignup } from '@/entities/user/model/User';
import { AxiosError } from 'axios';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_SIGNUP_ERROR_MESSAGE, executeWithRetry, normalizeSignupFailureMessage } from './useProfileSetupSubmit.utils';

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
  const { cleanup } = useSignup();
  const { mutateAsync: loginMutateAsync } = useSigninEmailMutation();
  const { mutateAsync: signinMutateAsync } = useSigninSocialMutation();
  const isSubmittingRef = useRef(false);

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

    const body = {
      thirdPartyType: socialInfo.thirdPartyType,
      SocialAccessToken: response.body[0].accessToken,
      socialId: socialInfo.socialId,
      id_token: socialInfo.id_token,
      SocialRefreshToken: socialInfo.SocialRefreshToken,
      deviceToken: socialInfo.deviceToken ?? (await requestForToken()),
      deviceType: socialInfo.deviceType ?? window.osType ?? 'web'
    };
    const signinResponse = await executeWithRetry(() => signinMutateAsync(body), 1);
    const accessToken = signinResponse.data.body[0].accessToken;

    if (!accessToken) throw new Error(DEFAULT_SIGNUP_ERROR_MESSAGE);
    saveAccessToken(accessToken);

    const data = await executeWithRetry(() => getUser(), 1);
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
    const loginResponse = await executeWithRetry(() => loginMutateAsync(body), 1);
    const accessToken = loginResponse.data.body[0]?.accessToken;

    if (!accessToken) throw new Error(loginResponse.data.resultMessage || '로그인에 실패했습니다.');
    saveAccessToken(accessToken);

    const data = await executeWithRetry(() => getUser(), 1);
    const user = data.data.body[0];
    setUser(user);
    cleanup();
    navigate('/signup/complete', { replace: true });
  };

  const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.resultMessage;
      showToast(normalizeSignupFailureMessage(errorMessage));
    } else if (error instanceof Error) {
      showToast(normalizeSignupFailureMessage(error.message));
    } else {
      showToast(DEFAULT_SIGNUP_ERROR_MESSAGE);
    }
  };

  const handleSubmit = async (signupData: UserSignup) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {
      const socialInfo = sessionStorage.getItem('socialSignupInfo');
      if (socialInfo) {
        const socialSignupInfo: SocialSignupInfo = JSON.parse(socialInfo);
        await handleSocialSignup(socialSignupInfo, signupData);
        return;
      }

      await handleEmailSignup(signupData);
      return;
    } catch (error: unknown) {
      handleError(error);
      throw error;
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return {
    handleSubmit
  };
};
