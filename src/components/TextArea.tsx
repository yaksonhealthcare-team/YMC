import { TextField } from "@mui/material"
import clsx from "clsx"
import { COLORS } from "@constants/ColorConstants"

const TEXT_FIELD_STYLES = {
  base: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
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
  },
  normal: {
    borderColor: COLORS.BORDER,
  },
  error: {
    borderColor: COLORS.ERROR,
  },
  disabled: {
    borderColor: COLORS.DISABLED_BORDER,
    backgroundColor: COLORS.DISABLED_BG,
  },
  focused: {
    borderWidth: 1,
    borderColor: COLORS.FOCUSED_BORDER,
  },
} as const

const COUNTER_TEXT_STYLES = {
  normal: "text-gray-400",
  error: "text-error",
} as const

interface TextAreaProps {
  placeholder?: string
  label?: string
  helperText?: string
  maxLength?: number
  value: string
  disabled?: boolean
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export const TextArea = ({
  placeholder,
  label,
  helperText,
  maxLength,
  value = "",
  disabled,
  onChange,
}: TextAreaProps) => {
  const isError = maxLength && value.length > maxLength
  const textStyle = isError
    ? COUNTER_TEXT_STYLES.error
    : COUNTER_TEXT_STYLES.normal

  return (
    <div>
      {label && <p className="font-m text-14px text-gray-700 mb-2">{label}</p>}

      <TextField
        multiline
        rows={5}
        fullWidth
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={isError || false}
        variant="outlined"
        sx={{
          ...TEXT_FIELD_STYLES.base,
          "& .MuiOutlinedInput-root": {
            ...TEXT_FIELD_STYLES.base["& .MuiOutlinedInput-root"],
            "& fieldset": {
              borderColor: isError ? COLORS.ERROR : COLORS.BORDER,
            },
            "&:hover fieldset": {
              borderColor: isError ? COLORS.ERROR : COLORS.BORDER,
            },
            "&.Mui-focused fieldset": {
              borderColor: isError ? COLORS.ERROR : COLORS.FOCUSED_BORDER,
            },
            "&.Mui-disabled fieldset": TEXT_FIELD_STYLES.disabled,
          },
        }}
      />

      <div
        className={clsx(
          "flex items-center mt-1 mx-2",
          helperText ? "justify-between" : "justify-end",
        )}
      >
        {helperText && (
          <span className={clsx("font-m text-12px", textStyle)}>
            {helperText}
          </span>
        )}
        {maxLength && (
          <span className={clsx("font-m text-12px", textStyle)}>
            {value.length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  )
}

TextArea.displayName = "TextArea"
