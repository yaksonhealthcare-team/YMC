import { useEffect, useRef } from "react"

const Store = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // iframe이 로드된 후에 메시지 전송
    const sendTokenToStore = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "AUTH_TOKEN",
            accessToken: localStorage.getItem("accessToken"),
          },
          "https://devmall.yaksonhc.com/",
        )
      }
    }

    // iframe이 로드되면 토큰 전송
    if (iframeRef.current) {
      iframeRef.current.addEventListener("load", sendTokenToStore)
    }

    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener("load", sendTokenToStore)
      }
    }
  }, [])

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        ref={iframeRef}
        src="https://devmall.yaksonhc.com/"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Zippy Store"
      />
    </div>
  )
}

export default Store
