import { UserMapper } from "../mappers/UserMapper.ts"
import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"
import { UpdateUserProfileRequest, User, UserResponse } from "../types/User.ts"
import { useAuthStore } from "../stores/auth.store"

interface SignInResponseBody {
  accessToken: string
}

export interface SignInResponse extends HTTPResponse<SignInResponseBody[]> {
  headers?: {
    refreshToken?: string
  }
}

export const loginWithEmail = async ({
  username,
  password,
  deviceToken,
  deviceType,
}: {
  username: string
  password: string
  deviceToken?: string | null
  deviceType?: "android" | "ios" | "web"
}): Promise<{
  accessToken: string
}> => {
  const { data } = await axiosClient.post("/auth/signin/email", {
    username: username,
    password: password,
    deviceToken: deviceToken,
    deviceType: deviceType,
  })

  const accessToken = data.body[0].accessToken
  const refreshToken = data.headers?.refreshToken

  if (refreshToken) {
    useAuthStore.getState().setRefreshToken(refreshToken)
  }

  axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`

  return {
    accessToken,
  }
}

export const fetchUser = async (): Promise<User> => {
  const {
    data: { body: response },
  } = await axiosClient.get<HTTPResponse<UserResponse[]>>("/auth/me")
  return UserMapper.toEntity(response[0])
}

export const resetPassword = async (
  password: string,
  token_version_id?: string,
  di?: string,
): Promise<void> => {
  await axiosClient.put("/auth/reset_password", {
    password: password,
    token_version_id: token_version_id,
    di: di,
  })
}

export const updateUserProfile = async (data: UpdateUserProfileRequest) => {
  const requestData = UserMapper.toUpdateProfileRequest(data)
  const response = await axiosClient.patch("/auth/me", requestData)
  return response.data
}

export const signupWithSocial = async ({
  thirdPartyType,
  userInfo,
}: {
  thirdPartyType: string
  userInfo: Record<string, unknown>
}) => {
  // di 값의 + 문자를 %2B로 변환
  const processedUserInfo = {
    ...userInfo,
    di: userInfo.di,
    token_version_id: userInfo.token_version_id,
  }

  const response = await axiosClient.post("/auth/signup/social", {
    thirdPartyType,
    ...processedUserInfo,
  })

  const refreshToken = response.data.headers?.refreshToken
  if (refreshToken) {
    useAuthStore.getState().setRefreshToken(refreshToken)
  }

  return response.data
}

interface SignupFormData {
  userInfo: {
    name: string
    email: string
    password: string
    mobileno: string
    birthdate: string
    gender: string
    addr1: string
    addr2?: string
    marketing_yn: boolean
    post: string
    nationalinfo: string
    brand_code?: string[]
  }
  authData: {
    di: string
    token_version_id: string
  }
  optional?: {
    recom?: string
  }
}

const createSignupRequest = ({
  userInfo,
  authData,
  optional = {},
}: SignupFormData) => {
  const requestData = {
    ...userInfo,
    marketing_yn: userInfo.marketing_yn ? "Y" : "N",
    di: authData.di,
    token_version_id: authData.token_version_id,
    ...(optional.recom && { recom: optional.recom }),
  }

  return requestData
}

export const signup = async (signupData: SignupFormData) => {
  const requestData = createSignupRequest(signupData)

  const { data } = await axiosClient.post("/auth/signup/email", requestData)

  const refreshToken = data.headers?.refreshToken
  if (refreshToken) {
    useAuthStore.getState().setRefreshToken(refreshToken)
  }

  return data
}

export interface SignInWithSocialRequest {
  SocialAccessToken: string
  thirdPartyType: "K" | "N" | "G" | "A"
  socialId: string
  deviceToken?: string | null
  deviceType?: "android" | "ios" | "web"
  id_token?: string
  SocialRefreshToken?: string | null
}

export interface SignInWithSocialResponse {
  accessToken: string
}

export class UserNotFoundError extends Error {
  constructor() {
    super("User not found")
    this.name = "UserNotFoundError"
  }
}

export async function signinWithSocial(
  request: SignInWithSocialRequest,
): Promise<SignInWithSocialResponse> {
  try {
    const { data } = await axiosClient.post<SignInResponse>(
      "/auth/signin/social",
      request,
    )

    const accessToken = data.body[0].accessToken
    const refreshToken = data.headers?.refreshToken

    if (refreshToken) {
      useAuthStore.getState().setRefreshToken(refreshToken)
    }

    axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`

    return {
      accessToken,
    }
  } catch (error: any) {
    // 401 에러는 사용자를 찾을 수 없는 경우
    if (error.response?.status === 401) {
      throw new UserNotFoundError()
    }
    throw error
  }
}

export const withdrawal = async () => {
  const response = await axiosClient.delete(`/auth/withdrawal`)
  return response.data
}

export const logout = async () => {
  const response = await axiosClient.post("/auth/logout", {})
  useAuthStore.getState().clearRefreshToken()
  return response.data
}

export const findEmail = async ({
  name,
  mobileNumber,
  birthDate,
}: {
  name: string
  mobileNumber: string
  birthDate: string
}): Promise<string> => {
  const { data } = await axiosClient.post<HTTPResponse<{ email: string }[]>>(
    "/auth/account/find-account",
    {
      name,
      mobileno: mobileNumber,
      birthdate: birthDate,
    },
  )

  return data.body[0].email
}

export const checkEmail = async (email: string): Promise<boolean> => {
  const { data } = await axiosClient.post<HTTPResponse<null>>(
    "/auth/signup/check-id",
    {
      email,
    },
  )
  // resultCode가 "23"이면 이메일이 중복된 경우
  return data.resultCode === "23"
}
