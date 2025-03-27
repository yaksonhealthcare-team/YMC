import { setReactNativeLogger, axiosClient } from "../queries/clients"

/**
 * React Native API 통신 로그를 콘솔에 출력하는 함수
 */
const logToReactNative = (type: string, message: string, data?: any) => {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: type,
        data: message,
        details: data,
        timestamp: new Date().toISOString(),
      }),
    )
  }
}

/**
 * React Native 애플리케이션에서 로그를 기록하는 유틸리티
 *
 * 사용 방법:
 * 1. React Native 앱 초기화 시 이 함수를 호출합니다.
 * 2. API 통신 중 발생하는 모든 에러가 React Native 콘솔에 기록됩니다.
 */
export function initializeReactNativeLogger() {
  // React Native 환경에서 로깅 함수 등록
  setReactNativeLogger((level, message, data) => {
    // 기본 콘솔 로깅
    switch (level) {
      case "info":
        console.info(`[API-INFO] ${message}`, data)
        logToReactNative("API_INFO", message, data)
        break
      case "warn":
        console.warn(`[API-WARN] ${message}`, data)
        logToReactNative("API_WARN", message, data)
        break
      case "error":
        console.error(`[API-ERROR] ${message}`, data)
        logToReactNative("API_ERROR", message, data)

        // 에러 상세 정보 로깅
        console.group("API 에러 상세 정보")
        if (data?.code) console.error(`에러 코드: ${data.code}`)
        if (data?.response) console.error("응답 데이터:", data.response)
        if (data?.status) console.error(`상태 코드: ${data.status}`)
        if (data?.url) console.error(`URL: ${data.url}`)

        // 요청 상세 정보 추가
        if (data?.config) {
          console.group("요청 정보")
          console.error(`URL: ${data.config.url}`)
          console.error(`메소드: ${data.config.method}`)
          console.error("헤더:", data.config.headers)
          console.error("데이터:", data.config.data)
          console.groupEnd()
        }

        console.groupEnd()
        break
    }
  })

  // 요청 인터셉터에 로깅 추가
  axiosClient.interceptors.request.use(
    (config) => {
      logToReactNative(
        "API_REQUEST",
        `${config.method?.toUpperCase()} ${config.url}`,
        {
          url: config.url,
          method: config.method,
          headers: config.headers,
          data: config.data,
          params: config.params,
        },
      )
      return config
    },
    (error) => {
      logToReactNative("API_REQUEST_ERROR", "요청 전송 중 오류 발생", error)
      return Promise.reject(error)
    },
  )
}
