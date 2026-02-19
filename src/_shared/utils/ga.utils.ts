import ReactGA from 'react-ga4';

const isDevelopment = import.meta.env.DEV;

/**
 * 개발 환경에서만 로그 출력
 */
const log = (...args: unknown[]) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

/**
 * Google Analytics 초기화
 * 운영 환경에서만 실제 데이터 전송
 */
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  // 개발 환경에서는 GA 비활성화
  if (isDevelopment) {
    console.log('🔧 [개발 모드] Google Analytics 비활성화');
    return;
  }

  if (!measurementId) {
    console.warn('⚠️ GA Measurement ID가 설정되지 않았습니다.');
    return;
  }

  ReactGA.initialize(measurementId, {
    gaOptions: {
      debug_mode: false
    },
    gtagOptions: {
      debug_mode: false
    }
  });

  console.log('✅ Google Analytics 초기화 완료:', measurementId);
};

/**
 * 페이지뷰 전송
 * @param path - 페이지 경로 (예: /reservation)
 * @param search - 쿼리 파라미터 (예: ?id=123)
 * @param title - 페이지 제목 (선택)
 */
export const sendPageView = (path: string, search?: string, title?: string) => {
  const fullPath = search ? `${path}${search}` : path;
  const fullUrl = window.location.origin + fullPath;

  ReactGA.send({
    hitType: 'pageview',
    page: fullPath,
    title: title || document.title,
    location: fullUrl
  });

  log('📊 GA Pageview:', fullPath);
};

/**
 * 커스텀 이벤트 전송
 * @param category - 이벤트 카테고리 (예: 'Reservation')
 * @param action - 이벤트 액션 (예: 'Click')
 * @param label - 이벤트 라벨 (선택)
 * @param value - 이벤트 값 (선택)
 */
export const sendEvent = (category: string, action: string, label?: string, value?: number) => {
  ReactGA.event({
    category,
    action,
    label,
    value
  });

  log('📊 GA Event:', { category, action, label, value });
};

/**
 * 사용자 ID 설정 (로그인 시)
 * @param userId - 사용자 ID
 */
export const setUserId = (userId: string) => {
  ReactGA.set({ userId });
  log('👤 GA User ID 설정:', userId);
};

/**
 * 사용자 속성 설정
 * @param properties - 사용자 속성 객체
 */
export const setUserProperties = (properties: Record<string, unknown>) => {
  ReactGA.set(properties);
  log('👤 GA User Properties:', properties);
};
