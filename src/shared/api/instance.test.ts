import { captureSentryError } from '@/shared/lib/utils/sentry.utils';
import { AxiosError } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authApi } from './instance';

vi.mock('@/shared/lib/utils/sentry.utils', () => ({
  captureSentryError: vi.fn()
}));

describe('authApi response interceptor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('네트워크 에러를 Sentry에 캡쳐한다', async () => {
    const handlers = (
      authApi.interceptors.response as unknown as {
        handlers: Array<{ rejected?: (error: unknown) => Promise<unknown> }>;
      }
    ).handlers;
    const rejected = handlers[0]?.rejected;

    expect(rejected).toBeTypeOf('function');

    const networkError = new AxiosError('timeout', 'ECONNABORTED', {
      url: '/test/network',
      method: 'get',
      headers: {}
    } as any);

    await expect(rejected?.(networkError)).rejects.toBeInstanceOf(AxiosError);
    expect(captureSentryError).toHaveBeenCalledTimes(1);
  });
});
