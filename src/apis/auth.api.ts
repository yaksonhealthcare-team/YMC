import { UserMapper } from "../mappers/UserMapper.ts"
import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"
import { UpdateUserProfileRequest, User, UserResponse } from "../types/User.ts"

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
      Authorization: token,
    },
  })
  return UserMapper.toEntity(response[0])
}

export const resetPassword = async (
  email: string,
  password: string,
): Promise<void> => {
  await axiosClient.put("/auth/reset_password", {
    email: email,
    password: password,
  })
}

export const updateUserProfile = async (data: UpdateUserProfileRequest) => {
  const requestData = UserMapper.toUpdateProfileRequest(data)
  const response = await axiosClient.patch("/auth/me", requestData)
  return response.data
}

export const loginWithNaver = async ({
  accessToken,
}: {
  accessToken: string
}) => {
  const { data } = await axiosClient.post("/auth/signin/social", {
    thirdPartyType: "N",
    SocialAccessToken: accessToken,
    device_token: "TODO: FCM 토큰 추가",
    device_type: "TODO: 디바이스 타입 추가",
  })

  return {
    refreshToken: data.Header[0].refreshToken,
    accessToken: data.body[0].accessToken,
  }
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
    di:
      typeof userInfo.di === "string"
        ? userInfo.di.replace(/\+/g, "%2B")
        : userInfo.di,
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
    di: authData.di.replace(/\+/g, "%2B"),
    ...(optional.recom && { recom: optional.recom }),
  }

  return requestData
}

export const signup = async (signupData: SignupFormData) => {
  const requestData = createSignupRequest(signupData)

  const { data } = await axiosClient.post("/auth/signup/email", requestData)

  return data
}

export const signinWithSocial = async ({
  socialAccessToken,
  socialId,
  provider,
}: {
  socialAccessToken: string
  socialId: string
  provider: "K" | "N" | "G" | "A"
}): Promise<{
  refreshToken: string
  accessToken: string
}> => {
  const { data } = await axiosClient.post("/auth/signin/social", {
    thirdPartyType: provider,
    socialId: socialId,
    device_token: "TODO: FCM 토큰 추가",
    device_type: "TODO: 디바이스 타입 추가",
    SocialAccessToken: socialAccessToken,
  })

  return {
    refreshToken: data.body[0]?.refreshToken || "",
    accessToken: data.body[0]?.accessToken || "",
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
