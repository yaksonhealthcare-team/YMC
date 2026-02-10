import { AxiosError } from 'axios';
import { ERROR_CODES } from '../constants';
import { logger } from './logger.utils';
import { captureSentryError } from './sentry.utils';

export const getErrorMessage = (code: string): string => {
  switch (code) {
    case ERROR_CODES.TOKEN_EXPIRED:
      return '인증이 만료되었습니다. 다시 로그인해주세요.';
    case ERROR_CODES.REFRESH_TOKEN_EXPIRED:
      return '인증이 만료되었습니다. 다시 로그인해주세요.';
    case ERROR_CODES.INVALID_TOKEN:
      return '유효하지 않은 인증입니다.';
    case ERROR_CODES.UNAUTHORIZED:
      return '접근 권한이 없습니다.';
    case ERROR_CODES.INVALID_REQUEST:
    case ERROR_CODES.BAD_REQUEST:
      return '잘못된 요청입니다.';
    case ERROR_CODES.SERVER_ERROR:
    case ERROR_CODES.DATABASE_ERROR:
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    case ERROR_CODES.PAYMENT_ERROR:
    case ERROR_CODES.PAYMENT_CANCEL_ERROR:
      return '결제 처리 중 오류가 발생했습니다.';
    case ERROR_CODES.CONSULTATION_LIMIT_EXCEEDED:
      return '상담 예약 가능 횟수가 없습니다.';
    case ERROR_CODES.ALREADY_RESERVED:
      return '이미 예약된 시간입니다.';
    case ERROR_CODES.INVALID_RESERVATION_TIME:
      return '예약 가능한 시간이 아닙니다.';
    default:
      return '알 수 없는 오류가 발생했습니다.';
  }
};

export const handleError = (error: unknown, msg: string) => {
  if (error instanceof AxiosError) {
    captureSentryError(error, {
      tags: {
        feature: 'api',
        function: msg,
        status: String(error.response?.status ?? 'unknown')
      },
      context: {
        url: error.config?.url,
        method: error.config?.method,
        responseData: error.response?.data
      }
    });
    logger.error(`${msg}: ${error.message}`, error);
    throw error;
  }
  captureSentryError(error, {
    tags: { feature: 'api', source: msg, status: 'unknown' }
  });
  logger.error(msg, error);
  throw error;
};
