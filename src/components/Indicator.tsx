import { Box } from "@mui/material"

interface IndicatorProps {
  total: number // 총 슬라이드 또는 페이지 개수
  current: number // 현재 슬라이드 또는 페이지 번호
  onChange: (index: number) => void // 슬라이드를 변경할 때 실행될 함수
}

export const Indicator = (props: IndicatorProps) => {
  const { total, current, onChange } = props

  return (
    <Box className="flex justify-center items-center gap-[5px]">
      {Array.from({ length: total }).map((_, index) => (
        <Box
          key={index}
          className={`w-1.5 h-1.5 rounded-full cursor-pointer ${
            index === current ? "bg-primary" : "border border-gray-200 bg-white"
          }`}
          onClick={() => onChange(index)}
        />
      ))}
    </Box>
  )
}
