import React from "react"
import LoadingIndicator from "./LoadingIndicator"

const FullPageLoading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <LoadingIndicator />
    </div>
  )
}

export default FullPageLoading
