import GearIcon from "@assets/icons/GearIcon.svg?react"
import Profile from "@assets/icons/Profile.svg?react"
import { Image } from "@components/common/Image"
import { ChangeEvent, useRef } from "react"
import { useOverlay } from "../../../contexts/ModalContext"

interface ProfileImageButtonProps {
  profileImageUrl?: string
  onImageChange: (file: File | null) => void
  onPreviewImageChange: (previewImage: string) => void
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// 미디어 선택 옵션
const MEDIA_SELECTOR = [
  { id: "camera", label: "카메라", value: "camera" },
  { id: "gallery", label: "사진", value: "gallery" },
]

const validateImage = (file: File) => {
  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드 가능합니다.")
  }

  if (file.size > MAX_FILE_SIZE) {
    // 5MB 제한
    throw new Error("파일 크기는 5MB 이하여야 합니다.")
  }
}

const ProfileImageButton = ({
  profileImageUrl,
  onImageChange,
  onPreviewImageChange,
}: ProfileImageButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const { showToast, openBottomSheet, closeOverlay } = useOverlay()

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    try {
      if (file) {
        // 파일 유효성 검사
        validateImage(file)

        onImageChange(file)
        const reader = new FileReader()
        reader.onload = () => {
          onPreviewImageChange(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message)
      } else {
        showToast("이미지 업로드에 실패했습니다.")
      }
    }
  }

  const handleImageDelete = () => {
    onImageChange(null)
    onPreviewImageChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = ""
    }
  }

  const handleSelectMediaOption = (option: (typeof MEDIA_SELECTOR)[number]) => {
    // 살짝 지연시켜 선택 다이얼로그가 열리도록 함
    setTimeout(() => {
      if (option.value === "camera") {
        if (cameraInputRef.current) {
          cameraInputRef.current.click()
          closeOverlay()
        }
      } else if (option.value === "gallery") {
        if (fileInputRef.current) {
          fileInputRef.current.click()
          closeOverlay()
        }
      }
    }, 300)
  }

  const handleImageUploadClick = () => {
    // 바텀 시트 열기
    const content = (
      <div className="flex flex-col">
        {MEDIA_SELECTOR.map((item) => (
          <button
            key={item.id}
            type="button"
            className="flex w-full cursor-pointer items-center justify-start px-5 py-4 text-left"
            onClick={() => handleSelectMediaOption(item)}
          >
            {item.label}
          </button>
        ))}
      </div>
    )

    openBottomSheet(content, {
      title: "사진 등록하기",
    })
  }

  return (
    <div className="relative w-20 h-20">
      {profileImageUrl ? (
        <>
          <button
            type="button"
            onClick={handleImageUploadClick}
            className="w-full h-full p-0 border-0 bg-transparent"
          >
            <Image
              src={profileImageUrl}
              alt="프로필"
              className="w-full h-full rounded-full object-cover"
            />
          </button>
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
        <button
          type="button"
          onClick={handleImageUploadClick}
          className="w-full h-full p-0 border-0 bg-transparent"
        >
          <div className="rounded-full flex justify-center items-center w-full h-full bg-[#F8F8F8]">
            <Profile className="w-8 h-8 text-gray-400" />
            <div className="absolute right-0 bottom-0 bg-gray-700 rounded-full bg-opacity-60 w-[24px] h-[24px] flex justify-center items-center">
              <GearIcon className="text-white w-[16px] h-[16px]" />
            </div>
          </div>
        </button>
      )}

      {/* 파일 입력 요소들 (숨김) */}
      <div style={{ display: "none" }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
    </div>
  )
}

export default ProfileImageButton
