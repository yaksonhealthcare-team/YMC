interface Window {
  ReactNativeWebView?: {
    postMessage: (message: string) => void
  }
  webkit?: {
    messageHandlers: {
      openExternalLink: {
        postMessage: (url: string) => void
      }
    }
  }
  Android?: {
    openExternalLink: (url: string) => void
  }
  setNativeSafeAreaColors?: (top: string, bottom: string) => void
}
