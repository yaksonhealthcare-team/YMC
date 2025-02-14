import { useLayout } from "contexts/LayoutContext"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { RadioCard } from "@components/RadioCard"
import { AdditionalManagement } from "types/Membership"
import { RadioGroup } from "@mui/material"
import { Button } from "@components/Button"
import { useOverlay } from "contexts/ModalContext"
import DateAndTimeBottomSheet from "./_fragments/DateAndTimeBottomSheet"
import { Dayjs } from "dayjs"
import FixedButtonContainer from "@components/FixedButtonContainer"
import { useAdditionalManagement } from "../../queries/useMembershipQueries.tsx"
import { TimeSlot } from "../../types/Schedule.ts"
import { useMembershipList } from "../../queries/useMembershipQueries.tsx"
import { useMembershipOptionsStore } from "../../hooks/useMembershipOptions"
import LoadingIndicator from "@components/LoadingIndicator.tsx"
import { useCreateReservationMutation } from "../../queries/useReservationQueries"
import { useQuery } from "@tanstack/react-query"
import { getConsultationCount } from "../../apis/reservation.api"
import { MembershipSwiper } from "@components/MembershipSwiper"
import { AdditionalServiceCard } from "@components/AdditionalServiceCard"
import { ReservationFormSection } from "./_fragments/ReservationFormSection"
import { ReservationSummarySection } from "./_fragments/ReservationSummarySection"
import { useErrorHandler } from "hooks/useErrorHandler"
import { formatPrice, parsePrice } from "utils/format"
import { formatDateForAPI } from "utils/date"
import { toNumber } from "utils/number"

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
  const { openBottomSheet, closeOverlay, openAlert } = useOverlay()
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedBranch, clear } = useMembershipOptionsStore()
  const { data: consultationCount = 0 } = useQuery({
    queryKey: ["consultationCount"],
    queryFn: getConsultationCount,
  })
  const { mutateAsync: createReservation } = useCreateReservationMutation()
  const { handleError } = useErrorHandler()

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

  const handleOnChangeItem = (value: string) => {
    setData((prev) => ({
      ...prev,
      item: value,
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
          Number(service.s_idx),
        )}
        b_idx={selectedBranch?.b_idx || ""}
      />,
      { height: "large" },
    )
  }

  const handleAdditionalServiceChange = (
    checked: boolean,
    service: AdditionalManagement,
  ) => {
    setData((prev) => {
      const newServices = checked
        ? [...prev.additionalServices, service]
        : prev.additionalServices.filter((s) => s.s_idx !== service.s_idx)

      return {
        ...prev,
        additionalServices: newServices,
      }
    })
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
        branch: selectedBranch.b_idx,
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
    const optionPrice = service.options?.[0]?.ss_price
    return sum + (optionPrice ? parsePrice(optionPrice) : 0)
  }, 0)

  const renderAdditionalManagementSection = () => {
    if (data.item === "상담 예약" || isAdditionalLoading) return null

    if (!additionalManagements?.body?.length) return null

    return (
      <section className="px-5 py-6 border-b-8 border-[#f7f7f7]">
        <p className="font-m text-14px text-gray-700 mb-4">추가관리 (선택)</p>
        <div className="flex flex-col gap-3">
          {additionalManagements.body.map((option) => {
            const isChecked = data.additionalServices.some(
              (service) => service.s_idx === option.s_idx,
            )
            return (
              <AdditionalServiceCard
                key={option.s_idx}
                option={option}
                isChecked={isChecked}
                onChangeService={handleAdditionalServiceChange}
              />
            )
          })}
        </div>
      </section>
    )
  }

  const validateReservationData = () => {
    if (!data.item) {
      handleError(new Error("회원권을 먼저 선택해주세요."))
      return false
    }
    if (!data.date || !data.timeSlot) {
      handleError(new Error("예약 날짜와 시간을 선택해주세요."))
      return false
    }
    if (!data.branch) {
      handleError(new Error("지점을 선택해주세요."))
      return false
    }
    return true
  }

  const handleConsultationReservation = async () => {
    try {
      if (!validateReservationData()) return

      const response = await createReservation({
        r_gubun: "C",
        b_idx: data.branch!,
        r_date: formatDateForAPI(data.date?.toDate() || null),
        r_stime: data.timeSlot!.time,
        r_memo: data.request,
      })

      if (response.resultCode !== "00") {
        handleError(new Error(response.resultMessage))
        return
      }

      openAlert({
        title: "예약 완료",
        description: "상담 예약이 완료되었습니다.",
      })

      if (location.state?.returnPath) {
        navigate(location.state.returnPath, {
          state: {
            ...location.state,
            type: data.item,
            branch: data.branch,
            date: data.date?.format("YYYY-MM-DD"),
            time: data.timeSlot?.time,
            additionalServices: data.additionalServices,
            request: data.request,
          },
        })
      }
    } catch (error) {
      handleError(error, "상담 예약에 실패했습니다. 다시 시도해주세요.")
    }
  }

  const handleMembershipReservation = async () => {
    try {
      if (!validateReservationData()) return

      const response = await createReservation({
        r_gubun: "R",
        mp_idx: data.item,
        b_idx: data.branch!,
        r_date: formatDateForAPI(data.date?.toDate() || null),
        r_stime: data.timeSlot!.time,
        add_services: data.additionalServices.map((service) =>
          toNumber(service.s_idx),
        ),
        r_memo: data.request,
      })

      if (response.resultCode !== "00") {
        handleError(new Error(response.resultMessage))
        return
      }

      navigate("/payment", {
        state: {
          type: "reservation",
          items: [
            {
              type: data.item,
              branch: data.branch,
              date: data.date!.format("YYYY-MM-DD"),
              time: data.timeSlot!.time,
              additionalServices: data.additionalServices,
              request: data.request,
            },
          ],
        },
        replace: true,
      })
    } catch (error) {
      handleError(error, "예약에 실패했습니다. 다시 시도해주세요.")
    }
  }

  if (isMembershipsLoading) {
    return <LoadingIndicator className="min-h-screen" />
  }

  return (
    <div className="flex-1 space-y-3 pb-32 overflow-y-auto overflow-x-hidden">
      <section className="px-5 pt-2 pb-6 border-b-8 border-[#f7f7f7]">
        <RadioGroup
          className="flex flex-col space-y-4"
          value={data.item}
          onChange={(e) => handleOnChangeItem(e.target.value)}
        >
          <div>
            <RadioCard checked={data.item === "상담 예약"} value="상담 예약">
              <div className="justify-start items-center gap-2 flex">
                <div className="text-gray-700 text-16px font-sb">상담 예약</div>
                <div className="px-2 py-0.5 bg-tag-greenBg rounded-[999px] justify-center items-center flex">
                  <div className="text-center text-tag-green text-12px font-m">
                    {consultationCount === 0
                      ? "FREE"
                      : `${consultationCount}/2`}
                  </div>
                </div>
              </div>
            </RadioCard>
          </div>
          {!isMembershipsLoading && membershipsData?.pages[0] && (
            <MembershipSwiper
              membershipsData={membershipsData.pages[0]}
              selectedItem={data.item}
              onChangeItem={handleOnChangeItem}
            />
          )}
        </RadioGroup>
      </section>

      {renderAdditionalManagementSection()}

      <ReservationFormSection
        data={data}
        selectedBranch={selectedBranch}
        onOpenCalendar={handleOpenCalendar}
        onChangeRequest={(value) =>
          setData((prev) => ({ ...prev, request: value }))
        }
        onNavigateBranchSelect={() => {
          if (!data.item) {
            handleError(new Error("회원권을 먼저 선택해주세요."))
            return
          }
          navigate("/membership/select-branch", {
            state: {
              returnPath: "/reservation/form",
              selectedItem: data.item,
              brand_code: BRAND_CODE,
            },
          })
        }}
      />

      {data.item !== "상담 예약" && (
        <ReservationSummarySection
          additionalServices={data.additionalServices}
          totalPrice={totalPrice}
        />
      )}

      <FixedButtonContainer className="bg-white">
        <Button
          variantType="primary"
          sizeType="l"
          onClick={async () => {
            if (!validateReservationData()) return

            if (data.item === "상담 예약") {
              await handleConsultationReservation()
              return
            }

            await handleMembershipReservation()
          }}
          className="w-full"
        >
          {data.item === "상담 예약"
            ? "예약하기"
            : `${formatPrice(totalPrice)}원 결제하기`}
        </Button>
      </FixedButtonContainer>
    </div>
  )
}

export default ReservationFormPage
