import { AppRouter } from "./router/router.tsx"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { OverlayProvider, useOverlay } from "./contexts/ModalContext.tsx"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./queries/clients.ts"
import { useEffect } from "react"
import { setGlobalShowToast } from "./queries/clients"

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

function AppContent() {
  const { showToast } = useOverlay()

  useEffect(() => {
    setGlobalShowToast(showToast)
  }, [showToast])

  return <AppRouter />
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <OverlayProvider>
          <AppContent />
        </OverlayProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
