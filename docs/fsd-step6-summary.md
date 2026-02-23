# FSD STEP 6 — app/ 레이어 구성 작업 요약

> 작업일: 2026-02-23
> 브랜치: `chore/fsd`

---

## 1. 작업 목표

`src/app/` 레이어 구성: 애플리케이션 진입점, 프로바이더, 라우터, 전역 스타일을 app 레이어로 응집.

---

## 2. app/ 디렉토리 구조

```
src/app/
├── App.tsx              # 루트 컴포넌트 (QueryClient, ThemeProvider 등 설정)
├── main.tsx             # 애플리케이션 진입점 (ReactDOM.createRoot)
├── providers/
│   └── Initialization.tsx  # 사용자 초기화 컴포넌트 (ChannelTalk, Sentry 설정)
├── router/
│   ├── NewRouter.tsx    # 라우터 설정 (createBrowserRouter, requireAuth)
│   └── config.tsx       # 라우트 정의 목록 (authRoutes + noAuthRoutes)
└── styles/
    ├── fonts.css        # Pretendard 폰트
    ├── global.css       # 전역 스타일
    ├── index.css        # Tailwind CSS 진입점
    └── swiper-custom.css # Swiper 커스텀 스타일
```

---

## 3. 이동한 파일 목록

### 3-1. src 루트 → app/

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `src/App.tsx` | `src/app/App.tsx` |
| `src/main.tsx` | `src/app/main.tsx` |
| `src/Initialization.tsx` | `src/app/providers/Initialization.tsx` |

### 3-2. src/pages/ → app/router/

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `src/pages/NewRouter.tsx` | `src/app/router/NewRouter.tsx` |
| `src/pages/newConfig.tsx` | `src/app/router/config.tsx` |

### 3-3. src/assets/css/ → app/styles/

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `src/assets/css/fonts.css` | `src/app/styles/fonts.css` |
| `src/assets/css/global.css` | `src/app/styles/global.css` |
| `src/assets/css/index.css` | `src/app/styles/index.css` |
| `src/assets/css/swiper-custom.css` | `src/app/styles/swiper-custom.css` |

> `git mv`를 사용하여 git history 보존

---

## 4. Import 경로 수정 내역

### app/App.tsx

```ts
// 수정 전
import { Initialization } from '@/Initialization';
import { Router } from '@/pages/NewRouter';
import { Loading, useVConsole } from './_shared';

// 수정 후
import { Initialization } from '@/app/providers/Initialization';
import { Router } from '@/app/router/NewRouter';
import { Loading, useVConsole } from '@/_shared';
```

### app/main.tsx

```ts
// 수정 전
import './assets/css/fonts.css';
import './assets/css/global.css';
import './assets/css/index.css';
import './assets/css/swiper-custom.css';

// 수정 후
import './styles/fonts.css';
import './styles/global.css';
import './styles/index.css';
import './styles/swiper-custom.css';
```

### app/router/NewRouter.tsx

```ts
// 수정 전
import { CustomRouteObject, routeConfig } from './newConfig';

// 수정 후
import { CustomRouteObject, routeConfig } from './config';
```

### app/router/config.tsx

- 모든 상대 경로 dynamic import를 `@/pages/` 절대 경로로 변환 (Python regex, 60여개)
  ```ts
  // 수정 전
  import('./login/Login')
  import('./membership/Membership')
  // ...

  // 수정 후
  import('@/pages/login/Login')
  import('@/pages/membership/Membership')
  // ...
  ```

### index.html

```html
<!-- 수정 전 -->
<script type="module" src="/src/main.tsx"></script>

<!-- 수정 후 -->
<script type="module" src="/src/app/main.tsx"></script>
```

### pages/home/Home.tsx

```ts
// 수정 전
import '@/assets/css/swiper-custom.css';

// 수정 후
import '@/app/styles/swiper-custom.css';
```

---

## 5. 검증 결과

```
yarn tsc -b --noEmit   → 에러 0개
yarn test --run        → 14개 테스트 전원 통과
```
