import { useEffect, useMemo, useState } from "react"
import { Button } from "@components/Button"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import { useOverlay } from "../../contexts/ModalContext.tsx"
import OptionsBottomSheetContent from "./_fragments/OptionsBottomSheetContent.tsx"
import ClockIcon from "@assets/icons/ClockIcon.svg?react"
import StoreIcon from "@assets/icons/StoreIcon.svg?react"
import NoteIcon from "@assets/icons/NoteIcon.svg?react"
import { useMembershipDetail } from "queries/useMembershipQueries.tsx"
import calculateDiscountRate from "utils/calculateDiscountRate.ts"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/swiper-bundle.css"
import MembershipPlaceholderImage from "@assets/images/MembershipPlaceholderImage.jpg"
import CartIcon from "@components/icons/CartIcon.tsx"
import { useMembershipOptionsStore } from "../../hooks/useMembershipOptions.ts"
import LoadingIndicator from "@components/LoadingIndicator"
import { Branch } from "../../types/Branch"
import { MembershipBranchSelectModal } from "./_fragments/MembershipBranchSelectModal"

const MembershipDetailPage = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const { data: membership } = useMembershipDetail(id!)
  const { openBottomSheet, closeOverlay, overlayState } = useOverlay()
  const {
    currentPath,
    isBottomSheetOpen,
    setCurrentPath,
    setSelectedOptions,
    setIsBottomSheetOpen,
    setSelectedBranch,
    clear,
  } = useMembershipOptionsStore()

  const [isModalOpen, setIsModalOpen] = useState(false)

  // 구매하기 버튼 클릭 시 바텀시트 열기
  const handlePurchaseClick = () => {
    setIsBottomSheetOpen(true)
  }

  // 지점 선택 버튼 클릭 시 모달 열기
  const handleBranchSelect = () => {
    closeOverlay() // 바텀시트 닫기
    setIsModalOpen(true)
  }

  useEffect(() => {
    if (currentPath !== location.pathname) {
      clear()
      closeOverlay()
      setCurrentPath(location.pathname)
    }
  }, [location.pathname, location.state])

  useEffect(() => {
    if (isBottomSheetOpen) {
      openBottomSheet(
        <OptionsBottomSheetContent
          key={location.pathname}
          serviceType={membership?.s_type}
          options={membership?.options || []}
          membershipId={id!}
          onClickBranchSelect={handleBranchSelect}
          onAddToCartSuccess={() => {
            closeOverlay()
            setSelectedOptions([])
            navigate("/cart")
          }}
        />,
      )
    }
  }, [isBottomSheetOpen, membership, id])

  // 바텀시트가 닫힐 때 상태 초기화
  useEffect(() => {
    if (!overlayState.isOpen && overlayState.type === null) {
      setIsBottomSheetOpen(false)
    }
  }, [overlayState])

  useEffect(() => {
    setHeader({
      display: true,
      component: (
        <div className={"flex items-center justify-between px-5 py-3 h-[48px]"}>
          <div
            onClick={() => {
              if (location.state?.fromBranchSelect) {
                navigate("/membership", { replace: true })
              } else {
                navigate(-1)
              }
            }}
          >
            <CaretLeftIcon className={"w-5 h-5"} />
          </div>
          <CartIcon />
        </div>
      ),
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [location.state, navigate, setHeader, setNavigation])

  if (!membership) return <LoadingIndicator className="min-h-screen" />

  const MembershipInfo = () => (
    <div className="flex flex-col px-5 py-6 gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-primary font-sb text-14px">
            {membership.brand_name || "약손명가"}
          </span>
          <h1 className="text-gray-900 font-sb text-16px">
            {membership.s_name || "데이터가 없습니다"}
          </h1>
        </div>
        {membership.options?.length > 0 && (
          <div className="flex items-baseline gap-2">
            {membership.options[0].original_price && (
              <span className="text-primary font-b text-18px">
                {calculateDiscountRate(
                  Number(membership.options[0].ss_price.replace(/,/g, "")),
                  Number(
                    membership.options[0].original_price.replace(/,/g, ""),
                  ),
                )}
                %
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-gray-900 font-b text-18px">
                {membership.options[0].ss_price}원
              </span>
              <span className="text-gray-900 font-r text-12px">부터~</span>
            </div>
            {membership.options[0].original_price && (
              <span className="text-gray-400 font-r text-14px line-through translate-y-[0.5px]">
                {membership.options[0].original_price}원
              </span>
            )}
          </div>
        )}
      </div>
      <div className="h-px bg-gray-100" />
      <p className="text-gray-900 font-r text-14px leading-[24px]">
        {membership.s_content || membership.s_name || "상품 설명이 없습니다"}
      </p>
    </div>
  )

  const MembershipDetail = () => {
    const sortedCourses = useMemo(
      () =>
        membership?.courses?.sort(
          (a, b) => Number(a.prior) - Number(b.prior),
        ) || [],
      [membership?.courses],
    )

    return (
      <div className="flex flex-col px-5 py-6 gap-4">
        <h2 className="text-gray-800 font-b text-16px">상세정보</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <StoreIcon className="text-primary" />
            <span className="text-gray-800 font-m text-14px">
              {membership.s_type || "회원권 유형 정보가 없습니다"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="text-primary" />
            <span className="text-gray-800 font-m text-14px">
              {membership.s_time
                ? `${membership.s_time}분 소요`
                : "소요 시간 정보가 없습니다"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <NoteIcon className="text-primary" />
            <span className="text-gray-800 font-m text-14px">관리 코스</span>
          </div>
          {sortedCourses.length > 0 ? (
            <div className="inline">
              {sortedCourses.map((course) => (
                <div key={course.sc_idx} className={"inline-flex items-center"}>
                  <p className="inline font-r text-14px whitespace-nowrap">
                    {course.sc_name} ({course.sc_min}분)
                  </p>
                  {sortedCourses.indexOf(course) !==
                    sortedCourses.length - 1 && (
                    <CaretRightIcon className="w-4 h-4 inline text-gray-400 mx-1.5" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 font-r text-14px">
              관리 코스 정보가 없습니다
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="pb-[94px]">
      <Swiper className="w-full h-[280px]">
        {membership?.pictures?.length > 0 ? (
          membership.pictures.map((imageUrl, index) => (
            <SwiperSlide key={index}>
              <img
                src={imageUrl || MembershipPlaceholderImage}
                alt={`${membership.s_name} 이미지 ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <img
              src={MembershipPlaceholderImage}
              alt={`${membership.s_name || "회원권"} 기본 이미지`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        )}
      </Swiper>

      <MembershipInfo />

      <div className="w-full h-2 bg-gray-50" />

      <MembershipDetail />

      {/* Bottom Fixed Button */}

      <div className="fixed bottom-0 left-0 right-0 h-[94px] bg-white border-t border-gray-50">
        <div className="px-5 pt-3">
          <Button
            onClick={handlePurchaseClick}
            variantType="primary"
            sizeType="l"
            className="w-full"
          >
            구매하기
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <MembershipBranchSelectModal
          onBranchSelect={(branch: Branch) => {
            setSelectedBranch(branch)
            setIsBottomSheetOpen(true)
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

export default MembershipDetailPage
