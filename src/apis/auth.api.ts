import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"
import { User, UserResponse, UserUpdateRequest } from "../types/User.ts"
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

export const updateUserProfile = async (request: UserUpdateRequest) => {
  await axiosClient.patch("/auth/me", {
    ...request,
  })
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
  provider: "K" | "N" | "A"
  accessToken: string
  userInfo: {
    name: string
    mobileno: string
    birthdate: string
    gender: string
    post: string
    addr1: string
    addr2: string
    marketing_yn: "Y" | "N"
    brand_code: string[]
    email?: string
  }
}) => {
  const { data } = await axiosClient.post("/auth/signup/social", {
    thirdPartyType: provider,
    SocialAccessToken: accessToken,
    ...userInfo,
  })

  return data
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
