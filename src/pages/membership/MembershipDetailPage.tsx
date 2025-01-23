import { useEffect, useMemo } from "react"
import { Button } from "@components/Button"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useNavigate, useParams } from "react-router-dom"
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
import {
  SelectedOption,
  useMembershipOptionsStore,
} from "../../hooks/useMembershipOptions.ts"
import { addCart } from "../../apis/cart.api.ts"
import { Branch } from "../../types/Branch.ts"
import { queryClient } from "../../queries/clients.ts"
import { queryKeys } from "../../queries/query.keys.ts"

const MembershipDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { setHeader, setNavigation } = useLayout()
  const { openBottomSheet, closeOverlay } = useOverlay()
  const navigate = useNavigate()

  const {
    shouldOpenBottomSheet,
    setShouldOpenBottomSheet,
    clear: clearMembershipOptions,
  } = useMembershipOptionsStore()
  const { clear: clearOptions } = useMembershipOptionsStore()
  const { data: membership, isLoading } = useMembershipDetail(id || "")
  const sortedOptions = useMemo(
    () =>
      membership?.options.sort((a, b) => Number(a.ss_idx) - Number(b.ss_idx)),
    [membership?.options],
  )

  const firstOption = sortedOptions?.[0]

  useEffect(() => {
    setHeader({
      display: true,
      component: (
        <div className={"flex items-center justify-between px-5 py-3 h-[48px]"}>
          <div
            onClick={() => {
              clearMembershipOptions()
              navigate(-1)
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

    if (shouldOpenBottomSheet) {
      handleOpenOptionsBottomSheet()
    }
  }, [])

  const handleAddItemsToCart = async (
    selectedOptions: SelectedOption[],
    selectedBranch: Branch | null,
  ) => {
    if (!selectedBranch) return

    await addCart(
      selectedOptions.map(({ option, count }) => ({
        s_idx: Number(id!),
        ss_idx: Number(option.ss_idx),
        b_idx: Number(selectedBranch.id),
        // TODO: 전지점 회원권 케이스에 대해 API 수정 요청드림.
        //  추후 변경: b_idx: selectedBranch ? Number(selectedBranch.id) : undefined와 비슷하게 변경해야 할 것 같습니다.
        brand_code: selectedBranch.brandCode,
        amount: count,
      })),
    )
    await queryClient.refetchQueries({ queryKey: queryKeys.carts.all })
    clearOptions()
    closeOverlay()
    navigate("/cart")
  }

  if (isLoading || !membership) return <div>Loading...</div>

  const handleOpenOptionsBottomSheet = () => {
    openBottomSheet(
      <OptionsBottomSheetContent
        serviceType={membership.service_type}
        options={sortedOptions || []}
        onClickAddToCart={handleAddItemsToCart}
        onClickBranchSelect={() => {
          closeOverlay()
          setShouldOpenBottomSheet(true)
          navigate(`/membership/select-branch`)
        }}
      />,
    )
  }

  const MembershipInfo = () => (
    <div className="flex flex-col px-5 py-6 gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-primary font-sb text-14px">
            {membership.brand_name}
          </span>
          <h1 className="text-gray-900 font-sb text-16px">
            {membership.service_name}
          </h1>
        </div>
        {firstOption && (
          <div className="flex items-end gap-2">
            {membership.options[0].option_original_price && (
              <span className="text-primary font-b text-18px">
                {calculateDiscountRate(
                  membership.options[0].option_price,
                  membership.options[0].option_original_price,
                )}
                %
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-gray-900 font-b text-18px">
                {membership.options[0].option_price}원
              </span>
              <span className="text-gray-900 font-r text-12px">부터~</span>
            </div>
            {membership.options[0].option_original_price && (
              <span className="text-gray-400 font-r text-14px line-through">
                {membership.options[0].option_original_price}원
              </span>
            )}
          </div>
        )}
      </div>
      <div className="h-px bg-gray-100" />
      <p className="text-gray-900 font-r text-14px leading-[24px]">
        {membership.service_content}
      </p>
    </div>
  )

  const MembershipDetail = () => {
    const sortedCourses = useMemo(
      () =>
        membership?.courses?.sort(
          (a, b) => Number(a.priority) - Number(b.priority),
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
              {membership.service_type}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="text-primary" />
            <span className="text-gray-800 font-m text-14px">
              {membership.service_time}분 소요
            </span>
          </div>
          {sortedCourses.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <NoteIcon className="text-primary " />
                <span className="text-gray-800 font-m text-14px">
                  관리 코스
                </span>
              </div>
              <div className="inline">
                {sortedCourses.map((course) => (
                  <div
                    key={course.sc_idx}
                    className={"inline-flex items-center"}
                  >
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
            </>
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
                alt={`${membership.service_name} 이미지 ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <img
              src={MembershipPlaceholderImage}
              alt={`${membership.service_name} 기본 이미지`}
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
            onClick={handleOpenOptionsBottomSheet}
            variantType="primary"
            sizeType="l"
            className="w-full"
          >
            구매하기
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MembershipDetailPage
