import React from "react"
import Logo from "@components/Logo.tsx"
import PageContainer from "@components/PageContainer.tsx"

const SplashScreen: React.FC = () => {
  return (
    <PageContainer>
      <div
        className={
          "flex flex-col h-full w-full justify-center items-center bg-[#F8F5F2] p-14"
        }
      >
        <div className={"p-48"}>
          <Logo text size={191} />
        </div>
      </div>
    </PageContainer>
  )
}

export default SplashScreen
