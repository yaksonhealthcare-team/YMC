import { Button } from "@components/Button.tsx"
import { useEffect, useState } from "react"
import CustomTextField from "@components/CustomTextField.tsx"
import { BrandCard } from "@components/BrandCard.tsx"
import { useNavigate } from "react-router-dom"
import { useLayout } from "../../contexts/LayoutContext.tsx"

export const ProfileSetup = () => {
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({
      display: true,
      left: "back",
      backgroundColor: "white",
    })
    setNavigation({ display: false })
  }, [])
  const [form, setForm] = useState({
    profileImage: null,
    name: "",
    phone: "",
    gender: "",
    postcode: "",
    address1: "",
    address2: "",
    brand: "",
    referralCode: "",
  })

  const navigate = useNavigate()

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
          <button className="w-20 h-20 rounded-full border border-[#ECECEC] overflow-hidden">
            {form.profileImage ? (
              <img
                src={form.profileImage}
                alt="프로필"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#F8F8F8]" />
            )}
          </button>
        </div>

        {/* 이름 */}
        <CustomTextField
          label="이름"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="이름 입력"
        />

        {/* 휴대폰 번호 */}
        <CustomTextField
          label="휴대폰 번호"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="휴대폰 번호 입력"
        />

        {/* 성별 */}
        <div className="flex flex-col gap-2">
          <span className="text-14px font-medium text-[#212121]">성별</span>
          <div className="flex gap-2">
            <button
              className={`flex-1 h-[52px] px-5 rounded-xl border flex justify-between items-center ${
                form.gender === "female"
                  ? "bg-[#FEF2F1] border-primary"
                  : "border-[#ECECEC]"
              }`}
              onClick={() => setForm({ ...form, gender: "female" })}
            >
              <span
                className={`text-16px ${form.gender === "female" ? "font-semibold" : ""}`}
              >
                여자
              </span>
              <div
                className={`w-5 h-5 rounded-full ${
                  form.gender === "female"
                    ? "bg-primary flex items-center justify-center"
                    : "border-2 border-[#DDDDDD]"
                }`}
              >
                {form.gender === "female" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>
            <button
              className={`flex-1 h-[52px] px-5 rounded-xl border flex justify-between items-center ${
                form.gender === "male"
                  ? "bg-[#FEF2F1] border-primary"
                  : "border-[#ECECEC]"
              }`}
              onClick={() => setForm({ ...form, gender: "male" })}
            >
              <span
                className={`text-16px ${form.gender === "male" ? "font-semibold" : ""}`}
              >
                남자
              </span>
              <div
                className={`w-5 h-5 rounded-full ${
                  form.gender === "male"
                    ? "bg-primary flex items-center justify-center"
                    : "border-2 border-[#DDDDDD]"
                }`}
              >
                {form.gender === "male" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* 주소 */}
        <div className="flex flex-col gap-2">
          <span className="text-14px font-medium text-[#212121]">주소</span>
          <div className="flex gap-2">
            <CustomTextField
              value={form.postcode}
              onChange={(e) => setForm({ ...form, postcode: e.target.value })}
              placeholder="우편번호"
            />
            <Button
              variantType="primary"
              sizeType="s"
              onClick={() => {
                /* TODO: 우편번호 검색 */
              }}
            >
              우편번호 검색
            </Button>
          </div>
          <CustomTextField
            value={form.address1}
            onChange={(e) => setForm({ ...form, address1: e.target.value })}
            placeholder="기본주소"
          />
          <CustomTextField
            value={form.address2}
            onChange={(e) => setForm({ ...form, address2: e.target.value })}
            placeholder="상세주소"
          />
        </div>

        {/* 브랜드 선택 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-0.5">
            <span className="text-14px font-medium text-black">
              현재 이용중인 브랜드를 선택해주세요
            </span>
            <span className="text-14px text-[#A2A5AA]">(선택)</span>
          </div>
          <div className="flex gap-4">
            {["약손명가", "달리아 스파", "여리한 다이어트"].map((brandName) => (
              <BrandCard
                key={brandName}
                name={brandName}
                brandSrc={`/assets/brands/${brandName}.png`}
                onClick={() => setForm({ ...form, brand: brandName })}
                selected={form.brand === brandName}
              />
            ))}
          </div>
        </div>

        {/* 추천인 코드 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-0.5">
            <span className="text-14px font-medium text-black">추천인</span>
            <span className="text-14px text-[#A2A5AA]">(선택)</span>
          </div>
          <CustomTextField
            value={form.referralCode}
            onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
            placeholder="추천인 코드 입력"
          />
        </div>
      </div>

      <Button
        variantType="primary"
        sizeType="l"
        disabled={!form.name || !form.phone || !form.gender}
        onClick={() => navigate("/signup/complete")}
      >
        완료
      </Button>
    </div>
  )
}

export default ProfileSetup
