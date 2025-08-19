import { addCart } from '@/apis/cart.api';
import CaretDownIcon from '@/assets/icons/CaretDownIcon.svg?react';
import CaretLeftIcon from '@/assets/icons/CaretLeftIcon.svg?react';
import CaretRightIcon from '@/assets/icons/CaretRightIcon.svg?react';
import { Button } from '@/components/Button';
import XCircleIcon from '@/components/icons/XCircleIcon';
import { useLayout } from '@/stores/LayoutContext';
import { useOverlay } from '@/stores/ModalContext';
import { usePaymentStore } from '@/hooks/usePaymentStore';
import { Branch } from '@/types/Branch';
import { MembershipOption } from '@/types/Membership';
import { formatPrice, parsePrice } from '@/utils/format';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface OptionsBottomSheetContentProps {
  serviceType: string;
  options: MembershipOption[];
  membershipId: string;
  brand: string;
  title: string;
  duration: number;
  brandCode: string;
  onClose: () => void;
}

interface SelectedOption {
  option: MembershipOption;
  count: number;
}

export const OptionsBottomSheetContent = ({
  serviceType,
  options,
  membershipId,
  brand,
  title,
  duration,
  brandCode,
  onClose
}: OptionsBottomSheetContentProps) => {
  const navigate = useNavigate();
  const { openModal, closeOverlay, showToast } = useOverlay();
  const { setNavigation, setHeader } = useLayout();
  const { setItems, setBranch } = usePaymentStore();

  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const queryClient = useQueryClient();

  // 회원권 상세 페이지 헤더 설정 함수
  const setMembershipDetailHeader = useCallback(() => {
    setHeader({
      display: true,
      component: (
        <div className={'flex items-center justify-between px-5 py-3 h-[48px] bg-white'}>
          <div onClick={() => navigate(-1)} className="rounded">
            <CaretLeftIcon className={'w-5 h-5'} />
          </div>
          {/* <CartIcon /> */}
        </div>
      ),
      backgroundColor: 'bg-white'
    });
  }, [setHeader, navigate]);

  // useEffect로 헤더 상태 관리
  useEffect(() => {
    // 모달이 열려있지 않을 때만 회원권 상세 헤더 설정
    if (!isModalOpen) {
      setMembershipDetailHeader();
    }
  }, [isModalOpen, setMembershipDetailHeader]);

  const totalPrice = useMemo(
    () => selectedOptions.reduce((acc, { option, count }) => acc + parsePrice(option.ss_price) * count, 0),
    [selectedOptions]
  );

  const handleSelectOption = (option: MembershipOption) => {
    const existingOption = selectedOptions.find((selectedOption) => selectedOption.option.ss_idx === option.ss_idx);

    if (existingOption) {
      return;
    }

    setSelectedOptions([
      {
        option,
        count: 1
      },
      ...selectedOptions
    ]);
  };

  const handleRemoveOption = (optionId: string) => {
    const newSelectedOptions = selectedOptions.filter((option) => option.option.ss_idx !== optionId);
    setSelectedOptions(newSelectedOptions);
  };

  const handleCountChange = (option: MembershipOption, count: number) => {
    // 수량이 1 미만이면 1로 설정
    const newCount = Math.max(1, count);

    setSelectedOptions(
      selectedOptions.map((item) => (item.option.ss_idx === option.ss_idx ? { ...item, count: newCount } : item))
    );
  };

  const handleAddToCart = async () => {
    try {
      let branchType: '전지점' | '지정지점';
      if (serviceType === '앱전용 회원권') {
        branchType = '전지점';
      } else if (serviceType === '지점 회원권') {
        branchType = '지정지점';
      } else {
        branchType = '지정지점';
      }

      const cartItems = selectedOptions.map(({ option, count }) => {
        const baseItem = {
          s_idx: parseInt(membershipId),
          ss_idx: parseInt(option.ss_idx),
          brand_code: brandCode,
          amount: count,
          b_type: branchType
        };

        if (branchType === '지정지점' && selectedBranch) {
          return {
            ...baseItem,
            b_idx: parseInt(selectedBranch.b_idx)
          };
        }

        return baseItem;
      });

      await addCart(cartItems);
      await queryClient.refetchQueries({ queryKey: ['carts'] });

      // 네비게이션 상태를 명시적으로 false로 설정
      setNavigation({ display: false });

      openModal({
        title: '장바구니 담기 완료',
        message: '선택하신 상품이 장바구니에 담겼습니다.\n장바구니로 이동하시겠습니까?',
        onConfirm: () => {
          closeOverlay();
          navigate('/cart');
        },
        onCancel: () => {
          closeOverlay();
        }
      });
    } catch {
      alert('장바구니 담기에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handlePurchase = async () => {
    try {
      // 결제 스토어에 선택한 정보 저장
      const paymentItems = selectedOptions.map(({ option, count }) => ({
        s_idx: parseInt(membershipId),
        ss_idx: parseInt(option.ss_idx),
        b_idx: selectedBranch ? parseInt(selectedBranch.b_idx) : 0,
        brand_code: brandCode,
        amount: count,
        b_type: '지정지점' as const,
        title,
        brand,
        branchType: serviceType === '앱전용 회원권' ? '전지점' : '지정 지점',
        duration,
        price: parsePrice(option.ss_price),
        originalPrice: option.original_price ? parsePrice(option.original_price) : undefined,
        sessions: parseInt(option.ss_count),
        type: 'membership' as const
      }));

      // 지점 회원권이면서 selectedBranch가 없는 경우에만 return
      if (!selectedBranch && serviceType === '지점 회원권') {
        return;
      }

      setItems(paymentItems);
      setBranch(
        selectedBranch || {
          b_idx: '0',
          brandCode: brandCode,
          name: brand,
          address: '',
          latitude: 0,
          longitude: 0,
          canBookToday: false,
          distanceInMeters: null,
          isFavorite: false,
          brand: 'therapist' as const
        }
      );

      // 네비게이션 상태를 명시적으로 false로 설정
      setNavigation({ display: false });

      // 스토어가 업데이트된 후에 네비게이션 실행
      navigate('/payment', { replace: true });

      // 네비게이션이 완료된 후에 오버레이 닫기
      closeOverlay();
    } catch {
      alert('결제 진행 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleClose = () => {
    // 선택된 옵션 초기화
    setSelectedOptions([]);
    // 선택된 지점 초기화
    setSelectedBranch(null);
    // 드롭다운 닫기
    setIsDropdownOpen(false);
    // 네비게이션 상태를 명시적으로 false로 설정
    setNavigation({ display: false });
    // 회원권 상세 페이지 헤더 복원
    setMembershipDetailHeader();
    // 오버레이 닫기
    onClose();
  };

  const handleCartButtonClick = () => {
    if (selectedOptions.length === 0) {
      handleClose();
    } else {
      // 버튼이 비활성화 상태일 때는 장바구니에 담지 않음
      if (!isButtonDisabled) {
        handleAddToCart();
      }
    }
  };

  const isButtonDisabled = useMemo(() => {
    if (selectedOptions.length === 0) return true;
    if (serviceType === '지점 회원권') {
      return !selectedBranch;
    }
    return false;
  }, [selectedOptions.length, serviceType, selectedBranch]);

  // const handleBranchSelect = (branch: Branch) => {
  //   setSelectedBranch(branch);
  //   setIsModalOpen(false);

  //   // 지점 선택 후 헤더가 사라지는 문제 해결을 위해 회원권 상세 페이지 헤더를 명시적으로 복원
  //   setMembershipDetailHeader();

  //   // 히스토리 관리 - 현재 URL 상태를 replace하여 히스토리에서 중복 항목 제거
  //   navigate('.', {
  //     replace: true,
  //     state: {
  //       s_idx: membershipId,
  //       brand_code: brandCode
  //     }
  //   });
  // };

  const openBranchSelectModal = () => {
    // 모달을 열기 전에 회원권 상세 헤더 설정 확인
    setMembershipDetailHeader();
    setIsModalOpen(true);

    // s_idx 정보를 모달에 전달 (히스토리에 추가하지 않도록 replace: true 설정)
    navigate('.', {
      state: {
        s_idx: membershipId,
        brand_code: brandCode
      },
      replace: true // 히스토리 스택에 추가하지 않고 현재 상태를 대체
    });
  };

  return (
    <div className="flex flex-col max-h-[610px] min-h-[500px]">
      {/* 콘텐츠 영역 */}
      <div className="flex-1 p-5">
        {serviceType === '지점 회원권' && (
          <button
            className={'w-full border border-gray-100 rounded-xl px-4 py-3 flex justify-between mb-3 items-center '}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openBranchSelectModal();
            }}
            aria-label={selectedBranch ? `선택된 지점: ${selectedBranch.name}` : '지점 선택하기'}
          >
            <span className={`${selectedBranch ? '' : 'text-[#bdbdbd]'} text-base font-normal leading-normal`}>
              {selectedBranch ? selectedBranch.name : '지점을 선택해주세요'}
            </span>
            <CaretRightIcon className={'w-[18px] h-[18px] text-gray-900'} />
          </button>
        )}

        <div className="w-full relative">
          <button
            className={clsx(
              'w-full h-[52px] px-4 py-3 bg-white flex justify-between items-center ',
              isDropdownOpen ? 'rounded-t-xl border border-[#ebebeb] border-b-0' : 'rounded-xl border border-[#ebebeb]'
            )}
            onClick={() => {
              if (serviceType === '지점 회원권' && !selectedBranch) {
                // 토스트 메시지 표시
                showToast('지점을 먼저 선택해주세요');
                return;
              }
              setIsDropdownOpen(!isDropdownOpen);
            }}
            aria-label="관리 횟수 선택"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
          >
            <span className="text-[#bdbdbd] text-base font-normal leading-normal">관리 횟수를 선택해주세요</span>
            <CaretDownIcon
              className={`w-4 h-4 text-gray-900 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 w-full bg-white rounded-b-xl border border-[#dddddd] flex flex-col">
              {options.map((option) => (
                <button
                  key={option.ss_idx}
                  className={`w-full px-4 py-3.5 text-left text-[#212121] text-sm font-normal border-b border-[#ebebeb] hover:bg-gray-50 `}
                  onClick={() => {
                    handleSelectOption(option);
                    setIsDropdownOpen(false);
                  }}
                  aria-label={`${option.ss_count}회 선택`}
                  role="option"
                >
                  {option.ss_count}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 선택된 옵션들 */}
        <div className="mt-5">
          <div className="flex flex-col gap-4">
            {selectedOptions.map(({ option, count }) => (
              <div key={option.ss_idx} className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-m text-16px text-gray-900">{option.ss_count}회</span>
                  <XCircleIcon className="w-5 cursor-pointer" onClick={() => handleRemoveOption(option.ss_idx)} />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center "
                      onClick={() => handleCountChange(option, count - 1)}
                      aria-label={`${option.ss_count}회 수량 감소`}
                    >
                      -
                    </button>
                    <span className="w-8 text-center" role="status" aria-label={`현재 수량 ${count}개`}>
                      {count}
                    </span>
                    <button
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center "
                      onClick={() => handleCountChange(option, count + 1)}
                      aria-label={`${option.ss_count}회 수량 증가`}
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-sb text-16px text-gray-900">{formatPrice(option.ss_price)}</span>
                      <span className="font-r text-14px text-gray-900">원</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="px-5 py-5">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1">
              <span className="font-r text-16px text-gray-900">총</span>
              <span className="font-b text-18px text-primary">{selectedOptions.length}개</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-r text-16px text-gray-900">총</span>
              <span className="font-b text-18px text-primary">{formatPrice(totalPrice)}원</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variantType={selectedOptions.length === 0 ? 'grayLine' : 'line'}
              sizeType="l"
              onClick={handleCartButtonClick}
              className={clsx('flex-1', selectedOptions.length === 0 && '!text-[#BDBDBD]')}
              disabled={selectedOptions.length === 0 ? false : isButtonDisabled}
            >
              {selectedOptions.length === 0 ? '닫기' : '장바구니 담기'}
            </Button>
            <Button
              variantType="primary"
              sizeType="l"
              onClick={handlePurchase}
              className="flex-1"
              disabled={isButtonDisabled}
            >
              바로구매
            </Button>
          </div>
        </div>
      </div>

      {/* {isModalOpen &&
        createPortal(
          <MembershipBranchSelectModal
            onBranchSelect={handleBranchSelect}
            onClose={() => {
              setIsModalOpen(false);

              // 모달이 닫힐 때 헤더가 사라지는 문제 해결을 위해 회원권 상세 페이지 헤더를 명시적으로 복원
              setMembershipDetailHeader();

              // 히스토리 정리 - 현재 URL 상태를 replace하여 히스토리에서 중복 항목 제거
              navigate('.', {
                replace: true,
                state: {
                  s_idx: membershipId,
                  brand_code: brandCode
                }
              });
            }}
            brandCode={brandCode}
          />,
          document.body
        )} */}
    </div>
  );
};

export default OptionsBottomSheetContent;
