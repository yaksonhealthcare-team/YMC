# FSD STEP 4 — widgets/ 레이어 구성 작업 요약

> 작업일: 2026-02-23
> 브랜치: `chore/fsd`

---

## 1. 작업 목표

`src/widgets/` 레이어 구성: 독립적으로 사용 가능한 복합 UI 블록을 widget 단위로 응집.

---

## 2. widgets 디렉토리 구조

```
src/widgets/
├── banner-swiper/ui/         # BannerSwiper 컴포넌트
├── bottom-fixed-section/ui/  # BottomFixedSection 컴포넌트
├── brand-swiper/ui/          # SwiperBrandCard 컴포넌트
├── date-bottom-sheet/ui/     # DateBottomSheet 컴포넌트 + utils
├── header/ui/                # Header 컴포넌트
├── home-overview/ui/         # HomeOverview 컴포넌트
├── layout/{ui,model}/        # Layout 컴포넌트 + LayoutContext
├── membership-card/ui/       # MembershipCard + MembershipChip
├── notification-button/ui/   # NotificationButton 컴포넌트
├── notices-slider/ui/        # NoticesSummarySlider 컴포넌트
├── price-summary/ui/         # PriceSummary 컴포넌트
└── startup-popup/{ui,model}/ # StartupPopup + popupStore
```

---

## 3. 이동한 파일 목록

### 3-1. _shared/organisms → widgets

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `_shared/components/organisms/Header/Header.tsx` | `widgets/header/ui/Header.tsx` |
| `_shared/components/organisms/Header/index.ts` | `widgets/header/ui/index.ts` |
| `_shared/components/organisms/Layout/Layout.tsx` | `widgets/layout/ui/Layout.tsx` |
| `_shared/components/organisms/Layout/Layout.types.ts` | `widgets/layout/ui/Layout.types.ts` |
| `_shared/components/organisms/Layout/index.ts` | `widgets/layout/ui/index.ts` |
| `_shared/components/organisms/BottomFixedSection/BottomFixedSection.tsx` | `widgets/bottom-fixed-section/ui/BottomFixedSection.tsx` |
| `_shared/components/organisms/BottomFixedSection/BottomFixedSection.types.ts` | `widgets/bottom-fixed-section/ui/BottomFixedSection.types.ts` |
| `_shared/components/organisms/BottomFixedSection/index.ts` | `widgets/bottom-fixed-section/ui/index.ts` |
| `_shared/components/organisms/DateBottomSheet/DateBottomSheet.tsx` | `widgets/date-bottom-sheet/ui/DateBottomSheet.tsx` |
| `_shared/components/organisms/DateBottomSheet/DateBottomSheet.types.ts` | `widgets/date-bottom-sheet/ui/DateBottomSheet.types.ts` |
| `_shared/components/organisms/DateBottomSheet/DateBottomSheet.utils.ts` | `widgets/date-bottom-sheet/ui/DateBottomSheet.utils.ts` |
| `_shared/components/organisms/DateBottomSheet/DateBottomSheet.utils.test.ts` | `widgets/date-bottom-sheet/ui/DateBottomSheet.utils.test.ts` |
| `_shared/components/organisms/DateBottomSheet/index.ts` | `widgets/date-bottom-sheet/ui/index.ts` |

### 3-2. _domain components → widgets

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `_domain/contents/components/molecules/BannerSwiper/BannerSwiper.tsx` | `widgets/banner-swiper/ui/BannerSwiper.tsx` |
| `_domain/contents/components/molecules/BannerSwiper/BannerSwiper.types.ts` | `widgets/banner-swiper/ui/BannerSwiper.types.ts` |
| `_domain/contents/components/molecules/BannerSwiper/index.ts` | `widgets/banner-swiper/ui/index.ts` |
| `_domain/contents/components/atoms/NotificationButton/NotificationButton.tsx` | `widgets/notification-button/ui/NotificationButton.tsx` |
| `_domain/contents/components/atoms/NotificationButton/NotificationButton.types.ts` | `widgets/notification-button/ui/NotificationButton.types.ts` |
| `_domain/contents/components/atoms/NotificationButton/index.ts` | `widgets/notification-button/ui/index.ts` |
| `_domain/core/components/organisms/HomeOverview/HomeOverview.tsx` | `widgets/home-overview/ui/HomeOverview.tsx` |
| `_domain/core/components/organisms/HomeOverview/HomeOverview.types.ts` | `widgets/home-overview/ui/HomeOverview.types.ts` |
| `_domain/core/components/organisms/HomeOverview/index.ts` | `widgets/home-overview/ui/index.ts` |
| `_domain/membership/components/organisms/MembershipCard/MembershipCard.tsx` | `widgets/membership-card/ui/MembershipCard.tsx` |
| `_domain/membership/components/organisms/MembershipCard/MembershipCard.types.ts` | `widgets/membership-card/ui/MembershipCard.types.ts` |
| `_domain/membership/components/organisms/MembershipCard/index.ts` | `widgets/membership-card/ui/index.ts` |
| `_domain/membership/components/molecules/MembershipChip.tsx` | `widgets/membership-card/ui/MembershipChip.tsx` |
| `_domain/membership/components/molecules/MembershipChip.types.ts` | `widgets/membership-card/ui/MembershipChip.types.ts` |

### 3-3. src/components, src/stores → widgets

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `src/components/SwiperBrandCard.tsx` | `widgets/brand-swiper/ui/SwiperBrandCard.tsx` |
| `src/components/NoticesSummarySlider.tsx` | `widgets/notices-slider/ui/NoticesSummarySlider.tsx` |
| `src/components/PriceSummary.tsx` | `widgets/price-summary/ui/PriceSummary.tsx` |
| `src/components/popup/StartupPopup.tsx` | `widgets/startup-popup/ui/StartupPopup.tsx` |
| `src/stores/popupStore.ts` | `widgets/startup-popup/model/popupStore.ts` |
| `src/stores/LayoutContext.tsx` | `widgets/layout/model/LayoutContext.tsx` |

---

## 4. Import 교체 규모

| 작업 | 변경 파일 수 |
|------|------------|
| STEP 4 import 경로 교체 (Python 스크립트) | 77개 |
| _shared/_domain 배럴 인덱스 업데이트 | 9개 |
| widgets 내부 상대 경로 수정 | 5개 |

---

## 5. 검증 결과

```
yarn tsc -b --noEmit   → 에러 0개
yarn test --run        → 14개 테스트 전원 통과
```

---

## 6. STEP 5 예정 작업 — pages/ + app/

### pages/
- `_fragments/` → `ui/` 디렉토리 이름 변경 (모든 페이지)
- `_shared/router/` 하위 페이지들을 `pages/`로 통합

### app/
- `App.tsx`, `main.tsx` → `app/`
- `Initialization.tsx` → `app/providers/`
- `pages/NewRouter.tsx` → `app/router/`
- `pages/newConfig.tsx` → `app/router/config.tsx`
- `assets/css/` → `app/styles/`
