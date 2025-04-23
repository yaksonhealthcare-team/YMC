import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

/**
 * 브라우저 뒤로가기를 방지하는 훅
 * 현재 페이지에서 사용자가 뒤로가기를 시도할 경우 현재 페이지를 유지합니다.
 */
export function usePreventGoBack() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const preventGoBack = (e: PopStateEvent) => {
      // 뒤로가기 이벤트 감지 및 취소
      e.preventDefault()
      // 현재 페이지 유지
      navigate(location.pathname, { replace: true })
    }

    // popstate 이벤트 발생 시 처리
    window.history.pushState(null, "", location.pathname)
    window.addEventListener("popstate", preventGoBack)

    return () => {
      window.removeEventListener("popstate", preventGoBack)
    }
  }, [navigate, location])
}
