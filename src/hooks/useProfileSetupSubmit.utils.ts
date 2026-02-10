export const DEFAULT_SIGNUP_ERROR_MESSAGE = '회원가입에 실패했습니다. 계속 문제가 발생할 경우 고객센터에 문의해 주세요.';

export const normalizeSignupFailureMessage = (message?: string) => {
  if (!message) return DEFAULT_SIGNUP_ERROR_MESSAGE;
  if (/성공|완료/i.test(message)) return DEFAULT_SIGNUP_ERROR_MESSAGE;
  return message;
};

export const executeWithRetry = async <T>(
  task: () => Promise<T>,
  retries = 1,
  delayMs = 250,
  sleepFn: (ms: number) => Promise<void> = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      await sleepFn(delayMs * (attempt + 1));
    }
  }

  throw lastError ?? new Error(DEFAULT_SIGNUP_ERROR_MESSAGE);
};
