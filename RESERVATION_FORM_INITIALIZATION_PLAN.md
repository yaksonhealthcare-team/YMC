# `ReservationFormPage.tsx` 진입 경로 및 초기 상태 설정 계획서

## 1. 진입 경로 식별 및 전달 정보

| 진입 경로 (파일)                                         | 전달 정보 방식       | 전달 정보 내용                                                                                                                                              |
| :------------------------------------------------------- | :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ReservationDetailPage.tsx` ('다시 예약하기')            | `location.state`     | `{ rebookingMembershipId: string, branchId: string }`                                                                                                       |
| `BranchDetail.tsx` (지점 상세 > 예약하기)                | `location.state`     | `{ isConsultation: boolean, branchId: string, selectedBranch?: Branch }` (회원권 없을 시 `isConsultation: true`, 있을 시 `isConsultation: false` 또는 생략) |
| `BrandDetailPage.tsx` (브랜드 상세 > 예약하기)           | `location.state`     | `{ brandCode: string }`                                                                                                                                     |
| `MembershipCard.tsx` (회원권 카드 > 예약)                | URL 파라미터         | `?membershipId={id}`                                                                                                                                        |
| `Home.tsx` (홈 > 예약 버튼)                              | 없음                 | 특별한 초기 상태 설정 없음                                                                                                                                  |
| `ReservationHistoryPage.tsx` (예약 내역 > 예약 버튼)     | 없음                 | 특별한 초기 상태 설정 없음                                                                                                                                  |
| `ReserveCardSection.tsx` (홈 예약 카드 섹션 > 예약 버튼) | 없음                 | 특별한 초기 상태 설정 없음                                                                                                                                  |
| 기타 (URL 직접 입력 등)                                  | URL 파라미터 or 없음 | `?membershipId={id}`, `?branchId={id}` 또는 아무 정보 없음                                                                                                  |

**참고:** `location.state`는 사용자가 페이지를 새로고침하면 유실될 수 있습니다.

## 2. 경로별 요구되는 초기 상태 (`formData`, `selectedBranch`)

| 진입 경로                                          | 요구되는 `formData.item` 초기값 | 요구되는 `formData.branch` 초기값    | 요구되는 `selectedBranch` 초기값                       | 비고                                                                                          |
| :------------------------------------------------- | :------------------------------ | :----------------------------------- | :----------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| `ReservationDetail` ('다시 예약하기')              | `state.rebookingMembershipId`   | `state.branchId`                     | 해당 `branchId`에 해당하는 `Branch` 객체               | THER-272                                                                                      |
| `BranchDetail` (회원권 없음)                       | `"상담 예약"`                   | `state.branchId`                     | `state.selectedBranch` 또는 해당 `branchId`의 `Branch` | `isConsultation: true` (THER-257)                                                             |
| `BranchDetail` (회원권 있음)                       | `undefined`                     | `state.branchId`                     | `state.selectedBranch` 또는 해당 `branchId`의 `Branch` | `isConsultation: false` 또는 생략                                                             |
| `BrandDetail`                                      | `undefined`                     | `undefined`                          | `undefined`                                            | `state.brandCode` 전달되나, 현재는 기본 빈 상태로 처리 (추후 필터링 구현 가능)                |
| `MembershipCard`                                   | `params.membershipId`           | `undefined` (단일지점 자동선택 가능) | `undefined` (단일지점 자동선택 가능)                   | 회원권 데이터 로드 후 단일 지정 지점 회원권이면 해당 지점 자동 선택 로직 필요 (THER-269 관련) |
| `Home`, `ReservationHistory`, `ReserveCardSection` | `undefined`                     | `undefined`                          | `undefined`                                            | 기본 빈 상태                                                                                  |
| URL 직접 입력 (`?membershipId=...`)                | `params.membershipId`           | `undefined` (단일지점 자동선택 가능) | `undefined` (단일지점 자동선택 가능)                   | `MembershipCard`와 유사 (THER-269 관련)                                                       |
| URL 직접 입력 (`?branchId=...`)                    | `undefined`                     | `params.branchId`                    | 해당 `branchId`에 해당하는 `Branch` 객체               | `item`은 사용자가 직접 선택하도록 `undefined` 유지.                                           |
| URL 직접 입력 (`?branchId=...&membershipId=...`)   | `params.membershipId`           | `undefined` (단일지점 자동선택 가능) | `undefined` (단일지점 자동선택 가능)                   | `membershipId` 우선 적용. URL의 `branchId`는 무시. (아래 우선순위 2번 규칙 따름)              |
| URL 직접 입력 (파라미터 없음)                      | `undefined`                     | `undefined`                          | `undefined`                                            | 기본 빈 상태                                                                                  |

## 3. 초기 상태 설정 우선순위

0.  **다시 예약하기 (`location.state.rebookingMembershipId` & `branchId`)**: 예약 상세에서 전달된 재예약 정보가 최우선입니다. (THER-272)
1.  **`location.state` (지점 상세 - `isConsultation` & `branchId`)**: 지점 상세 페이지에서 명시적으로 전달된 상태가 다음 우선순위입니다. (THER-257)
    1.5 **`location.state` (브랜드 상세 - `brandCode`)**: 브랜드 상세 페이지에서 전달된 상태 - 현재는 특별한 처리 없음. 필요시 우선순위 조정 및 로직 추가. (여기서 처리되면 이후 URL 파라미터 처리는 건너뜁니다.)
2.  **URL 파라미터 (`membershipId`)**: 위 정보가 없고 `membershipId` 파라미터가 있으면 해당 회원권을 선택합니다. (URL에 `branchId`가 함께 있어도 `membershipId` 우선 적용) (THER-269 관련)
3.  **URL 파라미터 (`branchId`)**: 위 정보가 없고 `branchId` 파라미터만 있으면 해당 지점을 선택합니다. (`item`은 `undefined`로 둡니다.)
4.  **기본값**: 위 모든 정보가 없으면 `formData`는 빈 상태(`item: undefined, branch: undefined`)로 시작합니다.

## 4. 통합 `useEffect` 로직 개요 (의사코드)

```typescript
useEffect(() => {
  let initialStateSet = false // 초기 상태 설정 완료 플래그
  let initialMembershipIdForSwiper: string | undefined = undefined // Swiper 초기 슬라이드용 ID

  // --- 0. 필요한 데이터 로딩 상태 확인 (예: 멤버십 목록) ---
  // if (isMembershipsLoading || isInitialBranchLoading) return; // 로딩 중이면 대기
  // if (membershipsError || initialBranchError) { /* 오류 처리, 알림 표시 등 */ return; } // 로딩 실패 시 처리

  // --- 1. location.state 처리 (최우선: 다시 예약하기 > 지점 상세 > 브랜드 상세) ---
  if (location.state) {
    const {
      rebookingMembershipId,
      isConsultation,
      branchId,
      brandCode,
      selectedBranch: branchFromState, // 지점 상세에서 Branch 객체를 직접 전달받을 수 있음
    } = location.state

    // 유효하지 않은 ID 검사 (rebookingMembershipId, branchId) - 필요시 추가
    // const isValidRebookingId = memberships?.some(m => m.id === rebookingMembershipId);
    // const isValidBranchId = /* 지점 목록 또는 API 검증 */;

    if (
      rebookingMembershipId &&
      branchId /* && isValidRebookingId && isValidBranchId */
    ) {
      // 0순위: 다시 예약하기 (THER-272)
      setFormData({
        item: rebookingMembershipId,
        branch: branchId,
        date: null,
        time: null,
        trainer: null, // 관련 필드 초기화
      })
      initialMembershipIdForSwiper = rebookingMembershipId
      // selectedBranch는 아래 3번 로직에서 설정됨 (branchId 기준)
      initialStateSet = true
    } else if (
      isConsultation !== undefined &&
      branchId /* && isValidBranchId */
    ) {
      // 1순위: 지점 상세 (THER-257)
      const itemValue = isConsultation ? "상담 예약" : undefined
      setFormData({
        item: itemValue,
        branch: branchId,
        date: null,
        time: null,
        trainer: null, // 관련 필드 초기화
      })
      // selectedBranch는 state에서 받거나 아래 3번 로직에서 설정
      if (branchFromState) {
        setSelectedBranch(branchFromState)
      }
      initialStateSet = true
    } else if (brandCode) {
      // 1.5순위: 브랜드 상세 -> 현재는 아무것도 안 함 (기본 상태로 진행)
      // 필요시 여기에 로직 추가 (예: brandCode 상태 저장하여 필터링에 활용)
      // initialStateSet = true; // 여기서 true로 설정하면 URL 파라미터 처리 건너뜀
    }
  }

  // --- 2. URL 파라미터 처리 (location.state로 처리 안 됐고, 멤버십 데이터 로드 완료 시) ---
  if (!initialStateSet && memberships && memberships.length > 0) {
    const params = new URLSearchParams(location.search)
    const membershipIdFromUrl = params.get("membershipId")
    const branchIdFromUrl = params.get("branchId")

    // URL 파라미터 유효성 검사
    const isValidMembershipUrl = memberships.some(
      (m) => m.id === membershipIdFromUrl,
    )
    // const isValidBranchUrl = /* 지점 목록 또는 API 검증 */;

    if (membershipIdFromUrl && isValidMembershipUrl) {
      // 2순위: membershipId 파라미터 처리 -> item 설정 (THER-269 관련)
      setFormData({
        item: membershipIdFromUrl,
        branch: undefined, // branch는 아래 단일 지점 로직 또는 사용자 선택
        date: null,
        time: null,
        trainer: null, // 관련 필드 초기화
      })
      initialMembershipIdForSwiper = membershipIdFromUrl

      // 단일 지점 자동 선택 로직 (구현 필요)
      // const membershipInfo = memberships.find(m => m.id === membershipIdFromUrl);
      // if (membershipInfo?.availableBranches?.length === 1) {
      //   const singleBranchId = membershipInfo.availableBranches[0].id;
      //   setFormData(prev => ({ ...prev, branch: singleBranchId }));
      //   // selectedBranch는 아래 3번 로직에서 설정
      // }
      initialStateSet = true
    } else if (
      branchIdFromUrl /* && isValidBranchUrl */ &&
      !membershipIdFromUrl /* membershipId가 우선순위 높음 */
    ) {
      // 3순위: branchId 파라미터 처리 -> branch 설정, item은 undefined
      setFormData({
        branch: branchIdFromUrl,
        item: undefined,
        date: null,
        time: null,
        trainer: null, // 관련 필드 초기화
      })
      // selectedBranch는 아래 3번 로직에서 설정됨
      initialStateSet = true
    } else if (membershipIdFromUrl || branchIdFromUrl) {
      // 유효하지 않은 ID가 URL 파라미터로 들어온 경우
      console.warn("Invalid ID provided in URL parameters.")
      // 사용자에게 알림 표시 로직 추가 가능
      // 기본 빈 상태로 진행 (initialStateSet = false 유지)
    }
  }

  // --- 3. 초기 selectedBranch 설정 (formData.branch가 설정되었고 selectedBranch가 아직 null일 때) ---
  // useBranch(formData.branch) 훅은 컴포넌트 최상단에서 항상 호출되어 initialBranchData 제공 가정
  if (formData.branch && !selectedBranch && initialBranchData) {
    // initialBranchData (BranchDetail 타입)를 Branch 타입으로 변환하여 setSelectedBranch 호출
    const branchObject: Branch = {
      /* ...필요한 필드 매핑... */
    }
    setSelectedBranch(branchObject)
  } else if (
    formData.branch &&
    !selectedBranch &&
    !initialBranchData &&
    !isInitialBranchLoading
  ) {
    // branchId는 있는데 해당 지점 정보를 불러오지 못했거나 없는 경우 (오류 상황)
    console.error(`Branch data not found for branchId: ${formData.branch}`)
    // 사용자에게 오류 알림, branch 선택 초기화 등 고려
    setFormData((prev) => ({ ...prev, branch: undefined }))
  }

  // --- 4. MembershipSwiper 초기 슬라이드 설정 ---
  // initialMembershipIdForSwiper 상태를 MembershipSwiper 컴포넌트의 prop으로 전달
  // 예: <MembershipSwiper initialItemId={initialMembershipIdForSwiper} items={membershipsData} ... />

  // --- 5. 컴포넌트 언마운트 시 정리 (필요하다면) ---
  // return () => { clearAllFormData(); }; // 예시: Zustand 스토어 초기화 함수 호출
}, [
  location.state, // state 객체 자체가 변경될 때 반응
  location.search, // URL 파라미터 변경 시 반응
  memberships, // 멤버십 목록 데이터
  isMembershipsLoading, // 멤버십 로딩 상태
  // membershipsError, // 멤버십 로딩 에러 상태
  initialBranchData, // formData.branch에 해당하는 초기 지점 데이터
  isInitialBranchLoading, // 초기 지점 데이터 로딩 상태
  // initialBranchError, // 초기 지점 데이터 에러 상태
  setFormData, // Zustand setter (보통 안정적이지만 명시적으로 포함)
  setSelectedBranch, // 상태 setter
  // clearAllFormData // 정리 함수 (필요 시)
])
```

## 추가 고려 사항

- **`useBranch` 훅:** `formData.branch` ID로 지점 상세 정보를 비동기적으로 가져와 `initialBranchData`를 제공하는 커스텀 훅 구현이 필요합니다. 이 훅은 로딩 및 에러 상태도 함께 반환해야 합니다.
- **단일 지점 자동 선택:** 회원권(`membershipId`)이 주어졌을 때, 해당 회원권이 **단일 지정 지점** 회원권인 경우, `formData.branch`와 `selectedBranch`를 자동으로 설정하는 로직 구현이 필요합니다. (의사 코드 내 주석 참고)
- **상태 초기화:** **매우 중요:** `setFormData` 호출 시, 업데이트하는 필드 외에 예약 단계와 관련된 다른 필드들(예: `date`, `time`, `trainer`)은 반드시 `null` 또는 적절한 기본값으로 초기화해야 합니다. 이전 예약 시도에서 남은 값이 영향을 주지 않도록 주의해야 합니다.
- **타입 매핑:** `BranchDetail` (API 응답 타입 추정)과 `Branch` (폼 상태 또는 UI 컴포넌트에서 사용하는 타입 추정) 간의 필요한 필드 매핑 로직을 구현해야 합니다.
- **`MembershipSwiper` 초기 슬라이드:** `MembershipSwiper` 컴포넌트는 전달받은 초기 아이템 ID (`initialItemId` prop 등)에 해당하는 슬라이드를 보여주는 기능 구현이 필요합니다. (현재 코드 확인 및 필요시 수정)
- **ID 유효성 검사:** `location.state`나 URL 파라미터로 받은 `branchId`, `membershipId`가 실제로 유효한지 확인하는 로직(예: 로드된 목록에 존재하는지 확인)을 추가하면 안정성을 높일 수 있습니다. 유효하지 않은 경우 사용자에게 알림을 표시하고 기본 상태로 처리하는 것이 좋습니다. (의사 코드 내 주석 참고)
- **데이터 로딩 실패 처리:** 멤버십 목록이나 초기 지점 정보 로딩에 실패했을 경우, 사용자에게 오류 메시지를 보여주고 예약 프로세스를 진행할 수 없음을 알리는 처리가 필요합니다.

## `ReservationFormPage.tsx` 초기 상태 설정 테스트 시나리오

**테스트 목표:** 다양한 진입 경로와 전달된 정보(location.state, URL 파라미터)에 따라 `formData` (`item`, `branch`)와 `selectedBranch` 상태, 그리고 `MembershipSwiper`의 초기 슬라이드가 계획된 우선순위와 값으로 올바르게 설정되는지 검증합니다. 또한, 관련 없는 필드(날짜, 시간, 트레이너)가 초기화되는지 확인합니다.

**공통 확인 사항:**

- 각 시나리오 테스트 시, `formData`의 `date`, `time`, `trainer` 필드가 `null` 또는 초기 기본값으로 설정되어 있는지 확인합니다.
- `selectedBranch` 상태가 설정될 때, 해당 지점 정보가 UI (예: 지점 선택 컴포넌트)에 올바르게 반영되는지 확인합니다.
- `formData.item`이 설정될 때 (`상담 예약` 제외), `MembershipSwiper`가 해당 아이템(회원권)을 초기 슬라이드로 보여주는지 확인합니다.

### 1. `location.state` 기반 초기화 테스트

|  #  | 테스트 시나리오 설명                       | 진입 경로/액션                                                                           | 전달 정보 (`location.state`)                                               | 예상 `formData.item` | 예상 `formData.branch` | 예상 `selectedBranch`             | 비고 & 추가 확인 사항                                        |
| :-: | :----------------------------------------- | :--------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- | :------------------- | :--------------------- | :-------------------------------- | :----------------------------------------------------------- |
| 1-1 | **다시 예약하기**                          | `ReservationDetailPage`에서 '다시 예약하기' 버튼 클릭                                    | `{ rebookingMembershipId: 'valid_mem_id', branchId: 'valid_branch_id' }`   | `'valid_mem_id'`     | `'valid_branch_id'`    | `valid_branch_id`의 `Branch` 객체 | THER-272. Swiper 초기 슬라이드 확인.                         |
| 1-2 | **지점 상세 (상담 예약)**                  | `BranchDetail` (회원권 없음)에서 '예약하기' 버튼 클릭                                    | `{ isConsultation: true, branchId: 'valid_branch_id' }`                    | `"상담 예약"`        | `'valid_branch_id'`    | `valid_branch_id`의 `Branch` 객체 | THER-257. `item`이 문자열 "상담 예약"인지 확인.              |
| 1-3 | **지점 상세 (회원권 있음)**                | `BranchDetail` (회원권 있음)에서 '예약하기' 버튼 클릭                                    | `{ isConsultation: false, branchId: 'valid_branch_id' }`                   | `undefined`          | `'valid_branch_id'`    | `valid_branch_id`의 `Branch` 객체 | `item`은 사용자가 선택해야 함.                               |
| 1-4 | **지점 상세 (`selectedBranch` 포함)**      | `BranchDetail`에서 `selectedBranch` 객체 포함하여 '예약하기' 클릭 (구현 시)              | `{ ..., branchId: 'valid_branch_id', selectedBranch: branchObject }`       | (1-2 또는 1-3 따름)  | `'valid_branch_id'`    | `branchObject`                    | `useBranch` 호출 없이 state의 객체로 바로 설정되는지 확인.   |
| 1-5 | **브랜드 상세**                            | `BrandDetailPage`에서 '예약하기' 버튼 클릭                                               | `{ brandCode: 'valid_brand_code' }`                                        | `undefined`          | `undefined`            | `null`                            | 현재는 특별한 동작 없음 (기본 상태).                         |
| 1-6 | **유효하지 않은 ID (state)** - `branchId`  | `BranchDetail` 등에서 **존재하지 않는** `branchId` 포함하여 진입 시도                    | `{ isConsultation: true, branchId: 'invalid_branch_id' }`                  | `"상담 예약"`?       | `undefined`?           | `null`?                           | 유효성 검사 로직에 따라 동작 정의 필요 (예: 알림 후 기본값). |
| 1-7 | **유효하지 않은 ID (state)** - `rebooking` | `ReservationDetailPage`에서 **존재하지 않는** `rebookingMembershipId` 포함하여 진입 시도 | `{ rebookingMembershipId: 'invalid_mem_id', branchId: 'valid_branch_id' }` | `undefined`?         | `'valid_branch_id'`?   | `null`?                           | 유효성 검사 로직에 따라 동작 정의 필요 (예: 알림 후 기본값). |

### 2. URL 파라미터 기반 초기화 테스트

|  #  | 테스트 시나리오 설명                        | 진입 경로/액션                                                               | 전달 정보 (URL)                      | 예상 `formData.item`     | 예상 `formData.branch`    | 예상 `selectedBranch`             | 비고 & 추가 확인 사항                                            |
| :-: | :------------------------------------------ | :--------------------------------------------------------------------------- | :----------------------------------- | :----------------------- | :------------------------ | :-------------------------------- | :--------------------------------------------------------------- |
| 2-1 | **`membershipId` (단일 지점)**              | `?membershipId=single_branch_mem_id` 로 직접 접근 또는 `MembershipCard` 클릭 | `?membershipId=single_branch_mem_id` | `'single_branch_mem_id'` | 해당 단일 지점 `branchId` | 해당 단일 지점 `Branch` 객체      | **단일 지점 자동 선택 로직** 확인. Swiper 초기 슬라이드 확인.    |
| 2-2 | **`membershipId` (다중 지점)**              | `?membershipId=multi_branch_mem_id` 로 직접 접근 또는 `MembershipCard` 클릭  | `?membershipId=multi_branch_mem_id`  | `'multi_branch_mem_id'`  | `undefined`               | `null`                            | `branch`는 사용자가 선택해야 함. Swiper 초기 슬라이드 확인.      |
| 2-3 | **`branchId`**                              | `?branchId=valid_branch_id` 로 직접 접근                                     | `?branchId=valid_branch_id`          | `undefined`              | `'valid_branch_id'`       | `valid_branch_id`의 `Branch` 객체 | `item`은 사용자가 선택해야 함.                                   |
| 2-4 | **`membershipId` + `branchId` (조합)**      | `?membershipId=valid_mem_id&branchId=another_branch_id` 로 직접 접근         | `?membershipId=...&branchId=...`     | `'valid_mem_id'`         | (2-1 또는 2-2 따름)       | (2-1 또는 2-2 따름)               | `membershipId` 우선 적용 확인. URL의 `branchId`는 무시되어야 함. |
| 2-5 | **유효하지 않은 ID (URL)** - `membershipId` | `?membershipId=invalid_mem_id` 로 직접 접근                                  | `?membershipId=invalid_mem_id`       | `undefined`              | `undefined`               | `null`                            | 유효성 검사 후 기본 상태 및 알림 확인.                           |
| 2-6 | **유효하지 않은 ID (URL)** - `branchId`     | `?branchId=invalid_branch_id` 로 직접 접근                                   | `?branchId=invalid_branch_id`        | `undefined`              | `undefined`               | `null`                            | 유효성 검사 후 기본 상태 및 알림 확인.                           |

### 3. 우선순위 및 기본 상태 테스트

|  #  | 테스트 시나리오 설명          | 진입 경로/액션                                                                                                  | 전달 정보 (`state` + URL)                                                                       | 예상 `formData.item` | 예상 `formData.branch` | 예상 `selectedBranch`             | 비고 & 추가 확인 사항                                          |
| :-: | :---------------------------- | :-------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- | :------------------- | :--------------------- | :-------------------------------- | :------------------------------------------------------------- |
| 3-1 | **State 우선 (State vs URL)** | `BranchDetail`에서 예약하기 클릭 (`state` 전달) + URL에 `membershipId` 파라미터 존재 시                         | `state`: `{isConsultation: true, branchId: 'state_branch_id'}`, URL: `?membershipId=url_mem_id` | `"상담 예약"`        | `'state_branch_id'`    | `state_branch_id`의 `Branch` 객체 | `location.state` 정보가 URL 파라미터보다 우선 처리되는지 확인. |
| 3-2 | **기본 상태 (정보 없음)**     | `Home`, `ReservationHistory` 등에서 '예약' 버튼 클릭 또는 `/reservation/form` 으로 직접 접근 (state/param 없음) | 없음                                                                                            | `undefined`          | `undefined`            | `null`                            | 모든 초기화 조건 없이 기본 빈 상태로 시작하는지 확인.          |

### 4. 데이터 로딩 관련 테스트

|  #  | 테스트 시나리오 설명      | 진입 경로/액션                                            | 조건                                              | 예상 결과                                                     |
| :-: | :------------------------ | :-------------------------------------------------------- | :------------------------------------------------ | :------------------------------------------------------------ |
| 4-1 | **멤버십 목록 로딩 중**   | (모든 경로) 예약 폼 진입 시                               | 멤버십 목록 API 응답이 지연되는 상황              | 초기 상태 설정 로직이 멤버십 로딩 완료 후 실행됨을 확인.      |
| 4-2 | **멤버십 목록 로딩 실패** | (모든 경로) 예약 폼 진입 시                               | 멤버십 목록 API 호출 실패 (네트워크 오류, 500 등) | 사용자에게 오류 알림 표시, 예약 폼은 기본 빈 상태 유지 확인.  |
| 4-3 | **`useBranch` 로딩 중**   | `state`나 URL로 `branchId`가 전달되어 `useBranch` 호출 시 | `useBranch` 훅 내부 API 응답 지연                 | `selectedBranch` 설정이 `useBranch` 로딩 완료 후 실행됨 확인. |
| 4-4 | **`useBranch` 로딩 실패** | `state`나 URL로 `branchId`가 전달되어 `useBranch` 호출 시 | `useBranch` 훅 내부 API 호출 실패                 | 사용자에게 오류 알림 표시, `formData.branch` 초기화 확인.     |

---

## `ReservationFormPage.tsx` 초기 상태 설정 구현 실행 계획

**목표:** `RESERVATION_FORM_INITIALIZATION_PLAN.md`에 정의된 대로, 다양한 진입 경로와 전달 정보에 따라 예약 폼의 초기 상태(`formData`, `selectedBranch`) 및 관련 UI(`MembershipSwiper` 등)를 올바르게 설정하는 로직을 구현합니다.

**단계별 계획:**

1.  **사전 준비: 상태 및 타입 정의 (State & Types Setup)**

    - `Zustand` 스토어 또는 `useState`를 사용하여 예약 폼의 상태(`formData`, `selectedBranch`, `initialMembershipIdForSwiper` 등)를 관리할 변수를 정의하거나 확인합니다.
    - `formData` 인터페이스에 `item` (string | undefined), `branch` (string | undefined), `date`, `time`, `trainer` 필드가 있는지 확인하고, 필요시 업데이트합니다.
    - `Branch` (UI/상태용) 및 `BranchDetail` (API 응답용 추정) 타입이 정의되어 있는지 확인하고, 필요시 생성 또는 수정합니다.

2.  **`useBranch` 훅 구현 (Implement `useBranch` Hook)**

    - `src/hooks/api/branch/` 디렉토리에 `useBranch.ts` (또는 유사한 이름) 파일을 생성합니다. (이미 존재하면 수정)
    - `branchId`를 인자로 받아 해당 지점의 상세 정보 (`BranchDetail` 타입)를 조회하는 Tanstack Query 훅 (`useQuery`)을 구현합니다.
    - 훅은 `data` (지점 상세 정보), `isLoading`, `error` 상태를 반환하도록 합니다.
    - `branchId`가 `undefined`거나 유효하지 않은 값일 경우 쿼리가 실행되지 않도록 `enabled` 옵션을 설정합니다.

3.  **핵심 `useEffect` 로직 구현 (Implement Core `useEffect` Logic)**

    - `ReservationFormPage.tsx` 컴포넌트 내에 `useEffect` 훅을 추가합니다.
    - 계획서의 의사 코드에 명시된 의존성 배열(`location.state`, `location.search`, 멤버십 데이터 관련 상태, `useBranch` 훅 관련 상태, 상태 setter 함수 등)을 정확하게 설정합니다.
    - `react-router-dom`의 `useLocation` 훅을 사용하여 `location.state` 및 `location.search`에 접근합니다.
    - `URLSearchParams`를 사용하여 `location.search`에서 `membershipId`, `branchId` 파라미터를 추출합니다.
    - 계획서의 **우선순위(0~4)**에 따라 조건문을 작성하여 `location.state`와 URL 파라미터를 처리합니다.
      - 각 조건 분기 내에서 `setFormData`를 호출하여 `item`과 `branch`를 설정하고, **동시에 `date`, `time`, `trainer` 필드를 `null` 또는 기본값으로 초기화**합니다.
      - `setInitialMembershipIdForSwiper` (또는 유사 상태 setter)를 호출하여 Swiper 초기 슬라이드 ID를 설정합니다.
    - 필요한 데이터(멤버십 목록, `useBranch` 결과)의 로딩 상태 및 에러 상태를 확인하고, 로딩 중이거나 에러 발생 시 로직 실행을 중단하거나 적절히 처리하는 방어 코드를 추가합니다. (예: `isLoading`이면 `return;`, `error`이면 콘솔 출력 및 알림)

4.  **`selectedBranch` 설정 로직 구현 (Implement `selectedBranch` Setting Logic)**

    - `useEffect` 내부 또는 별도의 `useEffect`에서 `formData.branch` 값이 설정되었는지 확인합니다.
    - `useBranch(formData.branch)` 훅을 호출하여 해당 지점 정보를 가져옵니다. (페이지 최상단에서 호출)
    - `location.state`에 `selectedBranch` 객체가 직접 전달된 경우, 해당 객체를 사용하여 `setSelectedBranch`를 우선 호출합니다. (1-4 시나리오)
    - `state`에 `selectedBranch`가 없고 `useBranch` 훅이 데이터를 성공적으로 로드한 경우(`initialBranchData` 사용 가능), `BranchDetail` 타입을 `Branch` 타입으로 **매핑**하여 `setSelectedBranch`를 호출합니다.
    - `useBranch` 훅 로딩 실패 시 콘솔 에러 출력 및 관련 상태 초기화 (예: `formData.branch`를 `undefined`로) 로직을 추가합니다.

5.  **단일 지점 자동 선택 로직 구현 (Implement Single Branch Auto-Selection)**

    - `useEffect` 내 URL 파라미터 처리 로직 중 `membershipId`를 처리하는 부분에서, 해당 `membershipId`에 해당하는 멤버십 정보를 가져옵니다. (로드된 `memberships` 목록 사용)
    - 멤버십 정보에 연결된 이용 가능 지점 (`availableBranches` 등)이 1개인지 확인합니다.
    - 1개일 경우, 해당 지점의 `branchId`를 `setFormData`를 사용하여 `branch` 필드에 설정합니다. (`item` 설정 후 추가로 호출)

6.  **`MembershipSwiper` 연동 (Integrate with `MembershipSwiper`)**

    - `ReservationFormPage.tsx`의 JSX 부분에서 `MembershipSwiper` 컴포넌트를 렌더링할 때, `initialItemId` (또는 유사한 prop 이름) prop으로 `initialMembershipIdForSwiper` 상태 값을 전달합니다.
    - `MembershipSwiper` 컴포넌트 내부 로직을 확인하여, `initialItemId` prop을 받았을 때 해당 ID를 가진 슬라이드로 이동하는 로직이 있는지 확인하고, 없다면 구현합니다. (예: Swiper API의 `slideTo` 또는 `initialSlide` 옵션 활용)

7.  **ID 유효성 검사 (선택 사항) (Implement ID Validation - Optional)**

    - 안정성 향상을 위해, `location.state`나 URL 파라미터로 받은 `membershipId` 또는 `branchId`가 로드된 데이터 목록(`memberships` 등)에 실제로 존재하는지 확인하는 로직을 `useEffect` 내 적절한 위치에 추가할 수 있습니다.
    - 유효하지 않은 ID 감지 시, 콘솔 경고 출력 및 사용자 알림 표시, 그리고 기본 상태로 초기화하는 로직을 구현합니다.

8.  **테스트 및 검증 (Testing & Verification)**

    - `RESERVATION_FORM_INITIALIZATION_PLAN.md`에 작성된 **테스트 시나리오**를 기반으로 실제 동작을 테스트합니다.
    - 다양한 진입 경로, 유효/무효 ID, 데이터 로딩 성공/실패 등 엣지 케이스를 포함하여 테스트합니다.
    - 브라우저 개발자 도구를 사용하여 상태 변화, 콘솔 로그, 네트워크 요청/응답을 확인합니다.

9.  **코드 리뷰 및 리팩토링 (Code Review & Refactoring)**
    - 구현된 코드가 명확하고, 효율적이며, 설정된 코딩 컨벤션을 준수하는지 검토합니다.
    - 불필요한 코드나 중복 로직이 있다면 제거합니다.
    - 주석이 필요한 부분을 추가하고, 변수 및 함수 이름을 명확하게 작성합니다.

---
