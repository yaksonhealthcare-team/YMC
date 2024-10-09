import { MouseEventHandler, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import Logo from "@components/Logo.tsx"
import Button from "@components/Button.tsx"
import { Typography } from "@mui/material"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { User } from "../../types/User.ts"

const Login = () => {
  const { login } = useAuth()
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()

  useEffect(() => {
    setHeader({
      display: false,
    })
    setNavigation({
      display: false,
    })
  }, [])

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    // TODO: 여기에 실제 인증 로직을 구현합니다
    // 예를 들어, API 호출을 통한 인증 등
    login({
      username: "임시사용자",
      email: "user@example.com",
      password: "password",
    } as unknown as User) // 성공 시 사용자 정보를 저장
    navigate("/") // 홈 페이지로 리다이렉트
  }

  const handleOnClickSignup = () => {
    navigate("/signup") //TODO: 회원가입 페이지로 이동
  }

  return (
    <div
      className={
        "flex flex-col h-full w-full justify-between items-center bg-[#F8F5F2] p-14"
      }
    >
      <div className={"py-48"}>
        <Logo text size={191} />
      </div>

      <Button onClick={(event) => handleSubmit(event)} variant="outlined">
        임시로그인 (홈으로 이동)
      </Button>
      <div className={"flex justify-center"}>
        <Typography variant="body2" className={"p-4"}>
          처음이신가요?
        </Typography>
        <Button variantType="text" sizeType="s" onClick={handleOnClickSignup}>
          회원가입
        </Button>
      </div>
    </div>
  )
}

export default Login
