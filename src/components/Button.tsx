import React from "react"
import { Button as MUIButton, ButtonProps } from "@mui/material"
import { styled } from "@mui/material/styles"

const CustomButton = styled(MUIButton)({
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    boxShadow: "none",
  },
})

interface CustomButtonProps extends Omit<ButtonProps, "children"> {
  variantType?: "primary" | "secondary" | "line" | "gray" | "text"
  sizeType?: "xs" | "s" | "m" | "l"
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  children?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      variantType = "primary",
      sizeType = "m",
      iconLeft,
      iconRight,
      children = "Button",
      className = "",
      ...props
    },
    ref,
  ) => {
    const variantClasses = {
      primary:
        "bg-primary text-white hover:bg-primary-400 active:bg-primary-500 disabled:bg-[#DCDCDC] disabled:text-gray-400 ",
      secondary:
        "bg-[#FEF2F1] text-primary-400 hover:bg-primary-100 active:bg-primary-200 disabled:bg-grey-50 disabled:text-gray-300 ",
      line: "border border-solid border-primary bg-white text-primary-400 hover:bg-[#FEF2F1] active:bg-primary-100 disabled:bg-white disabled:text-gray-300 disabled:border disabled:border-solid disabled:border-gray-300 ",
      gray: "bg-gray-100 text-black hover:bg-gray-50 active:bg-gray-200 disabled:bg-grey-50 disabled:text-gray-300 ",
      text: "bg-transparent text-primary hover:underline active:text-primary-400 active:bg-white ",
    }

    const sizeClasses = {
      xs: "px-[8.5px] py-3 font-sb text-12px ",
      s: "px-[9.5px] py-3 font-sb text-14px ",
      m: "px-3 py-4 font-sb text-16px ",
      l: "px-[14.px] py-5 font-b text-16px ",
    }

    const iconSize = {
      xs: "w-4 h-4 ",
      s: "w-4 h-4 ",
      m: "w-5 h-5 ",
      l: "w-5 h-5 ",
    }

    const baseClasses = `${variantClasses[variantType]} ${className}`

    return (
      <CustomButton
        ref={ref}
        disableRipple
        {...props}
        className={`rounded-lg ${baseClasses} ${sizeClasses[sizeType]}`}
        sx={{
          "&.MuiButtonBase-root": {
            boxShadow: "none !important",
            "&:hover": {
              boxShadow: "none !important",
            },
          },
          ...props.sx,
        }}
      >
        {iconLeft && (
          <span className={`${iconSize[sizeType]} flex mr-1.5`}>
            {iconLeft}
          </span>
        )}
        {children}
        {iconRight && (
          <span className={`${iconSize[sizeType]} flex ml-1.5`}>
            {iconRight}
          </span>
        )}
      </CustomButton>
    )
  },
)

Button.displayName = "Button"
