import { Checkbox } from "@mui/material"
import { ClockIcon } from "@mui/x-date-pickers"
import { AdditionalManagement } from "types/Membership"
import { parsePrice } from "utils/format"

interface AdditionalServiceCardProps {
  option: AdditionalManagement
  isChecked: boolean
  onChangeService: (checked: boolean, service: AdditionalManagement) => void
}

export const AdditionalServiceCard = ({
  option,
  isChecked,
  onChangeService,
}: AdditionalServiceCardProps) => {
  return (
    <div
      key={option.s_idx}
      className="p-5 bg-white rounded-xl border border-gray-100 flex flex-col gap-2"
    >
      <div className="flex justify-between items-center">
        <p className="text-[#212121] text-16px font-m leading-[23.68px]">
          {option.s_name}
        </p>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          aria-label={`${option.s_name} ${isChecked ? "선택 해제" : "선택"}`}
          className=" rounded"
        >
          <Checkbox
            checked={isChecked}
            onChange={(e) => {
              e.stopPropagation()
              onChangeService(e.target.checked, {
                s_idx: option.s_idx,
                s_name: option.s_name,
                s_time: option.s_time,
                options: option.options,
              })
            }}
            sx={{
              width: 20,
              height: 20,
              padding: 0,
              backgroundColor: "bg-white",
              "& .MuiSvgIcon-root": {
                width: 20,
                height: 20,
              },
              "&.Mui-checked": {
                color: "#F37165",
                backgroundColor: "bg-white",
              },
              "&:not(.Mui-checked)": {
                color: "#DDDDDD",
                backgroundColor: "bg-white",
              },
              "&:hover": {
                backgroundColor: "bg-white",
              },
            }}
          />
        </button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-gray-500 text-14px font-r leading-[20.72px]">
            {Number(option.s_time || 0)}분 소요
          </span>
        </div>
        <p className="text-[#212121] text-16px font-bold leading-[23.68px]">
          {parsePrice(option.options?.[0]?.ss_price).toLocaleString()}원
        </p>
      </div>
    </div>
  )
}
