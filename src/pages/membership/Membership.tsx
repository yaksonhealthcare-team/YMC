import { useEffect, useState } from "react"
import { useLayout } from "contexts/LayoutContext"
import { useNavigate } from "react-router-dom"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import CartIcon from "@components/icons/CartIcon"
import { Tab, Tabs } from "@mui/material"
import { MembershipCard } from "./_fragments/MembershipCard"
import { MembershipCategory, MembershipItem } from "../../types/Membership"
import {
  useMembershipCategories,
  useMembershipList,
} from "../../queries/useMembershipQueries"
import { ListResponse } from "../../apis/membership.api"
import { fetchCartCount } from "../../apis/cart.api"
import LoadingIndicator from "@components/LoadingIndicator"
import useIntersection from "../../hooks/useIntersection"

const MembershipPage = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const [brandCode, setBrandCode] = useState("001") // 약손명가
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
        <div onClick={() => navigate(-1)}>
          <CaretLeftIcon className="w-5 h-5" />
        </div>
      ),
      right: <CartIcon />,
      backgroundColor: "bg-system-bg",
    })
    setNavigation({ display: true })
  }, [])

  if (
    isCategoriesLoading ||
    isMembershipsLoading ||
    !categoriesData?.body ||
    !membershipsData?.pages[0].body
  ) {
    return <LoadingIndicator className="min-h-screen" />
  }

  return (
    <div className="min-h-screen bg-system-bg">
      {/* 고정 영역 */}
      <div className="fixed top-[48px] left-0 right-0 z-10">
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
        <div className="w-full bg-system-bg border-b border-gray-100">
          <div className="max-w-[500px] min-w-[375px] mx-auto">
            <div className="px-5">
              <Tabs
                value={brandCode}
                onChange={(_, value) => setBrandCode(value)}
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
                  "& .MuiTabs-scroller": {
                    overflowX: "auto !important",
                    "&::-webkit-scrollbar": { display: "none" },
                  },
                  "& .MuiTab-root": {
                    minHeight: 48,
                    padding: "14px 0",
                    marginRight: "24px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#9E9E9E",
                    "&.Mui-selected": {
                      color: "#212121",
                    },
                  },
                }}
                aria-label="브랜드 선택"
              >
                <Tab label="약손명가" value="001" />
                <Tab label="달리아스파" value="002" />
                <Tab label="여리한다이어트" value="003" />
              </Tabs>
            </div>
          </div>
        </div>

        {/* 카테고리 선택 */}
        <div className="w-full bg-system-bg">
          <div className="max-w-[500px] min-w-[375px] mx-auto">
            <div className="px-5 py-4">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory(undefined)}
                  className={`flex-shrink-0 w-[68px] h-[68px] rounded-full flex items-center justify-center ${
                    !selectedCategory
                      ? "bg-primary"
                      : "bg-[rgba(33,33,33,0.45)]"
                  }`}
                >
                  <span className="text-white text-12px font-medium leading-[15.36px]">
                    전체
                  </span>
                </button>
                {categoriesData.body.map((category: MembershipCategory) => (
                  <button
                    key={category.sc_code}
                    onClick={() => setSelectedCategory(category.sc_code)}
                    className={`flex-shrink-0 w-[68px] h-[68px] rounded-full flex items-center justify-center ${
                      selectedCategory === category.sc_code
                        ? "bg-primary"
                        : "bg-[rgba(33,33,33,0.45)]"
                    }`}
                  >
                    <span className="text-white text-12px font-medium leading-[15.36px] px-1">
                      {category.sc_name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 회원권 목록 */}
      <div className="pt-[185px] pb-[96px] bg-system-bg">
        <div className="max-w-[500px] min-w-[375px] mx-auto">
          <div className="px-5 py-6">
            {membershipsData.pages[0].body.length === 0 ? (
              <div className="flex justify-center items-center h-[200px] text-gray-600">
                준비중 입니다
              </div>
            ) : (
              <div className="space-y-4">
                {membershipsData.pages.map((page) =>
                  page.body.map((membership: MembershipItem) => (
                    <MembershipCard
                      key={membership.s_idx}
                      membership={membership}
                      onClick={() => navigate(`/membership/${membership.s_idx}`)}
                    />
                  )),
                )}
                <div ref={observerTarget} className="h-4" />
                {isFetchingNextPage && (
                  <LoadingIndicator className="min-h-[100px]" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MembershipPage
