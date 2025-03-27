import { createTheme, ThemeProvider } from "@mui/material/styles"
import { QueryClientProvider } from "@tanstack/react-query"
import { useEffect } from "react"
import ErrorBoundary from "./components/ErrorBoundary"
import { queryClient } from "./queries/clients.ts"
import { AppRouter } from "./router/router.tsx"
import { initializeReactNativeLogger } from "./utils/reactNativeLogger"

const theme = createTheme({
  // MUI 테마 설정
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          width: "auto", // 기본 width를 'auto'로 설정
          height: "auto", // 기본 height를 'auto'로 설정
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#F37165", // Primary 색상 설정
    },
    secondary: {
      main: "#FEF2F1", // Secondary 색상 설정
    },
    success: {
      main: "#0A84FF",
    },
    error: {
      main: "#FF453A",
    },
  },
  typography: {
    fontFamily: "Pretendard, sans-serif", // Pretendard 폰트 설정
  },
})

function App() {
  // React Native 로깅 초기화
  useEffect(() => {
    // React Native WebView 환경 확인
    const isWebView =
      typeof window !== "undefined" && window.ReactNativeWebView !== undefined

    if (isWebView) {
      initializeReactNativeLogger()
      console.info("React Native API 로깅이 초기화되었습니다.")
    }
  }, [])

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AppRouter />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
