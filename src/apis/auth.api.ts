import { UserMapper } from "../mappers/UserMapper.ts"
import { axiosClient } from "../queries/clients.ts"
import { HTTPResponse } from "../types/HTTPResponse.ts"
import { UpdateUserProfileRequest, User, UserResponse } from "../types/User.ts"
import { useAuthStore } from "../stores/auth.store"
import axios from "axios"

interface SignInResponseBody {
  accessToken: string
}

export interface SignInResponse extends HTTPResponse<SignInResponseBody[]> {
  Header: [
    {
      // refreshToken 필드가 더 이상 존재하지 않음 (쿠키로 대체됨)
    },
  ]
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
  // 인증 상태 설정
  useAuthStore.getState().setAuthenticated(true)

  axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`

  return {
    accessToken,
  }
}

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    // refreshToken이 쿠키에 있으므로 명시적으로 가져올 필요 없음
    // 자동으로 쿠키가 요청과 함께 전송됨
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/auth/crypto/tokenreissue.php`,
      {
        withCredentials: true, // 쿠키를 요청과 함께 전송하기 위해 필요
      },
    )

    if (response.data.resultCode !== "00") {
      // 리프레시 토큰 만료 또는 유효하지 않음
      useAuthStore.getState().setAuthenticated(false)
      return null
    }

    const { accessToken } = response.data.body

    // 새 액세스 토큰 저장
    if (accessToken) {
      axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    }

    return accessToken
  } catch (error) {
    console.error("토큰 갱신 중 오류 발생:", error)
    useAuthStore.getState().setAuthenticated(false)
    return null
  }
}

export const fetchUser = async (): Promise<User> => {
  const response =
    await axiosClient.get<HTTPResponse<UserResponse[]>>("/auth/me")

  return UserMapper.toEntity(response.data.body[0])
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
  const processedUserInfo = {
    ...userInfo,
    di: userInfo.di,
    token_version_id: userInfo.token_version_id,
  }

  const response = await axiosClient.post(
    "/auth/signup/social",
    {
      thirdPartyType,
      ...processedUserInfo,
    },
    { withCredentials: true },
  ) // 쿠키를 받기 위해 추가

  // 인증 상태 설정
  useAuthStore.getState().setAuthenticated(true)

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

  const { data } = await axiosClient.post("/auth/signup/email", requestData, {
    withCredentials: true,
  }) // 쿠키를 받기 위해 추가

  // 인증 상태 설정
  useAuthStore.getState().setAuthenticated(true)

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
      { withCredentials: true }, // 쿠키를 받기 위해 추가
    )

    const accessToken = data.body[0].accessToken
    // 인증 상태 설정
    useAuthStore.getState().setAuthenticated(true)

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
  // axiosClient의 기본 Authorization 헤더 제거
  delete axiosClient.defaults.headers.common.Authorization

  // 클라이언트 측 인증 상태 업데이트
  useAuthStore.getState().setAuthenticated(false)
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
