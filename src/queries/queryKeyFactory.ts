export const createQueryKeyFactory = (prefix: string) => ({
  all: () => [prefix] as const,
  detail: (id: string) => [prefix, id] as const,
  list: (params: object) => [prefix, params] as const,
})

// 현재 로그인한 사용자 ID를 가져오는 함수
export const getUserIdForCache = (): string | null => {
  // 로컬 스토리지에서 사용자 정보를 가져옴
  const token = localStorage.getItem("accessToken")
  return token ? `user_${token.slice(-8)}` : null // 토큰의 마지막 8자리만 사용
}

// 사용자 컨텍스트를 포함한 쿼리 키 생성
export const createUserContextQueryKey = (baseKey: readonly unknown[]) => {
  const userId = getUserIdForCache()
  return userId ? [userId, ...baseKey] : baseKey
}
