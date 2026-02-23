# FSD STEP 3 — features/ 레이어 구성 작업 요약

> 작업일: 2026-02-23
> 브랜치: `chore/fsd`

---

## 1. 작업 목표

`src/features/` 레이어 구성: 사용자 인터랙션·비즈니스 플로우 코드를 features 단위로 응집.
추가로 STEP 2에서 완료되지 않은 entity UI 카드 및 `_domain` 타입/서비스 이동을 완료.

---

## 2. features 디렉토리 구조

```
src/features/
├── auth/
│   ├── ui/resetPassword/   # 비밀번호 초기화 UI
│   ├── model/              # SignupContext, user.store
│   └── lib/                # auth.services, useProfileSetup* hooks
├── reservation/
│   ├── ui/                 # _domain/reservation 컴포넌트 (organisms, sections, templates)
│   ├── model/              # reservationStore
│   └── lib/                # reservation/guide/schedule/branch/menu services, format.utils
├── payment/
│   └── lib/                # usePayment, usePaymentHandlers, usePaymentStore
├── membership-purchase/
│   ├── model/              # membershipStore, membership.constants
│   └── lib/                # membership.services, .business, .utils
├── search-branch/
│   └── lib/                # useGeolocation, useBranchLocationSelect, useNaverMapBranchMarkers, useAddressFromCoords
└── questionnaire-submit/
    └── lib/                # useQuestionnaire
```

---

## 3. 이동한 파일 목록

### 3-1. Entity UI 카드 (STEP 2 잔여)

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `src/components/BranchCard.tsx` | `src/entities/branch/ui/BranchCard.tsx` |
| `src/components/BrandCard.tsx` | `src/entities/brand/ui/BrandCard.tsx` |
| `src/components/CartCard.tsx` | `src/entities/cart/ui/CartCard.tsx` |
| `src/components/PaymentCard.tsx` | `src/entities/payment/ui/PaymentCard.tsx` |
| `src/components/NotificationCard.tsx` | `src/entities/notification/ui/NotificationCard.tsx` |
| `src/components/ProfileCard.tsx` | `src/entities/user/ui/ProfileCard.tsx` |
| `src/components/ReserveCard.tsx` | `src/entities/reservation/ui/ReserveCard.tsx` |
| `src/components/AdditionalServiceCard.tsx` | `src/entities/reservation/ui/AdditionalServiceCard.tsx` |

### 3-2. _domain 타입 → entities/model/ (STEP 2 잔여)

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `_domain/auth/types/auth.types.ts` | `entities/user/model/auth.types.ts` |
| `_domain/auth/types/user.types.ts` | `entities/user/model/user.types.ts` |
| `_domain/contents/types/banners.types.ts` | `entities/banner/model/banners.types.ts` |
| `_domain/contents/types/contents.types.ts` | `entities/content/model/contents.types.ts` |
| `_domain/category/types/menu.types.ts` | `entities/reservation/model/menu.types.ts` |
| `_domain/membership/types/membership.types.ts` | `entities/membership/model/membership.types.ts` |
| `_domain/reservation/types/reservation.types.ts` | `entities/reservation/model/reservation.types.ts` |
| `_domain/reservation/types/schedule.types.ts` | `entities/schedule/model/schedule.types.ts` |
| `_domain/reservation/types/branch.types.ts` | `entities/branch/model/branch.types.ts` |
| `_domain/reservation/types/guide.types.ts` | `entities/reservation/model/guide.types.ts` |

### 3-3. _domain 서비스 → entities/lib/ (STEP 2 잔여)

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `_domain/contents/services/banners.services.ts` | `entities/banner/lib/banners.services.ts` |
| `_domain/contents/services/contents.services.ts` | `entities/content/lib/contents.services.ts` |
| `_domain/auth/utils/token.utils.ts` | `entities/user/lib/token.utils.ts` |
| `src/hooks/useDisplayBrands.ts` | `entities/brand/lib/useDisplayBrands.ts` |

### 3-4. features/auth/

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `src/components/resetPassword/ResetPassword.tsx` | `features/auth/ui/resetPassword/ResetPassword.tsx` |
| `src/components/resetPassword/ResetPasswordComplete.tsx` | `features/auth/ui/resetPassword/ResetPasswordComplete.tsx` |
| `src/stores/SignupContext.tsx` | `features/auth/model/SignupContext.tsx` |
| `src/_domain/auth/stores/user.store.ts` | `features/auth/model/user.store.ts` |
| `src/_domain/auth/services/auth.services.ts` | `features/auth/lib/auth.services.ts` |
| `src/hooks/useProfileSetupHandlers.ts` | `features/auth/lib/useProfileSetupHandlers.ts` |
| `src/hooks/useProfileSetupSubmit.ts` | `features/auth/lib/useProfileSetupSubmit.ts` |
| `src/hooks/useProfileSetupSubmit.test.ts` | `features/auth/lib/useProfileSetupSubmit.test.ts` |
| `src/hooks/useProfileSetupSubmit.utils.ts` | `features/auth/lib/useProfileSetupSubmit.utils.ts` |
| `src/hooks/useProfileSetupValidation.ts` | `features/auth/lib/useProfileSetupValidation.ts` |

### 3-5. features/reservation/

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `src/stores/reservationStore.ts` | `features/reservation/model/reservationStore.ts` |
| `_domain/reservation/services/guide.services.ts` | `features/reservation/lib/guide.services.ts` |
| `_domain/reservation/services/reservation.services.ts` | `features/reservation/lib/reservation.services.ts` |
| `_domain/reservation/services/schedule.services.ts` | `features/reservation/lib/schedule.services.ts` |
| `_domain/reservation/services/branch.services.ts` | `features/reservation/lib/branch.services.ts` |
| `_domain/reservation/utils/format.utils.ts` | `features/reservation/lib/format.utils.ts` |
| `_domain/reservation/business/menu.business.ts` | `features/reservation/lib/menu.business.ts` |
| `_domain/category/services/menu.services.ts` | `features/reservation/lib/menu.services.ts` |
| `src/hooks/useGuideMessages.ts` | `features/reservation/lib/useGuideMessages.ts` |
| `_domain/reservation/components/organisms/MenuCard/MenuCard.tsx` | `features/reservation/ui/MenuCard.tsx` |
| `_domain/reservation/components/organisms/MenuCard/MenuCard.types.ts` | `features/reservation/ui/MenuCard.types.ts` |
| `_domain/reservation/components/organisms/ReservationMembershipCard/ReservationMembershipCard.tsx` | `features/reservation/ui/ReservationMembershipCard.tsx` |
| `_domain/reservation/components/organisms/ReservationMembershipCard/ReservationMembershipCard.types.ts` | `features/reservation/ui/ReservationMembershipCard.types.ts` |
| `_domain/reservation/components/organisms/ReservationMembershipSwiper/ReservationMembershipSwiper.tsx` | `features/reservation/ui/ReservationMembershipSwiper.tsx` |
| `_domain/reservation/components/organisms/ReservationMembershipSwiper/ReservationMembershipSwiper.types.ts` | `features/reservation/ui/ReservationMembershipSwiper.types.ts` |
| `_domain/reservation/components/sections/ReservationMenuSection/ReservationMenuSection.tsx` | `features/reservation/ui/ReservationMenuSection.tsx` |
| `_domain/reservation/components/sections/ReservationMenuSection/ReservationMenuSection.types.ts` | `features/reservation/ui/ReservationMenuSection.types.ts` |
| `_domain/reservation/components/sections/ReservationRestSection/ReservationRestSection.tsx` | `features/reservation/ui/ReservationRestSection.tsx` |
| `_domain/reservation/components/templates/MenuChoiceTemplate.tsx` | `features/reservation/ui/MenuChoiceTemplate.tsx` |
| `_domain/reservation/components/templates/ReservationTemplate.tsx` | `features/reservation/ui/ReservationTemplate.tsx` |

### 3-6. features/payment/

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `src/hooks/usePayment.ts` | `features/payment/lib/usePayment.ts` |
| `src/hooks/usePaymentHandlers.ts` | `features/payment/lib/usePaymentHandlers.ts` |
| `src/hooks/usePaymentStore.ts` | `features/payment/lib/usePaymentStore.ts` |

### 3-7. features/membership-purchase/

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `src/stores/membershipStore.ts` | `features/membership-purchase/model/membershipStore.ts` |
| `_domain/membership/services/membership.services.ts` | `features/membership-purchase/lib/membership.services.ts` |
| `_domain/membership/business/membership.business.ts` | `features/membership-purchase/lib/membership.business.ts` |
| `_domain/membership/utils/membership.utils.ts` | `features/membership-purchase/lib/membership.utils.ts` |
| `_domain/membership/constants/membership.constants.ts` | `features/membership-purchase/model/membership.constants.ts` |

### 3-8. features/search-branch/

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `src/hooks/useBranchLocationSelect.ts` | `features/search-branch/lib/useBranchLocationSelect.ts` |
| `src/hooks/useGeolocation.tsx` | `features/search-branch/lib/useGeolocation.tsx` |
| `src/hooks/useNaverMapBranchMarkers.tsx` | `features/search-branch/lib/useNaverMapBranchMarkers.tsx` |
| `src/hooks/useAddressFromCoords.ts` | `features/search-branch/lib/useAddressFromCoords.ts` |

### 3-9. features/questionnaire-submit/

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `src/hooks/useQuestionnaire.ts` | `features/questionnaire-submit/lib/useQuestionnaire.ts` |

---

## 4. 신규 생성 파일

| 파일 | 내용 |
|------|------|
| `src/entities/reservation/model/index.ts` | reservation.types, guide.types, menu.types 배럴 |
| `src/entities/user/model/index.ts` (수정) | User, user.types, auth.types 추가 |
| `src/features/reservation/ui/index.ts` | 모든 reservation UI 컴포넌트 배럴 |

---

## 5. Import 교체 규모

| 작업 | 변경 파일 수 |
|------|------------|
| STEP 3 import 경로 교체 (Python 스크립트) | 43개 |
| _domain 배럴 인덱스 업데이트 | 24개 |
| 이동된 파일 내부 상대 경로 수정 | 16개 |
| 추가 픽스 | 21개 |

---

## 6. 검증 결과

```
yarn tsc -b --noEmit   → 에러 0개
yarn test --run        → 14개 테스트 전원 통과
```

---

## 7. STEP 4 예정 작업 — widgets/

`_domain` 및 `src/components/`의 복합 UI 블록을 `widgets/` 레이어로 이동:

| 대상 | 이동 위치 |
|------|----------|
| `_domain/contents/components/molecules/BannerSwiper/` | `widgets/banner-swiper/ui/` |
| `_domain/contents/components/atoms/NotificationButton/` | `widgets/notification-button/ui/` |
| `_domain/core/components/organisms/HomeOverview/` | `widgets/home-overview/ui/` |
| `_domain/membership/components/organisms/MembershipCard/` | `widgets/membership-card/ui/` |
| `_domain/membership/components/molecules/MembershipChip/` | `widgets/membership-card/ui/` |
| `src/components/SwiperBrandCard.tsx` | `widgets/brand-swiper/ui/` |
| `src/components/NoticesSummarySlider.tsx` | `widgets/notices-slider/ui/` |
| `src/components/PriceSummary.tsx` | `widgets/price-summary/ui/` |
| `src/components/popup/StartupPopup.tsx` | `widgets/startup-popup/ui/` |
| `src/stores/popupStore.ts` | `widgets/startup-popup/model/` |
| `_shared/components/organisms/` (Header, Layout, DateBottomSheet, BottomFixedSection) | `widgets/{name}/ui/` |
