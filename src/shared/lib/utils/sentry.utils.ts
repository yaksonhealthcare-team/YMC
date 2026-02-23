import { UserSchema } from '@/_domain/auth/types';
import * as Sentry from '@sentry/react';

const NON_ACTIONABLE_ERROR_PATTERNS: Array<string | RegExp> = [
  /ResizeObserver loop limit exceeded/i,
  /ResizeObserver loop completed with undelivered notifications/i,
  /Script error\.?/i,
  /The operation was aborted/i,
  /AbortError/i,
  /NetworkError when attempting to fetch resource/i
];

const NOISY_SCRIPT_URL_PATTERNS: Array<string | RegExp> = [
  /^chrome-extension:\/\//i,
  /^moz-extension:\/\//i,
  /^safari-extension:\/\//i,
  /^edge-extension:\/\//i
];

let isSentryInitialized = false;
const SENTRY_CAPTURED_FLAG = '__sentry_captured__';

/**
 * Sentry 이벤트 노이즈 이벤트 제거
 */
const shouldDropNoiseEvent = (event: Sentry.Event) => {
  const values = event.exception?.values ?? [];
  const messages = values.map((v) => `${v.type ?? ''} ${v.value ?? ''}`.trim()).filter(Boolean);

  return messages.some((message) =>
    NON_ACTIONABLE_ERROR_PATTERNS.some((pattern) =>
      typeof pattern === 'string' ? message.includes(pattern) : pattern.test(message)
    )
  );
};

export const initSentry = () => {
  if (isSentryInitialized) return;

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    tracesSampleRate: 0.01,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.1,
    environment: import.meta.env.MODE === 'production' ? 'production' : 'development',
    sendDefaultPii: true,
    integrations: [Sentry.replayIntegration()],
    ignoreErrors: NON_ACTIONABLE_ERROR_PATTERNS,
    denyUrls: NOISY_SCRIPT_URL_PATTERNS,
    beforeSend(event) {
      if (shouldDropNoiseEvent(event)) {
        return null;
      }

      return event;
    }
  });

  isSentryInitialized = true;
};

const hasSentryCaptured = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  return Boolean((error as Record<string, unknown>)[SENTRY_CAPTURED_FLAG]);
};

const markSentryCaptured = (error: unknown) => {
  if (!error || typeof error !== 'object') return;
  (error as Record<string, unknown>)[SENTRY_CAPTURED_FLAG] = true;
};

/**
 * Sentry에 사용자 정보 설정
 * @param user 사용자 정보
 */
export const setSentryUser = (user: UserSchema | null) => {
  if (user) {
    // 기본 사용자 식별 정보
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.name,
      hp: user.hp,
      gender: user.sex,
      brands: user.brands.map((brand) => brand.b_name)
    });
    Sentry.setTags({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userHp: user.hp,
      userGender: user.sex
    });

    Sentry.setContext('user_info', { user });
  } else {
    Sentry.setUser(null);
    Sentry.setContext('user_info', null);
  }
};

/**
 * Sentry에 사용자 경로 정보 설정
 * @param pathname 현재 경로
 * @param searchParams 쿼리 파라미터
 */
export const setSentryBreadcrumb = (pathname: string, searchParams?: URLSearchParams) => {
  Sentry.addBreadcrumb({
    message: `사용자가 ${pathname} 페이지에 접근했습니다`,
    category: 'navigation',
    level: 'info',
    data: {
      pathname,
      search: searchParams?.toString() || '',
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Sentry에 사용자 액션 정보 설정
 * @param action 액션명
 * @param data 추가 데이터
 */
export const setSentryAction = (action: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    message: `사용자가 ${action} 액션을 수행했습니다`,
    category: 'user',
    level: 'info',
    data: {
      action,
      ...data,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Sentry에 에러 캡쳐
 *
 * @param error 실제 에러 객체 (Error | unknown)
 * @param context 추가 컨텍스트 정보 (선택)
 * @param tags 추가 태그 (선택)
 */
export const captureSentryError = (
  error: unknown,
  options?: {
    context?: Record<string, any>;
    tags?: Record<string, string>;
    level?: Sentry.SeverityLevel;
  }
) => {
  if (hasSentryCaptured(error)) return;

  // Error 객체 보장
  const normalizedError =
    error instanceof Error ? error : new Error(typeof error === 'string' ? error : JSON.stringify(error));
  markSentryCaptured(error);
  markSentryCaptured(normalizedError);

  Sentry.withScope((scope) => {
    // level 기본값: error
    scope.setLevel(options?.level ?? 'error');

    // 태그 세팅
    if (options?.tags) {
      Object.entries(options.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    // 컨텍스트 세팅
    if (options?.context) {
      scope.setContext('error_context', {
        ...options.context,
        capturedAt: new Date().toISOString()
      });
    }

    Sentry.captureException(normalizedError);
  });
};

export const safeJsonParse = <T>(
  raw: string,
  options?: {
    source?: string;
    tags?: Record<string, string>;
    context?: Record<string, unknown>;
  }
): T | null => {
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    captureSentryError(error, {
      tags: { feature: 'json_parse', source: options?.source ?? 'unknown', ...(options?.tags ?? {}) },
      context: {
        ...options?.context,
        rawPreview: raw.slice(0, 300)
      }
    });
    return null;
  }
};

export const safeDecodeAndParseJson = <T>(
  encoded: string,
  options?: {
    source?: string;
    tags?: Record<string, string>;
    context?: Record<string, unknown>;
  }
): T | null => {
  try {
    const decoded = decodeURIComponent(encoded);
    return safeJsonParse<T>(decoded, {
      source: options?.source,
      tags: options?.tags,
      context: { ...(options?.context ?? {}), decodedPreview: decoded.slice(0, 300) }
    });
  } catch (error) {
    captureSentryError(error, {
      tags: { feature: 'decode_uri', source: options?.source ?? 'unknown', ...(options?.tags ?? {}) },
      context: {
        ...options?.context,
        encodedPreview: encoded.slice(0, 300)
      }
    });
    return null;
  }
};
