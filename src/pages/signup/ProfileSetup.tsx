import { Button } from "@components/Button.tsx"
import React, { useEffect, useState } from "react"
import CustomTextField from "@components/CustomTextField.tsx"
import { useNavigate } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useSignup } from "../../contexts/SignupContext.tsx"
import PostcodeModal from "@components/modal/PostcodeModal.tsx"
import { Address } from "react-daum-postcode/lib/loadPostcode"
import Profile from "@assets/icons/Profile.svg?react"
import SettingIcon from "@assets/icons/SettingIcon.svg?react"
import { SwiperBrandCard } from "@components/SwiperBrandCard.tsx"
import { signup } from "../../apis/auth.api.ts"
import { loginWithEmail } from "../../apis/auth.api.ts"
import { fetchUser } from "../../apis/auth.api.ts"
import { useAuth } from "../../contexts/AuthContext.tsx"
import { useOverlay } from "../../contexts/ModalContext"
import { signupWithSocial } from "../../apis/auth.api.ts"
import { UserSignup } from "../../types/User.ts"
import { loginWithSocial } from "../../apis/auth.api.ts"
import { AxiosError } from "axios"

export const ProfileSetup = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const { signupData, setSignupData, cleanup } = useSignup()
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false)

  const { login } = useAuth()
  const { showToast } = useOverlay()
  const isSocialSignup = !!sessionStorage.getItem("socialSignupInfo")

  const [nameError, setNameError] = useState("")

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      backgroundColor: "white",
    })
    setNavigation({ display: false })
  }, [])

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
        gender: socialInfo.gender === "M" ? "male" : "female",
      }))
    }
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setSignupData((prev) => ({
        ...prev,
        profileImage: file,
      }))
    }
  }

  const handleCompletePostcode = (address: Address) => {
    setSignupData({
      ...signupData,
      postCode: address.zonecode,
      address1: address.address,
    })
    setIsPostcodeOpen(false)
  }

  const toggleBrandSelection = (code: string) => {
    setSignupData((prev: UserSignup) => {
      const brandCodes = prev.brandCodes || []
      const isSelected = brandCodes.includes(code)

      const updatedBrands = isSelected
        ? brandCodes.filter((code) => code !== code)
        : [...brandCodes, code]

      return { ...prev, brandCodes: updatedBrands }
    })
  }

  const validateName = (name: string) => {
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(name)) {
      setNameError("이름에는 특수문자와 숫자를 사용할 수 없습니다")
      return false
    }
    setNameError("")
    return true
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setSignupData({ ...signupData, name: newName })
    validateName(newName)
  }

  const handleImageDelete = () => {
    setSignupData((prev) => ({
      ...prev,
      profileImage: null,
    }))
  }

  const handleSignupSubmit = async () => {
    if (!validateName(signupData.name)) {
      showToast("이름을 올바르게 입력해주세요")
      return
    }

    try {
      const socialInfo = JSON.parse(
        sessionStorage.getItem("socialSignupInfo") || "{}",
      )
      const isSocialSignup = !!socialInfo.provider

      if (isSocialSignup) {
        try {
          const response = await signupWithSocial({
            provider: socialInfo.provider,
            userInfo: {
              ...socialInfo,
              id: socialInfo.id,
              name: signupData.name,
              email: signupData.email,
              mobileno: signupData.mobileNumber,
              birthdate: signupData.birthDate,
              gender: signupData.gender === "male" ? "M" : "F",
              post: signupData.postCode,
              addr1: signupData.address1,
              addr2: signupData.address2 || "",
              marketing_yn: signupData.marketingYn ? "Y" : "N",
              brand_code: signupData.brandCodes || [],
            },
          })

          if (
            !response ||
            !response.body ||
            !Array.isArray(response.body) ||
            response.body.length === 0
          ) {
            throw new Error("회원가입 응답에 유효한 body가 없습니다")
          }

          if (!response.body[0]?.accessToken) {
            throw new Error("회원가입 응답에 accessToken이 없습니다")
          }

          const { accessToken } = await loginWithSocial({
            provider: socialInfo.provider,
            accessToken: response.body[0].accessToken,
            socialId: socialInfo.socialId,
          })

          const user = await fetchUser(accessToken)
          login({ user, token: accessToken })
          cleanup()
          navigate("/signup/complete")
          return
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            showToast(
              error.response?.data?.message || "회원가입에 실패했습니다",
            )
          } else {
            showToast("회원가입에 실패했습니다")
          }
        }
      } else {
        await signup({
          email: signupData.email,
          password: signupData.password!,
          name: signupData.name,
          mobileno: signupData.mobileNumber,
          birthdate: signupData.birthDate,
          gender: signupData.gender === "male" ? "M" : "F",
          post: signupData.postCode,
          addr1: signupData.address1,
          addr2: signupData.address2,
          marketing_yn: signupData.marketingYn ? "Y" : "N",
          brand_code: signupData.brandCodes,
        })

        const { accessToken } = await loginWithEmail({
          username: signupData.email,
          password: signupData.password!,
        })

        const user = await fetchUser(accessToken)
        login({ user, token: accessToken })
      }

      cleanup()
      navigate("/signup/complete")
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message
        if (errorMessage?.includes("already exists")) {
          showToast("이미 가입된 이메일입니다")
        } else if (errorMessage?.includes("Invalid mobile")) {
          showToast("올바르지 않은 휴대폰 번호입니다")
        } else {
          showToast(errorMessage || "회원가입에 실패했습니다")
        }
      } else {
        showToast("회원가입에 실패했습니다")
      }
    }
  }

  return (
    <div className="flex flex-col px-5 pt-5 pb-7 gap-10">
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
              {signupData.profileImage ? (
                <>
                  <img
                    src={URL.createObjectURL(signupData.profileImage)}
                    alt="프로필"
                    className="rounded-full w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleImageDelete()
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
            onChange={handleImageUpload}
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
          <div className="flex gap-2">
            <button
              className={`flex-1 h-[52px] px-5 rounded-xl border flex justify-between items-center cursor-not-allowed opacity-75 ${
                signupData.gender === "female"
                  ? "bg-[#FEF2F1] border-primary"
                  : "border-[#ECECEC] bg-gray-50"
              }`}
              onClick={() => setSignupData({ ...signupData, gender: "female" })}
              disabled={true}
            >
              <span
                className={`text-16px ${signupData.gender === "female" ? "font-semibold" : "text-gray-500"}`}
              >
                여자
              </span>
              <div
                className={`w-5 h-5 rounded-full ${
                  signupData.gender === "female"
                    ? "bg-primary flex items-center justify-center opacity-75"
                    : "border-2 border-[#DDDDDD] bg-gray-100"
                }`}
              >
                {signupData.gender === "female" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>
            <button
              className={`flex-1 h-[52px] px-5 rounded-xl border flex justify-between items-center cursor-not-allowed opacity-75 ${
                signupData.gender === "male"
                  ? "bg-[#FEF2F1] border-primary"
                  : "border-[#ECECEC] bg-gray-50"
              }`}
              onClick={() => setSignupData({ ...signupData, gender: "male" })}
              disabled={true}
            >
              <span
                className={`text-16px ${signupData.gender === "male" ? "font-semibold" : "text-gray-500"}`}
              >
                남자
              </span>
              <div
                className={`w-5 h-5 rounded-full ${
                  signupData.gender === "male"
                    ? "bg-primary flex items-center justify-center opacity-75"
                    : "border-2 border-[#DDDDDD] bg-gray-100"
                }`}
              >
                {signupData.gender === "male" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* 생년월일 */}
        <CustomTextField
          label="생년월일"
          value={signupData.birthDate}
          onChange={(e) =>
            setSignupData({ ...signupData, birthDate: e.target.value })
          }
          placeholder="YYYYMMDD"
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
            />
            <Button
              variantType="primary"
              sizeType="s"
              onClick={() => setIsPostcodeOpen(true)}
            >
              우편번호 검색
            </Button>
          </div>
          <CustomTextField
            value={signupData.address1}
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

        {/* 추천인 코드 */}
        <div className="flex flex-col gap-2">
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
        </div>
      </div>

      <Button
        variantType="primary"
        sizeType="l"
        disabled={
          !signupData.name ||
          !signupData.mobileNumber ||
          !signupData.gender ||
          !signupData.address1 ||
          !signupData.postCode
        }
        onClick={handleSignupSubmit}
      >
        완료
      </Button>
    </div>
  )
}

export default ProfileSetup
