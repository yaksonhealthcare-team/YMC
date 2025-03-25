import { useEffect, useState } from "react"

export const useNaverMap = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    const checkNaverMap = () => {
      if (!mounted) return

      if (window.naver?.maps) {
        console.log("네이버 지도 API 초기화 완료")
        setIsLoaded(true)
      }
    }

    // 이미 로드되어 있는 경우
    if (window.naver?.maps) {
      console.log("네이버 지도 API가 이미 로드되어 있습니다.")
      setIsLoaded(true)
      return
    }

    // 스크립트 로드 이벤트 리스너
    const script = document.querySelector('script[src*="maps.js"]')
    if (script) {
      console.log("네이버 지도 API 스크립트를 찾았습니다.")
      script.addEventListener("load", checkNaverMap)
      script.addEventListener("error", (e) => {
        if (!mounted) return
        console.error("네이버 지도 API 스크립트 로딩 실패:", e)
        setError(new Error("네이버 지도 API 로딩 실패"))
      })
    } else {
      // 스크립트가 없는 경우, 스크립트를 직접 추가
      console.log("네이버 지도 API 스크립트를 추가합니다.")
      const newScript = document.createElement("script")
      newScript.type = "text/javascript"
      newScript.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=iorpsr2u1r&submodules=geocoder`
      newScript.async = true
      newScript.defer = true
      newScript.onload = checkNaverMap
      newScript.onerror = (e) => {
        if (!mounted) return
        console.error("네이버 지도 API 스크립트 로딩 실패:", e)
        setError(new Error("네이버 지도 API 로딩 실패"))
      }
      document.body.appendChild(newScript)
    }

    // 주기적으로 API 초기화 상태 확인
    const interval = setInterval(() => {
      if (!mounted) return

      if (window.naver?.maps) {
        console.log("네이버 지도 API 초기화 완료 (interval)")
        setIsLoaded(true)
        clearInterval(interval)
      }
    }, 100)

    // 5초 후에도 로드되지 않으면 에러 처리
    const timeout = setTimeout(() => {
      if (!mounted) return

      if (!window.naver?.maps) {
        console.error("네이버 지도 API 로딩 시간 초과")
        setError(new Error("네이버 지도 API 로딩 시간 초과"))
      }
    }, 5000)

    return () => {
      mounted = false
      if (script) {
        script.removeEventListener("load", checkNaverMap)
      }
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return { isLoaded, error }
}
