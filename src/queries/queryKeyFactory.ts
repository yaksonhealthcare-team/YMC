export const createQueryKeyFactory = (prefix: string) => ({
  all: () => [prefix] as const,
  detail: (id: string) => [prefix, id] as const,
  list: (params: object) => [prefix, params] as const,
})
