import { useLayout } from "contexts/LayoutContext"
import { useEffect, useState, useCallback, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { RadioCard } from "@components/RadioCard"
import { AdditionalManagement } from "types/Membership"
import { RadioGroup } from "@mui/material"
import { Button } from "@components/Button"
import { useOverlay } from "contexts/ModalContext"
import DateAndTimeBottomSheet from "./_fragments/DateAndTimeBottomSheet"
import { Dayjs } from "dayjs"
import dayjs from "dayjs"
import FixedButtonContainer from "@components/FixedButtonContainer"
import { TimeSlot } from "../../types/Schedule.ts"
import { useMembershipOptionsStore } from "../../hooks/useMembershipOptions"
import LoadingIndicator from "@components/LoadingIndicator.tsx"
import { useCreateReservationMutation } from "../../queries/useReservationQueries"
import { MembershipSwiper } from "@components/MembershipSwiper"
// import { AdditionalServiceCard } from "@components/AdditionalServiceCard"
import { ReservationFormSection } from "./_fragments/ReservationFormSection"
// import { ReservationSummarySection } from "./_fragments/ReservationSummarySection"
import { useErrorHandler } from "hooks/useErrorHandler"
import { formatDateForAPI } from "utils/date"
import { toNumber } from "utils/number"
import { createAdditionalManagementOrder } from "apis/order.api"
import { useUserMemberships } from "queries/useMembershipQueries"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import { getConsultationCount } from "../../apis/reservation.api"
import { useQuery } from "@tanstack/react-query"

interface FormDataType {
  item: undefined | string
  branch: undefined | string
  date: null | Dayjs
  timeSlot: null | TimeSlot
  request: string
  additionalServices: AdditionalManagement[]
  membershipId?: string
}

const BRAND_CODE = "001" // 약손명가

const ReservationFormPage = () => {
  const { openBottomSheet, closeOverlay, openModal } = useOverlay()
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedBranch, clear, setSelectedBranch } =
    useMembershipOptionsStore()
  const { handleError } = useErrorHandler()

  // State
  const [data, setData] = useState<FormDataType>({
    item: location.state?.fromReservation?.item || "",
    branch: location.state?.fromReservation?.branch || "",
    date: location.state?.fromReservation?.date
      ? dayjs(location.state.fromReservation.date)
      : null,
    timeSlot: location.state?.fromReservation?.timeSlot || null,
    request: location.state?.fromReservation?.request || "",
    additionalServices:
      location.state?.fromReservation?.additionalServices || [],
    membershipId: location.state?.fromReservation?.membershipId,
  })

  const [allMemberships, setAllMemberships] = useState<
    typeof filteredMemberships
  >([])

  // Queries
  const { data: consultationCount } = useQuery({
    queryKey: ["consultation-count"],
    queryFn: getConsultationCount,
  })
  const { mutateAsync: createReservation } = useCreateReservationMutation()
  const { data: membershipsData, isLoading: isMembershipsLoading } =
    useUserMemberships("T")

  // 지점 선택 시 해당 지점의 회원권만 필터링
  const filteredMemberships = useMemo(() => {
    if (!membershipsData?.pages[0]?.body) return []

    if (!selectedBranch) return membershipsData.pages[0].body

    return membershipsData.pages[0].body.filter((membership) =>
      membership.branchs?.some(
        (branch) => branch.b_idx === selectedBranch.b_idx,
      ),
    )
  }, [membershipsData, selectedBranch])

  // 최초 로드 시와 회원권 데이터가 변경될 때만 전체 회원권 목록 업데이트
  useEffect(() => {
    if (membershipsData?.pages[0]?.body) {
      setAllMemberships(membershipsData.pages[0].body)
    }
  }, [membershipsData])

  // Navigation Handler
  const handleBack = useCallback(() => {
    // 먼저 모든 상태를 초기화
    setData({
      item: undefined,
      branch: undefined,
      date: null,
      timeSlot: null,
      request: "",
      additionalServices: [],
    })
    clear()

    // 세션 스토리지에서 fromReservation 정보를 가져옴
    const fromReservation = sessionStorage.getItem("fromReservation")

    // 세션 스토리지 정보가 있으면 초기화 (이전 방식과의 호환성 유지)
    if (fromReservation) {
      sessionStorage.removeItem("fromReservation")
    }

    // 현재 위치 객체에서 상태 정보 확인
    const locationState = location.state || {}

    // 1. 지점 선택 화면에서 왔을 경우 (무한 루프 방지)
    if (locationState.fromBranchSelect || locationState.selectedBranch) {
      // 원래 온 경로가 있으면 그 경로로, 없으면 홈으로
      if (locationState.originalPath) {
        navigate(locationState.originalPath, { replace: true })
      } else {
        navigate("/", { replace: true })
      }
    }
    // 2. 지점 상세 페이지에서 왔을 경우
    else if (locationState.fromBranchDetail) {
      // 지점 상세 페이지로 돌아갈 때 originalPath 사용
      if (locationState.originalPath) {
        navigate(locationState.originalPath, { replace: true })
      } else {
        navigate("/branch", { replace: true })
      }
    }
    // 3. 결제 완료 페이지에서 왔을 경우
    else if (document.referrer.includes("/payment/complete")) {
      navigate("/", { replace: true })
    }
    // 4. 예약 상세 페이지에서 재예약으로 온 경우
    else if (locationState.fromReservationDetail) {
      // originalPath가 있으면 해당 경로로 이동, 없으면 예약 목록으로 이동
      if (locationState.originalPath) {
        navigate(locationState.originalPath, { replace: true })
      } else {
        navigate("/member-history/reservation", { replace: true })
      }
    }
    // 5. 회원권 카드에서 온 경우
    else if (locationState.fromMembershipCard) {
      // originalPath가 '/'(홈)인 경우 홈으로 이동, 아니면 예약 히스토리로 이동
      if (locationState.originalPath === "/") {
        navigate("/", { replace: true })
      } else {
        navigate("/member-history/reservation", { replace: true })
      }
    }
    // 6. 특정 경로로 돌아가야 하는 경우
    else if (locationState.returnPath) {
      navigate(locationState.returnPath, { replace: true })
    }
    // 7. 그 외 경우는 일반 뒤로가기
    else {
      navigate(-1)
    }
  }, [clear, navigate, location])

  // Layout Effects
  useEffect(() => {
    const cleanupRef = { shouldNavigate: true }

    setHeader({
      display: true,
      title: "예약하기",
      left: "back",
      onClickBack: () => {
        if (cleanupRef.shouldNavigate) {
          handleBack()
        }
      },
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })

    return () => {
      cleanupRef.shouldNavigate = false
    }
  }, [handleBack])

  // 지점 자동 선택
  useEffect(() => {
    let isSubscribed = true

    const setBranchFromReservation = async () => {
      if (!membershipsData?.pages[0]?.body || isMembershipsLoading) {
        return
      }

      if (location.state?.fromReservation?.branch) {
        const branch = membershipsData.pages[0].body
          .find((membership) =>
            membership.branchs?.some(
              (b) => b.b_idx === location.state.fromReservation.branch,
            ),
          )
          ?.branchs?.find(
            (b) => b.b_idx === location.state.fromReservation.branch,
          )

        if (isSubscribed && branch) {
          const branchData = {
            b_idx: branch.b_idx,
            name: branch.b_name,
            address: "",
            latitude: 0,
            longitude: 0,
            canBookToday: true,
            distanceInMeters: null,
            isFavorite: false,
            brandCode: BRAND_CODE,
            brand: "약손명가",
          }
          setSelectedBranch(branchData)
        }
      }
    }

    setBranchFromReservation()

    return () => {
      isSubscribed = false
    }
  }, [
    location.state?.fromReservation?.branch,
    membershipsData,
    setSelectedBranch,
    isMembershipsLoading,
  ])

  // Data Effects
  useEffect(() => {
    let isSubscribed = true

    if (selectedBranch && isSubscribed) {
      setData((prev) => ({
        ...prev,
        branch: selectedBranch.b_idx,
      }))
    }

    return () => {
      isSubscribed = false
    }
  }, [selectedBranch])

  useEffect(() => {
    let isSubscribed = true

    if (location.state?.selectedBranch && isSubscribed) {
      setSelectedBranch(location.state.selectedBranch)
    }

    if (location.state?.selectedItem && isSubscribed) {
      setData((prev) => ({
        ...prev,
        item: location.state.selectedItem,
      }))
    }

    return () => {
      isSubscribed = false
    }
  }, [location.state, setSelectedBranch])

  // 회원권 유효성 검사
  useEffect(() => {
    let isSubscribed = true

    const checkMembershipValidity = async () => {
      if (location.state?.fromReservation?.membershipId && membershipsData) {
        const membership = membershipsData.pages[0]?.body?.find(
          (m) => m.mp_idx === location.state.fromReservation.membershipId,
        )

        if (isSubscribed) {
          if (!membership) {
            await openModal({
              title: "알림",
              message: "해당 회원권 정보를 찾을 수 없습니다.",
              onConfirm: () => {
                navigate("/member-history/reservation", { replace: true })
              },
            })
          } else if (Number(membership.remain_amount) <= 0) {
            await openModal({
              title: "알림",
              message: "해당 회원권의 잔여 횟수가 없습니다.",
              onConfirm: () => {
                navigate("/member-history/reservation", { replace: true })
              },
            })
          }
        }
      }
    }

    checkMembershipValidity()

    return () => {
      isSubscribed = false
    }
  }, [
    location.state?.fromReservation?.membershipId,
    membershipsData,
    openModal,
    navigate,
  ])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clear() // 컴포넌트 언마운트 시 상태 초기화
    }
  }, [clear])

  // Handlers
  const handleOnChangeItem = (value: string) => {
    setData((prev) => ({
      ...prev,
      item: value,
      date: null,
      timeSlot: null,
      additionalServices: [],
    }))
  }

  // 회원권에 단일 지점만 있는 경우 자동으로 선택
  useEffect(() => {
    if (!data.item || data.item === "상담 예약") return

    // 선택된 회원권 찾기
    const selectedMembership = membershipsData?.pages[0]?.body?.find(
      (membership) => membership.mp_idx === data.item,
    )

    // 단일 지점만 있는 경우 자동 선택
    if (
      selectedMembership?.branchs &&
      selectedMembership.branchs.length === 1
    ) {
      const singleBranch = selectedMembership.branchs[0]
      const branch = {
        b_idx: singleBranch.b_idx,
        name: singleBranch.b_name,
        // Branch 인터페이스 필수 필드
        address: "",
        latitude: 0,
        longitude: 0,
        canBookToday: true,
        distanceInMeters: null,
        isFavorite: false,
        brandCode: BRAND_CODE,
        brand: "약손명가",
      }
      setSelectedBranch(branch)
    }
  }, [data.item, membershipsData])

  const handleOpenCalendar = () => {
    if (!data.item) {
      handleError(new Error("회원권을 먼저 선택해주세요."))
      return
    }

    if (!data.branch) {
      handleError(new Error("지점을 먼저 선택해주세요."))
      return
    }

    openBottomSheet(
      <DateAndTimeBottomSheet
        onClose={closeOverlay}
        date={data.date}
        time={data.timeSlot}
        onSelect={(date, timeSlot) => {
          setData((prev) => ({
            ...prev,
            date,
            timeSlot,
          }))
        }}
        membershipIndex={data.item === "상담 예약" ? 0 : Number(data.item)}
        addServices={data.additionalServices.map((service) =>
          Number(service.s_idx),
        )}
        b_idx={selectedBranch?.b_idx || ""}
      />,
      { height: "large" },
    )
  }

  const handleNavigateBranchSelect = useCallback(() => {
    if (!data.item) {
      handleError(new Error("회원권을 먼저 선택해주세요."))
      return
    }
    try {
      // 선택된 회원권 찾기
      const selectedMembership = membershipsData?.pages[0]?.body?.find(
        (membership) => membership.mp_idx === data.item,
      )

      // 원래 경로 정보 확인
      const originalPath = location.state?.originalPath || "/"

      navigate("/membership/branch-select", {
        state: {
          returnPath: "/reservation/form",
          selectedItem: data.item,
          brand_code: BRAND_CODE,
          // 회원권의 branchs 정보 전달
          availableBranches: selectedMembership?.branchs || [],
          // 현재 상태 정보 저장
          fromReservation: {
            item: data.item,
            date: data.date,
            timeSlot: data.timeSlot,
            request: data.request,
            additionalServices: data.additionalServices,
            membershipId: data.membershipId,
          },
          // 원래 경로 정보 저장
          originalPath,
        },
        replace: true, // 히스토리 스택에 추가되지 않고 교체하여 무한 루프 방지
      })
    } catch (error) {
      console.error("Navigation error:", error)
      handleError(new Error("지점 선택 페이지로 이동할 수 없습니다."))
    }
  }, [data, navigate, handleError, membershipsData, location])

  // Validation
  const validateReservationData = () => {
    if (!data.item) {
      handleError(new Error("회원권을 먼저 선택해주세요."))
      return false
    }
    if (!data.date || !data.timeSlot) {
      handleError(new Error("예약 날짜와 시간을 선택해주세요."))
      return false
    }
    if (!data.branch) {
      handleError(new Error("지점을 선택해주세요."))
      return false
    }
    return true
  }

  // Reservation Handlers
  const handleConsultationReservation = async () => {
    try {
      if (!validateReservationData()) return
      if (!selectedBranch) {
        handleError(new Error("지점을 선택해주세요."))
        return
      }

      const response = await createReservation({
        r_gubun: "C",
        mp_idx: data.item,
        b_idx: selectedBranch.b_idx,
        r_date: formatDateForAPI(data.date?.toDate() || null),
        r_stime: data.timeSlot!.time,
        r_memo: data.request,
      })

      if (response.resultCode !== "00") {
        handleError(new Error(response.resultMessage))
        return
      }

      openModal({
        title: "예약 완료",
        message: "상담 예약이 완료되었습니다.",
        onConfirm: () => {
          navigate("/member-history/reservation")
        },
      })
    } catch (error) {
      handleError(error, "상담 예약에 실패했습니다. 다시 시도해주세요.")
    }
  }

  const handleMembershipReservation = async () => {
    try {
      if (!validateReservationData()) return
      if (!selectedBranch) {
        handleError(new Error("지점을 선택해주세요."))
        return
      }

      // 1. 예약 생성
      const reservationResponse = await createReservation({
        r_gubun: "R",
        mp_idx: data.item,
        b_idx: selectedBranch.b_idx,
        r_date: formatDateForAPI(data.date?.toDate() || null),
        r_stime: data.timeSlot!.time,
        add_services: data.additionalServices.map((service) =>
          toNumber(service.s_idx),
        ),
        r_memo: data.request,
      })

      if (reservationResponse.resultCode !== "00") {
        handleError(new Error(reservationResponse.resultMessage))
        return
      }

      // 2. 추가 관리 주문서 발행
      if (data.additionalServices.length > 0) {
        const orderResponse = await createAdditionalManagementOrder({
          add_services: data.additionalServices.map((service) => ({
            s_idx: service.s_idx,
            ss_idx: service.options[0].ss_idx,
            amount: 1,
          })),
          b_idx: data.branch!,
        })

        if (orderResponse.resultCode !== "00") {
          handleError(new Error(orderResponse.resultMessage))
          return
        }

        // 3. 결제 페이지로 이동
        navigate("/payment", {
          state: {
            type: "additional",
            orderId: orderResponse.orderSheet.orderid,
            items: orderResponse.orderSheet.items,
          },
          replace: true,
        })
      } else {
        // 추가 관리가 없는 경우 예약 완료 처리
        openModal({
          title: "예약 완료",
          message: "예약이 완료되었습니다.",
          onConfirm: () => {
            navigate("/member-history/reservation")
          },
        })
      }
    } catch (error) {
      handleError(error, "예약에 실패했습니다. 다시 시도해주세요.")
    }
  }

  // Render Sections

  if (isMembershipsLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  // Main Render
  return (
    <div className="flex-1 space-y-3 pb-32 overflow-y-auto overflow-x-hidden">
      <section className="px-5 pt-2 pb-6 border-b-8 border-[#f7f7f7]">
        <h2 className="text-gray-700 text-18px font-sb leading-[148%] tracking-[-0.09px] mb-4">
          원하는 예약을 선택해주세요.
        </h2>
        <RadioGroup
          className="flex flex-col space-y-4"
          value={data.item}
          onChange={(e) => handleOnChangeItem(e.target.value)}
        >
          <div>
            <RadioCard
              checked={data.item === "상담 예약"}
              value="상담 예약"
              disabled={
                consultationCount &&
                consultationCount.maxCount - consultationCount.currentCount <= 0
              }
            >
              <div className="justify-start items-center gap-2 flex">
                <div
                  className={`text-16px font-sb ${
                    consultationCount &&
                    consultationCount.maxCount -
                      consultationCount.currentCount <=
                      0
                      ? "text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  상담 예약
                </div>
                <div
                  className={`px-2 py-0.5 rounded-[999px] justify-center items-center flex ${
                    consultationCount &&
                    consultationCount.maxCount -
                      consultationCount.currentCount <=
                      0
                      ? "bg-[#FFF8F7]"
                      : "bg-tag-greenBg"
                  }`}
                >
                  <div
                    className={`text-center text-12px font-m ${
                      consultationCount &&
                      consultationCount.maxCount -
                        consultationCount.currentCount <=
                        0
                        ? "text-error"
                        : "text-tag-green"
                    }`}
                  >
                    {!consultationCount?.currentCount
                      ? "FREE"
                      : `${(consultationCount?.maxCount ?? 0) - (consultationCount?.currentCount ?? 0)}/${consultationCount?.maxCount ?? 0}`}
                  </div>
                </div>
              </div>
            </RadioCard>
          </div>
          {!isMembershipsLoading && allMemberships.length > 0 ? (
            <MembershipSwiper
              key={location.state?.membershipId || data.membershipId || 'membership-swiper'}
              membershipsData={{
                ...(membershipsData?.pages[0] || {
                  resultCode: "00",
                  resultMessage: "",
                  resultCount: 0,
                  total_count: 0,
                  total_page_count: 0,
                  current_page: 0,
                }),
                body: allMemberships,
              }}
              selectedItem={data.item}
              onChangeItem={handleOnChangeItem}
              initialMembershipId={location.state?.membershipId || data.membershipId}
            />
          ) : (
            <Button
              variantType="secondary"
              sizeType="l"
              onClick={() => navigate("/membership")}
              className="justify-between items-center w-full !text-primary-300 font-sb !py-[20px] !rounded-xl"
            >
              회원권 구매하기
              <CaretRightIcon className="w-5 h-6" />
            </Button>
          )}
        </RadioGroup>
        <div className="flex flex-col mt-[16px]">
          <p className="text-gray-500 text-14px">
            * 상담 예약은 월간 {consultationCount?.maxCount ?? 0}회까지 이용
            가능합니다.
          </p>
          {!membershipsData?.pages[0]?.body?.length && (
            <p className="text-gray-500 text-14px">
              * 관리 프로그램은 회원권 구매 후 예약이 가능합니다.
            </p>
          )}
        </div>
      </section>

      <ReservationFormSection
        data={data}
        selectedBranch={selectedBranch}
        onOpenCalendar={handleOpenCalendar}
        onChangeRequest={(value) =>
          setData((prev) => ({ ...prev, request: value }))
        }
        onNavigateBranchSelect={handleNavigateBranchSelect}
        disableBranchSelection={
          data.item !== "상담 예약" &&
          !!membershipsData?.pages[0]?.body?.find(
            (membership) =>
              membership.mp_idx === data.item &&
              membership.branchs?.length === 1,
          )
        }
      />

      <FixedButtonContainer className="bg-white">
        <Button
          variantType="primary"
          sizeType="l"
          onClick={async () => {
            if (!validateReservationData()) return

            if (data.item === "상담 예약") {
              await handleConsultationReservation()
              return
            }

            await handleMembershipReservation()
          }}
          className="w-full"
        >
          예약하기
        </Button>
      </FixedButtonContainer>
    </div>
  )
}

export default ReservationFormPage
