import { ChangeEventHandler } from "react"
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@components/icons/SearchIcon";
import XCircleIcon from "@components/icons/XCircleIcon";
import { COLORS } from "@constants/ColorConstants";

interface SearchFieldProps {
  placeholder?: string
  value?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  disabled?: boolean
  onClear?: () => void
  onFocus?: () => void
  onBlur?: () => void
}

export const SearchField = ({
  placeholder,
  value,
  onChange,
  disabled,
  onClear,
  onFocus,
  onBlur,
}: SearchFieldProps) => (
  <TextField
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onFocus={onFocus}
    onBlur={onBlur}
    disabled={disabled}
    variant="outlined"
    fullWidth
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon className="w-6 h-6" />
        </InputAdornment>
      ),
      endAdornment: onClear && (
        <InputAdornment position="end">
          <XCircleIcon className="w-5 h-5 cursor-pointer" onClick={onClear} />
        </InputAdornment>
      ),
    }}
    sx={{
      "& .MuiOutlinedInput-root": {
        paddingX: 2,
        borderColor: COLORS.BORDER,
        borderRadius: "12px",
        "& fieldset": { borderColor: COLORS.BORDER },
        "&:hover fieldset": { borderColor: COLORS.BORDER },
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
)