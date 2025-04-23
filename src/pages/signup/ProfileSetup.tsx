import { Button } from "@components/Button.tsx"
import { useEffect, useState } from "react"
import CustomTextField from "@components/CustomTextField.tsx"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useSignup } from "../../contexts/SignupContext.tsx"
import PostcodeModal from "@components/modal/PostcodeModal.tsx"
import Profile from "@assets/icons/Profile.svg?react"
import SettingIcon from "@assets/icons/SettingIcon.svg?react"
import { SwiperBrandCard } from "@components/SwiperBrandCard.tsx"
import { useProfileSetupHandlers } from "../../hooks/useProfileSetupHandlers"
import { useProfileSetupValidation } from "../../hooks/useProfileSetupValidation"
import { useProfileSetupSubmit } from "../../hooks/useProfileSetupSubmit"
import { GenderSelect } from "@components/GenderSelect"
import { Image } from "@components/common/Image"
import { uploadImages } from "../../apis/image.api.ts"
import { CircularProgress } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useOverlay } from "contexts/ModalContext.tsx"

export const ProfileSetup = () => {
  const { setHeader, setNavigation } = useLayout()
  const { signupData, setSignupData } = useSignup()
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false)
  const isSocialSignup = !!sessionStorage.getItem("socialSignupInfo")
  const { openModal } = useOverlay()
  const navigate = useNavigate()
  const {
    // handleImageUpload,
    // handleImageDelete,
    handleCompletePostcode,
    toggleBrandSelection,
    handleNameChange,
  } = useProfileSetupHandlers()

  const { nameError, validateForm } = useProfileSetupValidation()
  const { handleSubmit } = useProfileSetupSubmit()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (!signupData.di) {
      openModal({
        title: "알림",
        message:
          "회원가입 정보가 초기화되었습니다. 처음부터 다시 시작해주세요.",
        onConfirm: () => {
          navigate("/login", { replace: true })
        },
      })
    }
  }, [signupData])

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      backgroundColor: "bg-white",
      title: "프로필 설정",
    })
    setNavigation({ display: false })
  }, [setHeader, setNavigation])

  useEffect(() => {
    if (isSocialSignup) {
      const socialInfo = JSON.parse(
        sessionStorage.getItem("socialSignupInfo") || "{}",
      )

      setSignupData((prev) => ({
        ...prev,
        name: socialInfo.name || prev.name,
        email: socialInfo.email || prev.email,
        mobileNumber: socialInfo.mobileno || prev.mobileNumber,
        birthDate: socialInfo.birthdate || prev.birthDate,
        gender: socialInfo.gender || prev.gender,
        profileUrl: socialInfo.profileUrl || prev.profileUrl,
      }))
    }
  }, [isSocialSignup, setSignupData])

  const handleImageUploadWithFile = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0]
      setProfileImageFile(file)
      const imageUrl = URL.createObjectURL(file)
      setSignupData((prev) => ({
        ...prev,
        profileUrl: imageUrl,
      }))
    }
  }

  const handleImageDeleteWithFile = () => {
    setProfileImageFile(null)
    setSignupData((prev) => ({
      ...prev,
      profileUrl: undefined,
    }))
  }

  const handleSignupSubmit = async () => {
    if (!validateForm(signupData.name)) {
      return
    }

    setIsSubmitting(true)

    try {
      // 프로필 이미지가 있으면 업로드
      if (profileImageFile) {
        try {
          const uploadedUrls = await uploadImages({
            fileToUpload: [profileImageFile],
            nextUrl: "/auth/signup",
            isSignup: "Y",
          })

          if (uploadedUrls && uploadedUrls.length > 0) {
            // 업로드된 이미지 URL로 업데이트하고 새 객체 생성하여 참조 변경
            setSignupData((prev) => ({
              ...prev,
              profileUrl: uploadedUrls[0],
            }))

            // 업로드된 이미지 URL을 사용하여 회원가입 진행
            await handleSubmit()
          }
        } catch (error) {
          console.error("이미지 업로드 실패:", error)
          // 이미지 업로드 실패해도 회원가입은 계속 진행
          await handleSubmit()
        }
      } else {
        // 이미지가 없는 경우 바로 회원가입 진행
        await handleSubmit()
      }
    } catch (error) {
      console.error("회원가입 실패:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col px-5 pt-5 pb-7 gap-10">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <CircularProgress color="primary" size={48} />
            <p className="mt-4 text-16px font-medium text-[#212121]">
              회원가입 처리 중...
            </p>
          </div>
        </div>
      )}
      <h1 className="text-[20px] font-bold leading-[30px] text-[#212121]">
        프로필을
        <br />
        설정해주세요
      </h1>

      <div className="flex flex-col gap-6">
        {/* 프로필 사진 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-0.5">
            <span className="text-14px font-medium text-[#212121]">
              프로필 사진
            </span>
            <span className="text-14px text-[#A2A5AA]">(선택)</span>
          </div>

          <div className="relative">
            <label
              className="w-20 h-20 rounded-full border border-[#ECECEC] cursor-pointer relative block"
              htmlFor="profileImageUpload"
            >
              {signupData.profileUrl ? (
                <>
                  <Image
                    src={signupData.profileUrl}
                    alt="프로필"
                    className="rounded-full w-full h-full object-cover"
                    useDefaultProfile
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleImageDeleteWithFile()
                    }}
                    className="absolute right-0 bottom-0 bg-gray-700 rounded-full bg-opacity-60 w-[24px] h-[24px] flex justify-center items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-[16px] h-[16px] text-white"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </>
              ) : (
                <div className="rounded-full flex justify-center items-center w-full h-full bg-[#F8F8F8]">
                  <Profile className="w-8 h-8 text-gray-400" />
                  <div className="absolute right-0 bottom-0 bg-gray-700 rounded-full bg-opacity-60 w-[24px] h-[24px] flex justify-center items-center">
                    <SettingIcon className="text-white w-[16px] h-[16px]" />
                  </div>
                </div>
              )}
            </label>
          </div>
          <input
            type="file"
            id="profileImageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUploadWithFile}
          />
        </div>

        {/* 이름 */}
        <div className="flex flex-col gap-1">
          <CustomTextField
            label="이름"
            value={signupData.name}
            onChange={handleNameChange}
            placeholder="이름 입력"
            state={nameError ? "error" : "default"}
            helperText={nameError}
            disabled={true}
          />
        </div>

        {/* 휴대폰 번호 */}
        <CustomTextField
          label="휴대폰 번호"
          value={signupData.mobileNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "")
            setSignupData({ ...signupData, mobileNumber: value })
          }}
          placeholder="- 없이 입력"
          maxLength={11}
          type="tel"
          disabled={true}
        />

        {/* 성별 */}
        <div className="flex flex-col gap-2">
          <span className="text-14px font-medium text-[#212121]">성별</span>
          <GenderSelect
            value={signupData.gender}
            onChange={(gender) => setSignupData({ ...signupData, gender })}
            disabled={true}
          />
        </div>

        {/* 생년월일 */}
        <CustomTextField
          label="생년월일"
          value={signupData.birthDate?.replace(
            /(\d{4})(\d{2})(\d{2})/,
            "$1.$2.$3",
          )}
          placeholder="YYYYMMDD"
          type="tel"
          disabled={true}
        />

        {/* 주소 */}
        <div className="flex flex-col gap-2">
          <span className="text-14px font-medium text-[#212121]">주소</span>
          <div className="flex gap-2">
            <CustomTextField
              value={signupData.postCode}
              onChange={(e) =>
                setSignupData({ ...signupData, postCode: e.target.value })
              }
              placeholder="우편번호"
              disabled
            />
            <Button
              variantType="primary"
              sizeType="s"
              onClick={() => setIsPostcodeOpen(true)}
              className="whitespace-nowrap min-w-[100px]"
            >
              우편번호 검색
            </Button>
          </div>
          <CustomTextField
            value={signupData.address1}
            disabled
            onChange={(e) =>
              setSignupData({ ...signupData, address1: e.target.value })
            }
            placeholder="기본주소"
          />
          <CustomTextField
            value={signupData.address2}
            onChange={(e) =>
              setSignupData({ ...signupData, address2: e.target.value })
            }
            placeholder="상세주소"
          />
        </div>

        {isPostcodeOpen && (
          <PostcodeModal
            setIsPostcodeOpen={setIsPostcodeOpen}
            handleCompletePostcode={handleCompletePostcode}
          />
        )}

        {/* 브랜드 선택 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-0.5">
            <span className="text-14px font-medium text-black">
              현재 이용중인 브랜드를 선택해주세요
            </span>
            <span className="text-14px text-[#A2A5AA]">(선택)</span>
          </div>

          <SwiperBrandCard
            onBrandClick={toggleBrandSelection}
            selectedBrandCodes={signupData.brandCodes}
          />
        </div>

        {/* 추천인 코드 -- 약손명가 헬스케어 팀의 요청으로 임시 숨김 처리 */}
        {/* <div className="flex flex-col gap-2">
          <div className="flex items-center gap-0.5">
            <span className="text-14px font-medium text-black">추천인</span>
            <span className="text-14px text-[#A2A5AA]">(선택)</span>
          </div>
          <CustomTextField
            value={signupData.referralCode}
            onChange={(e) =>
              setSignupData({ ...signupData, referralCode: e.target.value })
            }
            placeholder="추천인 코드 입력"
          />
        </div> */}
      </div>

      <Button
        variantType="primary"
        sizeType="l"
        disabled={
          !signupData.name ||
          !signupData.mobileNumber ||
          !signupData.gender ||
          !signupData.address1 ||
          !signupData.postCode ||
          isSubmitting
        }
        onClick={handleSignupSubmit}
      >
        완료
      </Button>
    </div>
  )
}

export default ProfileSetup
