import { ReactNode, forwardRef } from "react"

interface PageContainerProps {
  children: ReactNode
  className?: string
}

const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  ({ children, className }, ref) => {
    return (
      <div
        id="page-container"
        className={`h-screen max-h-full overflow-x-hidden ${className || "bg-system-bg"}`}
      >
        <div
          ref={ref}
          className="max-w-[500px] mx-auto h-full max-h-full overflow-y-auto overflow-x-hidden flex flex-col scrollbar-hide"
        >
          {children}
        </div>
      </div>
    )
  },
)

export default PageContainer
