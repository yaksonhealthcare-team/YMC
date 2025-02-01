import { useLayout } from "contexts/LayoutContext"
import { ChangeEvent, useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import CaretRigthIcon from "@assets/icons/CaretRightIcon.svg?react"
import CalendarIcon from "@assets/icons/CalendarIcon.svg?react"
import { RadioCard } from "@components/RadioCard"
import { MembershipRadioCard } from "./_fragments/MembershipRadioCard"
import { AdditionalManagement } from "types/Membership"
import { Box, RadioGroup, useTheme } from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { Pagination } from "swiper/modules"
import { Button } from "@components/Button"
import CustomInputButton from "@components/CustomInputButton"
import { useOverlay } from "contexts/ModalContext"
import DateAndTimeBottomSheet from "./_fragments/DateAndTimeBottomSheet"
import { Dayjs } from "dayjs"
import CustomTextField from "@components/CustomTextField"
import FixedButtonContainer from "@components/FixedButtonContainer"
import { ClockIcon } from "@mui/x-date-pickers"
import { useAdditionalManagement } from "../../queries/useMembershipQueries.tsx"
import { TimeSlot } from "../../types/Schedule.ts"
import { Checkbox } from "@mui/material"
import { useMembershipList } from "../../queries/useMembershipQueries.tsx"
import { useMembershipOptionsStore } from "../../hooks/useMembershipOptions"
import LoadingIndicator from "@components/LoadingIndicator.tsx"

interface FormDataType {
  item: undefined | string
  branch: undefined | string
  date: null | Dayjs
  timeSlot: null | TimeSlot
  request: string
  additionalServices: AdditionalManagement[]
}

const BRAND_CODE = "001" // 약손명가

const ReservationFormPage = () => {
  const { openBottomSheet, closeOverlay } = useOverlay()
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const [consultationSlot] = useState(1)
  const { selectedBranch, clear } = useMembershipOptionsStore()

  const { data: membershipsData, isLoading: isMembershipsLoading } =
    useMembershipList(BRAND_CODE)

  const [data, setData] = useState<FormDataType>({
    item: undefined,
    branch: undefined,
    date: null,
    timeSlot: null,
    request: "",
    additionalServices: [],
  })

  const { data: additionalManagements, isLoading: isAdditionalLoading } =
    useAdditionalManagement(data.item)

  const handleOnChangeItem = (event: ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({
      ...prev,
      item: event.target.value,
      additionalServices: [],
    }))
  }

  const handleOpenCalendar = () => {
    if (!data.item) return

    openBottomSheet(
      <DateAndTimeBottomSheet
        onClose={closeOverlay}
        date={data.date}
        time={data.timeSlot}
        onSelect={(date, timeSlot) => {
          setData((prev) => ({
            ...prev,
            date,
            timeSlot,
          }))
        }}
        membershipIndex={data.item === "상담 예약" ? 0 : Number(data.item)}
        addServices={data.additionalServices.map((service) =>
          Number(service.am_idx),
        )}
        b_idx={selectedBranch?.id || ""}
      />,
    )
  }

  useEffect(() => {
    setHeader({
      display: true,
      title: "예약하기",
      left: "back",
      onClickBack: () => {
        navigate(-1)
        clear()
      },
      backgroundColor: "bg-white",
    })
    setNavigation({ display: false })

    if (selectedBranch) {
      setData((prev) => ({
        ...prev,
        branch: selectedBranch.id,
      }))
    }

    if (location.state?.selectedItem) {
      setData((prev) => ({
        ...prev,
        item: location.state.selectedItem,
      }))
    }
  }, [selectedBranch, location.state])

  const totalPrice = data.additionalServices.reduce((sum, service) => {
    const optionPrice = service.options?.[0]?.ss_price?.replace(/,/g, "")
    return sum + (optionPrice ? Number(optionPrice) : 0)
  }, 0)

  if (isMembershipsLoading || isAdditionalLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  return (
    <div className="flex-1 space-y-3 pb-32 overflow-y-auto overflow-x-hidden">
      <section className="px-5 pt-2 pb-6 border-b-8 border-[#f7f7f7]">
        <RadioGroup
          className="flex flex-col space-y-4"
          value={data.item}
          onChange={handleOnChangeItem}
        >
          <div>
            <RadioCard checked={data.item === "상담 예약"} value="상담 예약">
              <div className="justify-start items-center gap-2 flex">
                <div className="text-gray-700 text-16px font-sb">상담 예약</div>
                <div className="px-2 py-0.5 bg-tag-greenBg rounded-[999px] justify-center items-center flex">
                  <div className="text-center text-tag-green text-12px font-m">
                    {consultationSlot}회
                  </div>
                </div>
              </div>
            </RadioCard>
          </div>
          {!isMembershipsLoading && membershipsData?.pages[0]?.body && (
            <Box className="w-full">
              <Swiper
                modules={[Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                style={{ overflow: "visible" }}
                className="w-full"
                pagination={{
                  clickable: true,
                }}
              >
                <style>
                  {`
                    .swiper-pagination-bullet {
                      width: 6px;
                      height: 6px;
                      background: #DDDDDD;
                      opacity: 1;
                    }
                    .swiper-pagination-bullet-active {
                      background: #F37165;
                    }
                  `}
                </style>
                {membershipsData.pages[0].body.map((membership) => (
                  <SwiperSlide key={membership.s_idx}>
                    <div>
                      <MembershipRadioCard
                        membership={membership}
                        checked={data.item === membership.s_idx}
                        value={membership.s_idx}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          )}
        </RadioGroup>
      </section>
      <section className="px-5 py-6 border-b-8 border-[#f7f7f7]">
        <div>
          <p className="text-gray-700 text-base font-sb mb-3">예약 문진</p>
          <button
            type="button"
            onClick={() => {
              navigate("/mypage/questionnaire/reservation")
            }}
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
          onClick={() => {
            navigate("/questionnaire/reservation")
          }}
        >
          새로 작성하기
        </Button>
      </section>
      {!isAdditionalLoading &&
        additionalManagements &&
        additionalManagements.body.length > 0 &&
        data.item !== "상담 예약" && (
          <section className="px-5 py-6 border-b-8 border-[#f7f7f7]">
            <p className="font-m text-14px text-gray-700 mb-4">
              추가관리 (선택)
            </p>
            <div className="flex flex-col gap-3">
              {additionalManagements.body.map((option) => {
                const isChecked = data.additionalServices.some(
                  (service) => service.am_idx === option.am_idx,
                )
                return (
                  <div
                    key={option.am_idx}
                    className="p-5 bg-white rounded-xl border border-gray-100 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-[#212121] text-16px font-m leading-[23.68px]">
                        {option.s_name}
                      </p>
                      <Checkbox
                        checked={isChecked}
                        onChange={() => {
                          setData((prev) => {
                            // 이미 선택된 항목인지 확인
                            const existingIndex =
                              prev.additionalServices.findIndex(
                                (service) => service.am_idx === option.am_idx,
                              )

                            // 새로운 additionalServices 배열 생성
                            const newAdditionalServices = [
                              ...prev.additionalServices,
                            ]

                            if (existingIndex >= 0) {
                              // 이미 선택된 항목이면 제거
                              newAdditionalServices.splice(existingIndex, 1)
                            } else {
                              // 선택되지 않은 항목이면 추가
                              newAdditionalServices.push({
                                am_idx: option.am_idx,
                                s_name: option.s_name,
                                s_time: option.s_time,
                                options: option.options,
                              })
                            }

                            return {
                              ...prev,
                              additionalServices: newAdditionalServices,
                            }
                          })
                        }}
                        sx={{
                          width: 20,
                          height: 20,
                          padding: 0,
                          "& .MuiSvgIcon-root": {
                            width: 20,
                            height: 20,
                          },
                          "&.Mui-checked": {
                            color: "#F37165",
                          },
                          "&:not(.Mui-checked)": {
                            color: "#DDDDDD",
                          },
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-gray-500 text-14px font-r leading-[20.72px]">
                          {Number(option.s_time || 0)}분 소요
                        </span>
                      </div>
                      <p className="text-[#212121] text-16px font-bold leading-[23.68px]">
                        {option.options?.[0]?.ss_price || "0"}원
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

      <section className="px-5 py-6 border-b-8 border-[#f7f7f7]">
        <div className="flex flex-col gap-6">
          <CustomInputButton
            label="지점 선택"
            value={selectedBranch ? selectedBranch.name : ""}
            placeholder="지점을 선택해주세요."
            iconRight={<CaretRigthIcon className="w-4 h-4" />}
            onClick={() => {
              if (!data.item) {
                alert("회원권을 먼저 선택해주세요.")
                return
              }
              navigate("/membership/select-branch", {
                state: {
                  returnPath: "/reservation/form",
                  selectedItem: data.item,
                },
                replace: true,
              })
            }}
          />
          <CustomInputButton
            label="예약 일시"
            value={
              data.date && data.timeSlot
                ? `${data.date.format("YYYY.MM.DD")} ${data.timeSlot.time}`
                : ""
            }
            placeholder="예약 날짜를 선택해주세요."
            iconRight={
              <CalendarIcon
                className="w-6 h-6"
                color={theme.palette.grey[300]}
              />
            }
            onClick={() => {
              if (!data.item) {
                alert("회원권을 먼저 선택해주세요.")
                return
              }
              if (!data.branch) {
                alert("지점을 먼저 선택해주세요.")
                return
              }
              handleOpenCalendar()
            }}
          />
          <CustomTextField
            name="request"
            label="요청사항"
            placeholder="요청사항을 입력해주세요."
            value={data.request}
            onChange={(event) => {
              const value = event.target.value
              if (value.length > 100) {
                alert("요청사항은 100자 이내로 입력해주세요.")
                return
              }
              setData((prev) => ({
                ...prev,
                request: value,
              }))
            }}
            helperText={`${data.request.length}/100`}
          />
          <p className="text-gray-500 text-sm">
            * 예약 당일 취소, 노쇼의 경우 예약시 차감된 회원권 횟수가 반환되지
            않습니다.
          </p>
        </div>
      </section>
      <section className="px-5 py-6">
        <p className="font-m text-14px mb-2 text-gray-700">결제 금액</p>
        <div className="flex flex-col gap-3 mt-4">
          {data.additionalServices.map((service) => (
            <div key={service.am_idx} className="flex justify-between">
              <p className="text-gray-400 text-sm font-medium">
                {service.s_name}
              </p>
              <p className="text-base font-medium">
                {service.options?.[0]?.ss_price || "0"}원
              </p>
            </div>
          ))}
        </div>
        <div className="w-full h-px bg-gray-100 my-4" />
        <div className="flex justify-between items-center">
          <p className="text-gray-700 text-base font-sb">총 결제금액</p>
          <p className="text-primary text-xl font-bold">
            {totalPrice.toLocaleString()}원
          </p>
        </div>
      </section>
      <FixedButtonContainer className="bg-white">
        <Button
          variantType="primary"
          sizeType="l"
          onClick={() => {}}
          className="w-full"
        >
          {data.item === "0"
            ? "예약하기"
            : `${totalPrice.toLocaleString()}원 결제하기`}
        </Button>
      </FixedButtonContainer>
    </div>
  )
}

export default ReservationFormPage
