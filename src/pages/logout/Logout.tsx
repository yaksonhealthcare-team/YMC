import Logo from "@components/Logo.tsx"
import { Typography } from "@mui/material"
import { useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext.tsx"
import { useLayout } from "../../contexts/LayoutContext.tsx"

const Logout = () => {
  const { logout } = useAuth()
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({
      display: false,
      backgroundColor: "bg-system-bg",
    })
    setNavigation({ display: false })
  }, [])

  const handleLogout = () => {
    logout()
  }
  useEffect(() => {
    handleLogout()
  }, [])
  return (
    <div
      className={
        "flex flex-col h-full w-full justify-center items-center bg-system-bg p-14"
      }
    >
      <div className={"py-48"}>
        <Logo text size={191} />

        <div className={"flex justify-center"}>
          <Typography variant="body2" className={"p-4"}>
            안전하게 로그아웃 중입니다.
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default Logout
