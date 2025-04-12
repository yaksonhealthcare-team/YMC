import React, { useEffect } from "react"

const AppBridge = ({ children }: { children?: React.ReactNode }) => {
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const data = JSON.parse(event.data)

      // TODO: 개발 환경일 때만 로그 찍도록
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: "CONSOLE_LOG",
          data,
        }),
      )

      if (data.type) {
        switch (data.type) {
          case "FCM_TOKEN":
            handleFcmToken(data.data)
            break
          case "DEVICE_TYPE":
            handleDeviceType(data.data)
            break
        }
      }
    }

    if (window.ReactNativeWebView) {
      window.addEventListener("message", handleMessage)

      return () => {
        window.removeEventListener("message", handleMessage)
      }
    }
  }, [window.ReactNativeWebView])

  const handleDeviceType = async (data: any) => {
    localStorage.setItem("DEVICE_TYPE", data.deviceType)
  }

  const handleFcmToken = async (data: any) => {
    localStorage.setItem("FCM_TOKEN", data.fcmToken)
  }

  return <>{children}</>
}

export default AppBridge
