import { ReactNode } from "react"

interface PageContainerProps {
  children: ReactNode
  className?: string
}

const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div
      className={`h-screen max-h-full overflow-x-hidden ${className || "bg-system-bg"}`}
    >
      <div className="max-w-[500px] mx-auto h-full max-h-full overflow-y-scroll overflow-x-hidden flex flex-col scrollbar-hide bg-white">
        {children}
      </div>
    </div>
  )
}

export default PageContainer
