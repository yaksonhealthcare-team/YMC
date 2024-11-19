import { useLayout } from "contexts/LayoutContext"
import { ChangeEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import CaretRigthIcon from "@assets/icons/CaretRightIcon.svg?react"
import { RadioCard } from "@components/RadioCard"
import { MembershipRadioCard } from "./_fragments/MembershipRadioCard"
import { MembershipItem, MembershipStatus } from "types/Membership"
import { Box, RadioGroup } from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css/pagination"
import { Pagination } from "swiper/modules"
import { Button } from "@components/Button"

interface FormDataType {
  item: number
}

const example_items: MembershipItem[] = [
  {
    id: 1,
    status: MembershipStatus.AVAILABLE,
    title: "K-BEAUTY 연예인관리",
    count: "4회 / 20",
    startAt: "2024.04.01",
    endAt: "2024.12.31",
    isAllBranch: true,
    isReady: false,
  },
  {
    id: 2,
    status: MembershipStatus.COMPLETED,
    title: "바디케어 프로그램",
    count: "0회 / 10",
    startAt: "2024.01.01",
    endAt: "2024.03.31",
    isReady: true,
  },
  {
    id: 3,
    status: MembershipStatus.EXPIRED,
    title: "럭셔리 스파",
    count: "2회 / 5",
    startAt: "2024.12.01",
    endAt: "2024.02.29",
  },
  {
    id: 4,
    status: MembershipStatus.EXPIRED,
    title: "럭셔리 스파",
    count: "2회 / 5",
    startAt: "2024.12.01",
    endAt: "2024.02.29",
  },
]

const ReservationFormPage = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const [consultationSlot, setConsultationSlot] = useState(1)
  const [hasMembership, setHasMembership] = useState(false)
  const [itemOptions, setItemOptions] = useState(example_items)
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

    // TODO: Get item options from API
    setItemOptions(example_items)
  }, [])

  return (
    <div className="flex-1space-y-3 pb-32 overflow-y-auto">
      <section className="px-5 pt-2 pb-6 border-b-8 border-[#f7f7f7]">
        <RadioGroup
          className="flex flex-col space-y-4"
          value={data.item}
          onChange={handleOnChangeItem}
        >
          <RadioCard
            checked={data.item === 0}
            value={0}
            disabled={consultationSlot >= 2}
          >
            <div className="justify-start items-center gap-2 flex">
              <div className="text-gray-700 text-16px font-sb">상담 예약</div>
              {consultationSlot < 2 && (
                <div className="px-2 py-0.5 bg-tag-greenBg rounded-[999px] justify-center items-center flex">
                  <div className="text-center text-tag-green text-12px font-m">
                    {consultationSlot === 0 ? "Free" : "1/2"}
                  </div>
                </div>
              )}
              {consultationSlot >= 2 && (
                <div className="px-2 h-4 bg-tag-redBg rounded-[999px] justify-center items-center flex">
                  <div className="text-center text-tag-red text-12px font-m">
                    0/2
                  </div>
                </div>
              )}
            </div>
          </RadioCard>
          {hasMembership ? (
            <Box
              className="w-full"
              sx={(theme) => ({
                "& .swiper-pagination": {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "5px",
                  position: "relative",
                  bottom: "0",
                  marginTop: "12px",
                },
                "& .swiper-pagination-bullet": {
                  width: "6px",
                  height: "6px",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  backgroundColor: "white",
                  border: `1px solid ${theme.palette.grey[200]}`,
                  opacity: 1,
                  margin: "0 !important",
                },
                "& .swiper-pagination-bullet-active": {
                  backgroundColor: theme.palette.primary.main,
                  border: "none",
                },
              })}
            >
              <Swiper
                modules={[Pagination]}
                spaceBetween={10}
                slidesPerView={1}
                style={{ overflow: "visible" }}
                className="w-full"
                pagination={{ clickable: true }}
              >
                {itemOptions.map((item) => (
                  <SwiperSlide key={item.id} className="mr-2">
                    <MembershipRadioCard
                      membership={item}
                      checked={data.item === item.id}
                      value={item.id}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          ) : (
            <Button
              variantType="primary"
              className="bg-tag-redBg !text-tag-red justify-between items-center hover:bg-red-100"
              iconRight={<CaretRigthIcon className="w-5 h-5" />}
              onClick={() => navigate("/membership")}
            >
              회원권 구매하기
            </Button>
          )}

          <p className="text-gray-500 text-sm">
            * 상담 예약은 월간 2회까지 이용 가능합니다.
          </p>
        </RadioGroup>
      </section>
    </div>
  )
}

export default ReservationFormPage
