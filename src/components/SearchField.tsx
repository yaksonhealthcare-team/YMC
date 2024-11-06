import { InputAdornment, TextField, TextFieldProps } from "@mui/material"
import SearchIcon from "@components/icons/SearchIcon"
import XCircleIcon from "@components/icons/XCircleIcon"
import { COLORS } from "@constants/ColorConstants"

type SearchFieldProps = TextFieldProps & {
  placeholder?: string
  value: string
  disabled?: boolean
  onClear?: () => void
}

export const SearchField = ({ placeholder, value, onClear, ...props }: SearchFieldProps) => {
  return (
    <div className="flex items-center">
      <TextField
        placeholder={placeholder}
        value={value}
        variant="outlined"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {<SearchIcon className="w-6 h-6" />}
            </InputAdornment>
          ),
          endAdornment: onClear && (
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
        {...props}
      />
    </div>
  )
}
