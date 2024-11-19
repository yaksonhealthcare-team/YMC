import { useLayout } from "contexts/LayoutContext"
import { ChangeEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import CaretRigthIcon from "@assets/icons/CaretRightIcon.svg?react"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import { RadioCard } from "@components/RadioCard"
import { MembershipRadioCard } from "./_fragments/MembershipRadioCard"
import { MembershipItem, MembershipStatus } from "types/Membership"
import { Box, RadioGroup, useTheme } from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css/pagination"
import { Pagination } from "swiper/modules"
import { Button } from "@components/Button"
import CustomInputButton from "@components/CustomInputButton"
import { useOverlay } from "contexts/ModalContext"
import DateAndTimeBottomSheet from "./_fragments/DateAndTimeBottomSheet"
import { Dayjs } from "dayjs"
import CustomTextField from "@components/CustomTextField"
import FixedButtonContainer from "@components/FixedButtonContainer"

interface FormDataType {
  item: undefined | number
  branch: undefined | number
  date: null | Dayjs
  time: null | string
  request: string
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
  const { openBottomSheet, closeOverlay } = useOverlay()
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const theme = useTheme()
  const [consultationSlot, setConsultationSlot] = useState(1)
  const [hasMembership, setHasMembership] = useState(true)
  const [itemOptions, setItemOptions] = useState(example_items)
  const [data, setData] = useState<FormDataType>({
    item: undefined,
    branch: undefined,
    date: null,
    time: null,
    request: "",
  })
  const [price, setPrice] = useState(10000)

  const handleOnChangeItem = (event: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, item: parseInt(event.target.value) })
  }

  const handleOpenCalendar = () => {
    openBottomSheet(
      <DateAndTimeBottomSheet
        onClose={closeOverlay}
        date={data.date}
        time={data.time}
        onSelect={(date, time) => {
          setData((prev) => ({
            ...prev,
            date,
            time,
          }))
        }}
      />,
      {
        height: "large",
      },
    )
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
    <div className="flex-1space-y-3 pb-32 overflow-y-auto overflow-x-hidden">
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
          <div>
            <p className="text-gray-500 text-sm">
              * 상담 예약은 월간 2회까지 이용 가능합니다.
            </p>
            {!hasMembership && (
              <p className="text-gray-500 text-sm mt-1">
                * 관리 프로그램은 회원권 구매 후 예약이 가능합니다.
              </p>
            )}
          </div>
        </RadioGroup>
      </section>
      <section className="px-5 py-6 border-b-8 border-[#f7f7f7]">
        <div>
          <p className="text-gray-700 text-base font-sb mb-3">예약 문진</p>
          <button
            type="button"
            onClick={() => {}}
            className="w-full bg-white border !border-gray-200 rounded-xl h-[61px] px-5 flex items-center justify-between cursor-pointer"
          >
            <span className="text-gray-700 text-sm font-bold leading-tight">
              예약문진 (등록완료)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-gray-200 text-sm font-normal leading-tight">
                2024.12.12 작성
              </span>
              <CaretRigthIcon
                className="w-4 h-4"
                color={theme.palette.grey[300]}
              />
            </div>
          </button>
        </div>
        <Button
          variantType="gray"
          size="small"
          className="w-full text-sm h-[40px] flex items-center justify-center mt-3"
        >
          새로 작성하기
        </Button>
      </section>
      <section className="px-5 py-6 border-b-8 border-[#f7f7f7]">
        <div className="flex flex-col gap-6">
          <CustomInputButton
            label="지점 선택"
            value={data.branch ? String(data.branch) : ""}
            placeholder="지점을 선택해주세요."
            iconRight={<CaretRigthIcon className="w-4 h-4" />}
            onClick={() => {
              //   TODO: navigate to branch selection page
            }}
          />
          <CustomInputButton
            label="예약 일시"
            value={
              data.date && data.time
                ? `${data.date.format("YYYY.MM.DD")} ${data.time}`
                : ""
            }
            placeholder="예약 날짜를 선택해주세요."
            iconRight={
              <CalendarIcon
                className="w-6 h-6"
                color={theme.palette.grey[300]}
              />
            }
            onClick={handleOpenCalendar}
          />
          <CustomTextField
            name="request"
            label="요청사항"
            placeholder="요청사항을 입력해주세요."
            value={data.request}
            onChange={(event) => {
              setData((prev) => ({
                ...prev,
                request: event.target.value,
              }))
            }}
          />
          <p className="text-gray-500 text-sm">
            * 예약 당일 취소, 노쇼의 경우 예약시 차감된 회원권 횟수가 반환되지
            않습니다.
          </p>
        </div>
      </section>
      <section className="px-5 py-6 ">
        <p className="font-m text-14px mb-2 text-gray-700">결제 금액</p>
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex justify-between">
            <p className="text-gray-400 text-sm font-medium">
              추가 관리 항목명
            </p>
            <p className="text-base font-medium">100,000원</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-400 text-sm font-medium">
              추가 관리 항목명
            </p>
            <p className="text-base font-medium">100,000원</p>
          </div>
        </div>
        <div className="w-full h-px bg-gray-100 my-4" />
        <div className="flex justify-between text-gray-700">
          <p>최종 결제 금액</p>
          <p className="text-xl font-bold">0원</p>
        </div>
      </section>
      <FixedButtonContainer className="bg-white">
        <Button
          variantType="primary"
          sizeType="l"
          onClick={() => {}}
          className="w-full"
        >
          {data.item === 0
            ? "예약하기"
            : `${price.toLocaleString()}원 결제하기`}
        </Button>
      </FixedButtonContainer>
    </div>
  )
}

export default ReservationFormPage
