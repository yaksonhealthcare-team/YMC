import { useEffect, useState } from "react"
import { useLayout } from "contexts/LayoutContext"
import { useNavigate } from "react-router-dom"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import { Button } from "@components/Button"
import { Box, Tab, Tabs } from "@mui/material"
import { MembershipCard } from "./_fragments/MembershipCard"
import SplashScreen from "@components/Splash"
import { MembershipCategory, MembershipItem } from "../../types/Membership"
import {
  useMembershipCategories,
  useMembershipList,
} from "../../queries/useMembershipQueries"

const MembershipPage = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const [brandCode] = useState("001") // 약손명가
  const [selectedCategory, setSelectedCategory] = useState<string>()

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useMembershipCategories(brandCode)
  const { data: membershipsData, isLoading: isMembershipsLoading } =
    useMembershipList(brandCode, selectedCategory)

  useEffect(() => {
    setHeader({
      display: true,
      title: "회원권 구매",
      left: (
        <div onClick={() => navigate(-1)}>
          <CaretLeftIcon className="w-5 h-5" />
        </div>
      ),
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  if (
    isCategoriesLoading ||
    isMembershipsLoading ||
    !categoriesData ||
    !membershipsData
  ) {
    return <SplashScreen />
  }

  return (
    <div className="flex flex-col h-full">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedCategory || ""}
          onChange={(_, value) => setSelectedCategory(value)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="회원권 카테고리"
        >
          <Tab label="전체" value="" />
          {categoriesData.items.map((category: MembershipCategory) => (
            <Tab
              key={category.sc_idx}
              label={category.category_name}
              value={category.sc_idx}
            />
          ))}
        </Tabs>
      </Box>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {membershipsData.items.map((membership: MembershipItem) => (
          <MembershipCard
            key={membership.s_idx}
            membership={membership}
            onClick={() => navigate(`/membership/${membership.s_idx}`)}
          />
        ))}
      </div>

      <div className="p-5 border-t border-gray-100">
        <Button
          variantType="primary"
          sizeType="l"
          className="w-full"
          onClick={() => navigate("/cart")}
        >
          장바구니
        </Button>
      </div>
    </div>
  )
}

export default MembershipPage
