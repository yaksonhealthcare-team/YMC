/**
 * PullToRefresh 기능을 설정하는 유틸리티 함수
 * 스크롤 위치가 0일 때 ReactNativeWebView.postMessage를 통해 네이티브 앱에 알림
 */
export function setupPullToRefresh() {
  let lastScrollPosition = window.scrollY

  // ReactNativeWebView가 존재하는지 확인
  const isReactNativeWebView = () => {
    return (
      typeof window !== "undefined" &&
      window.ReactNativeWebView &&
      typeof window.ReactNativeWebView.postMessage === "function"
    )
  }

  // 스크롤 이벤트 리스너
  const handleScroll = () => {
    const currentScrollPosition = window.scrollY

    // 스크롤 위치가 0이고 이전 스크롤 위치가 0보다 컸을 때 (위로 스크롤한 경우)
    if (currentScrollPosition === 0 && lastScrollPosition > 0) {
      if (isReactNativeWebView()) {
        // ReactNativeWebView에 PULL_TO_REFRESH 메시지 전송
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "PULL_TO_REFRESH",
          }),
        )
      }
    }

    lastScrollPosition = currentScrollPosition
  }

  // 스크롤 이벤트 등록
  window.addEventListener("scroll", handleScroll, { passive: true })

  // 클린업 함수 반환
  return () => {
    window.removeEventListener("scroll", handleScroll)
  }
}
