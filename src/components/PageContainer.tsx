import { ReactNode } from "react"

const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-gray-50 h-screen">
      <div className="max-w-[500px] min-w-[375px] mx-auto bg-white h-full">
        {children}
      </div>
    </div>
  )
}

export default PageContainer
