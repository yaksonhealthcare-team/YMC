import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Notice } from "@components/Notice"
import { Button } from "@components/Button"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import CrownIcon from "@assets/icons/CrownIcon.svg?react"
import PersonalCardIcon from "@assets/icons/PersonalCardIcon.svg?react"
import InformationIcon from "@assets/icons/InformationIcon.svg?react"
import PointIcon from "@assets/icons/PointIcon.svg?react"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useAuth } from "../../contexts/AuthContext.tsx"
import { useOverlay } from "../../contexts/ModalContext.tsx"

const MyPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const { openBottomSheet, closeOverlay } = useOverlay()

  useEffect(() => {
    setHeader({ display: false })
    setNavigation({ display: true })
  }, [navigate])

  const handleOpenQuestionnaire = () => {
    openBottomSheet(
      <div className={"flex flex-col"}>
        <p className={"mx-5 mt-5 font-sb text-18px"}>
          {"보고 싶은 문진 종류를 선택해주세요."}
        </p>
        <div className={"mt-10 border-t border-gray-50 flex gap-2 pt-3 px-5"}>
          <Button
            className={"w-full"}
            variantType={"line"}
            onClick={() => {
              closeOverlay()
              navigate("/mypage/questionnaire/reservation")
            }}
          >
            {"예약 문진 보기"}
          </Button>
          <Button
            className={"w-full"}
            variantType={"primary"}
            onClick={() => {
              closeOverlay()
              navigate("/mypage/questionnaire/general")
            }}
          >
            {"공통 문진 보기"}
          </Button>
        </div>
      </div>,
    )
  }

  const handleOpenUserLevel = () => {
    openBottomSheet(
      <div className={"flex flex-col"}>
        <p className={"font-sb text-18px px-5 pt-4"}>회원등급 안내</p>
        <p className={"py-6"}>{"회원등급 기획 미정"}</p>
        <div className={"border-t border-gray-200 pt-3"}>
          <Button className={"w-full"} onClick={closeOverlay}>
            {"예약하기"}
          </Button>
        </div>
      </div>,
    )
  }

  const menuItems = [
    { id: "favorite", title: "즐겨찾는 지점", path: "/favorite" },
    { id: "payment", title: "결제 내역", path: "/payment_history" },
    { id: "review", title: "작성한 만족도", path: "/review" },
    { id: "inquiry", title: "1:1 문의", path: "/inquiry" },
    { id: "event", title: "이벤트", path: "/event" },
    { id: "notice", title: "공지사항", path: "/notice" },
    { id: "settings", title: "알림설정", path: "/settings/notifications" },
  ]

  return (
    <>
      <div className="h-fit bg-[#F8F5F2] pb-8">
        {/* Notice */}
        <div className="px-5 py-2 m-5 rounded-[20px] bg-white">
          <Notice
            title="9월 1일 회원권 변경사항 안내드립니다."
            onClick={() => navigate("/notice/1")}
          />
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-12 h-12 rounded-full border border-gray-100 overflow-hidden">
            <img
              src={user?.profileURL || "/assets/profile_image.jpeg"}
              alt="프로필"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-b text-[20px] text-gray-900">
            {user?.username ?? ""}님
          </span>
        </div>

        {/* Info Cards */}
        <div className="px-5 space-y-5">
          {/* Branch Info */}
          <div
            className="p-5 bg-white rounded-2xl border border-gray-100"
            onClick={() => navigate("/mypage/active-branch")}
          >
            <div className="flex justify-between items-center">
              <span className="font-m text-14px text-gray-500">
                이용 중인 지점
              </span>
              <div className="flex items-center">
                <span className="font-sb text-14px text-gray-900">
                  약손명가 강남구청역점 외 2개
                </span>
                <CaretRightIcon className="w-3 h-3 ml-1.5" />
              </div>
            </div>
          </div>

          {/* Points & Membership */}
          <div className="flex gap-2">
            <div
              className="w-[101px] h-24 bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center"
              onClick={handleOpenQuestionnaire}
            >
              <PersonalCardIcon />
              <span className="font-m text-14px text-gray-500 mt-1">
                내 문진
              </span>
            </div>
            <div className="flex-1 p-3 bg-white rounded-2xl border border-gray-100">
              <div
                className="flex justify-between items-center mb-3"
                onClick={() => navigate("/point")}
              >
                <div className="flex items-center gap-2">
                  <PointIcon />
                  <span className="font-m text-14px text-gray-500">포인트</span>
                </div>
                <div className="flex items-center">
                  <span className="font-sb text-16px text-gray-900">
                    {`${user?.point ?? 0}P`}
                  </span>
                  <CaretRightIcon className="w-3 h-3 ml-1.5" />
                </div>
              </div>
              <div className="w-full h-[1px] bg-gray-100 my-3" />
              <div
                className="flex justify-between items-center"
                onClick={handleOpenUserLevel}
              >
                <div className="flex items-center gap-2">
                  <CrownIcon />
                  <span className="font-m text-14px text-gray-500">
                    회원등급
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-sb text-16px text-gray-900">
                    {user?.level ?? ""}
                  </span>
                  <InformationIcon className={"w-4 h-4 text-gray-500"} />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Edit Button */}
          <Button
            variantType="primary"
            sizeType="m"
            onClick={() => navigate("/profile")}
            className="w-full"
          >
            프로필 수정
          </Button>

          {/* Menu List */}
          <div className="bg-white rounded-[20px] border border-gray-100">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(item.path)}
                className="flex items-center h-12 px-5 gap-3 cursor-pointer"
              >
                <span className="flex-1 font-m text-16px text-gray-900">
                  {item.title}
                </span>
                <CaretRightIcon className="w-3 h-3" />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center gap-4 mt-8 mb-20">
            <div className="flex items-center gap-3">
              <span
                onClick={() => navigate("/terms")}
                className="font-sb text-14px text-gray-400"
              >
                이용약관
              </span>
              <div className="w-[1px] h-3.5 bg-gray-200" />
              <span
                onClick={() => navigate("/logout")}
                className="font-sb text-14px text-gray-400"
              >
                로그아웃
              </span>
            </div>
            <span className="font-r text-12px text-gray-300">
              {/* TODO: 실제 버전 표시 */}
              v.1.1.4 version
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default MyPage
