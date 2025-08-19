import { ApiResponse, CustomUseMutationOptions, CustomUseQueryOptions } from '@/_shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { SigninEmailBody, SigninEmailSchema, UserSchema } from '../../types';
import { getUser, logout, signinEmail } from '../auth.services';

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

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => logout()
  });
};

export const useSigninEmailMutation = (
  options?: CustomUseMutationOptions<AxiosResponse<ApiResponse<SigninEmailSchema[]>>, AxiosError, SigninEmailBody>
) => {
  return useMutation({
    mutationFn: (body: SigninEmailBody) => signinEmail(body),
    ...options
  });
};
