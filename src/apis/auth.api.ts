import { UserMapper } from "../mappers/UserMapper.ts"
import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"
import { UpdateUserProfileRequest, User, UserResponse } from "../types/User.ts"

interface SignInResponseBody {
  refreshToken: string
  accessToken: string
}

export interface SignInResponse extends HTTPResponse<SignInResponseBody[]> {}

export const loginWithEmail = async ({
  username,
  password,
}: {
  username: string
  password: string
}): Promise<{
  refreshToken: string
  accessToken: string
}> => {
  const { data } = await axiosClient.post("/auth/signin/email", {
    username: username,
    password: password,
    // TODO: Add body params
    // device_token: FCM_TOKEN,
    // device_type: ANDROID | IOS,
  })

  return {
    refreshToken: data.Header[0].refreshToken,
    accessToken: data.body[0].accessToken,
  }
}

export const fetchUser = async (token: string): Promise<User> => {
  const {
    data: { body: response },
  } = await axiosClient.get<HTTPResponse<UserResponse[]>>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
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
  provider,
  userInfo,
}: {
  provider: string
  userInfo: Record<string, unknown>
}) => {
  // di 값의 + 문자를 %2B로 변환
  const processedUserInfo = {
    ...userInfo,
    di: userInfo.di,
    token_version_id: userInfo.token_version_id,
  }

  const response = await axiosClient.post("/auth/signup/social", {
    thirdPartyType: provider,
    ...processedUserInfo,
  })

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

  return data
}

export interface SignInWithSocialRequest {
  provider: "K" | "N" | "G" | "A"
  socialId: string
  socialAccessToken: string
  deviceToken?: string
  deviceType?: "android" | "ios" | "web"
}

export interface SignInWithSocialResponse {
  refreshToken: string
  accessToken: string
}

export class UserNotFoundError extends Error {
  constructor() {
    super("User not found")
    this.name = "UserNotFoundError"
  }
}

export async function signinWithSocial(
  params: SignInWithSocialRequest,
): Promise<SignInWithSocialResponse> {
  try {
    const response = await axiosClient.post<SignInResponse>(
      "/auth/signin/social",
      {
        SocialAccessToken: params.socialAccessToken,
        thirdPartyType: params.provider,
        socialId: params.socialId,
        deviceToken: params.deviceToken,
        deviceType: params.deviceType,
      },
      {
        maxRedirects: 0,
        validateStatus: (status) => {
          return (status >= 200 && status < 300) || status === 302
        },
        withCredentials: true,
      },
    )

    // 302 상태 코드를 받았을 경우 UserNotFoundError 발생
    if (response.status === 302 || !response.data.body?.[0]?.accessToken) {
      throw new UserNotFoundError()
    }

    return {
      refreshToken: response.data.body[0].refreshToken,
      accessToken: response.data.body[0].accessToken,
    }
  } catch (error: any) {
    if (
      error.response?.status === 404 ||
      error.response?.status === 302 ||
      error.code === "ERR_NETWORK"
    ) {
      throw new UserNotFoundError()
    }
    throw error
  }
}

export const withdrawal = async () => {
  const response = await axiosClient.delete(`/auth/withdrawal`)
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
