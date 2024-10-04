import React, { createContext, useState, useContext } from "react"
import PageContainer from "@components/PageContainer.tsx"
import { Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { AppBar, Link } from "@mui/material"

type NavigationConfig = {
  display?: boolean
}

type HeaderConfig = {
  display?: boolean
  title?: string | React.ReactNode
  backButton?: boolean
  left?: React.ReactNode
  right?: React.ReactNode
}

interface LayoutContextValue {
  navigation: NavigationConfig
  setNavigation: (navigation: NavigationConfig) => void
  header: HeaderConfig
  setHeader: (header: HeaderConfig) => void
}

const LayoutContext = createContext<LayoutContextValue | null>({
  navigation: { display: false },
  setNavigation: () => {},
  header: { display: false },
  setHeader: () => {},
})

export const LayoutProvider = ({ children }) => {
  const [navigation, setNavigation] = useState<NavigationConfig>({
    display: true,
  })
  const [header, setHeader] = useState<HeaderConfig>({
    display: true,
    title: "THERAPIST",
  })

  return (
    <LayoutContext.Provider
      value={{
        navigation,
        setNavigation,
        header,
        setHeader,
      }}
    >
      <PageContainer>
        {header.display && (
          <div className={"z-10"}>
            <div className="fixed space-x-4 w-full h-12 max-w-[500px] min-w-[375px] flex items-center py-3 px-5 bg-white">
              <div className={"flex justify-start w-1/3"}>{header.left}</div>

              <Typography variant="h6" className={"w-1/3 flex justify-center"}>
                {header.title}
              </Typography>

              <div className={"flex justify-end w-1/3"}>{header.right}</div>
            </div>
            <div className={"h-12"} />
          </div>
        )}

        {children}
        {navigation.display && (
          <div>
            <div className={"h-[82px]"} />
            <div
              className="flex justify-around space-x-4 fixed bottom-0 w-full max-w-[500px] min-w-[375px] h-[82px] z-10 bg-white"
              style={{
                boxShadow: "0px -2px 16px 0px #2E2B2914",
              }}
            >
              <NavButton
                activeIcon={"assets/navIcon/home_active.png"}
                inactiveIcon={"assets/navIcon/home_inactive.png"}
                title={"홈"}
                link={"/"}
              />
              <NavButton
                activeIcon={"assets/navIcon/purchase_active.png"}
                inactiveIcon={"assets/navIcon/purchase_inactive.png"}
                title={"회원권 구매"}
                link={"/purchase"}
              />
              <NavButton
                activeIcon={"assets/navIcon/store_active.png"}
                inactiveIcon={"assets/navIcon/store_inactive.png"}
                title={"스토어"}
                link={"/store"}
              />
              <NavButton
                activeIcon={"assets/navIcon/reservation_active.png"}
                inactiveIcon={"assets/navIcon/reservation_inactive.png"}
                title={"예약/회원권"}
                link={"/reservation"}
              />
              <NavButton
                activeIcon={"assets/navIcon/mypage_active.png"}
                inactiveIcon={"assets/navIcon/mypage_incative.png"}
                title={"마이페이지"}
                link={"/mypage"}
              />
            </div>
          </div>
        )}
      </PageContainer>
    </LayoutContext.Provider>
  )
}

const NavButton = ({ activeIcon, inactiveIcon, title, link }) => {
  const path = window.location.pathname
  const isActive = path === link
  const navigate = useNavigate()

  return (
    <div
      className={"p-3 w-full flex flex-col gap-1 items-center cursor-pointer"}
      onClick={() => navigate(link)}
      style={{ color: isActive ? "#F37165" : "#BDBDBD" }}
    >
      <img src={isActive ? activeIcon : inactiveIcon} width={32} />
      <Typography
        variant={"body2"}
        className={
          isActive
            ? "text-[#F37165] text-[12px] truncate"
            : "text-[#BDBDBD] text-[12px] truncate"
        }
      >
        {title}
      </Typography>
    </div>
  )
}

export const useLayout = () => {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutProvider")
  }
  return context
}
