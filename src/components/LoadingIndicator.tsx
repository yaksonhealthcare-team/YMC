import React from "react"

interface LoadingIndicatorProps {
  className?: string
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-gray-600 text-sm">로딩중...</p>
    </div>
  )
}

export default LoadingIndicator
