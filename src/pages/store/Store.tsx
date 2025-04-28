import { useEffect, useRef } from "react"
import { useLayout } from "contexts/LayoutContext"
import { axiosClient } from "queries/clients"

const Store = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({ display: false, backgroundColor: "bg-white" })
    setNavigation({ display: true })
  }, [])

  useEffect(() => {
    // iframe이 로드된 후에 메시지 전송
    const sendTokenToStore = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "AUTH_TOKEN",
            accessToken: axiosClient.defaults.headers.common.Authorization,
          },
          "https://mall.yaksonhc.com/",
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
    <div
      className="bg-white"
      style={{ width: "100%", height: "calc(100vh - 82px)" }}
    >
      <iframe
        ref={iframeRef}
        src="https://mall.yaksonhc.com/"
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
