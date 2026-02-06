import { UserSchema } from '@/_domain/auth/types';
import * as Sentry from '@sentry/react';

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
  // Error 객체 보장
  const normalizedError =
    error instanceof Error ? error : new Error(typeof error === 'string' ? error : JSON.stringify(error));

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
