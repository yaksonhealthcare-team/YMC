import { ReactNode } from "react"

const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-gray-50 h-screen max-h-full overflow-x-hidden overscroll-none">
      <div className="max-w-[500px] mx-auto bg-white h-full max-h-full overflow-y-scroll overflow-x-hidden flex flex-col scrollbar-hide overscroll-none">
        {children}
      </div>
    </div>
  )
}

export default PageContainer
