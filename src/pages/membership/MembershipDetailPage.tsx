import { useEffect, useMemo, useState } from "react"
import { Button } from "@components/Button"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom"
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
import { MembershipDetail, MembershipOption } from "../../types/Membership"
import { formatPrice, parsePrice } from "utils/format"
import { toNumber } from "utils/number"

const MembershipInfo = ({ membership }: { membership: MembershipDetail }) => {
  return (
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
                {formatPrice(membership.options[0].ss_price)}원
              </span>
              <span className="text-gray-900 font-r text-12px">부터~</span>
            </div>
            {membership.options[0].original_price && (
              <span className="text-gray-400 font-r text-14px line-through translate-y-[0.5px]">
                {formatPrice(membership.options[0].original_price)}원
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
}

const MembershipDetailContent = ({
  membership,
}: {
  membership: MembershipDetail
}) => {
  const sortedCourses = useMemo(
    () =>
      membership?.courses?.sort((a, b) => Number(a.prior) - Number(b.prior)) ||
      [],
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
                {sortedCourses.indexOf(course) !== sortedCourses.length - 1 && (
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

const MembershipDetailPage = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const brandCode = searchParams.get("brand_code") || "001"
  const { setHeader, setNavigation } = useLayout()
  const { data: membership } = useMembershipDetail(id!)
  const { openBottomSheet } = useOverlay()
  const { clear } = useMembershipOptionsStore()

  const sortedCourses = useMemo(() => {
    return (
      membership?.courses?.sort(
        (a, b) => toNumber(a.prior) - toNumber(b.prior),
      ) ?? []
    )
  }, [membership?.courses])

  const [selectedOption, setSelectedOption] = useState<MembershipOption | null>(
    null,
  )
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  const handleOptionClick = (option: MembershipOption) => {
    setSelectedOption(option)
    setIsBottomSheetOpen(true)
  }

  // 구매하기 버튼 클릭 시 바텀시트 열기
  const handlePurchaseClick = () => {
    if (!membership) return

    openBottomSheet(
      <OptionsBottomSheetContent
        key={location.pathname}
        serviceType={membership.s_type}
        options={membership.options || []}
        membershipId={id!}
        brand={membership.brand_name || "No Name"}
        title={membership.s_name || "No Name"}
        duration={parseInt(membership.s_time || "0")}
        brandCode={brandCode}
      />,
    )
  }

  useEffect(() => {
    clear()
    setHeader({
      display: true,
      component: (
        <div className={"flex items-center justify-between px-5 py-3 h-[48px]"}>
          <div
            onClick={() => {
              if (location.state?.fromBranchSelect) {
                navigate("/membership", { replace: true })
              } else {
                navigate(`/membership?brand_code=${brandCode}`)
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
  }, [])

  if (!membership) return <LoadingIndicator className="min-h-screen" />

  const discountRate = calculateDiscountRate(
    parsePrice(membership.options[0].ss_price),
    parsePrice(membership.options[0].original_price),
  )

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

      <MembershipInfo membership={membership} />

      <div className="w-full h-2 bg-gray-50" />

      <MembershipDetailContent membership={membership} />

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
    </div>
  )
}

export default MembershipDetailPage
