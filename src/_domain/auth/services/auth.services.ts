import { authApi, publicApi } from '@/_shared/services/instance';
import { ApiResponse } from '@/_shared/types/response.types';
import { handleError } from '@/_shared/utils';
import { AxiosError, AxiosResponse } from 'axios';
import { UserSchema } from '../types';
import {
  CryptoTokenReissueSchema,
  SigninEmailBody,
  SigninEmailSchema,
  SigninSocialBody,
  SigninSocialSchema,
  TermsParams,
  TermsSchema
} from '../types/auth.types';
import { CustomUseMutationOptions, CustomUseQueryOptions } from '@/_shared';
import { useMutation, useQuery } from '@tanstack/react-query';

const BASE_URL = `/auth`;

/**
 * 토큰 재요청
 * @link
 * https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-993ebd2e-fe67-4c78-a024-f97e393798d9?action=share&creator=45468383&ctx=documentation
 */
export const refreshAccessToken = async (): Promise<
  AxiosResponse<ApiResponse<CryptoTokenReissueSchema>, AxiosError>
> => {
  try {
    const endpoint = `${BASE_URL}/crypto/tokenreissue.php`;

    return await publicApi.get(endpoint);
  } catch (error) {
    throw handleError(error, 'refreshAccessToken');
  }
};

/**
 * 소셜 로그인
 * @link
 * https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-7975850e-3c46-4db4-9620-8797ca4fe750?action=share&source=copy-link&creator=45468383
 */
const signinSocial = async (
  body: SigninSocialBody
): Promise<AxiosResponse<ApiResponse<SigninSocialSchema[]>, AxiosError>> => {
  try {
    const endpoint = `${BASE_URL}/signin/social`;

    return await publicApi.post(endpoint, body);
  } catch (error) {
    throw handleError(error, 'signinSocial');
  }
};
export const useSigninSocialMutation = () => {
  return useMutation({
    mutationFn: (body: SigninSocialBody) => signinSocial(body)
  });
};

/**
 * 유저 데이터 조회
 * @link
 * https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-4ed91877-0c46-4550-a492-aa791a4df388?action=share&source=copy-link&creator=45468383
 */
export const getUser = async (): Promise<AxiosResponse<ApiResponse<UserSchema[]>, AxiosError>> => {
  try {
    const endpoint = `${BASE_URL}/me`;

    return await authApi.get(endpoint);
  } catch (error) {
    throw handleError(error, 'getUser');
  }
};
export const useGetUser = (
  options?: CustomUseQueryOptions<
    AxiosResponse<ApiResponse<UserSchema[]>>,
    AxiosError,
    AxiosResponse<ApiResponse<UserSchema[]>>
  >
) => {
  return useQuery({
    queryKey: ['get-user'],
    queryFn: () => getUser(),
    ...options
  });
};

/**
 * 로그아웃
 * @link
 * https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-b9793758-fd37-4cd7-9d40-b76f7c0c8376?action=share&source=copy-link&creator=45468383
 */
const logout = async (): Promise<AxiosResponse<ApiResponse<{ message: string }>, AxiosError>> => {
  try {
    const endpoint = `${BASE_URL}/logout`;

    return await authApi.get(endpoint);
  } catch (error) {
    throw handleError(error, 'logout');
  }
};
export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => logout()
  });
};

/**
 * 이메일 로그인
 * @link
 * https://yaksonhc.postman.co/workspace/Team-Workspace~34821a51-840a-442c-80f4-eeb9dc894ed4/request/37761356-bca7f957-1cf3-4786-8e01-c8f65f37bb7b?action=share&source=copy-link&creator=45468383
 */
const signinEmail = async (
  body: SigninEmailBody
): Promise<AxiosResponse<ApiResponse<SigninEmailSchema[]>, AxiosError>> => {
  try {
    const endpoint = `${BASE_URL}/signin/email`;

    return await publicApi.post(endpoint, body);
  } catch (error) {
    throw handleError(error, 'signinEmail');
  }
};
export const useSigninEmailMutation = (
  options?: CustomUseMutationOptions<AxiosResponse<ApiResponse<SigninEmailSchema[]>>, AxiosError, SigninEmailBody>
) => {
  return useMutation({
    mutationFn: (body: SigninEmailBody) => signinEmail(body),
    ...options
  });
};

const getTerms = async (params: TermsParams): Promise<AxiosResponse<ApiResponse<TermsSchema>, AxiosError>> => {
  try {
    const endpoint = `${BASE_URL}/signup/terms`;

    return await publicApi.get(endpoint, { params });
  } catch (error) {
    throw handleError(error, 'getTerms');
  }
};
export const useGetTerms = (
  params: TermsParams,
  options?: CustomUseQueryOptions<AxiosResponse<ApiResponse<TermsSchema>, AxiosError>>
) => {
  return useQuery({
    queryKey: ['get-terms', params],
    queryFn: () => getTerms(params),
    ...options
  });
};
