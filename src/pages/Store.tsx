import { useEffect, useRef, useState } from "react"
import { useLayout } from "../contexts/LayoutContext"

const Store = () => {
  const { setHeader } = useLayout()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // 헤더 설정
    setHeader({
      display: true,
      title: "스토어",
      left: "back",
      backgroundColor: "bg-white",
    })

    // iframe 리로드 방지를 위한 쿠키나 로컬 스토리지 설정
    if (!localStorage.getItem("store_session")) {
      localStorage.setItem("store_session", "true")
    }

    return () => {
      setHeader({ display: true })
    }
  }, [setHeader])

  const handleIframeError = () => {
    if (retryCount < 3) {
      setRetryCount((prev) => prev + 1)
      if (iframeRef.current) {
        iframeRef.current.src = `http://139.150.72.85:8081/?t=${Date.now()}`
      }
    }
  }

  return (
    <div className="w-full h-[calc(100vh-82px)]">
      <iframe
        ref={iframeRef}
        src={`http://139.150.72.85:8081/?t=${Date.now()}`}
        className="w-full h-full border-none"
        title="스토어"
        onError={handleIframeError}
      />
    </div>
  )
}

export default Store
