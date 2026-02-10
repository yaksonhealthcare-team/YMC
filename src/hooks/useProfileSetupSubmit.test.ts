import { jest } from '@jest/globals';
import {
  DEFAULT_SIGNUP_ERROR_MESSAGE,
  executeWithRetry,
  normalizeSignupFailureMessage
} from './useProfileSetupSubmit.utils';

describe('useProfileSetupSubmit helpers', () => {
  it('normalizes empty failure message to default', () => {
    expect(normalizeSignupFailureMessage(undefined)).toBe(DEFAULT_SIGNUP_ERROR_MESSAGE);
  });

  it('normalizes success-like message to default failure message', () => {
    expect(normalizeSignupFailureMessage('회원가입이 완료되었습니다')).toBe(DEFAULT_SIGNUP_ERROR_MESSAGE);
    expect(normalizeSignupFailureMessage('성공')).toBe(DEFAULT_SIGNUP_ERROR_MESSAGE);
  });

  it('keeps non-success failure message as-is', () => {
    const message = '로그인에 실패했습니다.';
    expect(normalizeSignupFailureMessage(message)).toBe(message);
  });

  it('retries and succeeds on second attempt', async () => {
    let count = 0;
    const task = jest.fn(async () => {
      count += 1;
      if (count === 1) throw new Error('temporary');
      return 'ok';
    });
    const sleepFn = jest.fn(async () => undefined);

    const result = await executeWithRetry(task, 1, 10, sleepFn);

    expect(result).toBe('ok');
    expect(task).toHaveBeenCalledTimes(2);
    expect(sleepFn).toHaveBeenCalledTimes(1);
    expect(sleepFn).toHaveBeenCalledWith(10);
  });

  it('throws after exhausting retries', async () => {
    const error = new Error('final');
    const task = jest.fn(async () => {
      throw error;
    });
    const sleepFn = jest.fn(async () => undefined);

    await expect(executeWithRetry(task, 1, 10, sleepFn)).rejects.toThrow('final');
    expect(task).toHaveBeenCalledTimes(2);
    expect(sleepFn).toHaveBeenCalledTimes(1);
  });
});
