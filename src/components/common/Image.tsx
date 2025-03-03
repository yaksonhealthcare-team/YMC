import { ImgHTMLAttributes, useState } from "react"
import Profile from "@assets/icons/Profile.svg?react"

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
  useDefaultProfile?: boolean
}

export const Image = ({
  src,
  alt,
  fallbackSrc,
  useDefaultProfile = false,
  className = "",
  ...props
}: ImageProps) => {
  const [error, setError] = useState(false)

  const handleError = () => {
    setError(true)
  }

  if (error) {
    if (useDefaultProfile) {
      return <Profile className={`text-gray-300 ${className}`} />
    }
    if (fallbackSrc) {
      return (
        <img {...props} src={fallbackSrc} alt={alt} className={className} />
      )
    }
    return <div className={`bg-gray-100 ${className}`} />
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      onError={handleError}
      className={className}
    />
  )
}
