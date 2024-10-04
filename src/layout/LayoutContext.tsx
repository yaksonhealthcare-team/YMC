import React, { createContext, useState, useContext } from "react"
import PageContainer from "@components/PageContainer.tsx"
import { IconButton, Link, Typography } from "@mui/material"

type NavigationConfig = {
  display?: boolean
}

type HeaderConfig = {
  display?: boolean
  title?: string | React.ReactNode
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
  navigation: { display: true },
  setNavigation: () => {},
  header: { display: true },
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
          <div className={"h-12"}>
            <div className="fixed space-x-4 w-full h-12 max-w-[500px] min-w-[375px] flex items-center py-3 px-5">
              <div className={"flex justify-start w-1/3"}>{header.left}</div>

              <Typography variant="h6" className={"w-1/3 flex justify-center"}>
                {header.title}
              </Typography>

              <div className={"flex justify-end w-1/3"}>{header.right}</div>
            </div>
          </div>
        )}

        {children}
        {navigation.display && (
          <div className={"h-[82px]"}>
            <div className="flex justify-center space-x-4 fixed bottom-0 w-full bg-black max-w-[500px] min-w-[375px]  h-[82px]">
              <Link to="/" activeClassName="font-bold">
                Home
              </Link>

              <Link to="/reports" activeClassName="font-bold">
                Reports
              </Link>

              <Link to="/settings" activeClassName="font-bold">
                Settings
              </Link>
            </div>
          </div>
        )}
      </PageContainer>
    </LayoutContext.Provider>
  )
}

export const useLayoutContext = () => {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutProvider")
  }
  return context
}
