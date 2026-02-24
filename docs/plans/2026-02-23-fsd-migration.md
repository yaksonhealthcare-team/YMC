# FSD Architecture Migration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** `src/` 하위 파일들을 Feature-Sliced Design(FSD) 아키텍쳐로 재배치하여 기능 확장 비용을 줄인다.

**Architecture:** 파일 이동과 import 경로 수정만 수행한다. 코드 로직 변경 없음. 6개 레이어(shared → entities → features → widgets → pages → app) 순서로 진행하며, 하위 레이어가 상위 레이어를 참조하지 않는 FSD 의존성 규칙을 준수한다.

**Tech Stack:** React 18, TypeScript, Vite, `@/*` = `src/*` path alias

**Path alias:** `@/*` → `src/*` (tsconfig.app.json 기준)

**검수 규칙:** 각 단계 완료 후 반드시 사용자 검수를 받을 것. `yarn tsc --noEmit` 으로 타입 에러 0개 확인 후 검수 요청.

---

## 확정된 결정사항

- `_fragments/` → `ui/` 로 통일
- 쿼리 키 → `shared/constants/queryKeys/` 한 곳에서 관리
- `DevPage.tsx` → 삭제
- 중복 hooks (`src/hooks/useDebounce.ts`, `src/hooks/useIntersection.tsx`) → `_shared/` 버전이 더 완성도 높음, 구버전 삭제

---

## 최종 목표 디렉토리 구조

```
src/
├── app/            # 진입점, providers, router, 전역 스타일
├── pages/          # 라우트 페이지 (조합만, 로직 없음)
├── widgets/        # 독립적인 복합 UI 블록 (재사용 가능)
├── features/       # 사용자 인터랙션 / 비즈니스 플로우
├── entities/       # 비즈니스 엔티티 (api + model + ui)
└── shared/         # 공통 인프라 (ui, lib, api, constants, types)
```

---

## STEP 1: shared/ 구성

> **의존성:** 없음 (가장 하위 레이어)
> **범위:** `_shared/`, `utils/`, `hooks/`(공통분), `types/`(공통분), `components/`(도메인 무관), `stores/ModalContext.tsx`, 쿼리 키 파일들

### 1-1. 목표 디렉토리 생성

```
src/shared/
├── api/                    # axios instance
├── constants/
│   └── queryKeys/          # 모든 쿼리 키
├── types/                  # 공통 타입 (HTTPResponse, global.d.ts 등)
├── lib/
│   ├── hooks/              # 공통 hooks
│   ├── utils/              # 공통 utils
│   └── stores/             # 공통 store (header 등)
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

### 1-2. 파일 이동 목록

#### shared/api/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/_shared/services/instance.ts` | `src/shared/api/instance.ts` |

#### shared/constants/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/_shared/constants/brands.constants.ts` | `src/shared/constants/brands.constants.ts` |
| `src/_shared/constants/endpoint.ts` | `src/shared/constants/endpoint.ts` |
| `src/_shared/constants/error.constants.ts` | `src/shared/constants/error.constants.ts` |
| `src/_shared/constants/location.constants.ts` | `src/shared/constants/location.constants.ts` |

#### shared/constants/queryKeys/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/_shared/constants/queryKey.constants.ts` | `src/shared/constants/queryKeys/queryKey.constants.ts` |
| `src/queries/queryKeyFactory.ts` | `src/shared/constants/queryKeys/queryKeyFactory.ts` |
| `src/queries/query.keys.ts` | `src/shared/constants/queryKeys/query.keys.ts` |
| `src/queries/keys/address.keys.ts` | `src/shared/constants/queryKeys/keys/address.keys.ts` |
| `src/queries/keys/banners.keys.ts` | `src/shared/constants/queryKeys/keys/banners.keys.ts` |
| `src/queries/keys/branches.keys.ts` | `src/shared/constants/queryKeys/keys/branches.keys.ts` |
| `src/queries/keys/brands.keys.ts` | `src/shared/constants/queryKeys/keys/brands.keys.ts` |
| `src/queries/keys/carts.keys.ts` | `src/shared/constants/queryKeys/keys/carts.keys.ts` |
| `src/queries/keys/events.keys.ts` | `src/shared/constants/queryKeys/keys/events.keys.ts` |
| `src/queries/keys/memberships.keys.ts` | `src/shared/constants/queryKeys/keys/memberships.keys.ts` |
| `src/queries/keys/notices.keys.ts` | `src/shared/constants/queryKeys/keys/notices.keys.ts` |
| `src/queries/keys/notifications.keys.ts` | `src/shared/constants/queryKeys/keys/notifications.keys.ts` |
| `src/queries/keys/payments.keys.ts` | `src/shared/constants/queryKeys/keys/payments.keys.ts` |
| `src/queries/keys/points.keys.ts` | `src/shared/constants/queryKeys/keys/points.keys.ts` |
| `src/queries/keys/popups.keys.ts` | `src/shared/constants/queryKeys/keys/popups.keys.ts` |
| `src/queries/keys/questionnaires.keys.ts` | `src/shared/constants/queryKeys/keys/questionnaires.keys.ts` |
| `src/queries/keys/reservations.keys.ts` | `src/shared/constants/queryKeys/keys/reservations.keys.ts` |
| `src/queries/keys/reviews.keys.ts` | `src/shared/constants/queryKeys/keys/reviews.keys.ts` |
| `src/queries/keys/schedules.keys.ts` | `src/shared/constants/queryKeys/keys/schedules.keys.ts` |

#### shared/types/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/_shared/types/response.types.ts` | `src/shared/types/response.types.ts` |
| `src/_shared/types/util.types.ts` | `src/shared/types/util.types.ts` |
| `src/types/HTTPResponse.ts` | `src/shared/types/HTTPResponse.ts` |
| `src/types/global.d.ts` | `src/shared/types/global.d.ts` |
| `src/types/kakao.d.ts` | `src/shared/types/kakao.d.ts` |
| `src/types/naver.d.ts` | `src/shared/types/naver.d.ts` |
| `src/types/Coordinate.ts` | `src/shared/types/Coordinate.ts` |
| `src/types/Location.ts` | `src/shared/types/Location.ts` |

#### shared/lib/utils/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/_shared/utils/date.utils.ts` | `src/shared/lib/utils/date.utils.ts` |
| `src/_shared/utils/fetch.utils.ts` | `src/shared/lib/utils/fetch.utils.ts` |
| `src/_shared/utils/format.utils.ts` | `src/shared/lib/utils/format.utils.ts` |
| `src/_shared/utils/error.utils.ts` | `src/shared/lib/utils/error.utils.ts` |
| `src/_shared/utils/form.utils.ts` | `src/shared/lib/utils/form.utils.ts` |
| `src/_shared/utils/ga.utils.ts` | `src/shared/lib/utils/ga.utils.ts` |
| `src/_shared/utils/logger.utils.ts` | `src/shared/lib/utils/logger.utils.ts` |
| `src/_shared/utils/sdk.utils.ts` | `src/shared/lib/utils/sdk.utils.ts` |
| `src/_shared/utils/sentry.utils.ts` | `src/shared/lib/utils/sentry.utils.ts` |
| `src/_shared/utils/sentry.utils.test.ts` | `src/shared/lib/utils/sentry.utils.test.ts` |
| `src/_shared/utils/lazyWithRetry.ts` | `src/shared/lib/utils/lazyWithRetry.ts` |
| `src/utils/date.ts` | `src/shared/lib/utils/date.ts` |
| `src/utils/formatDate.ts` | `src/shared/lib/utils/formatDate.ts` |
| `src/utils/formatTime.ts` | `src/shared/lib/utils/formatTime.ts` |
| `src/utils/formatToTimeSlot.ts` | `src/shared/lib/utils/formatToTimeSlot.ts` |
| `src/utils/format.ts` | `src/shared/lib/utils/format.ts` |
| `src/utils/number.ts` | `src/shared/lib/utils/number.ts` |
| `src/utils/emailValidator.ts` | `src/shared/lib/utils/emailValidator.ts` |
| `src/utils/passwordValidator.ts` | `src/shared/lib/utils/passwordValidator.ts` |
| `src/utils/gender.ts` | `src/shared/lib/utils/gender.ts` |
| `src/utils/grade.ts` | `src/shared/lib/utils/grade.ts` |
| `src/utils/sanitize.ts` | `src/shared/lib/utils/sanitize.ts` |
| `src/utils/copyUtils.ts` | `src/shared/lib/utils/copyUtils.ts` |
| `src/utils/getCurrentLocation.ts` | `src/shared/lib/utils/getCurrentLocation.ts` |
| `src/utils/createMarkerIcon.ts` | `src/shared/lib/utils/createMarkerIcon.ts` |
| `src/utils/niceAuth.ts` | `src/shared/lib/utils/niceAuth.ts` |
| `src/utils/niceCheck.ts` | `src/shared/lib/utils/niceCheck.ts` |
| `src/utils/isLowerVersion.ts` | `src/shared/lib/utils/isLowerVersion.ts` |

#### shared/lib/hooks/

| 현재 경로 | 이동 경로 | 비고 |
|----------|----------|------|
| `src/_shared/hooks/useChannelTalk.ts` | `src/shared/lib/hooks/useChannelTalk.ts` | |
| `src/_shared/hooks/useChannelTalkVisibility.ts` | `src/shared/lib/hooks/useChannelTalkVisibility.ts` | |
| `src/_shared/hooks/useDebounce.ts` | `src/shared/lib/hooks/useDebounce.ts` | 이쪽이 더 완성도 높음 |
| `src/_shared/hooks/useIntersectionObserver.ts` | `src/shared/lib/hooks/useIntersectionObserver.ts` | 이쪽이 더 완성도 높음 |
| `src/_shared/hooks/useNewAppBridge.tsx` | `src/shared/lib/hooks/useNewAppBridge.tsx` | |
| `src/_shared/hooks/useOverlayBackHandler.ts` | `src/shared/lib/hooks/useOverlayBackHandler.ts` | |
| `src/_shared/hooks/useVConsole.ts` | `src/shared/lib/hooks/useVConsole.ts` | |
| `src/hooks/useForceUpdateModal.tsx` | `src/shared/lib/hooks/useForceUpdateModal.tsx` | |
| `src/hooks/usePreventGoBack.ts` | `src/shared/lib/hooks/usePreventGoBack.ts` | |

#### 삭제 (중복 구버전)

| 삭제 대상 | 이유 |
|----------|------|
| `src/hooks/useDebounce.ts` | `_shared/` 버전으로 대체 |
| `src/hooks/useIntersection.tsx` | `_shared/` 버전(`useIntersectionObserver`)으로 대체 |

#### shared/lib/stores/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/_shared/stores/header.stores.ts` | `src/shared/lib/stores/header.store.ts` |

#### shared/ui/button/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/components/Button.tsx` | `src/shared/ui/button/Button.tsx` |
| `src/components/ButtonRound.tsx` | `src/shared/ui/button/ButtonRound.tsx` |
| `src/components/FloatingButton.tsx` | `src/shared/ui/button/FloatingButton.tsx` |
| `src/components/SearchFloatingButton.tsx` | `src/shared/ui/button/SearchFloatingButton.tsx` |
| `src/components/FixedButtonContainer.tsx` | `src/shared/ui/button/FixedButtonContainer.tsx` |

#### shared/ui/text-field/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/components/CustomTextField.tsx` | `src/shared/ui/text-field/CustomTextField.tsx` |
| `src/components/SearchField.tsx` | `src/shared/ui/text-field/SearchField.tsx` |
| `src/components/TextArea.tsx` | `src/shared/ui/text-field/TextArea.tsx` |
| `src/components/input/PasswordCustomInput.tsx` | `src/shared/ui/text-field/PasswordCustomInput.tsx` |

#### shared/ui/tabs/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/components/Tabs.tsx` | `src/shared/ui/tabs/Tabs.tsx` |

#### shared/ui/switch/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/components/Switch.tsx` | `src/shared/ui/switch/Switch.tsx` |

#### shared/ui/radio/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/components/Radio.tsx` | `src/shared/ui/radio/Radio.tsx` |
| `src/components/RadioCard.tsx` | `src/shared/ui/radio/RadioCard.tsx` |
| `src/components/GenderSelect.tsx` | `src/shared/ui/radio/GenderSelect.tsx` |

#### shared/ui/filter/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/components/Filter.tsx` | `src/shared/ui/filter/Filter.tsx` |

#### shared/ui/tag/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/components/Tag.tsx` | `src/shared/ui/tag/Tag.tsx` |
| `src/components/ReserveTag.tsx` | `src/shared/ui/tag/ReserveTag.tsx` |

#### shared/ui/loading/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/components/LoadingIndicator.tsx` | `src/shared/ui/loading/LoadingIndicator.tsx` |
| `src/components/FullPageLoading.tsx` | `src/shared/ui/loading/FullPageLoading.tsx` |

#### shared/ui/error/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/components/ErrorBoundary.tsx` | `src/shared/ui/error/ErrorBoundary.tsx` |
| `src/components/ErrorPage.tsx` | `src/shared/ui/error/ErrorPage.tsx` |

#### shared/ui/modal/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/stores/ModalContext.tsx` | `src/shared/ui/modal/ModalContext.tsx` |
| `src/components/modal/PostcodeModal.tsx` | `src/shared/ui/modal/PostcodeModal.tsx` |

#### shared/ui/calendar/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/_shared/components/molecules/Calendar/Calendar.tsx` | `src/shared/ui/calendar/Calendar.tsx` |

#### shared/ui/map-view/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/components/MapView.tsx` | `src/shared/ui/map-view/MapView.tsx` |

#### shared/ui/image/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/components/common/Image.tsx` | `src/shared/ui/image/Image.tsx` |

#### shared/ui/layout/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/components/PageContainer.tsx` | `src/shared/ui/layout/PageContainer.tsx` |
| `src/components/Logo.tsx` | `src/shared/ui/layout/Logo.tsx` |
| `src/components/Header.tsx` | `src/shared/ui/layout/Header.tsx` |

#### shared/ui/icons/

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/components/icons/BranchIcon.tsx` | `src/shared/ui/icons/BranchIcon.tsx` |
| `src/components/icons/CheckIcon.tsx` | `src/shared/ui/icons/CheckIcon.tsx` |
| `src/components/icons/CheckFillCircleIcon.tsx` | `src/shared/ui/icons/CheckFillCircleIcon.tsx` |
| `src/components/icons/FilledCheckIcon.tsx` | `src/shared/ui/icons/FilledCheckIcon.tsx` |
| `src/components/icons/ReloadIcon.tsx` | `src/shared/ui/icons/ReloadIcon.tsx` |
| `src/components/icons/SearchIcon.tsx` | `src/shared/ui/icons/SearchIcon.tsx` |
| `src/components/icons/ShopIcon.tsx` | `src/shared/ui/icons/ShopIcon.tsx` |
| `src/components/icons/XIcon.tsx` | `src/shared/ui/icons/XIcon.tsx` |
| `src/components/icons/XCircleIcon.tsx` | `src/shared/ui/icons/XCircleIcon.tsx` |

#### shared/ui/ (기타 공통 UI)

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/components/EmptyCard.tsx` | `src/shared/ui/EmptyCard.tsx` |
| `src/components/DateAndTime.tsx` | `src/shared/ui/DateAndTime.tsx` |
| `src/components/Number.tsx` | `src/shared/ui/Number.tsx` |
| `src/components/Title.tsx` | `src/shared/ui/Title.tsx` |

### 1-3. STEP 1 이후 `src/components/`에 남는 파일 (다음 단계에서 처리)

| 파일 | 다음 단계 |
|------|----------|
| `BranchCard.tsx` | STEP 2 → `entities/branch/ui/` |
| `BrandCard.tsx` | STEP 2 → `entities/brand/ui/` |
| `CartCard.tsx` | STEP 2 → `entities/cart/ui/` |
| `PaymentCard.tsx` | STEP 2 → `entities/payment/ui/` |
| `NotificationCard.tsx` | STEP 2 → `entities/notification/ui/` |
| `ProfileCard.tsx` | STEP 2 → `entities/user/ui/` |
| `ReserveCard.tsx` | STEP 2 → `entities/reservation/ui/` |
| `AdditionalServiceCard.tsx` | STEP 2 → `entities/reservation/ui/` |
| `SwiperBrandCard.tsx` | STEP 4 → `widgets/brand-swiper/ui/` |
| `NoticesSummarySlider.tsx` | STEP 4 → `widgets/notices-slider/ui/` |
| `PriceSummary.tsx` | STEP 4 → `widgets/price-summary/ui/` |
| `popup/StartupPopup.tsx` | STEP 4 → `widgets/startup-popup/ui/` |
| `resetPassword/` | STEP 3 → `features/auth/ui/` |

### 1-4. 검증

```bash
yarn tsc --noEmit
```

타입 에러 0개 확인 후 검수 요청.

---

## STEP 2: entities/ 구성

> **의존성:** shared에만 의존
> **범위:** `apis/`, `types/`(도메인), `mappers/`, `queries/`(useXxxQueries), `_domain/` 내 services/types/utils, `components/`(도메인 카드 컴포넌트)

### 목표 구조

```
src/entities/
├── user/
│   ├── api/        # auth.api.ts, user.api.ts, useUserQueries
│   ├── model/      # User.ts types, user.store.ts, auth.types.ts
│   ├── lib/        # UserMapper.ts, token.utils.ts, auth.services.ts
│   └── ui/         # ProfileCard.tsx
├── branch/
│   ├── api/        # branch.api.ts, useBranchQueries.tsx
│   ├── model/      # Branch.ts
│   ├── lib/        # BranchMapper.ts
│   └── ui/         # BranchCard.tsx
├── membership/
│   ├── api/        # membership.api.ts, useMembershipQueries.tsx
│   ├── model/      # Membership.ts, MembershipProgram.ts, MemberHistory.ts, membership.types.ts
│   ├── lib/        # membership.business.ts, membership.utils.ts, membership.services.ts
│   └── ui/         # MembershipCard, MembershipChip
├── reservation/
│   ├── api/        # reservation.api.ts, useReservationQueries.ts
│   ├── model/      # Reservation.ts, reservation.types.ts
│   ├── lib/        # reservation.services.ts, format.utils.ts
│   └── ui/         # ReserveCard.tsx, AdditionalServiceCard.tsx
├── schedule/
│   ├── api/        # schedule.api.ts, useScheduleQueries.tsx
│   ├── model/      # Schedule.ts, schedule.types.ts
│   └── lib/        # schedule.services.ts
├── payment/
│   ├── api/        # payments.api.ts, usePaymentQueries.tsx
│   ├── model/      # Payment.ts
│   ├── lib/        # PaymentMapper.ts
│   └── ui/         # PaymentCard.tsx
├── review/
│   ├── api/        # review.api.ts, useReviewQueries.tsx
│   ├── model/      # Review.ts
│   └── lib/        # ReviewMapper.ts
├── notification/
│   ├── api/        # notifications.api.ts, useNotificationQueries.tsx
│   ├── model/      # Notification.ts
│   ├── lib/        # NotificationMapper.ts, notification.services.ts
│   └── ui/         # NotificationCard.tsx
├── point/
│   ├── api/        # points.api.ts, usePointQueries.tsx
│   ├── model/      # Point.ts
│   └── lib/        # PointMapper.ts
├── cart/
│   ├── api/        # cart.api.ts, useCartQueries.tsx
│   ├── model/      # Cart.ts
│   ├── lib/        # CartMapper.ts
│   └── ui/         # CartCard.tsx
├── banner/
│   ├── api/        # banner.api.ts, useBannerQueries.tsx
│   ├── model/      # Banner.ts, banners.types.ts
│   ├── lib/        # BannerMapper.ts, banners.services.ts
│   └── ui/         # (BannerSwiper는 widgets으로)
├── content/
│   ├── api/        # contents.api.ts, useContentQueries.tsx, useEventQueries.ts
│   ├── model/      # Content.ts, Event.ts, contents.types.ts
│   └── lib/        # ContentMapper.ts, contents.services.ts
└── brand/
    ├── api/        # brands.api.ts, useBrandQueries.tsx
    ├── model/      # Brand.ts
    ├── lib/        # BrandMapper.ts
    └── ui/         # BrandCard.tsx
```

*(상세 파일 매핑은 STEP 1 검수 완료 후 상세 작성)*

### 검증

```bash
yarn tsc --noEmit
```

---

## STEP 3: features/ 구성

> **의존성:** entities, shared에 의존
> **범위:** `hooks/`(도메인별), `stores/`(도메인별), `_domain/`(비즈니스 플로우), `pages/`의 복잡한 form 로직

### 목표 구조

```
src/features/
├── auth/
│   ├── ui/         # 로그인 폼, 회원가입 폼, resetPassword/
│   ├── model/      # SignupContext.tsx, auth.services.ts
│   └── lib/        # useProfile* hooks, 유효성 검사
├── reservation/
│   ├── ui/         # _domain/reservation/components/, DateAndTimeBottomSheet
│   ├── model/      # reservationStore.ts
│   └── lib/        # useQuestionnaire, guide.services.ts
├── payment/
│   ├── ui/         # payment _fragments/
│   └── lib/        # usePayment.ts, usePaymentHandlers.ts, usePaymentStore.ts
├── membership-purchase/
│   ├── ui/         # membership purchase flow UI
│   └── model/      # membershipStore.ts
├── search-branch/
│   ├── ui/         # 검색/필터/지도 관련 branch fragments
│   └── lib/        # useBranchLocationSelect, useGeolocation, useNaverMapBranchMarkers
├── review-write/
│   └── lib/        # review mutation hooks
├── questionnaire-submit/
│   └── lib/        # useQuestionnaire.ts
├── edit-profile/
│   ├── ui/         # editProfile _fragments/
│   └── lib/        # useProfileSetup* hooks
└── cart/
    └── ui/         # cart page fragments
```

*(상세 파일 매핑은 STEP 2 검수 완료 후 상세 작성)*

---

## STEP 4: widgets/ 구성

> **의존성:** features, entities, shared에 의존
> **범위:** 재사용 가능한 복합 UI 블록

### 목표 구조

```
src/widgets/
├── header/
│   └── ui/         # _shared/components/organisms/Header/
├── layout/
│   └── ui/         # _shared/components/organisms/Layout/, LayoutContext.tsx
├── bottom-fixed-section/
│   └── ui/         # _shared/components/organisms/BottomFixedSection/
├── banner-swiper/
│   └── ui/         # _domain/contents/components/molecules/BannerSwiper/
├── home-overview/
│   └── ui/         # _domain/core/components/organisms/HomeOverview/
├── date-bottom-sheet/
│   └── ui/         # _shared/components/organisms/DateBottomSheet/
├── membership-card/
│   └── ui/         # _domain/membership/components/organisms/MembershipCard/
├── notices-slider/
│   └── ui/         # components/NoticesSummarySlider.tsx
├── startup-popup/
│   └── ui/         # components/popup/StartupPopup.tsx + stores/popupStore.ts
└── price-summary/
    └── ui/         # components/PriceSummary.tsx
```

*(상세 파일 매핑은 STEP 3 검수 완료 후 상세 작성)*

---

## STEP 5: pages/ 구성

> **의존성:** 모든 레이어에 의존
> **범위:** `src/pages/`, `src/_shared/router/`

### 변경사항

1. `_fragments/` → `ui/` 로 디렉토리 이름 변경 (모든 페이지)
2. `_shared/router/` 하위 페이지들을 `pages/`로 통합:
   - `_shared/router/home/HomePage.tsx` → `pages/home/ui/HomePage.tsx`
   - `_shared/router/reservation/ReservationPage.tsx` → `pages/reservation/ui/ReservationPage.tsx`
   - `_shared/router/reservation/MenuChoicePage.tsx` → `pages/reservation/ui/MenuChoicePage.tsx`
   - `_shared/router/terms/TermsPage.tsx` → `pages/terms/ui/TermsPage.tsx`
   - `_shared/router/terms/TermsDetailPage.tsx` → `pages/terms/ui/TermsDetailPage.tsx`
   - `_shared/router/oauth/OAuthCallback.tsx` → `pages/oauth/ui/OAuthCallback.tsx`
3. `src/pages/DevPage.tsx` → **삭제**

*(상세 파일 매핑은 STEP 4 검수 완료 후 상세 작성)*

---

## STEP 6: app/ 구성

> **의존성:** 모든 레이어에 의존
> **범위:** `App.tsx`, `main.tsx`, `Initialization.tsx`, `pages/NewRouter.tsx`, `pages/newConfig.tsx`, `assets/css/`

### 파일 이동

| 현재 경로 | 이동 경로 |
|----------|----------|
| `src/App.tsx` | `src/app/App.tsx` |
| `src/main.tsx` | `src/app/main.tsx` |
| `src/Initialization.tsx` | `src/app/providers/Initialization.tsx` |
| `src/pages/NewRouter.tsx` | `src/app/router/index.tsx` |
| `src/pages/newConfig.tsx` | `src/app/router/config.tsx` |
| `src/assets/css/` | `src/app/styles/` |
| `src/assets/fonts/` | `src/app/styles/fonts/` |

> ⚠️ `main.tsx`의 `import './assets/css/index.css'` 경로도 함께 수정

*(상세 파일 매핑은 STEP 5 검수 완료 후 상세 작성)*

---

## 검수 체크리스트 (각 단계 공통)

- [ ] `yarn tsc --noEmit` — 타입 에러 0개
- [ ] 이동한 파일을 참조하는 모든 import 경로 업데이트 완료
- [ ] 불필요한 빈 디렉토리 제거
- [ ] 이전 경로의 파일 완전 삭제 확인
