import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import { ThemeProvider, createTheme } from "@mui/material/styles"

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
      // contrastText: "#FFFFFF", // 버튼의 텍스트 색상을 흰색으로 설정
    },
    secondary: {
      main: "#FEF2F1", // Secondary 색상 설정
      // contrastText: "#F37165", // 버튼의 텍스트 색상을 흰색으로 설정
    },
  },
  typography: {
    fontFamily: "Pretendard, sans-serif", // Pretendard 폰트 설정
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
