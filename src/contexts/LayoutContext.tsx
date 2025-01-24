import { createContext, useContext, useState } from "react"
import PageContainer from "@components/PageContainer.tsx"
import { Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import Header from "@components/Header.tsx"

type NavigationConfig = {
  display?: boolean
}

type BaseHeaderConfig = {
  display?: boolean
  backgroundColor?: string
}

type DetailedHeaderConfig = BaseHeaderConfig & {
  title?: string
  left?: "back" | React.ReactNode
  right?: React.ReactElement<React.SVGProps<SVGSVGElement>>
  onClickBack?: () => void
}

type FullHeaderConfig = BaseHeaderConfig & {
  component?: React.ReactNode
}

type HeaderConfig = DetailedHeaderConfig | FullHeaderConfig

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

interface LayoutProviderProps {
  children: React.ReactNode
}

const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const [navigation, setNavigation] = useState<NavigationConfig>({
    display: true,
  })
  const [header, setHeader] = useState<HeaderConfig>({
    display: true,
    title: "THERAPIST",
  })

  const renderHeader = () => {
    if (!header.display) return null

    if ("component" in header && header.component) {
      return (
        <>
          <div className={"fixed w-full max-w-[500px] min-w-[375px] z-10"}>
            {header.component}
          </div>
          <div className="min-h-12" />
        </>
      )
    }

    const headerConfig = header as DetailedHeaderConfig
    return (
      <div className={"z-10"}>
        <div
          className={`fixed w-full max-w-[500px] min-w-[375px] ${
            header.backgroundColor ? header.backgroundColor : "bg-system-bg"
          }`}
        >
          <Header
            type={
              headerConfig.left === "back" && headerConfig.right
                ? "back_title_right_icon"
                : headerConfig.left === "back"
                ? "back_title"
                : "title_right_icon"
            }
            title={headerConfig.title as string}
            onClickBack={
              headerConfig.onClickBack || (() => window.history.back())
            }
            iconRight={
              headerConfig.right as React.ReactElement<
                React.SVGProps<SVGSVGElement>
              >
            }
          />
        </div>
        <div className={"h-12"} />
      </div>
    )
  }

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
        {header.display && renderHeader()}
        {children}
        {navigation.display && (
          <div>
            <div className={"h-[82px]"} />
            <div
              className="flex fixed bottom-0 w-full max-w-[500px] min-w-[375px] h-[82px] z-10 bg-white"
              style={{
                boxShadow: "0px -2px 16px 0px #2E2B2914",
              }}
            >
              <NavButton
                activeIcon={"/assets/navIcon/home_active.png"}
                inactiveIcon={"/assets/navIcon/home_inactive.png"}
                title={"홈"}
                link={"/"}
              />
              <NavButton
                activeIcon={"/assets/navIcon/membership_active.png"}
                inactiveIcon={"/assets/navIcon/membership_inactive.png"}
                title={"회원권 구매"}
                link={"/membership"}
              />
              <NavButton
                activeIcon={"/assets/navIcon/store_active.png"}
                inactiveIcon={"/assets/navIcon/store_inactive.png"}
                title={"스토어"}
                link={"/store"}
              />
              <NavButton
                activeIcon={"/assets/navIcon/reservation_active.png"}
                inactiveIcon={"/assets/navIcon/reservation_inactive.png"}
                title={"예약/회원권"}
                link={"/member-history/reservation"}
                isActive={(path) => path.startsWith("/member-history")}
              />
              <NavButton
                activeIcon={"/assets/navIcon/mypage_active.png"}
                inactiveIcon={"/assets/navIcon/mypage_inactive.png"}
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

interface NavButtonProps {
  activeIcon: string
  inactiveIcon: string
  title: string
  link: string
  isActive?: (currentPath: string) => boolean
}

const defaultIsActive = (currentPath: string, link: string) =>
  currentPath === link

const NavButton = ({
  activeIcon,
  inactiveIcon,
  title,
  link,
  isActive = (path) => defaultIsActive(path, link),
}: NavButtonProps) => {
  const path = window.location.pathname
  const active = isActive(path)
  const navigate = useNavigate()

  return (
    <div
      className={
        "p-3 w-[calc(100%/5)] flex flex-col gap-1 items-center cursor-pointer shrink-0"
      }
      onClick={() => navigate(link)}
      style={{ color: active ? "#F37165" : "#BDBDBD" }}
    >
      <img src={active ? activeIcon : inactiveIcon} width={32} />
      <Typography
        variant={"body2"}
        className={
          active
            ? "text-[#F37165] text-[12px] truncate"
            : "text-[#BDBDBD] text-[12px] truncate"
        }
      >
        {title}
      </Typography>
    </div>
  )
}

const useLayout = () => {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutProvider")
  }
  return context
}

export { LayoutProvider, useLayout }
