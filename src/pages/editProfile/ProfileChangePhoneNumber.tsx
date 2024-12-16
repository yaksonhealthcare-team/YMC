import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"
import { Button } from "@components/Button.tsx"
import { useNavigate } from "react-router-dom"

const ProfileChangePhoneNumber = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()

  useEffect(() => {
    setHeader({
      left: "back",
      title: "휴대폰 번호 인증하기",
      backgroundColor: "bg-white",
      display: true,
    })
    setNavigation({ display: false })
  }, [])

  return (
    <div className={"flex flex-col p-5"}>
      <p className={"text-center font-sb text-20px mt-32"}>
        {"휴대폰 번호를 바꾸기 위해선"}
        <br />
        {"본인인증이 필요해요."}
      </p>
      <Button
        className={"w-full mt-10"}
        onClick={() => {
          // TODO: Pass API 완료 후 추가 작업할 것
          navigate(-1)
        }}
      >
        {"본인인증 하러가기"}
      </Button>
    </div>
  )
}

export default ProfileChangePhoneNumber
