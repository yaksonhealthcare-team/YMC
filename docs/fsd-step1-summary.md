# FSD STEP 1 작업 요약 — shared/ 구성

**브랜치:** `chore/fsd`
**완료일:** 2026-02-23
**검증:** `yarn tsc -b --noEmit` 타입 에러 0개, `yarn test` 14개 전부 통과

---

## 개요

`src/` 하위에 `shared/` 레이어를 신설하고, 도메인 무관한 공통 코드를 이동했다.
코드 로직은 변경하지 않고 **파일 위치와 import 경로만 변경**했다.

---

## 생성된 디렉토리 구조

```
src/shared/
├── api/                          # axios 인스턴스
├── constants/
│   └── queryKeys/
│       └── keys/                 # 도메인별 쿼리 키
├── types/                        # 공통 타입 (HTTPResponse, Coordinate 등)
├── lib/
│   ├── hooks/                    # 공통 훅
│   ├── utils/                    # 공통 유틸
│   └── stores/                   # 공통 스토어
└── ui/
    ├── button/
    ├── text-field/
    ├── tabs/
    ├── switch/
    ├── radio/
    ├── filter/
    ├── tag/
    ├── loading/
    ├── error/
    ├── modal/
    ├── calendar/
    ├── map-view/
    ├── image/
    ├── layout/
    └── icons/
```

---

## 주요 이동 목록

| 이전 경로 | 이후 경로 |
|----------|----------|
| `src/_shared/services/instance.ts` | `src/shared/api/instance.ts` |
| `src/_shared/constants/*.ts` | `src/shared/constants/*.ts` |
| `src/_shared/constants/queryKey.constants.ts` | `src/shared/constants/queryKeys/queryKey.constants.ts` |
| `src/queries/query.keys.ts`, `queryKeyFactory.ts` | `src/shared/constants/queryKeys/` |
| `src/queries/keys/*.ts` | `src/shared/constants/queryKeys/keys/` |
| `src/_shared/types/*.ts` | `src/shared/types/` |
| `src/types/HTTPResponse.ts`, `Coordinate.ts`, `Location.ts`, `global.d.ts`, `kakao.d.ts`, `naver.d.ts` | `src/shared/types/` |
| `src/_shared/utils/*.ts` | `src/shared/lib/utils/` |
| `src/utils/*.ts` | `src/shared/lib/utils/` |
| `src/_shared/hooks/*.ts` | `src/shared/lib/hooks/` |
| `src/hooks/useForceUpdateModal.tsx`, `usePreventGoBack.ts` | `src/shared/lib/hooks/` |
| `src/_shared/stores/header.stores.ts` | `src/shared/lib/stores/header.store.ts` |
| `src/_shared/components/molecules/Calendar/Calendar.tsx` | `src/shared/ui/calendar/Calendar.tsx` |
| `src/components/{Button,ButtonRound,FloatingButton,...}.tsx` | `src/shared/ui/button/` |
| `src/components/{CustomTextField,SearchField,TextArea}.tsx` | `src/shared/ui/text-field/` |
| `src/components/input/PasswordCustomInput.tsx` | `src/shared/ui/text-field/` |
| `src/components/Tabs.tsx` | `src/shared/ui/tabs/` |
| `src/components/Switch.tsx` | `src/shared/ui/switch/` |
| `src/components/{Radio,RadioCard,GenderSelect}.tsx` | `src/shared/ui/radio/` |
| `src/components/Filter.tsx` | `src/shared/ui/filter/` |
| `src/components/{Tag,ReserveTag}.tsx` | `src/shared/ui/tag/` |
| `src/components/{LoadingIndicator,FullPageLoading}.tsx` | `src/shared/ui/loading/` |
| `src/components/{ErrorBoundary,ErrorPage}.tsx` | `src/shared/ui/error/` |
| `src/stores/ModalContext.tsx` | `src/shared/ui/modal/ModalContext.tsx` |
| `src/components/modal/PostcodeModal.tsx` | `src/shared/ui/modal/` |
| `src/components/MapView.tsx` | `src/shared/ui/map-view/` |
| `src/components/common/Image.tsx` | `src/shared/ui/image/` |
| `src/components/{PageContainer,Logo,Header}.tsx` | `src/shared/ui/layout/` |
| `src/components/icons/*.tsx` | `src/shared/ui/icons/` |
| `src/components/{EmptyCard,DateAndTime,Number,Title}.tsx` | `src/shared/ui/` |

---

## 삭제된 파일

| 파일 | 이유 |
|------|------|
| `src/hooks/useDebounce.ts` | `_shared/hooks/useDebounce.ts`(더 완성도 높음)로 통합 |
| `src/hooks/useIntersection.tsx` | `shared/lib/hooks/useIntersectionObserver.ts`로 전환 |
| `src/pages/DevPage.tsx` | 개발용 임시 페이지, 확정 결정사항 |
| `src/utils/` (빈 디렉토리) | 파일 전부 이동 후 제거 |
| `src/queries/keys/` (빈 디렉토리) | 파일 전부 이동 후 제거 |

---

## useIntersection → useIntersectionObserver 전환

### 배경

`src/hooks/useIntersection.tsx` (구버전)과 `src/_shared/hooks/useIntersectionObserver.ts` (신버전)는
같은 역할을 하지만 API가 달랐다.

**구버전 API (`useIntersection`)**

```tsx
// 옵션 객체 한 개를 받고, 내부에서 ref를 생성해 반환
const { observerTarget } = useIntersection({
  onIntersect: () => fetchNextPage(),
  enabled: hasNextPage         // 활성화 조건
});

<div ref={observerTarget} />  // ref를 DOM에 붙임
```

**신버전 API (`useIntersectionObserver`)**

```tsx
// ref를 외부에서 만들어 첫 번째 인자로 전달
const observerTarget = useRef<HTMLDivElement>(null);
useIntersectionObserver(observerTarget, () => fetchNextPage());

<div ref={observerTarget} />
```

### 전환 방법

`enabled` 옵션은 별도 파라미터가 없으므로, **콜백 내부의 조건문**으로 흡수했다.

```tsx
// 전: enabled + onIntersect 분리
const { observerTarget } = useIntersection({
  onIntersect: () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  },
  enabled: hasNextPage && !isFetchingNextPage  // ← 이 옵션 제거
});

// 후: 조건을 콜백 안으로 통합
const observerTarget = useRef<HTMLDivElement>(null);
useIntersectionObserver(observerTarget, () => {
  if (hasNextPage && !isFetchingNextPage) fetchNextPage();  // ← 조건 인라인
});
```

### 전환된 파일 목록

- `src/pages/home/Notification.tsx`
- `src/pages/point/PointPage.tsx`
- `src/pages/review/ReviewPage.tsx`
- `src/pages/payment/PaymentHistoryPage.tsx`
- `src/pages/addUsingBranch/Step1SearchBranchList.tsx`
- `src/pages/branch/_fragments/BranchFilterList.tsx`
- `src/pages/membership/Membership.tsx`

---

## 하위 호환 처리 (`@/_shared` 배럴 import)

`@/_shared`에서 배럴 import로 쓰던 코드들이 있었다:

```tsx
import { authApi, handleError, CustomUseQueryOptions } from '@/_shared';
```

이 코드들은 STEP 2~6에서 순차적으로 정리될 예정이므로,
각 `_shared/` 서브 인덱스 파일이 새 위치를 re-export하도록 업데이트했다.

```ts
// src/_shared/services/index.ts
export { api, authApi } from '@/shared/api/instance';  // 새 경로로 re-export

// src/_shared/utils/index.ts
export * from '@/shared/lib/utils/date.utils';
// ...
```

기존 `@/_shared` import는 계속 동작하며, 이후 단계에서 순차 정리 예정.

---

## 다음 단계 (STEP 2)

`src/components/`에 남은 도메인 카드 컴포넌트와 `src/queries/useXxxQueries.tsx`,
`src/types/` 도메인 타입들을 `src/entities/` 레이어로 이동한다.
