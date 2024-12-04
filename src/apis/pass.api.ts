import { axiosClient } from "../queries/clients.ts"

export const pass = async () => {
  const { data } = await axiosClient.post("/auth/crypto/token.php")

  return data
}
