export interface ApiError {
  resultCode: string
  resultMessage: string
}

export interface ErrorResponse {
  resultCode: string
  resultMessage: string
}

export const ERROR_CODES = {
  // 인증 관련 에러
  TOKEN_EXPIRED: "10",
  REFRESH_TOKEN_EXPIRED: "11",
  INVALID_TOKEN: "20",
  UNAUTHORIZED: "21",

  // 요청 관련 에러
  INVALID_REQUEST: "24",
  BAD_REQUEST: "25",

  // 서버 에러
  SERVER_ERROR: "50",
  DATABASE_ERROR: "51",

  // 결제 관련 에러
  PAYMENT_ERROR: "60",
  PAYMENT_CANCEL_ERROR: "61",
} as const

export const getErrorMessage = (code: string): string => {
  switch (code) {
    case ERROR_CODES.TOKEN_EXPIRED:
      return "인증이 만료되었습니다. 다시 로그인해주세요."
    case ERROR_CODES.REFRESH_TOKEN_EXPIRED:
      return "인증이 만료되었습니다. 다시 로그인해주세요."
    case ERROR_CODES.INVALID_TOKEN:
      return "유효하지 않은 인증입니다."
    case ERROR_CODES.UNAUTHORIZED:
      return "접근 권한이 없습니다."
    case ERROR_CODES.INVALID_REQUEST:
    case ERROR_CODES.BAD_REQUEST:
      return "잘못된 요청입니다."
    case ERROR_CODES.SERVER_ERROR:
    case ERROR_CODES.DATABASE_ERROR:
      return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    case ERROR_CODES.PAYMENT_ERROR:
    case ERROR_CODES.PAYMENT_CANCEL_ERROR:
      return "결제 처리 중 오류가 발생했습니다."
    default:
      return "알 수 없는 오류가 발생했습니다."
  }
}
