import React from "react"
import { TextField, InputAdornment } from "@mui/material"
import { Button } from "@components/Button"
import { COLORS } from "@constants/ColorConstants"

interface CustomTextFieldProps {
  placeholder?: string
  label?: string
  value: string
  state?: "default" | "error" | "success"
  helperText?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  button?: React.ReactNode
  disabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  placeholder,
  label,
  value,
  state = "default",
  helperText,
  iconLeft,
  iconRight,
  button,
  disabled,
  onChange,
}) => {
  // disabled 시, 아이콘 색상 변경을 위한 설정
  const iconColor = disabled ? COLORS.DISABLED_TEXT : "black"

  // 좌측 아이콘 색상 적용
  const modifiedIconLeft =
    iconLeft &&
    React.cloneElement(iconRight as React.ReactElement<any>, {
      color: iconColor, // 색상을 전달
    })

  // 우측 아이콘 색상 적용
  const modifiedIconRight =
    iconRight &&
    React.cloneElement(iconRight as React.ReactElement<any>, {
      color: iconColor, // 색상을 전달
    })

  return (
    <div>
      {label && <p className="font-m text-14px text-gray-700 mb-2">{label}</p>}
      <div className="flex items-center">
        <TextField
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: modifiedIconLeft && (
              <InputAdornment position="start" sx={{ zIndex: 1 }}>
                {modifiedIconLeft}
              </InputAdornment>
            ),
            endAdornment: modifiedIconRight && (
              <InputAdornment position="end" sx={{ zIndex: 1 }}>
                {modifiedIconRight}
              </InputAdornment>
            ),
          }}
          sx={{
            width: "auto",
            flex: 1,
            "& .MuiOutlinedInput-root": {
              borderColor: state === "default" ? "#ECECEC" : undefined,
              borderRadius: "12px",
              "& fieldset": {
                borderColor:
                  state === "error"
                    ? COLORS.ERROR
                    : state === "success"
                      ? COLORS.SUCCESS
                      : COLORS.BORDER,
              },
              "&:hover fieldset": {
                borderColor:
                  state === "error"
                    ? COLORS.ERROR
                    : state === "success"
                      ? COLORS.SUCCESS
                      : COLORS.BORDER,
              },
              "&.Mui-focused fieldset": {
                borderWidth: 1,
                borderColor:
                  state === "error"
                    ? COLORS.ERROR
                    : state === "success"
                      ? COLORS.SUCCESS
                      : COLORS.FOCUSED_BORDER,
              },
              "&.Mui-disabled fieldset": {
                borderColor: "white",
                backgroundColor: COLORS.DISABLED_BG,
              },
              "& input::placeholder": {
                color: COLORS.PLACEHOLDER,
                opacity: 1,
              },
              "& input.Mui-disabled": {
                zIndex: 1,
                WebkitTextFillColor: COLORS.DISABLED_TEXT,
              },
            },
            "& .MuiInputLabel-root": {
              fontSize: "12px",
              color: COLORS.LABEL,
            },
          }}
        />
        {button && <Button disabled={disabled} className="ml-1" />}
      </div>
      {helperText && (
        <p className="font-m text-12px text-gray-400 mt-1 ml-2">{helperText}</p>
      )}
    </div>
  )
}

export default CustomTextField
