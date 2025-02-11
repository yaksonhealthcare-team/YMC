import { useNavigate, Link } from "react-router-dom"
import { Divider } from "@mui/material"
import CaretRightIcon from "@assets/icons/CaretRightIcon.svg?react"
import CrownIcon from "@assets/icons/CrownIcon.svg?react"
import PersonalCardIcon from "@assets/icons/PersonalCardIcon.svg?react"
import InformationIcon from "@assets/icons/InformationIcon.svg?react"
import PointIcon from "@assets/icons/PointIcon.svg?react"
import { useAuth } from "../../../contexts/AuthContext"
import { useOverlay } from "../../../contexts/ModalContext"
import { Button } from "@components/Button"

const MyPagePointMembership = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { openBottomSheet, closeOverlay } = useOverlay()

  const handleOpenQuestionnaire = () => {
    openBottomSheet(
      <div className="flex flex-col">
        <div className="px-5 pt-4 pb-8 flex flex-col gap-2 text-center text-18px font-sb text-gray-900">
          {"보고 싶은 문진 종류를 선택해주세요."}
        </div>
        <div className="pt-3 pb-[30px] border-t border-gray-50">
          <div className="px-5 flex gap-3">
            <Link
              to="/mypage/questionnaire/reservation"
              onClick={() => {
                closeOverlay()
              }}
              className="w-full"
            >
              <Button className="w-full" variantType="line" sizeType="l">
                {"예약 문진"}
              </Button>
            </Link>
            <Link
              to="/mypage/questionnaire/common"
              onClick={() => {
                closeOverlay()
              }}
              className="w-full"
            >
              <Button className="w-full" variantType="primary" sizeType="l">
                {"공통 문진"}
              </Button>
            </Link>
          </div>
        </div>
      </div>,
    )
  }

  const handleOpenUserLevel = () => {
    openBottomSheet(
      <div className={"flex flex-col"}>
        <p className={"font-sb text-18px px-5 pt-4"}>회원등급 안내</p>
        <div className={"px-7 py-6"}>
          <table className={"w-full border-collapse"}>
            <thead>
              <tr className={"bg-system-bg"}>
                <th
                  className={
                    "p-3 pl-5 text-16px font-medium text-gray-900 text-left w-[100px]"
                  }
                >
                  등급
                </th>
                <th
                  className={
                    "p-3 text-16px font-medium text-gray-900 text-left"
                  }
                >
                  최근 1년간 누적 결제 금액
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className={"border-b border-gray-100"}>
                <td className={"p-3 pl-5 text-16px text-left w-[100px]"}>
                  A등급
                </td>
                <td className={"p-3 text-16px text-left"}>1,000만원 이상</td>
              </tr>
              <tr className={"border-b border-gray-100"}>
                <td className={"p-3 pl-5 text-16px text-left w-[100px]"}>
                  B등급
                </td>
                <td className={"p-3 text-16px text-left"}>330만원 이상</td>
              </tr>
              <tr className={"border-b border-gray-100"}>
                <td className={"p-3 pl-5 text-16px text-left w-[100px]"}>
                  C등급
                </td>
                <td className={"p-3 text-16px text-left"}>150만원 이상</td>
              </tr>
              <tr className={"border-b border-gray-100"}>
                <td className={"p-3 pl-5 text-16px text-left w-[100px]"}>
                  D등급
                </td>
                <td className={"p-3 text-16px text-left"}>30만원 이상</td>
              </tr>
              <tr className={"border-b border-gray-100"}>
                <td className={"p-3 pl-5 text-16px text-left w-[100px]"}>
                  E등급
                </td>
                <td className={"p-3 text-16px text-left"}>기본 등급</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>,
    )
  }

  return (
    <div className="flex gap-2">
      <div
        className="w-[101px] h-24 bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-2"
        onClick={handleOpenQuestionnaire}
      >
        <PersonalCardIcon className="w-6 h-6" />
        <span className="font-m text-14px text-gray-500">내 문진</span>
      </div>
      <div className="flex-1 h-24 px-5 py-3 bg-white rounded-2xl border border-gray-100 flex flex-col justify-center gap-3">
        <div
          className="flex justify-between items-center"
          onClick={() => navigate("/point")}
        >
          <div className="flex items-center gap-2">
            <PointIcon className="w-4 h-4" />
            <span className="font-m text-14px text-gray-500">포인트</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-sb text-16px text-gray-900">
              {`${user?.point ?? 0}P`}
            </span>
            <CaretRightIcon className="w-3 h-3" />
          </div>
        </div>
        <Divider className="border-gray-100" />
        <div
          className="flex justify-between items-center"
          onClick={handleOpenUserLevel}
        >
          <div className="flex items-center gap-2">
            <CrownIcon className="w-4 h-4" />
            <span className="font-m text-14px text-gray-500">회원등급</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-sb text-16px text-gray-900">
              {user?.level ?? ""}
            </span>
            <InformationIcon className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPagePointMembership
