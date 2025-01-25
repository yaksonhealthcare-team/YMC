import { useMutation } from "@tanstack/react-query"
import { withdrawal } from "../apis/auth.api"

export const useWithdrawal = () => {
  return useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string
      password: string
    }) => withdrawal(username, password),
  })
}
