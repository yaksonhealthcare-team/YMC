import React, { useState } from "react"
import { TextField } from "@mui/material"
import clsx from "clsx"
import { COLORS } from "@constants/ColorConstants"

interface TextAreaProps {
  placeholder?: string
  label?: string
  helperText?: string
  maxLength?: number
  value?: string
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const TextArea = (props: TextAreaProps) => {
  const { placeholder, label, helperText, maxLength = 100, disabled } = props
  const [value, setValue] = useState("")

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const isError = value.length > maxLength

  return (
    <div>
      {label && <p className="font-m text-14px text-gray-700 mb-2">{label}</p>}
      <TextField
        disabled={disabled}
        placeholder={placeholder}
        multiline
        rows={5}
        variant="outlined"
        fullWidth
        value={value}
        onChange={handleChange}
        error={isError}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            "& fieldset": {
              borderColor: isError ? COLORS.ERROR : COLORS.BORDER,
            },
            "&:hover fieldset": {
              borderColor: isError ? COLORS.ERROR : COLORS.BORDER,
            },
            "&.Mui-focused fieldset": {
              borderWidth: 1,
              borderColor: isError ? COLORS.ERROR : COLORS.FOCUSED_BORDER,
            },
            "&.Mui-disabled fieldset": {
              borderColor: COLORS.DISABLED_BORDER,
              backgroundColor: COLORS.DISABLED_BG,
            },
            "& textarea::placeholder": {
              color: COLORS.PLACEHOLDER,
              opacity: 1,
            },
            "& textarea.Mui-disabled": {
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
      <div
        className={`flex items-center mt-1 mx-2 ${helperText ? "justify-between" : "justify-end"}`}
      >
        {helperText && (
          <span
            className={clsx(
              "font-m text-12px",
              isError ? "text-error" : "text-gray-400",
            )}
          >
            {helperText}
          </span>
        )}
        <span
          className={clsx(
            "font-m text-12px",
            isError ? "text-error" : "text-gray-400",
          )}
        >
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  )
}

export default TextArea
