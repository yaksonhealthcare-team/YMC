import { ReactNode } from "react"

const FixedButtonContainer = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => {
  return (
    <div
      className={
        "px-[20px] pt-[12px] pb-[30px] fixed bottom-0 left-[50%] translate-x-[-50%] w-full max-w-[500px] min-w-[375px] bg-system-bg border-t-[1px] border-t-gray-100" +
        className
      }
    >
      {children}
    </div>
  )
}

export default FixedButtonContainer
