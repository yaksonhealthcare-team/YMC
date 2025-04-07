export const createQueryKeyFactory = (prefix: string) => ({
  all: () => [prefix] as const,
  detail: (id: string) => [prefix, id] as const,
  list: (params: object) => [prefix, params] as const,
})

// 사용자 컨텍스트를 포함한 쿼리 키 생성
export const createUserContextQueryKey = (baseKey: readonly unknown[]) => {
  return baseKey
}
