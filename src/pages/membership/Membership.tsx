import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import CartIcon from "@components/icons/CartIcon"
import LoadingIndicator from "@components/LoadingIndicator"
import { Tab, Tabs } from "@mui/material"
import { useLayout } from "contexts/LayoutContext"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { fetchCartCount } from "../../apis/cart.api"
import { ListResponse } from "../../apis/membership.api"
import useIntersection from "../../hooks/useIntersection"
import {
  useMembershipCategories,
  useMembershipList,
} from "../../queries/useMembershipQueries"
import { MembershipCategory, MembershipItem } from "../../types/Membership"
import { MembershipCard } from "./_fragments/MembershipCard"
import { BRAND_CODE } from "constants/brand"
import { useDisplayBrands } from "../../hooks/useDisplayBrands"

const MembershipPage = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const [searchParams, setSearchParams] = useSearchParams()
  const { displayedBrands } = useDisplayBrands()

  const brandCode =
    searchParams.get("brand_code") ||
    (displayedBrands?.[0]?.code ?? BRAND_CODE.YAKSON)
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const [cartCount, setCartCount] = useState(0)

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useMembershipCategories(brandCode) as {
      data: ListResponse<MembershipCategory> | undefined
      isLoading: boolean
    }
  const {
    data: membershipsData,
    isLoading: isMembershipsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMembershipList(brandCode, selectedCategory)

  const { observerTarget } = useIntersection({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  useEffect(() => {
    fetchCartCount().then((count) => setCartCount(count))
    setHeader({
      display: true,
      title: "회원권 구매",
      left: (
        <button
          onClick={() => navigate(-1)}
          className=" rounded"
          aria-label="뒤로가기"
        >
          <CaretLeftIcon className="w-5 h-5" />
        </button>
      ),
      right: <CartIcon />,
    })
    setNavigation({ display: true })
  }, [])

  // 브랜드 변경 시
  const handleBrandChange = (_: React.SyntheticEvent, value: string) => {
    setSearchParams({ brand_code: value })
    setSelectedCategory(undefined)
  }

  const isLastDisplayedBrand = (code: string) =>
    code === displayedBrands?.[displayedBrands.length - 1]?.code

  // 카테고리 변경 시
  const handleCategoryChange = (category?: string) => {
    setSelectedCategory(category)
  }

  if (
    isCategoriesLoading ||
    isMembershipsLoading ||
    !categoriesData?.body ||
    !membershipsData?.pages[0].body ||
    !displayedBrands
  ) {
    return <LoadingIndicator className="min-h-screen bg-system-bg" />
  }

  return (
    <div className="min-h-screen bg-system-bg">
      <div className="w-full max-w-[500px] mx-auto relative">
        {/* 고정 영역 */}
        <div className="sticky top-[48px] left-0 w-full z-10 bg-system-bg">
          {/* 안내 메시지 */}
          {cartCount === 0 && (
            <div className="w-full bg-[#92443D]">
              <div className="max-w-[500px] min-w-[375px] mx-auto">
                <div className="w-full h-[41px] flex items-center justify-center">
                  <span className="text-white text-14px font-medium">
                    이용하고 싶은 회원권을 담아주세요.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 브랜드 선택 탭 */}
          <div className="w-full border-b border-gray-100">
            <div className="max-w-[500px] min-w-[375px] mx-auto">
              <Tabs
                value={brandCode}
                onChange={handleBrandChange}
                variant="scrollable"
                scrollButtons={false}
                allowScrollButtonsMobile={false}
                TabIndicatorProps={{
                  sx: {
                    height: 2,
                    bgcolor: "#212121",
                  },
                }}
                sx={{
                  minHeight: 48,
                  bgcolor: "#F8F5F2",
                  "& .MuiTabs-scroller": {
                    overflowX: "auto !important",
                    "&::-webkit-scrollbar": { display: "none" },
                  },
                  "& .MuiTab-root": {
                    minWidth: "unset",
                    minHeight: 48,
                    padding: "14px 0",
                    marginRight: "24px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#9E9E9E",
                    "&.Mui-selected": {
                      color: "#212121",
                    },
                    "&:first-of-type": {
                      marginLeft: "20px",
                    },
                    "&:last-of-type": {
                      marginRight: "20px",
                    },
                  },
                }}
                aria-label="브랜드 선택"
              >
                {displayedBrands?.map((brand) => (
                  <Tab
                    key={brand.code}
                    label={brand.name}
                    value={brand.code}
                    sx={{
                      marginRight: isLastDisplayedBrand(brand.code)
                        ? "40px !important"
                        : "24px !important",
                    }}
                  />
                ))}
              </Tabs>
            </div>
          </div>

          {/* 카테고리 선택 */}
          <div className="w-full max-w-[500px] min-w-[375px] mx-auto py-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide px-5">
              <button
                onClick={() => handleCategoryChange(undefined)}
                className={`flex-shrink-0 w-[68px] h-[68px] rounded-full flex items-center justify-center ${
                  !selectedCategory ? "bg-primary" : "bg-[rgba(33,33,33,0.45)]"
                }`}
              >
                <span className="text-white text-12px font-medium leading-[12px]">
                  전체
                </span>
              </button>
              {categoriesData.body.map((category: MembershipCategory) => (
                <button
                  key={category.sc_code}
                  onClick={() => handleCategoryChange(category.sc_code)}
                  className={`flex-shrink-0 w-[68px] h-[68px] rounded-full flex items-center justify-center ${
                    selectedCategory === category.sc_code
                      ? "bg-primary"
                      : "bg-[rgba(33,33,33,0.45)]"
                  }`}
                >
                  <span className="text-white text-12px font-medium leading-[1.4] px-1">
                    {category.sc_name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 회원권 목록 */}
        <div className="px-5 pb-32">
          <div className="grid grid-cols-1 gap-3">
            {membershipsData.pages.map((page) =>
              page.body.map((membership: MembershipItem) => (
                <MembershipCard
                  key={membership.s_idx}
                  membership={membership}
                  onClick={() =>
                    navigate(`/membership/${membership.s_idx}`, {
                      state: { brandCode },
                    })
                  }
                />
              )),
            )}
          </div>
          <div ref={observerTarget} className="h-4" />
          {isFetchingNextPage && <LoadingIndicator className="min-h-[100px]" />}
        </div>
      </div>
    </div>
  )
}

export default MembershipPage
