# FSD STEP 7 — `_shared` / `_domain` 완전 제거 요약

**작업일**: 2026-02-23

## 목표

기존 레거시 배럴 디렉토리(`_shared/`, `_domain/`)를 완전히 제거하고 FSD 레이어 구조에 맞는 경로로 모든 import를 교체한다.

---

## 작업 내용

### 1. 실제 파일 이동 (git mv)

| 원본 경로 | 이동된 경로 |
|-----------|------------|
| `_shared/components/atoms/Button/Button.tsx` | `shared/ui/button/DsButton.tsx` |
| `_shared/components/atoms/Collapse/Collapse.tsx` | `shared/ui/collapse/Collapse.tsx` |
| `_shared/components/atoms/Divider/Divider.tsx` | `shared/ui/divider/Divider.tsx` |
| `_shared/components/atoms/Loading/Loading.tsx` | `shared/ui/loading/Loading.tsx` |
| `_shared/components/atoms/RadioButton/RadioButton.tsx` | `shared/ui/radio/RadioButton.tsx` |
| `_shared/components/molecules/InputBox/InputBox.tsx` | `shared/ui/text-field/InputBox.tsx` |
| `_shared/components/molecules/RadioGroup/RadioGroup.tsx` | `shared/ui/radio/RadioGroup.tsx` |
| `_shared/components/molecules/RadioLabelCard/RadioLabelCard.tsx` | `shared/ui/radio/RadioLabelCard.tsx` |
| `_shared/components/molecules/SearchTextField/SearchTextField.tsx` | `shared/ui/text-field/SearchTextField.tsx` |
| `_shared/components/molecules/TextSwiper/TextSwiper.tsx` | `shared/ui/text-swiper/TextSwiper.tsx` |
| `_shared/components/molecules/TimePicker/TimePicker.tsx` | `shared/ui/time-picker/TimePicker.tsx` |
| `_shared/services/notification.services.ts` | `entities/notification/api/notification.services.ts` |

> `_shared/components/atoms/Button`은 MUI `Button`과 이름 충돌 → `DsButton.tsx`로 이동, export 이름은 `Button` 유지

---

### 2. Import 경로 일괄 교체

Python 스크립트 3회 실행으로 아래 패턴을 교체:

- `@/_shared` (배럴 루트) → 각 `@/shared/*`, `@/entities/*`, `@/widgets/*` 경로 (57개 파일)
- `@/_domain` (배럴 루트) → 각 FSD 경로 (31개 파일)
- 서브 경로(`@/_shared/utils`, `@/_shared/components`, `@/_domain/reservation/types` 등) → 정확한 FSD 경로 (14개 파일)

---

### 3. 디렉토리 삭제

```bash
rm -rf src/_shared src/_domain
```

---

### 4. tsc 에러 수동 수정 (최종 단계)

| 파일 | 수정 내용 |
|------|----------|
| `app/router/NewRouter.tsx` | `removeAccessToken` import 누락 → `@/entities/user/lib/token.utils` 추가 |
| `entities/notification/api/notification.services.ts` | `CustomUseQueryOptions`를 `response.types`에서 `util.types`로 이동 |
| `features/auth/lib/useProfileSetupSubmit.ts` | `useSigninEmailMutation`, `useSigninSocialMutation`, `saveAccessToken`, `SigninEmailBody` import 누락 추가 |
| `features/membership-purchase/lib/membership.business.ts` | `ReservationMembershipType`, `ReservationFormValues`를 `entities/reservation/model/reservation.types`에서 import |
| `features/reservation/lib/branch.services.ts` | `GET_BRANCH_DETAIL`, `GET_BRANCHES` import 누락 추가 |
| `features/reservation/lib/reservation.services.ts` | `GET_RESERVATION_CONSULT_COUNT`, `GET_RESERVATION_DETAIL` import 누락 추가 |
| `features/reservation/lib/schedule.services.ts` | `GET_SCHEDULES_DATE`, `GET_SCHEDULES_TIMES` import 누락 추가 |

---

## 결과

- `_shared/`, `_domain/` 디렉토리 완전 삭제
- `tsc --noEmit` 에러 **0개** 달성
- 모든 import가 FSD 레이어 구조를 준수하는 경로로 교체됨

---

## 최종 FSD 레이어 구조

```
src/
├── app/          # 앱 진입점, 라우터, 프로바이더
├── pages/        # 페이지 컴포넌트
├── widgets/      # 독립 UI 블록
├── features/     # 사용자 인터랙션 기능
├── entities/     # 비즈니스 엔티티
└── shared/       # 재사용 가능한 공통 코드
```
