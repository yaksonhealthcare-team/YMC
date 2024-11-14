import React from "react"
import { Button as MUIButton, ButtonProps } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledButton = styled(MUIButton)({
  textTransform: "none",
  boxShadow: "none",
  "&:hover": { boxShadow: "none" },
})

const VARIANT_STYLES = {
  primary:
    "bg-primary text-white hover:bg-primary-400 active:bg-primary-500 disabled:bg-[#DCDCDC] disabled:text-gray-400",
  secondary:
    "bg-[#FEF2F1] text-primary-400 hover:bg-primary-100 active:bg-primary-200 disabled:bg-grey-50 disabled:text-gray-300",
  line: "border border-solid border-primary bg-white text-primary-400 hover:bg-[#FEF2F1] active:bg-primary-100 disabled:bg-white disabled:text-gray-300 disabled:border disabled:border-solid disabled:border-gray-300",
  gray: "bg-gray-100 text-black hover:bg-gray-50 active:bg-gray-200 disabled:bg-grey-50 disabled:text-gray-300",
  text: "bg-transparent text-primary hover:underline active:text-primary-400 active:bg-white",
} as const

const SIZE_STYLES = {
  xs: "px-[8.5px] py-3 font-sb text-12px",
  s: "px-[9.5px] py-3 font-sb text-14px",
  m: "px-3 py-4 font-sb text-16px",
  l: "px-[14.px] py-5 font-b text-16px",
} as const

const ICON_SIZES = {
  xs: "w-4 h-4",
  s: "w-4 h-4",
  m: "w-5 h-5",
  l: "w-5 h-5",
} as const

interface CustomButtonProps extends ButtonProps {
  variantType?: keyof typeof VARIANT_STYLES
  sizeType?: keyof typeof SIZE_STYLES
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

export const Button = ({
  variantType = "primary",
  sizeType = "m",
  iconLeft,
  iconRight,
  children = "Button",
  className = "",
  ...props
}: CustomButtonProps) => (
  <StyledButton
    {...props}
    className={`rounded-lg ${className || VARIANT_STYLES[variantType]} ${SIZE_STYLES[sizeType]}`}
  >
    {iconLeft && (
      <span className={`${ICON_SIZES[sizeType]} flex mr-1.5`}>{iconLeft}</span>
    )}
    {children}
    {iconRight && (
      <span className={`${ICON_SIZES[sizeType]} flex ml-1.5`}>{iconRight}</span>
    )}
  </StyledButton>
)

Button.displayName = "Button"
