import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Suspense } from 'react';
import { Loading, useVConsole } from './_shared';
import { Router } from './_shared/router';
import ErrorBoundary from './components/ErrorBoundary';

dayjs.extend(customParseFormat);
dayjs.locale('ko');

/**
 * @deprecated
 * 점진적으로 mui를 tailwind로 대체합니다.
 */
const theme = createTheme({
  // MUI 테마 설정
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          width: 'auto', // 기본 width를 'auto'로 설정
          height: 'auto' // 기본 height를 'auto'로 설정
        }
      }
    }
  },
  palette: {
    primary: {
      main: '#F37165' // Primary 색상 설정
    },
    secondary: {
      main: '#FEF2F1' // Secondary 색상 설정
    },
    success: {
      main: '#0A84FF'
    },
    error: {
      main: '#FF453A'
    }
  },
  typography: {
    fontFamily: 'Pretendard, sans-serif' // Pretendard 폰트 설정
  }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: false
    }
  }
});

const App = () => {
  useVConsole();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <ReactQueryDevtools initialIsOpen={false} />
            <Suspense fallback={<Loading variant="global" />}>
              <Router />
            </Suspense>
          </LocalizationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
