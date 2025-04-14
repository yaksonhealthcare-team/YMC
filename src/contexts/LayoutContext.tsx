import { createContext, useContext, useState, useEffect, useRef } from "react"
import PageContainer from "@components/PageContainer.tsx"
import { Typography } from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom"
import Header from "@components/Header.tsx"

type NavigationConfig = {
  display?: boolean
  activeTab?: string
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

export interface LayoutContextValue {
  header: HeaderConfig
  setHeader: (header: HeaderConfig) => void
  navigation: NavigationConfig
  setNavigation: (navigation: NavigationConfig) => void
  setTitle: (title: string) => void
}

const LayoutContext = createContext<LayoutContextValue | null>({
  navigation: { display: false },
  setNavigation: () => {},
  header: { display: false },
  setHeader: () => {},
  setTitle: () => {},
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
  const location = useLocation()
  const pageContainerRef = useRef<HTMLDivElement>(null)

  // 경로 변경 시 스크롤을 맨 위로 이동
  useEffect(() => {
    if (pageContainerRef.current) {
      pageContainerRef.current.scrollTo(0, 0)
    }
  }, [location.pathname])

  // 안전영역 색상 설정
  useEffect(() => {
    if (
      !("component" in header) &&
      window.setNativeSafeAreaColors &&
      header.backgroundColor
    ) {
      const topColor = extractColor(header.backgroundColor)
      const bottomColor = navigation.display ? "#FFFFFF" : topColor

      window.setNativeSafeAreaColors(topColor, bottomColor)
    }
  }, [header, navigation.display])

  // html과 body의 배경색 설정
  useEffect(() => {
    const color = header.backgroundColor === "bg-white" ? "#FFFFFF" : "#F8F5F2"
    document.documentElement.style.backgroundColor = color
    document.body.style.backgroundColor = color
  }, [header.backgroundColor])

  const setTitle = (title: string) => {
    setHeader((prev) => ({
      ...prev,
      title,
    }))
  }

  const renderHeader = () => {
    if (!header.display) return null

    if ("component" in header && header.component) {
      return (
        <>
          <div className={"fixed w-full max-w-[500px] z-10"}>
            {header.component}
          </div>
          <div className="min-h-12" />
        </>
      )
    }

    const headerConfig = header as DetailedHeaderConfig
    return (
      <div className={"z-50"}>
        <div
          className={`fixed w-full max-w-[500px]`}
          style={{
            backgroundColor: extractColor(
              headerConfig.backgroundColor || "bg-system-bg",
            ),
          }}
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
        setTitle,
      }}
    >
      <PageContainer
        ref={pageContainerRef}
        className={header.backgroundColor || "bg-system-bg"}
      >
        {header.display && renderHeader()}
        {children}
        {navigation.display && (
          <div>
            <div className={"h-[82px]"} />
            <div
              className="flex fixed bottom-0 left-0 right-0 mx-auto h-[82px] z-10 bg-white justify-between max-w-[500px]"
              style={{
                boxShadow: "0px -2px 16px 0px #2E2B2914",
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                margin: "0 auto",
                width: "100%",
                maxWidth: "500px",
              }}
            >
              <NavButton
                activeIcon={"/assets/navIcon/home_active.png"}
                inactiveIcon={"/assets/navIcon/home_inactive.png"}
                title={"홈"}
                link={"/"}
              />
              {/* 
              <NavButton
                activeIcon={"/assets/navIcon/membership_active.png"}
                inactiveIcon={"/assets/navIcon/membership_inactive.png"}
                title={"회원권 구매"}
                link={"/membership?brand_code=001"}
                isActive={(path) => path.startsWith("/membership")}
              />
              */}
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
  const { navigation } = useLayout()
  const active = navigation.activeTab
    ? title === navigation.activeTab
    : isActive(path)
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(link)
  }

  return (
    <button
      className={"py-3 flex-1 flex flex-col gap-1 items-center cursor-pointer"}
      onClick={handleClick}
      style={{ color: active ? "#F37165" : "#BDBDBD" }}
      aria-label={`${title} 메뉴`}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={active ? activeIcon : inactiveIcon}
          width={32}
          height={32}
          alt={`${title} 아이콘`}
          style={{ objectFit: "contain" }}
        />
      </div>
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
    </button>
  )
}

// Tailwind 클래스에서 실제 색상값 추출하는 유틸리티 함수
const extractColor = (className: string): string => {
  // bg-[#색상] 형식 처리
  const colorMatch = className.match(/bg-\[(.*?)\]/)
  if (colorMatch) {
    return colorMatch[1]
  }

  // 기본 Tailwind 클래스 처리
  switch (className) {
    case "bg-white":
      return "#FFFFFF"
    case "bg-system-bg":
      return "#F8F5F2"
    default:
      return "#F8F5F2" // 기본값을 시스템 배경색으로 변경
  }
}

const useLayout = () => {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutProvider")
  }
  return context
}

export { LayoutProvider, useLayout }
