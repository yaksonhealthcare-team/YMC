import { useEffect, RefObject } from "react"

const PATH_NAME_LIST = ["store", "branch", "profile"]

/**
 * 스크롤 이벤트를 감지하고 스크롤 위치가 0일 때 로그를 찍는 hook
 * @param elementRef - 스크롤을 감지할 요소의 ref
 */
export function useScrollDetection(elementRef?: RefObject<HTMLElement>) {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = elementRef
        ? elementRef.current?.scrollTop
        : document.documentElement.scrollTop || document.body.scrollTop

      if (!window.ReactNativeWebView) {
        return
      }

      if (PATH_NAME_LIST.includes(window.location.pathname)) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "SCROLL",
            data: {
              scroll: 1,
            },
          }),
        )
        return
      }

      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "SCROLL",
          data: {
            scroll: scrollTop,
          },
        }),
      )
    }

    // 스크롤 이벤트를 감지할 요소
    const scrollElement = elementRef?.current || window

    // 초기 로드 시 스크롤 위치 확인
    const initialScrollTop = elementRef
      ? elementRef.current?.scrollTop
      : document.documentElement.scrollTop || document.body.scrollTop

    if (initialScrollTop === 0) {
      console.log("초기 스크롤 위치가 0입니다.")
    }

    // 스크롤 이벤트 리스너 등록
    scrollElement.addEventListener("scroll", handleScroll)

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      scrollElement.removeEventListener("scroll", handleScroll)
    }
  }, [elementRef])
}
