import { Button } from "@components/Button.tsx"
import React, { useEffect, useState } from "react"
import CustomTextField from "@components/CustomTextField.tsx"
import { BrandCard } from "@components/BrandCard.tsx"
import { useNavigate, useLocation } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useSignup } from "../../contexts/SignupContext.tsx"
import PostcodeModal from "@components/modal/PostcodeModal.tsx"
import { Address } from "react-daum-postcode/lib/loadPostcode"
import Profile from "@assets/icons/Profile.svg?react"
import SettingIcon from "@assets/icons/SettingIcon.svg?react"
import { useBrands } from "../../queries/useBrandQueries.tsx"
import { Swiper, SwiperSlide } from "swiper/react"
import { signup } from "../../apis/auth.api.ts"
import { loginWithEmail } from "../../apis/auth.api.ts"
import { fetchUser } from "../../apis/auth.api.ts"
import { useAuth } from "../../contexts/AuthContext.tsx"
import { useOverlay } from "../../contexts/ModalContext"
import { signupWithSocial } from "../../apis/auth.api.ts"
import { UserSignup } from "../../types/User.ts"

export const ProfileSetup = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const location = useLocation()
  const { signupData, setSignupData, cleanup } = useSignup()
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false)
  const { data: brands } = useBrands()
  const socialInfo = location.state?.social
  const { login } = useAuth()
  const { showAlert } = useOverlay()

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      backgroundColor: "white",
    })
    setNavigation({ display: false })
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

  const handleSignupSubmit = async () => {
    try {
      if (socialInfo) {
        // 소셜 회원가입
        await signupWithSocial({
          provider: socialInfo.provider,
          accessToken: socialInfo.accessToken,
          userInfo: {
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
      } else {
        // 일반 회원가입
        await signup({
          email: signupData.email,
          password: signupData.password,
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
      }

      // 회원가입 성공 후 자동 로그인
      const { accessToken } = await loginWithEmail({
        username: signupData.email,
        password: signupData.password,
      })

      const user = await fetchUser(accessToken)
      login({ user, token: accessToken })

      // 회원가입 성공 시 소셜 정보 삭제
      cleanup()

      navigate("/signup/complete")
    } catch (error: any) {
      showAlert(error.response?.data?.message || "회원가입에 실패했습니다")
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

          <label
            className="w-20 h-20 rounded-full border border-[#ECECEC] cursor-pointer relative"
            htmlFor="profileImageUpload"
          >
            {signupData.profileImage ? (
              <img
                src={URL.createObjectURL(signupData.profileImage)}
                alt="프로필"
                className="rounded-full w-full h-full object-cover"
              />
            ) : (
              <div className="rounded-full flex justify-center items-center w-full h-full bg-[#F8F8F8]">
                <Profile />

                <div className="absolute left-[56px] top-[56px] bg-gray-700 rounded-full bg-opacity-60 w-[24px] h-[24px] flex justify-center items-center">
                  <SettingIcon className="text-white w-[16px] h-[16px]" />
                </div>
              </div>
            )}
          </label>
          {/* 파일 입력 */}
          <input
            type="file"
            id="profileImageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* 이름 */}
        <CustomTextField
          label="이름"
          value={signupData.name}
          onChange={(e) =>
            setSignupData({ ...signupData, name: e.target.value })
          }
          placeholder="이름 입력"
        />

        {/* 휴대폰 번호 */}
        <CustomTextField
          label="휴대폰 번호"
          value={signupData.mobileNumber}
          onChange={(e) =>
            setSignupData({ ...signupData, mobileNumber: e.target.value })
          }
          placeholder="휴대폰 번호 입력"
        />

        {/* 성별 */}
        <div className="flex flex-col gap-2">
          <span className="text-14px font-medium text-[#212121]">성별</span>
          <div className="flex gap-2">
            <button
              className={`flex-1 h-[52px] px-5 rounded-xl border flex justify-between items-center ${
                signupData.gender === "female"
                  ? "bg-[#FEF2F1] border-primary"
                  : "border-[#ECECEC]"
              }`}
              onClick={() => setSignupData({ ...signupData, gender: "female" })}
            >
              <span
                className={`text-16px ${signupData.gender === "female" ? "font-semibold" : ""}`}
              >
                여자
              </span>
              <div
                className={`w-5 h-5 rounded-full ${
                  signupData.gender === "female"
                    ? "bg-primary flex items-center justify-center"
                    : "border-2 border-[#DDDDDD]"
                }`}
              >
                {signupData.gender === "female" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>
            <button
              className={`flex-1 h-[52px] px-5 rounded-xl border flex justify-between items-center ${
                signupData.gender === "male"
                  ? "bg-[#FEF2F1] border-primary"
                  : "border-[#ECECEC]"
              }`}
              onClick={() => setSignupData({ ...signupData, gender: "male" })}
            >
              <span
                className={`text-16px ${signupData.gender === "male" ? "font-semibold" : ""}`}
              >
                남자
              </span>
              <div
                className={`w-5 h-5 rounded-full ${
                  signupData.gender === "male"
                    ? "bg-primary flex items-center justify-center"
                    : "border-2 border-[#DDDDDD]"
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

          <div className="overflow-x-auto">
            <Swiper spaceBetween={16} slidesPerView={"auto"} className="gap-4">
              {brands &&
                brands.map((brand) => (
                  <SwiperSlide key={brand.code} className="!w-auto">
                    <BrandCard
                      name={brand.name}
                      brandSrc={brand.imageUrl || ""}
                      onClick={() => toggleBrandSelection(brand.code)}
                      selected={
                        signupData.brandCodes
                          ? signupData.brandCodes?.includes(brand.code)
                          : false
                      }
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
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
