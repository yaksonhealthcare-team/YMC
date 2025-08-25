import { authApi } from '@/_shared';
import { publicApi } from '@/_shared/services/instance';
import { UserMapper } from '@/mappers/UserMapper';
import { HTTPResponse } from '@/types/HTTPResponse';
import { UpdateUserProfileRequest } from '@/types/User';

export type DeviceType = 'android' | 'ios' | 'web';

export const resetPassword = async (password: string, token_version_id?: string, di?: string): Promise<void> => {
  await publicApi.put('/auth/reset_password', {
    password: password,
    token_version_id: token_version_id,
    di: di
  });
};

export const updateUserProfile = async (data: UpdateUserProfileRequest) => {
  const requestData = UserMapper.toUpdateProfileRequest(data);
  const response = await authApi.patch('/auth/me', requestData);
  return response.data;
};

export const signupWithSocial = async ({
  thirdPartyType,
  userInfo
}: {
  thirdPartyType: string;
  userInfo: Record<string, unknown>;
}) => {
  const processedUserInfo = {
    ...userInfo,
    di: userInfo.di,
    token_version_id: userInfo.token_version_id
  };

  const response = await publicApi.post(
    '/auth/signup/social',
    {
      thirdPartyType,
      ...processedUserInfo
    },
    { withCredentials: true }
  ); // 쿠키를 받기 위해 추가

  return response.data;
};

interface SignupFormData {
  userInfo: {
    name: string;
    email: string;
    password: string;
    mobileno: string;
    birthdate: string;
    gender: string;
    addr1: string;
    addr2?: string;
    marketing_yn: boolean;
    post: string;
    nationalinfo: string;
    brand_code?: string[];
    profileUrl?: string;
  };
  authData: {
    di: string;
    token_version_id: string;
  };
  optional?: {
    recom?: string;
  };
}

const createSignupRequest = ({ userInfo, authData, optional = {} }: SignupFormData) => {
  const requestData = {
    ...userInfo,
    marketing_yn: userInfo.marketing_yn ? 'Y' : 'N',
    di: authData.di,
    token_version_id: authData.token_version_id,
    ...(optional.recom && { recom: optional.recom }),
    ...(userInfo.profileUrl && {
      profileUrl: userInfo.profileUrl,
      profileURL: userInfo.profileUrl
    })
  };

  return requestData;
};

export const signup = async (signupData: SignupFormData) => {
  const requestData = createSignupRequest(signupData);

  const { data } = await publicApi.post('/auth/signup/email', requestData, {
    withCredentials: true
  }); // 쿠키를 받기 위해 추가

  return data;
};

export const withdrawal = async () => {
  const response = await authApi.delete(`/auth/withdrawal`);
  return response.data;
};

export const checkEmail = async (email: string): Promise<boolean> => {
  const { data } = await publicApi.post<HTTPResponse<null>>('/auth/signup/check-id', {
    email
  });
  // resultCode가 "23"이면 이메일이 중복된 경우
  return data.resultCode === '23';
};
