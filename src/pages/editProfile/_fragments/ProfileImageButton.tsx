import { ChangeEvent, useRef, useState } from "react"
import GearIcon from "@assets/icons/GearIcon.svg?react"
import Profile from "@assets/icons/Profile.svg?react"
import { useOverlay } from "../../../contexts/ModalContext"

interface ProfileImageButtonProps {
  profileImageUrl?: string
  onImageChange?: (file: File | null) => void
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const ProfileImageButton = ({
  profileImageUrl,
  onImageChange,
}: ProfileImageButtonProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(
    profileImageUrl || null,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showAlert } = useOverlay()

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        showAlert(
          "이미지 크기가 너무 큽니다. 5MB 이하의 이미지를 선택해주세요.",
        )
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImageSrc(reader.result as string)
        onImageChange?.(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageDelete = () => {
    setImageSrc(null)
    onImageChange?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="relative w-20 h-20">
      {imageSrc ? (
        <>
          <label
            htmlFor="profileImageUpload"
            className="block w-full h-full cursor-pointer"
          >
            <img
              src={imageSrc}
              alt="프로필"
              className="w-full h-full rounded-full object-cover"
            />
          </label>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleImageDelete()
            }}
            className="absolute right-0 bottom-0 bg-gray-700 rounded-full bg-opacity-60 w-[24px] h-[24px] flex justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[16px] h-[16px] text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </>
      ) : (
        <label
          htmlFor="profileImageUpload"
          className="block w-full h-full cursor-pointer"
        >
          <div className="rounded-full flex justify-center items-center w-full h-full bg-[#F8F8F8]">
            <Profile className="w-8 h-8 text-gray-400" />
            <div className="absolute right-0 bottom-0 bg-gray-700 rounded-full bg-opacity-60 w-[24px] h-[24px] flex justify-center items-center">
              <GearIcon className="text-white w-[16px] h-[16px]" />
            </div>
          </div>
        </label>
      )}
      <input
        id="profileImageUpload"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  )
}

export default ProfileImageButton
