import { ReactNode } from "react"

const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-gray-50 h-screen max-h-full">
      <div className="max-w-[500px] min-w-[350px] mx-auto bg-white h-full max-h-full overflow-y-scroll flex flex-col">
        {children}
      </div>
    </div>
  )
}

export default PageContainer
