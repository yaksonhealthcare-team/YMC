import { type ChangeEvent, forwardRef, type ReactNode } from "react"
import { InputAdornment, TextField } from "@mui/material"
import { Button } from "@components/Button"
import { COLORS } from "@constants/ColorConstants"

const STATE_COLORS = {
  default: COLORS.BORDER,
  error: COLORS.ERROR,
  success: COLORS.SUCCESS,
} as const

const TEXT_FIELD_STYLES = {
  root: {
    width: "auto",
    flex: 1,
  },
  input: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      "& fieldset": {
        borderColor: (state: keyof typeof STATE_COLORS) => STATE_COLORS[state],
      },
      "&:hover fieldset": {
        borderColor: (state: keyof typeof STATE_COLORS) => STATE_COLORS[state],
      },
      "&.Mui-focused fieldset": {
        borderWidth: 1,
        borderColor: (state: keyof typeof STATE_COLORS) =>
          state === "default" ? COLORS.FOCUSED_BORDER : STATE_COLORS[state],
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderWidth: 1,
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
  },
} as const

interface CustomTextFieldProps {
  name?: string
  type?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  label?: string
  helperText?: string
  state?: keyof typeof STATE_COLORS
  iconLeft?: ReactNode
  iconRight?: ReactNode
  button?: ReactNode
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const CustomTextField = forwardRef<HTMLInputElement, CustomTextFieldProps>(
  (
    {
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
    },
    ref,
  ) => (
    <div>
      {label && <p className="font-m text-14px text-gray-700 mb-2">{label}</p>}
      <div className="flex items-center">
        <TextField
          inputRef={ref}
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
            ...TEXT_FIELD_STYLES.root,
            ...TEXT_FIELD_STYLES.input,
            "& .MuiOutlinedInput-root": {
              ...TEXT_FIELD_STYLES.input["& .MuiOutlinedInput-root"],
              borderColor: state === "default" ? COLORS.BORDER : undefined,
              "& fieldset": {
                borderColor: STATE_COLORS[state],
              },
              "&:hover fieldset": {
                borderColor: STATE_COLORS[state],
              },
              "&.Mui-focused fieldset": {
                borderColor:
                  state === "default"
                    ? COLORS.FOCUSED_BORDER
                    : STATE_COLORS[state],
              },
            },
          }}
        />
        {button && <Button disabled={disabled} className="ml-1" />}
      </div>
      {helperText && (
        <p className="font-m text-12px text-gray-400 mt-1 ml-2">{helperText}</p>
      )}
    </div>
  ),
)

CustomTextField.displayName = "CustomTextField"

export default CustomTextField
