import React from "react"
import { InputAdornment, TextField } from "@mui/material"
import { Button } from "@components/Button"
import { COLORS } from "@constants/ColorConstants"

interface CustomTextFieldProps {
  name?: string
  type?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  label?: string
  helperText?: string
  state?: "default" | "error" | "success"
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  button?: React.ReactNode
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CustomTextField = React.forwardRef<
  HTMLInputElement,
  CustomTextFieldProps
>((props, ref) => {
  const {
    name,
    type = "text",
    value,
    placeholder,
    disabled,
    label,
    helperText,
    state = "default",
    iconLeft,
    iconRight,
    button,
    onChange,
  } = props

  return (
    <div>
      {label && <p className="font-m text-14px text-gray-700 mb-2">{label}</p>}
      <div className="flex items-center">
        <TextField
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: iconLeft && (
              <InputAdornment position="start">{iconLeft}</InputAdornment>
            ),
            endAdornment: iconRight && (
              <InputAdornment position="end">{iconRight}</InputAdornment>
            ),
          }}
          sx={{
            width: "auto",
            flex: 1,
            "& .MuiOutlinedInput-root": {
              borderColor: state === "default" ? COLORS.BORDER : undefined,
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
          ref={ref}
        />
        {button && <Button disabled={disabled} className="ml-1" />}
      </div>
      {helperText && (
        <p className="font-m text-12px text-gray-400 mt-1 ml-2">{helperText}</p>
      )}
    </div>
  )
})

CustomTextField.displayName = "CustomTextField"

export default CustomTextField
