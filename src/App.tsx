import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import PageContainer from "./components/PageContainer"

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
  return (
    <ThemeProvider theme={theme}>
      <PageContainer>
        <RouterProvider router={router} />
      </PageContainer>
    </ThemeProvider>
  )
}

export default App
