# FSD STEP 2 — entities/ 레이어 구성 작업 요약

> 작업일: 2026-02-23
> 브랜치: `chore/fsd`

---

## 1. 작업 목표

`src/entities/` 레이어 구성: 도메인별 타입(model), API 호출(api), 데이터 변환(lib)을 entity 단위로 응집시킨다.

FSD 의존성 규칙에 따라 `entities`는 `shared` 레이어만 참조 가능.

---

## 2. entities 디렉토리 구조

13개 entity:

```
src/entities/
├── banner/     { api, lib, model, ui }
├── branch/     { api, lib, model, ui }
├── brand/      { api, lib, model, ui }
├── cart/       { api, lib, model, ui }
├── content/    { api, lib, model, ui }
├── membership/ { api,      model, ui }
├── notification/{ api, lib, model, ui }
├── payment/    { api, lib, model, ui }
├── point/      { api, lib, model, ui }
├── reservation/{ api,      model, ui }
├── review/     { api, lib, model, ui }
├── schedule/   { api,      model, ui }
└── user/       { api, lib, model, ui }
```

---

## 3. 이동한 파일 목록

### 3-1. Types (model/)

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `src/types/User.ts` | `src/entities/user/model/User.ts` |
| `src/types/Branch.ts` | `src/entities/branch/model/Branch.ts` |
| `src/types/Membership.ts` | `src/entities/membership/model/Membership.ts` |
| `src/types/MemberHistory.ts` | `src/entities/membership/model/MemberHistory.ts` |
| `src/types/MembershipProgram.ts` | `src/entities/membership/model/MembershipProgram.ts` |
| `src/types/Reservation.ts` | `src/entities/reservation/model/Reservation.ts` |
| `src/types/Schedule.ts` | `src/entities/schedule/model/Schedule.ts` |
| `src/types/Payment.ts` | `src/entities/payment/model/Payment.ts` |
| `src/types/Review.ts` | `src/entities/review/model/Review.ts` |
| `src/types/Notification.ts` | `src/entities/notification/model/Notification.ts` |
| `src/types/Point.ts` | `src/entities/point/model/Point.ts` |
| `src/types/Cart.ts` | `src/entities/cart/model/Cart.ts` |
| `src/types/Banner.ts` | `src/entities/banner/model/Banner.ts` |
| `src/types/Content.ts` | `src/entities/content/model/Content.ts` |
| `src/types/Event.ts` | `src/entities/content/model/Event.ts` |
| `src/types/Brand.ts` | `src/entities/brand/model/Brand.ts` |

> `src/types/Questionnaire.ts`는 특정 entity에 귀속되지 않아 `src/types/`에 유지.

### 3-2. Mappers (lib/)

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `src/mappers/BannerMapper.ts` | `src/entities/banner/lib/BannerMapper.ts` |
| `src/mappers/BranchMapper.ts` | `src/entities/branch/lib/BranchMapper.ts` |
| `src/mappers/BrandMapper.ts` | `src/entities/brand/lib/BrandMapper.ts` |
| `src/mappers/CartMapper.ts` | `src/entities/cart/lib/CartMapper.ts` |
| `src/mappers/ContentMapper.ts` | `src/entities/content/lib/ContentMapper.ts` |
| `src/mappers/NotificationMapper.ts` | `src/entities/notification/lib/NotificationMapper.ts` |
| `src/mappers/PaymentMapper.ts` | `src/entities/payment/lib/PaymentMapper.ts` |
| `src/mappers/PointMapper.ts` | `src/entities/point/lib/PointMapper.ts` |
| `src/mappers/ReviewMapper.ts` | `src/entities/review/lib/ReviewMapper.ts` |
| `src/mappers/UserMapper.ts` | `src/entities/user/lib/UserMapper.ts` |

### 3-3. APIs (api/)

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `src/apis/auth.api.ts` | `src/entities/user/api/auth.api.ts` |
| `src/apis/user.api.ts` | `src/entities/user/api/user.api.ts` |
| `src/apis/pass.api.ts` | `src/entities/user/api/pass.api.ts` |
| `src/apis/questionnaire.api.ts` | `src/entities/user/api/questionnaire.api.ts` |
| `src/apis/banner.api.ts` | `src/entities/banner/api/banner.api.ts` |
| `src/apis/branch.api.ts` | `src/entities/branch/api/branch.api.ts` |
| `src/apis/brands.api.ts` | `src/entities/brand/api/brands.api.ts` |
| `src/apis/cart.api.ts` | `src/entities/cart/api/cart.api.ts` |
| `src/apis/contents.api.ts` | `src/entities/content/api/contents.api.ts` |
| `src/apis/membership.api.ts` | `src/entities/membership/api/membership.api.ts` |
| `src/apis/notifications.api.ts` | `src/entities/notification/api/notifications.api.ts` |
| `src/apis/payments.api.ts` | `src/entities/payment/api/payments.api.ts` |
| `src/apis/points.api.ts` | `src/entities/point/api/points.api.ts` |
| `src/apis/reservation.api.ts` | `src/entities/reservation/api/reservation.api.ts` |
| `src/apis/guidemessages.api.ts` | `src/entities/reservation/api/guidemessages.api.ts` |
| `src/apis/review.api.ts` | `src/entities/review/api/review.api.ts` |
| `src/apis/schedule.api.ts` | `src/entities/schedule/api/schedule.api.ts` |
| `src/apis/address.api.ts` | `src/shared/api/address.api.ts` _(도메인 무관)_ |
| `src/apis/image.api.ts` | `src/shared/api/image.api.ts` _(도메인 무관)_ |
| `src/apis/decrypt-result.api.ts` | `src/shared/api/decrypt-result.api.ts` _(도메인 무관)_ |

### 3-4. Queries (api/)

| 원본 위치 | 이동 위치 |
|-----------|-----------|
| `src/queries/useBannerQueries.tsx` | `src/entities/banner/api/useBannerQueries.tsx` |
| `src/queries/useBranchQueries.tsx` | `src/entities/branch/api/useBranchQueries.tsx` |
| `src/queries/useBrandQueries.tsx` | `src/entities/brand/api/useBrandQueries.tsx` |
| `src/queries/useCartQueries.tsx` | `src/entities/cart/api/useCartQueries.tsx` |
| `src/queries/useContentQueries.tsx` | `src/entities/content/api/useContentQueries.tsx` |
| `src/queries/useEventQueries.ts` | `src/entities/content/api/useEventQueries.ts` |
| `src/queries/useMembershipQueries.tsx` | `src/entities/membership/api/useMembershipQueries.tsx` |
| `src/queries/useNotificationQueries.tsx` | `src/entities/notification/api/useNotificationQueries.tsx` |
| `src/queries/usePaymentQueries.tsx` | `src/entities/payment/api/usePaymentQueries.tsx` |
| `src/queries/usePointQueries.tsx` | `src/entities/point/api/usePointQueries.tsx` |
| `src/queries/useQuestionnaireQueries.tsx` | `src/entities/user/api/useQuestionnaireQueries.tsx` |
| `src/queries/useReservationQueries.ts` | `src/entities/reservation/api/useReservationQueries.ts` |
| `src/queries/useReviewQueries.tsx` | `src/entities/review/api/useReviewQueries.tsx` |
| `src/queries/useScheduleQueries.tsx` | `src/entities/schedule/api/useScheduleQueries.tsx` |
| `src/queries/useAddressQueries.ts` | `src/shared/api/useAddressQueries.ts` _(도메인 무관)_ |

---

## 4. Import 경로 일괄 교체

Python 스크립트로 총 **147개 파일**의 import 경로를 자동 교체:

| 변경 전 패턴 | 변경 후 패턴 |
|-------------|------------|
| `@/types/{Type}` | `@/entities/{entity}/model/{Type}` |
| `@/apis/{entity}.api` | `@/entities/{entity}/api/{entity}.api` |
| `@/apis/{util}.api` | `@/shared/api/{util}.api` |
| `@/queries/use{Entity}Queries` | `@/entities/{entity}/api/use{Entity}Queries` |
| `@/mappers/{Entity}Mapper` | `@/entities/{entity}/lib/{Entity}Mapper` |

이동된 파일 내부의 상대 경로(`'../apis/xxx'`, `'../types/Xxx'`)도 절대 경로로 변환.

---

## 5. 삭제된 디렉토리

모든 파일 이동 후 아래 디렉토리가 비어 제거됨:

- `src/apis/` (20개 파일 → entities/api, shared/api)
- `src/mappers/` (10개 파일 → entities/lib)
- `src/queries/` (15개 파일 → entities/api, shared/api)
- `src/types/` (16개 파일 → entities/model) ← `Questionnaire.ts`만 잔류

---

## 6. 검증 결과

```
yarn tsc -b --noEmit   → 에러 0개
yarn test --run        → 14개 테스트 전원 통과
```

---

## 7. STEP 3 예정 작업

`_domain/` 내부 코드를 FSD `features/` 또는 `entities/` 하위로 재배치:

- `_domain/auth/` → 추후 결정 (app 레이어 관련)
- `_domain/membership/` services/types → `entities/membership/`
- `_domain/reservation/` services/types → `entities/reservation/`
- `_domain/contents/` components → `features/` 또는 `widgets/`
- 컴포넌트 cards (BranchCard, PaymentCard 등 `src/components/`) → entity `ui/` 또는 `features/`
