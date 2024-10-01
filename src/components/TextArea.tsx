import React, { useState } from "react"
import { TextField } from "@mui/material"

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
              borderColor: isError ? "#FF453A" : "#ECECEC",
            },
            "&:hover fieldset": {
              borderColor: isError ? "#FF453A" : "#ECECEC",
            },
            "&.Mui-focused fieldset": {
              borderWidth: 1,
              borderColor: isError ? "#FF453A" : "#757575",
            },
            "&.Mui-disabled fieldset": {
              borderColor: "#ECECEC",
              backgroundColor: "#F8F8F8",
            },
            "& textarea::placeholder": {
              color: "#BDBDBD",
              opacity: 1,
            },
            "& textarea.Mui-disabled": {
              zIndex: 1,
              WebkitTextFillColor: "#DDDDDD",
            },
          },
          "& .MuiInputLabel-root": {
            fontSize: "12px",
            color: "#6B7280",
          },
        }}
      />
      <div
        className={`flex items-center mt-1 mx-2 ${helperText ? "justify-between" : "justify-end"}`}
      >
        {helperText && (
          <span className="font-m text-12px text-gray-400">{helperText}</span>
        )}
        <span className="font-m text-12px text-gray-400">
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  )
}

export default TextArea
