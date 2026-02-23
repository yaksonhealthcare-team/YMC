# FSD STEP 5 — pages/ 레이어 정리 작업 요약

> 작업일: 2026-02-23
> 브랜치: `chore/fsd`

---

## 1. 작업 목표

`src/pages/` 레이어 내부 구조 정리:
1. `_fragments/` → `ui/` 디렉토리 이름 변경 (FSD 컨벤션 준수)
2. `_shared/router/` 하위 페이지 컴포넌트들을 `pages/` 레이어로 통합

---

## 2. Phase 1 — `_fragments/` → `ui/` 이름 변경

### 이름 변경된 디렉토리 목록 (14개)

| 원본 경로 | 변경 경로 |
|-----------|-----------|
| `pages/addUsingBranch/_fragments/` | `pages/addUsingBranch/ui/` |
| `pages/branch/_fragments/` | `pages/branch/ui/` |
| `pages/branch/[id]/_fragments/` | `pages/branch/[id]/ui/` |
| `pages/branch/search/_fragments/` | `pages/branch/search/ui/` |
| `pages/cart/_fragments/` | `pages/cart/ui/` |
| `pages/editProfile/_fragments/` | `pages/editProfile/ui/` |
| `pages/event/_fragments/` | `pages/event/ui/` |
| `pages/home/_fragments/` | `pages/home/ui/` |
| `pages/membership/_fragments/` | `pages/membership/ui/` |
| `pages/myPage/_fragments/` | `pages/myPage/ui/` |
| `pages/payment/_fragments/` | `pages/payment/ui/` |
| `pages/reservation/_fragments/` | `pages/reservation/ui/` |
| `pages/review/_fragments/` | `pages/review/ui/` |
| `pages/store/_fragments/` | `pages/store/ui/` |

> `git mv`를 사용하여 git history 보존

---

## 3. Phase 2 — `_shared/router/` 페이지 → `pages/` 통합

### 이동 및 생성된 파일 목록

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `_shared/router/home/HomePage.tsx` | `pages/home/HomePage.tsx` |
| `_shared/router/reservation/ReservationPage.tsx` | `pages/reservation/ReservationPage.tsx` |
| `_shared/router/reservation/MenuChoicePage.tsx` | `pages/reservation/MenuChoicePage.tsx` |
| `_shared/router/terms/TermsPage.tsx` | `pages/terms/TermsPage.tsx` |
| `_shared/router/terms/TermsDetailPage.tsx` | `pages/terms/TermsDetailPage.tsx` |
| `_shared/router/oauth/OAuthCallback.tsx` | `pages/oauth/OAuthCallback.tsx` |

---

## 4. Phase 3 — Import 경로 교체

### Python 스크립트 교체 규칙

| 교체 전 | 교체 후 |
|---------|---------|
| `/_fragments/` | `/ui/` |
| `from './_fragments/` | `from './ui/` |
| `from '../_fragments/` | `from '../ui/` |
| `@/_shared/router/home/HomePage` | `@/pages/home/HomePage` |
| `@/_shared/router/reservation/ReservationPage` | `@/pages/reservation/ReservationPage` |
| `@/_shared/router/reservation/MenuChoicePage` | `@/pages/reservation/MenuChoicePage` |
| `@/_shared/router/terms/TermsPage` | `@/pages/terms/TermsPage` |
| `@/_shared/router/terms/TermsDetailPage` | `@/pages/terms/TermsDetailPage` |
| `@/_shared/router/oauth/OAuthCallback` | `@/pages/oauth/OAuthCallback` |

**변경 파일 수: 30개**

### 추가 수동 수정

`pages/newConfig.tsx`에서 상대 경로로 작성된 import (Python 스크립트 미처리):

```ts
// 수정 전
import('../_shared/router/home/HomePage')
import('../_shared/router/terms/TermsPage')
import('../_shared/router/terms/TermsDetailPage')
import('../_shared/router/oauth/OAuthCallback')

// 수정 후
import('@/pages/home/HomePage')
import('@/pages/terms/TermsPage')
import('@/pages/terms/TermsDetailPage')
import('@/pages/oauth/OAuthCallback')
```

---

## 5. 검증 결과

```
yarn tsc -b --noEmit   → 에러 0개
yarn test --run        → 14개 테스트 전원 통과
```

---

## 6. STEP 6 예정 작업 — app/ 레이어 구성

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `src/App.tsx` | `src/app/App.tsx` |
| `src/main.tsx` | `src/app/main.tsx` |
| `src/Initialization.tsx` | `src/app/providers/Initialization.tsx` |
| `src/pages/NewRouter.tsx` | `src/app/router/NewRouter.tsx` |
| `src/pages/newConfig.tsx` | `src/app/router/config.tsx` |
| `src/assets/css/` | `src/app/styles/` |
