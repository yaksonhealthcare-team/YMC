import { ReactNode } from "react"
import clsx from "clsx"

interface FixedButtonContainerProps {
  className?: string
  children: ReactNode
}

const FixedButtonContainer = ({
  className,
  children,
}: FixedButtonContainerProps) => {
  return (
    <div
      className={clsx(
        "fixed bottom-0 left-1/2 -translate-x-1/2",
        "w-full max-w-[500px]",
        "px-5 pt-3 pb-[30px]",
        "bg-system-bg",
        "border-t border-gray-100",
        className,
      )}
    >
      {children}
    </div>
  )
}

export default FixedButtonContainer
