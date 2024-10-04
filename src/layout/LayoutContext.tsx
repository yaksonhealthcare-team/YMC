import React, { createContext, useState, useContext } from "react"
import PageContainer from "@components/PageContainer.tsx"
import { AppBar, Link } from "@mui/material"

type NavigationConfig = {
  display?: boolean
}

type HeaderConfig = {
  display?: boolean
  title?: string
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
  navigation: { display: true },
  setNavigation: () => {},
  header: { display: true },
  setHeader: () => {},
})

export const LayoutProvider = ({ children }) => {
  const [navigation, setNavigation] = useState<NavigationConfig>({
    display: true,
  })
  const [header, setHeader] = useState<HeaderConfig>({ display: true })

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
            <ul className="fixed space-x-4 w-full bg-black h-12 max-w-[500px] min-w-[375px]">
              <li>
                <Link to="/" activeClassName="font-bold">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/reports" activeClassName="font-bold">
                  Reports
                </Link>
              </li>
              <li>
                <Link to="/settings" activeClassName="font-bold">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
        )}

        {children}
        {navigation.display && (
          <div className={"h-[82px]"}>
            <ul className="flex justify-center space-x-4 fixed bottom-0 w-full bg-black max-w-[500px] min-w-[375px]  h-[82px]">
              <li>
                <Link to="/" activeClassName="font-bold">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/reports" activeClassName="font-bold">
                  Reports
                </Link>
              </li>
              <li>
                <Link to="/settings" activeClassName="font-bold">
                  Settings
                </Link>
              </li>
            </ul>
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
