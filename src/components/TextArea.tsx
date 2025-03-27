import { TextField } from "@mui/material"
import clsx from "clsx"

const COUNTER_TEXT_STYLES = {
  normal: "text-gray-400",
  error: "text-error",
} as const

interface TextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string
  label?: string
  helperText?: string
  maxLength?: number
  value: string
  disabled?: boolean
  error?: boolean
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export const TextArea = ({
  placeholder,
  label,
  helperText,
  maxLength,
  value = "",
  disabled,
  error,
  onChange,
}: TextAreaProps) => {
  const isError = Boolean(error || (maxLength && value.length > maxLength))
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
        error={isError}
        className="!bg-white"
        InputProps={{
          className: `!text-14px !font-r !text-gray-700 !rounded-xl !border-gray-200 ${
            isError ? "!border-error" : "!border-gray-200"
          }`,
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
