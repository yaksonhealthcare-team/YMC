import { getUser, useUserStore } from '@/_domain/auth';
import { updateUserProfile } from '@/entities/user/api/auth.api';
import { uploadImages } from '@/shared/api/image.api';
import CaretLeftIcon from '@/assets/icons/CaretLeftIcon.svg?react';
import AppleLoginIcon from '@/assets/icons/third_party_logo/AppleLoginIcon.svg?react';
import GoogleLoginIcon from '@/assets/icons/third_party_logo/GoogleLoginIcon.svg?react';
import KakaoLoginIcon from '@/assets/icons/third_party_logo/KakaoLoginIcon.svg?react';
import NaverLoginIcon from '@/assets/icons/third_party_logo/NaverLoginIcon.svg?react';
import CustomTextField from '@/shared/ui/text-field/CustomTextField';
import { GenderSelect } from '@/shared/ui/radio/GenderSelect';
import PostcodeModal from '@/shared/ui/modal/PostcodeModal';
import Switch from '@/shared/ui/switch/Switch';
import { useLayout } from '@/stores/LayoutContext';
import { useOverlay } from '@/shared/ui/modal/ModalContext';
import { UpdateUserProfileRequest } from '@/entities/user/model/User';
import { Gender } from '@/shared/lib/utils/gender';
import CircularProgress from '@mui/material/CircularProgress';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomSheetForm from './_fragments/EditProfileBottomSheetForm';
import { FieldWithButton, LabeledForm } from './_fragments/ProfileFormComponents';
import ProfileImageButton from './_fragments/ProfileImageButton';

const EditProfile = () => {
  const { user, setUser } = useUserStore();
  const { setNavigation, setHeader } = useLayout();
  const { openBottomSheet, closeOverlay, showToast } = useOverlay();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [gender, setGender] = useState<Gender>(user?.sex ?? 'M');
  const [address, setAddress] = useState({
    road: user?.addr1 || '',
    detail: user?.addr2 || '',
    postalCode: user!.post
  });
  const [marketingAgreed, setMarketingAgreed] = useState(user!.marketing_yn === 'Y');
  const [openPostcode, setOpenPostcode] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(user?.profileURL);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const detailAddressFieldRef = useRef<HTMLInputElement>(null);

  // 변경사항이 있는지 확인하는 함수
  const hasChanges = useCallback(() => {
    if (!user) return false;
    const isMarketingAgree = user.marketing_yn === 'Y';

    return (
      user.profileURL !== profileImageUrl ||
      address.postalCode !== user.post ||
      address.road !== user.addr1 ||
      address.detail !== user.addr2 ||
      marketingAgreed !== isMarketingAgree
    );
  }, [address.detail, address.postalCode, address.road, marketingAgreed, profileImageUrl, user]);

  const handleSubmit = useCallback(async () => {
    if (!user || !hasChanges()) return;

    setIsSubmitting(true);
    try {
      let finalProfileUrl = profileImageUrl ?? '';

      // 프로필 이미지가 변경되었고 새 이미지 파일이 있는 경우 이미지 업로드
      if (profileImageFile) {
        try {
          const uploadedUrls = await uploadImages({
            fileToUpload: [profileImageFile],
            nextUrl: '/auth/me'
          });

          if (uploadedUrls && uploadedUrls.length > 0) {
            finalProfileUrl = uploadedUrls[0];
          }
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
          showToast('이미지 업로드에 실패했습니다.');
          setIsSubmitting(false);
          return;
        }
      }

      const updatedData: UpdateUserProfileRequest = {
        postalCode: address.postalCode,
        address1: address.road,
        address2: address.detail,
        profileUrl: finalProfileUrl,
        marketingAgreed: marketingAgreed
      };

      await updateUserProfile(updatedData);

      // 최신 사용자 정보 가져오기
      try {
        const data = await getUser();
        const user = data.data.body[0];

        if (user) {
          setUser(user);
          showToast('프로필이 성공적으로 수정되었습니다.');
          navigate('/mypage', { replace: true });
        } else {
          showToast('프로필 수정에 실패했습니다.');
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        showToast('프로필 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      showToast('프로필 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    address.detail,
    address.postalCode,
    address.road,
    hasChanges,
    marketingAgreed,
    navigate,
    profileImageFile,
    profileImageUrl,
    setUser,
    showToast,
    user
  ]);

  const handleImageChange = (file: File | null) => {
    setProfileImageFile(file);
  };

  const handleClickBackButton = useCallback(() => {
    if (hasChanges()) {
      openBottomSheet(
        <BottomSheetForm
          title={'이 페이지를 나가시겠습니까?'}
          content={'수정한 데이터가 저장되지 않습니다.'}
          confirmOptions={{
            text: '나가기',
            onClick: () => {
              navigate('/mypage', { replace: true });
              closeOverlay();
            }
          }}
          cancelOptions={{
            text: '취소하기',
            onClick: closeOverlay
          }}
        />
      );
    } else {
      navigate(-1);
    }
  }, [closeOverlay, hasChanges, navigate, openBottomSheet]);

  const handleClickWithdrawal = () => {
    openBottomSheet(
      <BottomSheetForm
        title={'회원 탈퇴하시겠습니까?'}
        content={'탈퇴 시 적립금은 소멸되며, 계정 복구가 불가합니다.'}
        confirmOptions={{
          text: '탈퇴하기',
          onClick: () => {
            closeOverlay();
            navigate('/profile/withdrawal');
          }
        }}
        cancelOptions={{
          text: '취소하기',
          onClick: closeOverlay
        }}
      />
    );
  };

  useEffect(() => {
    setHeader({
      left: 'back',
      title: '내 정보 수정',
      component: (
        <div className="h-12 flex items-center justify-between px-5 bg-white relative">
          <button onClick={handleClickBackButton} className="absolute left-5">
            <CaretLeftIcon />
          </button>
          <span className="font-sb text-18px flex-1 text-center">내 정보 수정</span>
          <button
            className={'font-m text-gray-500 disabled:text-gray-300 disabled:cursor-default absolute right-5'}
            onClick={handleSubmit}
            disabled={!hasChanges()}
          >
            <p>{'저장'}</p>
          </button>
        </div>
      ),
      backgroundColor: 'bg-white',
      display: true,
      onClickBack: handleClickBackButton
    });
    setNavigation({ display: false });
  }, [
    address,
    marketingAgreed,
    gender,
    profileImageUrl,
    profileImageFile,
    setHeader,
    handleClickBackButton,
    handleSubmit,
    hasChanges,
    setNavigation
  ]);

  if (!user) {
    return <></>;
  }

  const renderSocialLoginIcon = () => {
    switch (user.thirdPartyType) {
      case 'naver':
        return <NaverLoginIcon />;
      case 'kakao':
        return <KakaoLoginIcon />;
      case 'apple':
        return <AppleLoginIcon />;
      case 'google':
        return <GoogleLoginIcon />;
      default:
        return null;
    }
  };

  return (
    <div className={'w-full h-full flex flex-col overflow-y-scroll'}>
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <CircularProgress color="primary" size={48} />
          </div>
        </div>
      )}
      <div className={'self-center mt-5'}>
        <ProfileImageButton
          profileImageUrl={profileImageUrl}
          onImageChange={handleImageChange}
          onPreviewImageChange={setProfileImageUrl}
        />
      </div>
      <div className={'mx-5 mt-5'}>
        <div className={'flex flex-col gap-10 mb-10'}>
          <LabeledForm label={'이름'}>
            <p>{user.name}</p>
          </LabeledForm>
          <LabeledForm className={'flex justify-between'} label={'이메일'}>
            <p>{user.email}</p>
            <div>{renderSocialLoginIcon()}</div>
          </LabeledForm>
          <LabeledForm label={'비밀번호 변경'}>
            <FieldWithButton
              fieldValue={'********'}
              buttonLabel={'변경하기'}
              buttonClassName="px-5 py-3.5 font-bold rounded-[12px]"
              onClick={() => {
                navigate('/profile/reset-password');
              }}
            />
          </LabeledForm>
          <LabeledForm label={'휴대폰 번호'}>
            <FieldWithButton
              fieldValue={user.hp}
              buttonLabel={'변경하기'}
              buttonClassName="px-5 py-3.5 font-bold rounded-[12px]"
              onClick={() => {
                navigate('/profile/change-phone');
              }}
            />
          </LabeledForm>
          <LabeledForm label={'생년월일'}>
            <p className="text-[18px] font-medium text-gray-900">
              {user.birthdate
                ? `${user.birthdate.slice(0, 4)}.${user.birthdate.slice(4, 6)}.${user.birthdate.slice(6, 8)}`
                : ''}
            </p>
          </LabeledForm>
          <LabeledForm label={'성별'}>
            <div className="opacity-50">
              <GenderSelect value={gender} onChange={setGender} disabled />
            </div>
          </LabeledForm>
          <LabeledForm className={'flex flex-col gap-2'} label={'주소'}>
            <FieldWithButton
              fieldValue={address.postalCode}
              buttonLabel={'우편번호 검색'}
              buttonClassName="px-[20px] py-3.5 font-bold whitespace-nowrap min-w-[140px] rounded-[12px]"
              onClick={() => setOpenPostcode(true)}
            />
            <div className={'px-4 py-3 outline outline-1 outline-gray-100 rounded-[12px] flex items-center'}>
              <p className={'font-r text-[16px] leading-[23px]'}>{address.road}</p>
            </div>
            <CustomTextField
              ref={detailAddressFieldRef}
              placeholder={'상세주소'}
              value={address.detail}
              onChange={(e) => setAddress({ ...address, detail: e.target.value })}
            />
          </LabeledForm>
          <div className={'flex justify-between'}>
            <p className={'font-m'}>{'마케팅 수신 동의'}</p>
            <Switch.IOS checked={marketingAgreed} onChange={(e) => setMarketingAgreed(e.target.checked)} />
          </div>
          <button className={'self-start'} onClick={handleClickWithdrawal}>
            <p className={'underline text-gray-400 text-14px font-m'}>{'회원탈퇴'}</p>
          </button>
          {openPostcode && (
            <PostcodeModal
              setIsPostcodeOpen={setOpenPostcode}
              handleCompletePostcode={({ roadAddress, jibunAddress, userSelectedType, zonecode }) => {
                setAddress({
                  road: userSelectedType === 'R' ? roadAddress : jibunAddress,
                  detail: '',
                  postalCode: zonecode
                });
                setOpenPostcode(false);
                detailAddressFieldRef.current?.focus();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
