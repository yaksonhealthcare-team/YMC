import React from "react"
import { Button as MUIButton, ButtonProps } from "@mui/material"
import { styled } from "@mui/material/styles"

const CustomButton = styled(MUIButton)(({ theme }) => ({
  // 기본 상태 (Active)
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: "8px", // 모서리 둥글게
  padding: "8.5px 12px", // 버튼 패딩 설정
  textTransform: "none", // 버튼 텍스트 대문자 변환 해제

  "&:hover": {
    backgroundColor: theme.palette.primary.light, // Hover 상태
  },

  "&:active": {
    backgroundColor: theme.palette.primary.dark, // Pressed 상태
  },

  "&:disabled": {
    backgroundColor: theme.palette.action.disabledBackground, // Disabled 상태
    color: theme.palette.action.disabled, // Disabled 텍스트 색상
  },
}))

interface CustomButtonProps extends ButtonProps {
  variantType?: "primary" | "secondary" | "line" | "gray" | "text" // 버튼 타입
  sizeType?: "xs" | "s" | "m" | "l" // 사이즈 추가
  iconLeft?: React.ReactNode // 좌측 아이콘 설정
  iconRight?: React.ReactNode // 우측 아이콘 설정
}

export const Button: React.FC<CustomButtonProps> = ({
  variantType = "primary",
  sizeType = "m", // 기본값을 md로 설정
  iconLeft,
  iconRight,
  children = "Button", // 기본 텍스트 설정
  ...props
}) => {
  const variantClasses = {
    primary:
      "bg-primary text-white hover:bg-primary-400 active:bg-primary-500 disabled:bg-[#DCDCDC] disabled:text-gray-400",
    secondary:
      "bg-[#FEF2F1] text-primary-400 hover:bg-primary-100 active:bg-primary-200 disabled:bg-grey-50 disabled:text-gray-300",
    line: "border border-solid border-primary bg-white text-primary-400 hover:bg-[#FEF2F1] active:bg-primary-100 disabled:bg-white disabled:text-gray-300 disabled:border disabled:border-solid disabled:border-gray-300",
    gray: "bg-gray-100 text-black hover:bg-gray-50 active:bg-gray-200 disabled:bg-grey-50 disabled:text-gray-300",
    text: "bg-transparent text-primary hover:underline active:text-primary-400 active:bg-white",
  }

  const sizeClasses = {
    xs: "px-[8.5px] py-3 font-sb text-12px", // xs 사이즈 추가
    s: "px-[9.5px] py-3 font-sb text-14px",
    m: "px-3 py-4 font-sb text-16px",
    l: "px-[14.px] py-5 font-b text-16px",
  }

  const iconSize = {
    xs: "w-4 h-4",
    s: "w-4 h-4",
    m: "w-5 h-5",
    l: "w-5 h-5",
  }

  return (
    <CustomButton
      {...props}
      className={`${variantClasses[variantType]} ${sizeClasses[sizeType]} ${props.className}`}
      sx={{
        ...props.sx,
      }}
    >
      {iconLeft && (
        <span className={`${iconSize[sizeType]} flex mr-1.5`}>{iconLeft}</span>
      )}
      {children}
      {iconRight && (
        <span className={`${iconSize[sizeType]} flex ml-1.5`}>{iconRight}</span>
      )}
    </CustomButton>
  )
}
