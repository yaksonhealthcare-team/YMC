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
import { ListResponse } from "../../apis/membership.api"

const MembershipPage = () => {
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const [brandCode] = useState("001") // 약손명가
  const [selectedCategory, setSelectedCategory] = useState<string>()

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useMembershipCategories(brandCode) as {
      data: ListResponse<MembershipCategory> | undefined
      isLoading: boolean
    }
  const { data: membershipsData, isLoading: isMembershipsLoading } =
    useMembershipList(brandCode, selectedCategory) as {
      data: ListResponse<MembershipItem> | undefined
      isLoading: boolean
    }

  useEffect(() => {
    setHeader({
      display: true,
      title: "회원권 구매",
      left: (
        <div onClick={() => navigate(-1)}>
          <CaretLeftIcon className="w-5 h-5" />
        </div>
      ),
      backgroundColor: "bg-system-bg",
    })
    setNavigation({ display: true })
  }, [])

  if (
    isCategoriesLoading ||
    isMembershipsLoading ||
    !categoriesData?.body ||
    !membershipsData?.body
  ) {
    return <SplashScreen />
  }

  return (
    <div className="h-screen bg-system-bg">
      <div className="fixed top-[48px] left-0 right-0 z-10 flex justify-center">
        <Box
          sx={{ borderBottom: 1, borderColor: "divider" }}
          className="w-full max-w-[500px] min-w-[375px] bg-system-bg"
        >
          <Tabs
            value={selectedCategory || ""}
            onChange={(_, value) => setSelectedCategory(value)}
            variant="scrollable"
            scrollButtons={false}
            allowScrollButtonsMobile={false}
            TabIndicatorProps={{
              sx: {
                transition: "none",
                bgcolor: "#212121",
              },
            }}
            sx={{
              "& .MuiTabs-scroller": {
                overflowX: "auto !important",
                "&::-webkit-scrollbar": { display: "none" },
              },
              "& .MuiTab-root": {
                color: "#9E9E9E",
                "&.Mui-selected": {
                  color: "#212121",
                },
              },
            }}
            aria-label="회원권 카테고리"
          >
            <Tab label="전체" value="" />
            {categoriesData.body.map((category: MembershipCategory) => (
              <Tab
                key={category.sc_code}
                label={category.sc_name}
                value={category.sc_code}
              />
            ))}
          </Tabs>
        </Box>
      </div>

      <div className="pt-[96px] pb-[100px] p-5 bg-system-bg">
        {membershipsData.body.length === 0 ? (
          <div className="flex justify-center items-center h-[200px] text-gray-600">
            준비중 입니다
          </div>
        ) : (
          <div className="space-y-4">
            {membershipsData.body.map((membership: MembershipItem) => (
              <MembershipCard
                key={membership.s_idx}
                membership={membership}
                onClick={() => navigate(`/membership/${membership.s_idx}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MembershipPage
