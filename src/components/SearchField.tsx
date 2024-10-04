import React from "react"
import { TextField, InputAdornment } from "@mui/material"
import SearchIcon from "@components/icons/SearchIcon"
import XCircleIcon from "@components/icons/XCircleIcon"

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
            borderColor: "#ECECEC",
            borderRadius: "12px",
            "& fieldset": {
              borderColor: "#ECECEC",
            },
            "&:hover fieldset": {
              borderColor: "#ECECEC",
            },
            "&.Mui-focused fieldset": {
              borderWidth: 1,
              borderColor: "#757575",
            },
            "& input::placeholder": {
              color: "#BDBDBD",
              opacity: 1,
            },
          },
        }}
      />
    </div>
  )
}

export default SearchField
