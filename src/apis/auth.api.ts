import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"
import { User, UserResponse } from "../types/User.ts"
import { UserMapper } from "../mappers/UserMapper.ts"

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

interface UpdateUserProfileRequest {
  post: string
  addr1: string
  addr2: string
  sex: "M" | "F"
  profileURL: string
  marketing_yn: "Y" | "N"
}

export const updateUserProfile = async (data: UpdateUserProfileRequest) => {
  const response = await axiosClient.patch("/auth/me", data)
  return response.data
}

export const loginWithSocial = async ({
  provider,
  accessToken,
}: {
  provider: "K" | "N" | "G" | "A"
  accessToken: string
}) => {
  const { data } = await axiosClient.post("/auth/signin/social", {
    thirdPartyType: provider,
    SocialAccessToken: accessToken,
    device_token: "TODO: FCM 토큰 추가",
    device_type: "TODO: 디바이스 타입 추가",
  })

  return {
    refreshToken: data.Header?.[0]?.refreshToken || "",
    accessToken: data.body[0].accessToken,
  }
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
  accessToken,
  userInfo,
}: {
  provider: string
  accessToken: string
  userInfo: {
    name: string
    email: string
    mobileno: string
    birthdate: string
    gender: "M" | "F"
    post: string
    addr1: string
    addr2: string
    marketing_yn: "Y" | "N"
    brand_code: string[]
    nationalinfo: string
    di: string
    token_version_id: string
    enc_data: string
    integrity_value: string
  }
}) => {
  const response = await axiosClient.post("/auth/signup/social", {
    thirdPartyType: provider,
    SocialAccessToken: accessToken,
    ...userInfo,
  })
  return response.data
}

export const signup = async (userData: {
  email: string
  password: string
  name: string
  mobileno: string
  birthdate: string
  gender: string
  post: string
  addr1: string
  addr2?: string
  marketing_yn: "Y" | "N"
  brand_code?: string[]
}) => {
  const { data } = await axiosClient.post("/auth/signup/email", userData)
  return data
}
