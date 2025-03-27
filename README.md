# Therapi Frontend

## 프로젝트 소개

Therapi 서비스의 프론트엔드 프로젝트입니다. React와 TypeScript를 기반으로 구축되었으며, Vite를 사용하여 빠른 개발 환경을 제공합니다.

## 기술 스택

- React 18
- TypeScript
- Vite
- Material UI
- Tailwind CSS
- Tanstack React Query
- Zustand (상태 관리)
- Firebase (인증 및 메시징)

## 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- npm

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 필요한 환경 변수를 첨부하세요.

```
# 예시
VITE_API_URL=your_api_url
VITE_FIREBASE_CONFIG=your_firebase_config
```

## 프로젝트 구조

```
src/
├── apis/          # API 통신 관련 코드
├── components/    # 재사용 가능한 컴포넌트
│   └── common/   # 공통 컴포넌트
├── hooks/         # 커스텀 훅
├── pages/         # 페이지 컴포넌트
├── queries/       # React Query 관련 코드
├── router/        # 라우팅 설정
├── stores/        # Zustand 스토어
├── types/         # TypeScript 타입 정의
├── utils/         # 유틸리티 함수
└── i18n/          # 다국어 지원
```

## 개발 가이드

### 컴포넌트 작성

- 컴포넌트는 함수형으로 작성
- Props는 인터페이스로 타입 정의
- 공통 컴포넌트는 `src/components/common`에 위치

### 스타일링

- Tailwind CSS 클래스 사용
- 커스텀 색상은 `tailwind.config.js`에 정의된 변수 사용
- Material UI 컴포넌트 활용

### 상태 관리

- 로컬 상태: React useState
- 전역 상태: Zustand
- 서버 상태: React Query

### 다국어 지원

- 모든 정적 텍스트는 `src/i18n/index.ts`에서 관리
- 컴포넌트에서 직접 문자열 사용 지양

### SVG 아이콘 관리

1. SVG 파일 추가 시 `src/components/common/Svg/index.tsx`에 등록
2. `types.ts`에 타입 정의 추가
3. SVG 파일의 `fill` 속성을 `currentColor`로 변경
4. `src/Dev/index.tsx`에 아이콘 업데이트

## 배포

- Vercel을 통한 자동 배포
- main 브랜치 머지 시 자동 배포 진행

## 코드 품질

- ESLint를 통한 코드 품질 관리
- Prettier를 통한 코드 포맷팅
- Husky를 통한 커밋 전 검사

## 문제 해결

일반적인 문제 해결 방법:

1. 의존성 관련 문제: `npm clean-install`
2. 타입 에러: `tsc --noEmit`
3. 캐시 관련 문제: `npm run dev --force`

## 기여 가이드

1. 새로운 브랜치 생성
2. 코드 작성 및 테스트
3. PR 생성
4. 코드 리뷰 후 머지

## 라이선스

Private Repository - 무단 사용 금지

# 웹뷰 API 로깅 기능

React Native WebView에서 실행될 때 API 통신 로그를 확인할 수 있는 기능이 추가되었습니다.

## 사용 방법

React Native 앱에서 WebView 컴포넌트에 `onMessage` 핸들러를 추가하세요:

```javascript
<WebView
  source={{ uri: "https://your-web-app-url.com" }}
  onMessage={(event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)

      // API 통신 로그 처리
      if (data.type && data.type.startsWith("API_")) {
        console.log(`[${data.type}] ${data.data}`)

        // 상세 정보가 있는 경우 로깅
        if (data.details) {
          console.log(JSON.stringify(data.details, null, 2))
        }
      }
    } catch (error) {
      console.error("WebView 메시지 처리 중 오류:", error)
    }
  }}
/>
```

## 로그 유형

- `API_REQUEST`: API 요청 정보 (URL, 메소드, 헤더, 데이터)
- `API_INFO`: 일반 정보 로그
- `API_WARN`: 경고 로그
- `API_ERROR`: 오류 로그 (오류 코드, 응답 데이터, 요청 정보 포함)

## 상세 데이터 구조

- 요청 정보: URL, 메소드, 헤더, 데이터, 파라미터
- 응답 정보: 상태 코드, 응답 데이터, 에러 메시지
- 타임스탬프: 로그 발생 시간
