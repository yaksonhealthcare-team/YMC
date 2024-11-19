import clsx from "clsx"

interface CustomInputButtonProps {
  label?: string
  value?: string
  placeholder?: string
  iconRight?: React.ReactNode
  onClick?: () => void
  className?: string
}

const CustomInputButton = ({
  label,
  value,
  placeholder,
  iconRight,
  onClick,
  className,
}: CustomInputButtonProps) => {
  return (
    <div>
      {label && <p className="font-m text-14px text-gray-700 mb-2">{label}</p>}
      <button
        type="button"
        onClick={onClick}
        className={clsx(
          "w-full bg-white border border-gray-200 rounded-lg p-3",
          "flex items-center justify-between cursor-pointer",
          className,
        )}
      >
        <span className="flex-1 text-left text-gray-700">
          {value || <span className="text-gray-400">{placeholder}</span>}
        </span>
        {iconRight && <span>{iconRight}</span>}
      </button>
    </div>
  )
}

export default CustomInputButton
