import { QueryKey, UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

/**
 * useQuery 훅 전용 커스텀 옵션 타입
 *
 * - 기본 제네릭:
 *   TQueryFnData  = 쿼리 함수가 반환하는 데이터 타입
 *   TError        = 에러 타입
 *   TData         = 최종 selector 등을 거친 후 반환될 데이터 타입
 *   TQueryKey     = 캐시 키 타입 (기본 QueryKey)
 *
 * - `queryKey` 와 `queryFn` 은
 *    내부에서 고정되므로 제외하고 나머지 옵션만 받을 수 있게 만든 유틸 타입
 */
export type CustomUseQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>;

/**
 * useInfiniteQuery 훅 전용 커스텀 옵션 타입
 *
 * - 기본 제네릭:
 *   TQueryFnData  = 쿼리 함수가 반환하는 데이터 타입
 *   TError        = 에러 타입
 *   TData         = 최종 selector 등을 거친 후 반환될 데이터 타입
 *   TQueryKey     = 캐시 키 타입 (기본 QueryKey)
 *
 * - `queryKey`, `queryFn`, `getNextPageParam` 은
 *   내부에서 고정되므로 제외하고 나머지 옵션만 받을 수 있게 만든 유틸 타입
 */
export type CustomUseInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = Omit<UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn' | 'getNextPageParam'>;

/**
 * useMutation 훅 전용 커스텀 옵션 타입
 *
 * - 기본 제네릭:
 *   TData       = 뮤테이션 성공 시 반환되는 데이터 타입
 *   TError      = 에러 타입
 *   TVariables  = 뮤테이션 함수에 넘기는 파라미터 타입
 *   TContext    = onMutate 의 컨텍스트 타입
 *
 * - `mutationFn` 은
 *   내부에서 고정되므로 제외하고 나머지 옵션만 받을 수 있게 만든 유틸 타입
 */
export type CustomUseMutationOptions<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown
> = Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>;
