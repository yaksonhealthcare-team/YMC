import { useEffect } from "react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useNavigate } from "react-router-dom"
import { Container, Typography } from "@mui/material"
import DynamicHomeHeaderBackground from "./_fragments/DynamicHomeHeaderBackground.tsx"
import Logo from "@components/Logo.tsx"

const Home = () => {
  const { setHeader, setNavigation } = useLayout()

  const navigate = useNavigate()
  useEffect(() => {
    setHeader({
      display: false,
    })

    setNavigation({ display: true })
  }, [])

  return (
    <Container className={"relative w-full h-full bg-[#F8F5F2] py-4"}>
      <DynamicHomeHeaderBackground
        header={
          <div className={"space-y-2"}>
            <Logo text size={136} />
            <Typography className="text-sm text-gray-500">
              [공지] 9월 1일 회원권 변경사항 안내드립니다.
            </Typography>
          </div>
        }
        content={
          <div>
            <div className="flex justify-between items-center bg-primary-300 rounded-2xl p-4">
              <div className="flex gap-2 flex-col text-white">
                <Typography className={"font-b"}>
                  <span className={"text-18px"}>김민정님</span> 반갑습니다.
                </Typography>
                <Typography className="font-m text-14px space-x-2">
                  <span>SILVER</span> <span>10,000 P</span>
                </Typography>
              </div>
              <div className="rounded-full bg-white text-primary-300 py-2.5 px-5">
                예약하기
              </div>
            </div>
            {/* 배너영역*/}
            <div className="mt-4">
              <img
                src="/assets/home_banner.png"
                alt="배너영역"
                className="w-full h-12 object-cover rounded-2xl"
              />
            </div>
          </div>
        }
        buttonArea={
          <button
            className="w-full h-full bg-primary-300 text-white rounded-full shadow-lg"
            onClick={() => navigate("/dev")}
          ></button>
        }
      />

      <button
        className="absolute bottom-4 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
        onClick={() => navigate("/dev")}
      >
        dev
      </button>
    </Container>
  )
}

export default Home
