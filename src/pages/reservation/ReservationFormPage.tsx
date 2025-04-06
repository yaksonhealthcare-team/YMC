import { useLayout } from "contexts/LayoutContext"
import { useEffect, useState, useCallback, useMemo } from "react"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import { RadioCard } from "@components/RadioCard"
import { RadioGroup } from "@mui/material"
import { Button } from "@components/Button"
import { useOverlay } from "contexts/ModalContext"
import DateAndTimeBottomSheet from "./_fragments/DateAndTimeBottomSheet"
import dayjs from "dayjs"
import FixedButtonContainer from "@components/FixedButtonContainer"
import { useMembershipOptionsStore } from "../../hooks/useMembershipOptions"
import LoadingIndicator from "@components/LoadingIndicator.tsx"
import { useCreateReservationMutation } from "../../queries/useReservationQueries"
import { MembershipSwiper } from "@components/MembershipSwiper"
import { ReservationFormSection } from "./_fragments/ReservationFormSection"
import { useErrorHandler } from "hooks/useErrorHandler"
import { formatDateForAPI } from "utils/date"
import { toNumber } from "utils/number"
import { createAdditionalManagementOrder } from "apis/order.api"
import { useUserMemberships } from "queries/useMembershipQueries"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import { getConsultationCount } from "../../apis/reservation.api"
import { useQuery } from "@tanstack/react-query"
import { useReservationFormStore } from "../../stores/reservationFormStore"

const BRAND_CODE = "001" // 약손명가

const ReservationFormPage = () => {
  const { openBottomSheet, closeOverlay, openModal } = useOverlay()
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const membershipIdFromUrl = searchParams.get("membershipId")
  const { selectedBranch, clear, setSelectedBranch } =
    useMembershipOptionsStore()
  const { handleError } = useErrorHandler()

  const { formData, setFormData, resetFormData } = useReservationFormStore()

  // 초기 데이터 설정
  useEffect(() => {
    // location.state에서 데이터를 가져온 경우에만 설정
    if (location.state?.fromReservation) {
      setFormData({
        item: location.state.fromReservation.item,
        branch: location.state.fromReservation.branch,
        date: location.state.fromReservation.date
          ? dayjs(location.state.fromReservation.date)
          : null,
        timeSlot: location.state.fromReservation.timeSlot || null,
        request: location.state.fromReservation.request || "",
        additionalServices:
          location.state.fromReservation.additionalServices || [],
      })
    }

    // URL에서 membershipId가 있는 경우 설정
    if (membershipIdFromUrl) {
      setFormData({
        membershipId: membershipIdFromUrl,
      })
    }
  }, [])

  const { data: consultationCount } = useQuery({
    queryKey: ["consultation-count"],
    queryFn: getConsultationCount,
  })
  const { mutateAsync: createReservation } = useCreateReservationMutation()
  const {
    data: userMembershipPaginationData,
    isLoading: isMembershipsLoading,
  } = useUserMemberships("T")

  const memberships = useMemo(() => {
    if (
      !userMembershipPaginationData ||
      userMembershipPaginationData.pages.length === 0
    )
      return []

    return userMembershipPaginationData.pages[0].body
  }, [userMembershipPaginationData])

  const handleBack = useCallback(() => {
    navigate(-1)
  }, [])

  useEffect(() => {
    setHeader({
      display: true,
      title: "예약하기",
      left: "back",
      onClickBack: () => {
        handleBack()
      },
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  // 지점 자동 선택
  useEffect(() => {
    const setBranchFromReservation = async () => {
      if (
        !userMembershipPaginationData?.pages[0]?.body ||
        isMembershipsLoading
      ) {
        return
      }

      if (location.state?.fromReservation?.branch) {
        const branch = userMembershipPaginationData.pages[0].body
          .find((membership) =>
            membership.branchs?.some(
              (b) => b.b_idx === location.state.fromReservation.branch,
            ),
          )
          ?.branchs?.find(
            (b) => b.b_idx === location.state.fromReservation.branch,
          )

        if (branch) {
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
  }, [
    location.state?.fromReservation?.branch,
    userMembershipPaginationData,
    setSelectedBranch,
    isMembershipsLoading,
  ])

  // Data Effects
  useEffect(() => {
    if (selectedBranch) {
      setFormData({
        branch: selectedBranch.b_idx,
      })
    }
  }, [selectedBranch, setFormData])

  useEffect(() => {
    if (location.state?.selectedBranch) {
      setSelectedBranch(location.state.selectedBranch)
    }

    if (location.state?.selectedItem) {
      setFormData({
        item: location.state.selectedItem,
      })
    }
  }, [location.state, setSelectedBranch, setFormData])

  // 회원권 유효성 검사
  const [modalOpened, setModalOpened] = useState(false)

  // URL의 membershipId를 사용하여 회원권 자동 선택
  useEffect(() => {
    if (membershipIdFromUrl && memberships.length > 0 && !formData.item) {
      const foundMembership = memberships.find(
        (m) => m.mp_idx === membershipIdFromUrl,
      )

      if (foundMembership) {
        setFormData({
          item: membershipIdFromUrl,
          membershipId: membershipIdFromUrl,
        })
      }
    }
  }, [membershipIdFromUrl, memberships, formData.item, setFormData])

  useEffect(() => {
    const checkMembershipValidity = async () => {
      const membershipIdToCheck = membershipIdFromUrl

      if (membershipIdToCheck && userMembershipPaginationData && !modalOpened) {
        const membership = userMembershipPaginationData.pages[0]?.body?.find(
          (m) => m.mp_idx === membershipIdToCheck,
        )

        if (!membership) {
          setModalOpened(true)
          openModal({
            title: "알림",
            message: "해당 회원권 정보를 찾을 수 없습니다.",
            onConfirm: () => {
              closeOverlay()
            },
          })
        } else if (Number(membership.remain_amount) <= 0) {
          setModalOpened(true)
          openModal({
            title: "알림",
            message: "해당 회원권의 잔여 횟수가 없습니다.",
            onConfirm: () => {
              closeOverlay()
              handleBack()
            },
          })
        }
      }
    }

    // 이미 모달이 열려있지 않은 경우에만 유효성 검사 실행
    if (!modalOpened) {
      checkMembershipValidity()
    }
  }, [
    membershipIdFromUrl,
    userMembershipPaginationData,
    openModal,
    closeOverlay,
    navigate,
  ])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clear() // 컴포넌트 언마운트 시 상태 초기화
      resetFormData() // 예약 폼 데이터 초기화
    }
  }, [clear, resetFormData])

  // Handlers
  const handleOnChangeItem = (value: string) => {
    setFormData({
      item: value,
      date: null,
      timeSlot: null,
      additionalServices: [],
    })
  }

  // 회원권에 단일 지점만 있는 경우 자동으로 선택
  useEffect(() => {
    if (!formData.item || formData.item === "상담 예약") return

    // 선택된 회원권 찾기
    const selectedMembership =
      userMembershipPaginationData?.pages[0]?.body?.find(
        (membership) => membership.mp_idx === formData.item,
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
  }, [formData.item, userMembershipPaginationData])

  const handleOpenCalendar = () => {
    if (!formData.item) {
      handleError(new Error("회원권을 먼저 선택해주세요."))
      return
    }

    if (!formData.branch) {
      handleError(new Error("지점을 먼저 선택해주세요."))
      return
    }

    openBottomSheet(
      <DateAndTimeBottomSheet
        onClose={closeOverlay}
        date={formData.date}
        time={formData.timeSlot}
        onSelect={(date, timeSlot) => {
          setFormData({
            ...formData,
            date,
            timeSlot,
          })
        }}
        membershipIndex={
          formData.item === "상담 예약" ? 0 : Number(formData.item)
        }
        addServices={formData.additionalServices.map((service) =>
          Number(service.s_idx),
        )}
        b_idx={selectedBranch?.b_idx || ""}
      />,
      { height: "large" },
    )
  }

  const handleNavigateBranchSelect = useCallback(() => {
    if (!formData.item) {
      handleError(new Error("회원권을 먼저 선택해주세요."))
      return
    }

    try {
      // 상담 예약인 경우와 회원권 예약인 경우를 구분
      if (formData.item === "상담 예약") {
        navigate("/membership/branch-select", {
          state: {
            returnPath: "/reservation/form",
            selectedItem: formData.item,
            brand_code: BRAND_CODE,
            isConsultation: true, // 상담 예약임을 표시
            // 현재 상태 정보 저장
            fromReservation: {
              item: formData.item,
              date: formData.date,
              timeSlot: formData.timeSlot,
              request: formData.request,
              additionalServices: formData.additionalServices,
              membershipId: formData.membershipId,
            },
            // 원래 경로 정보 저장
            originalPath: location.state?.originalPath || "/",
          },
        })
        return
      }

      // 회원권 예약인 경우 기존 로직 유지
      const selectedMembership =
        userMembershipPaginationData?.pages[0]?.body?.find(
          (membership) => membership.mp_idx === formData.item,
        )

      navigate("/membership/branch-select", {
        state: {
          returnPath: "/reservation/form",
          selectedItem: formData.item,
          brand_code: BRAND_CODE,
          availableBranches: selectedMembership?.branchs || [],
          fromReservation: {
            item: formData.item,
            date: formData.date,
            timeSlot: formData.timeSlot,
            request: formData.request,
            additionalServices: formData.additionalServices,
            membershipId: formData.membershipId,
          },
          originalPath: location.state?.originalPath || "/",
        },
      })
    } catch (error) {
      console.error("Navigation error:", error)
      handleError(new Error("지점 선택 페이지로 이동할 수 없습니다."))
    }
  }, [
    formData,
    navigate,
    handleError,
    userMembershipPaginationData,
    location,
    formData.membershipId,
  ])

  // Validation
  const validateReservationData = () => {
    if (!formData.item) {
      handleError(new Error("회원권을 먼저 선택해주세요."))
      return false
    }
    if (!formData.date || !formData.timeSlot) {
      handleError(new Error("예약 날짜와 시간을 선택해주세요."))
      return false
    }
    if (!formData.branch) {
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
        mp_idx: formData.item,
        b_idx: selectedBranch.b_idx,
        r_date: formatDateForAPI(formData.date?.toDate() || null),
        r_stime: formData.timeSlot!.time,
        r_memo: formData.request,
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
        mp_idx: formData.item,
        b_idx: selectedBranch.b_idx,
        r_date: formatDateForAPI(formData.date?.toDate() || null),
        r_stime: formData.timeSlot!.time,
        add_services: formData.additionalServices.map((service) =>
          toNumber(service.s_idx),
        ),
        r_memo: formData.request,
      })

      if (reservationResponse.resultCode !== "00") {
        handleError(new Error(reservationResponse.resultMessage))
        return
      }

      // 2. 추가 관리 주문서 발행
      if (formData.additionalServices.length > 0) {
        const orderResponse = await createAdditionalManagementOrder({
          add_services: formData.additionalServices.map((service) => ({
            s_idx: service.s_idx,
            ss_idx: service.options[0].ss_idx,
            amount: 1,
          })),
          b_idx: formData.branch!,
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
          value={formData.item}
          onChange={(e) => handleOnChangeItem(e.target.value)}
        >
          <div>
            <RadioCard
              checked={formData.item === "상담 예약"}
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
          {!isMembershipsLoading && memberships.length > 0 ? (
            <MembershipSwiper
              membershipsData={{
                ...(userMembershipPaginationData?.pages[0] || {
                  resultCode: "00",
                  resultMessage: "",
                  resultCount: 0,
                  total_count: 0,
                  total_page_count: 0,
                  current_page: 0,
                }),
                body: memberships,
              }}
              selectedItem={formData.item}
              onChangeItem={handleOnChangeItem}
              initialMembershipId={membershipIdFromUrl || formData.membershipId}
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
          {!userMembershipPaginationData?.pages[0]?.body?.length && (
            <p className="text-gray-500 text-14px">
              * 관리 프로그램은 회원권 구매 후 예약이 가능합니다.
            </p>
          )}
        </div>
      </section>

      <ReservationFormSection
        data={formData}
        selectedBranch={selectedBranch}
        onOpenCalendar={handleOpenCalendar}
        onChangeRequest={(value) =>
          setFormData({ ...formData, request: value })
        }
        onNavigateBranchSelect={handleNavigateBranchSelect}
        disableBranchSelection={
          formData.item !== "상담 예약" &&
          !!userMembershipPaginationData?.pages[0]?.body?.find(
            (membership) =>
              membership.mp_idx === formData.item &&
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

            if (formData.item === "상담 예약") {
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
