import React from "react"
import { TextField, InputAdornment } from "@mui/material"
import SearchIcon from "@components/icons/SearchIcon"
import XCircleIcon from "@components/icons/XCircleIcon"
import { COLORS } from "@constants/ColorConstants"

interface SearchFieldProps {
  placeholder?: string
  value: string
  disabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear?: () => void
}

const SearchField = (props: SearchFieldProps) => {
  const { placeholder, value, onChange, onClear } = props

  return (
    <div className="flex items-center">
      <TextField
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        variant="outlined"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {<SearchIcon className="w-6 h-6" />}
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {
                <XCircleIcon
                  className="w-5 h-5"
                  onClick={onClear}
                  sx={{ cursor: "pointer" }}
                />
              }
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            paddingX: 2,
            borderColor: COLORS.BORDER,
            borderRadius: "12px",
            "& fieldset": {
              borderColor: COLORS.BORDER,
            },
            "&:hover fieldset": {
              borderColor: COLORS.BORDER,
            },
            "&.Mui-focused fieldset": {
              borderWidth: 1,
              borderColor: COLORS.FOCUSED_BORDER,
            },
            "& input::placeholder": {
              color: COLORS.PLACEHOLDER,
              opacity: 1,
            },
          },
        }}
      />
    </div>
  )
}

export default SearchField
