import { Initialization } from '@/Initialization';
import { Router } from '@/pages/NewRouter';
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
import { initSentry } from './_shared/utils/sentry.utils';
import ErrorBoundary from './components/ErrorBoundary';

dayjs.extend(customParseFormat);
dayjs.locale('ko');

initSentry();

const theme = createTheme({
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          width: 'auto',
          height: 'auto'
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
    fontFamily: 'Pretendard, sans-serif'
  }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      gcTime: 1000 * 60 * 4, // 기본 4분
      staleTime: 1000 * 60 * 2 // 기본 2분
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
              <Initialization />
              <Router />
            </Suspense>
          </LocalizationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
