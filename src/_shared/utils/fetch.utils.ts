/**
 * promise 데이터 패칭을 지연시킬 때 사용합니다.
 * @param ms 지연시킬 시간
 */
export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
