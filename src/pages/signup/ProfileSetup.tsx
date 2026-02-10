import { uploadImages } from '@/apis/image.api';
import { Button } from '@/components/Button';
import CustomTextField from '@/components/CustomTextField';
import { GenderSelect } from '@/components/GenderSelect';
import { SwiperBrandCard } from '@/components/SwiperBrandCard';
import PostcodeModal from '@/components/modal/PostcodeModal';
import { useLayout } from '@/stores/LayoutContext';
import { useOverlay } from '@/stores/ModalContext';
import { useSignup } from '@/stores/SignupContext';
import { useProfileSetupHandlers } from '@/hooks/useProfileSetupHandlers';
import { useProfileSetupSubmit } from '@/hooks/useProfileSetupSubmit';
import { useProfileSetupValidation } from '@/hooks/useProfileSetupValidation';
import ProfileImageButton from '@/pages/editProfile/_fragments/ProfileImageButton';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfileSetup = () => {
  const { setHeader, setNavigation } = useLayout();
  const { signupData, setSignupData } = useSignup();
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const isSocialSignup = !!sessionStorage.getItem('socialSignupInfo');
  const { openModal } = useOverlay();
  const navigate = useNavigate();
  const {
    // handleImageUpload,
    // handleImageDelete,
    handleCompletePostcode,
    toggleBrandSelection,
    handleNameChange
  } = useProfileSetupHandlers();
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>();

  const { nameError, validateForm } = useProfileSetupValidation();
  const { handleSubmit } = useProfileSetupSubmit();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!signupData.di) {
      openModal({
        title: '알림',
        message: '회원가입 정보가 초기화되었습니다. 처음부터 다시 시작해주세요.',
        onConfirm: () => {
          navigate('/login', { replace: true });
        }
      });
    }
  }, [signupData]);

  useEffect(() => {
    setHeader({
      display: true,
      left: 'back',
      backgroundColor: 'bg-white',
      title: '프로필 설정'
    });
    setNavigation({ display: false });
  }, [setHeader, setNavigation]);

  useEffect(() => {
    if (isSocialSignup) {
      const socialInfo = JSON.parse(sessionStorage.getItem('socialSignupInfo') || '{}');

      setSignupData((prev) => ({
        ...prev,
        name: socialInfo.name || prev.name,
        email: socialInfo.email || prev.email,
        mobileNumber: socialInfo.mobileno || prev.mobileNumber,
        birthDate: socialInfo.birthdate || prev.birthDate,
        gender: socialInfo.gender || prev.gender,
        profileUrl: socialInfo.profileUrl || prev.profileUrl
      }));
    }
  }, [isSocialSignup, setSignupData]);

  const handleSignupSubmit = async () => {
    if (isSubmitting) return;

    if (!validateForm(signupData.name)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 프로필 이미지가 있으면 업로드
      if (profileImageFile) {
        try {
          const uploadedUrls = await uploadImages({
            fileToUpload: [profileImageFile],
            nextUrl: '/auth/signup',
            isSignup: 'Y'
          });

          if (uploadedUrls && uploadedUrls.length > 0) {
            const submitData = {
              ...signupData,
              profileUrl: uploadedUrls[0]
            };
            setSignupData((prev) => ({ ...prev, profileUrl: uploadedUrls[0] }));
            await handleSubmit(submitData);
          } else {
            await handleSubmit(signupData);
          }
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
          // 이미지 업로드 실패해도 회원가입은 계속 진행
          await handleSubmit(signupData);
        }
      } else {
        // 이미지가 없는 경우 바로 회원가입 진행
        await handleSubmit(signupData);
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col px-5 pt-5 pb-7 gap-10">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <CircularProgress color="primary" size={48} />
            <p className="mt-4 text-16px font-medium text-[#212121]">회원가입 처리 중...</p>
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
            <span className="text-14px font-medium text-[#212121]">프로필 사진</span>
            <span className="text-14px text-[#A2A5AA]">(선택)</span>
          </div>

          <div className="relative">
            <label
              className="w-20 h-20 rounded-full border border-[#ECECEC] cursor-pointer relative block"
              htmlFor="profileImageUpload"
            >
              <ProfileImageButton
                profileImageUrl={profileImageUrl}
                onImageChange={setProfileImageFile}
                onPreviewImageChange={setProfileImageUrl}
              />
            </label>
          </div>
        </div>

        {/* 이름 */}
        <div className="flex flex-col gap-1">
          <CustomTextField
            label="이름"
            value={signupData.name}
            onChange={handleNameChange}
            placeholder="이름 입력"
            state={nameError ? 'error' : 'default'}
            helperText={nameError}
            disabled={true}
          />
        </div>

        {/* 휴대폰 번호 */}
        <CustomTextField
          label="휴대폰 번호"
          value={signupData.mobileNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '');
            setSignupData({ ...signupData, mobileNumber: value });
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
          value={signupData.birthDate?.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')}
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
              onChange={(e) => setSignupData({ ...signupData, postCode: e.target.value })}
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
            onChange={(e) => setSignupData({ ...signupData, address1: e.target.value })}
            placeholder="기본주소"
          />
          <CustomTextField
            value={signupData.address2}
            onChange={(e) => setSignupData({ ...signupData, address2: e.target.value })}
            placeholder="상세주소"
          />
        </div>

        {isPostcodeOpen && (
          <PostcodeModal setIsPostcodeOpen={setIsPostcodeOpen} handleCompletePostcode={handleCompletePostcode} />
        )}

        {/* 브랜드 선택 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-0.5">
            <span className="text-14px font-medium text-black">현재 이용중인 브랜드를 선택해주세요</span>
            <span className="text-14px text-[#A2A5AA]">(선택)</span>
          </div>

          <SwiperBrandCard onBrandClick={toggleBrandSelection} selectedBrandCodes={signupData.brandCodes} />
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
  );
};

export default ProfileSetup;
