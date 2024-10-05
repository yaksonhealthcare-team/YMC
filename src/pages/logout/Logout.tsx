import Logo from "@components/Logo.tsx"
import React, { useEffect } from "react"
import { Typography } from "@mui/material"
import { useAuth } from "../../contexts/AuthContext.tsx"
import { useNavigate } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext.tsx"

const Logout = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({ display: false })
    setNavigation({ display: false })
  }, [])

  const handleLogout = () => {
    logout()

    setTimeout(() => {
      navigate("/login")
    }, 1500)
  }
  useEffect(() => {
    handleLogout()
  }, [])
  return (
    <div
      className={
        "flex flex-col h-full w-full justify-center items-center bg-[#F8F5F2] p-14"
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
