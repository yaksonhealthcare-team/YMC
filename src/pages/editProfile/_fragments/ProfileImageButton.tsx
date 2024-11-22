import { ChangeEvent, useRef, useState } from "react"
import GearIcon from "@assets/icons/GearIcon.svg?react"

interface ProfileImageButtonProps {
  profileImageUrl?: string
}

const ProfileImageButton = ({ profileImageUrl }: ProfileImageButtonProps) => {
  const [imageSrc, setImageSrc] = useState<string>(
    profileImageUrl || "/assets/profile_image.jpeg",
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageSrc(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <button className={"relative"} onClick={handleClick}>
      <img
        src={imageSrc}
        alt={"프로필"}
        className={"w-20 h-20 rounded-full object-cover"}
      />
      <div
        className={
          "absolute right-0 bottom-0 rounded-full bg-gray-700/60 w-6 h-6 place-content-center place-items-center"
        }
      >
        <GearIcon />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </button>
  )
}

export default ProfileImageButton
