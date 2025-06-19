# Therapit Frontend

## 프로젝트 소개

이 프로젝트는 React와 TypeScript를 기반으로 구축되었으며, Vite를 사용하여 빠른 개발 환경을 제공합니다.

## 기술 스택

### 프레임워크 & 라이브러리

- **React 18**: 사용자 인터페이스 구축을 위한 JavaScript 라이브러리
- **TypeScript**: 정적 타입 지원을 통한 안정적인 코드 작성
- **Vite**: 빠른 개발 환경 및 빌드 도구
- **React Router v6**: 클라이언트 사이드 라우팅 처리

### UI 및 스타일링

- **Material UI**: React 컴포넌트 라이브러리
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크

### 상태 관리 & 데이터 페칭

- **Zustand**: 간단하고 효율적인 상태 관리 라이브러리
- **Tanstack React Query**: 서버 상태 관리 및 데이터 페칭 라이브러리

### 외부 서비스

- **Firebase**: 인증, 알림 메시징 등을 위한 서비스

## 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- npm

### 개발 환경 세팅

1. 저장소 클론

   ```bash
   git clone [저장소 URL]
   cd therapi-frontend
   ```

2. 의존성 설치

   ```bash
   npm install
   ```

3. 환경 변수 설정
   프로젝트 루트에 `.env.local` 파일을 생성하고 필요한 환경 변수를 설정하세요.

   ```
   VITE_API_URL=백엔드_API_URL
   VITE_FIREBASE_CONFIG=파이어베이스_설정
   ```

4. 개발 서버 실행

   ```bash
   npm run dev
   ```

   기본적으로 `http://localhost:5173`에서 서버가 실행됩니다.

5. 프로덕션 빌드 생성
   ```bash
   npm run build
   ```
   빌드된 파일은 `dist` 디렉토리에 생성됩니다.

## 프로젝트 구조

```
src/
├── apis/          # API 통신 관련 코드
│   ├── http.ts    # Axios 인스턴스 및 공통 설정
│   └── *.api.ts   # 각 도메인별 API 호출 함수
├── assets/        # 이미지, 폰트 등 정적 파일
├── components/    # 재사용 가능한 컴포넌트
│   └── common/    # 공통 컴포넌트
├── config/        # 애플리케이션 설정
├── constants/     # 상수 정의
├── contexts/      # React 컨텍스트
├── hooks/         # 커스텀 훅
├── libs/          # 외부 라이브러리 관련 코드
├── mappers/       # 데이터 변환 로직
├── pages/         # 페이지 컴포넌트
├── queries/       # React Query 설정 및 hooks
├── router/        # 라우팅 설정
├── stores/        # Zustand 스토어
├── styles/        # 글로벌 스타일
├── types/         # TypeScript 타입 정의
└── utils/         # 유틸리티 함수
```

## 주요 기능 및 구현 방식

### 1. 라우팅

- `react-router-dom` v6을 사용한 클라이언트 사이드 라우팅
- 라우트 보호(ProtectedRoute)를 통한 인증 기반 접근 제어
- 코드 스플리팅을 통한 성능 최적화

```tsx
// src/router/router.tsx의 간소화된 예시
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/my-page',
    element: (
      <ProtectedRoute>
        <MyPage />
      </ProtectedRoute>
    )
  }
]);
```

### 2. 상태 관리

- **로컬 상태**: `useState`, `useReducer` 등 React 내장 훅 사용
- **전역 상태**: Zustand를 사용한 간결한 상태 관리

```tsx
// src/stores/popupStore.ts 예시
import { create } from 'zustand';

interface PopupState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const usePopupStore = create<PopupState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false })
}));
```

### 3. API 통신

- Axios를 사용한 HTTP 클라이언트 구현
- React Query를 활용한 서버 상태 관리

```tsx
// src/queries/hooks/useUserQuery.ts 예시
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@apis/user.api';

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserProfile(userId)
  });
};
```

### 4. 스타일링

- Tailwind CSS와 Material UI를 조합한 스타일링
- 테마 설정을 통한 일관된 디자인 시스템 적용

```tsx
// src/App.tsx의 테마 설정 예시
const theme = createTheme({
  palette: {
    primary: {
      main: '#F37165'
    },
    secondary: {
      main: '#FEF2F1'
    }
  },
  typography: {
    fontFamily: 'Pretendard, sans-serif'
  }
});
```

## 개발 가이드

### 컴포넌트 작성

- 함수형 컴포넌트와 React Hooks 사용
- 컴포넌트 Props는 TypeScript 인터페이스로 정의
- 재사용 가능한 UI 로직은 커스텀 훅으로 분리

### 폴더 및 파일 구조

- 기능 또는 도메인 단위로 파일 구성
- 컴포넌트명은 파스칼 케이스 사용 (예: `AuthButton`)

### 코드 품질 관리

- ESLint와 Prettier를 통한 코드 스타일 통일
- TypeScript 사용으로 타입 안정성 확보
- Husky를 통한 커밋 전 코드 검사

## 웹뷰 통합 가이드

React Native 앱에서 이 웹 앱을 웹뷰로 사용할 때 API 통신 로깅을 확인할 수 있습니다.

### 웹뷰 설정

```javascript
// React Native 코드 예시
<WebView
  source={{ uri: 'https://테라피-웹-URL.com' }}
  onMessage={(event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type && data.type.startsWith('API_')) {
        console.log(`[${data.type}] ${data.data}`);
      }
    } catch (error) {
      console.error('WebView 메시지 처리 중 오류:', error);
    }
  }}
/>
```

## 문제 해결 및 자주 발생하는 이슈

### 의존성 문제

```bash
# node_modules를 완전히 지우고 새로 설치
rm -rf node_modules
npm install
```

### 타입 에러

```bash
# TypeScript 타입 체크
npm run tsc
```

## 기여 방법

1. 기능 브랜치 생성 (`feat/기능명`)
2. 코드 작성 및 테스트
3. 풀 리퀘스트 생성
4. 코드 리뷰 후 메인 브랜치에 병합

## 배포

### Vercel 배포

- Vercel을 통한 자동 배포
- 메인 브랜치 병합 시 자동 배포 진행

### Apache 서버 배포 가이드

Apache 서버에 배포하는 방법은 매우 간단합니다.

1. **빌드 생성하기**

   ```bash
   npm run build
   ```

2. **배포하기**

   - `dist` 폴더 내의 모든 파일을 서버의 `public_html` 폴더에 업로드하면 됩니다.
   - FTP 프로그램이나 SSH를 통해 파일을 업로드할 수 있습니다.

3. **SPA 라우팅 설정 (필요시)**
   - `public_html` 폴더에 아래 내용의 `.htaccess` 파일을 생성하세요.
   ```
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

이게 전부입니다! 간단하게 빌드 후 파일을 업로드하기만 하면 됩니다.
