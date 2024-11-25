import { axiosClient } from "../queries/clients.ts"
import { UserResponseDTO } from "../types/dtos/UserDTO.ts"
import { HTTPResponse } from "../types/dtos/HTTPResponse.ts"
import { User } from "../types/User.ts"
import { UserMapper } from "../types/dtos/mapper/UserMapper.ts"

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
  } = await axiosClient.get<HTTPResponse<UserResponseDTO[]>>("/auth/me", {
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
