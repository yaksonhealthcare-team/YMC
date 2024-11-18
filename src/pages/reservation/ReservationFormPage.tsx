import { useLayout } from "contexts/LayoutContext"
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import { RadioCard } from "@components/RadioCard"
import { MembershipRadioCard } from "./_fragments/MembershipRadioCard"
import { MembershipStatus } from "types/Membership"
import { RadioGroup } from "@mui/material"

interface FormDataType {
  item: number
}

const ReservationFormPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const [data, setData] = useState<FormDataType>({
    item: 0,
  })

  const handleOnChangeItem = (event: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, item: parseInt(event.target.value) })
  }

  useEffect(() => {
    setHeader({
      display: true,
      title: "예약하기",
      left: (
        <div onClick={() => navigate(-1)}>
          <CaretLeftIcon className="w-5 h-5" />
        </div>
      ),
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })
  }, [])

  return (
    <div className="flex-1 px-5 space-y-3 pb-32 overflow-y-auto">
      <RadioGroup
        className="flex flex-col space-y-4"
        value={data.item}
        onChange={handleOnChangeItem}
      >
        <RadioCard checked={data.item === 0} value={0}>
          <div className="justify-start items-center gap-2 flex">
            <div className="text-gray-700 text-16px font-sb">상담 예약</div>
            <div className="px-2 py-0.5 bg-tag-greenBg rounded-[999px] justify-center items-center gap-1 flex">
              <div className="text-center text-tag-green text-12px font-m leading-[17.76px]">
                Free
              </div>
            </div>
          </div>
        </RadioCard>
        <MembershipRadioCard
          membership={{
            id: 0,
            status: MembershipStatus.AVAILABLE,
            title: "K-BEAUTY 연예인관리",
            count: "4회 / 20",
            startAt: "2024.04.01",
            endAt: "2024.12.31",
            isAllBranch: true,
          }}
          checked={data.item === 1}
          value={1}
        />
      </RadioGroup>
    </div>
  )
}

export default ReservationFormPage
