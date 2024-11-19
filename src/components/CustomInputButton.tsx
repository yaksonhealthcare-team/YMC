import { forwardRef, type ReactNode } from "react"
import { TextField, InputAdornment } from "@mui/material"
import { COLORS } from "@constants/ColorConstants"

interface CustomInputButtonProps {
  label?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  onClick?: () => void
  className?: string
}

const CustomInputButton = forwardRef<HTMLDivElement, CustomInputButtonProps>(
  (
    {
      label,
      value,
      placeholder,
      disabled,
      iconLeft,
      iconRight,
      onClick,
      className,
    },
    ref,
  ) => (
    <div ref={ref}>
      {label && <p className="font-m text-14px text-gray-700 mb-2">{label}</p>}
      <div
        onClick={!disabled ? onClick : undefined}
        className={`cursor-pointer ${disabled ? "opacity-50" : ""}`}
      >
        <div className="absolute inset-0 z-10" />
        <TextField
          value={value}
          placeholder={placeholder}
          disabled={true}
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
            startAdornment: iconLeft && (
              <InputAdornment position="start">{iconLeft}</InputAdornment>
            ),
            endAdornment: iconRight && (
              <InputAdornment position="end">{iconRight}</InputAdornment>
            ),
          }}
          sx={{
            width: "100%",
            flex: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              cursor: "pointer",
              backgroundColor: disabled ? COLORS.DISABLED_BG : "white",
              "& fieldset": {
                borderColor: `${COLORS.BORDER} !important`,
              },
              "& input": {
                cursor: "pointer",
              },
              "& input::placeholder": {
                color: COLORS.PLACEHOLDER,
                opacity: 1,
              },
            },
          }}
          className={className}
        />
      </div>
    </div>
  ),
)

CustomInputButton.displayName = "CustomInputButton"

export default CustomInputButton
