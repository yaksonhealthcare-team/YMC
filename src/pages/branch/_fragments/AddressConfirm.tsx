import HeartDisabledIcon from '@/assets/icons/HeartDisabledIcon.svg?react';
import HeartEnabledIcon from '@/assets/icons/HeartEnabledIcon.svg?react';
import { Button } from '@/components/Button';
import { useLayout } from '@/contexts/LayoutContext';
import { useOverlay } from '@/contexts/ModalContext';
import { useAddressFromCoords } from '@/hooks/useAddressFromCoords';
import { useBranchLocationSelect } from '@/hooks/useBranchLocationSelect';
import {
  useAddAddressBookmarkMutation,
  useAddressBookmarks,
  useDeleteAddressBookmarkMutation
} from '@/queries/useAddressQueries';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AddressConfirm = () => {
  const { setHeader, setNavigation } = useLayout();
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { setLocation } = useBranchLocationSelect();
  const { mutate: addBookmark } = useAddAddressBookmarkMutation();
  const { mutate: deleteBookmark } = useDeleteAddressBookmarkMutation();
  const { openModal, showToast } = useOverlay();
  const { address, fetchAddressFromCoords, updateAddressInfo } = useAddressFromCoords();

  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0
  });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const bookmarkProcessingRef = useRef(false);

  // 북마크 목록 가져오기
  const { data: bookmarks = [] } = useAddressBookmarks();

  useEffect(() => {
    // 헤더 설정
    setHeader({
      left: 'back',
      title: '주소 확인',
      backgroundColor: 'bg-white',
      display: true
    });
    setNavigation({ display: false });

    // 이전 화면에서 전달된 주소와 좌표 정보 확인
    if (routeLocation.state?.selectedLocation) {
      const { address: locationAddress, coords } = routeLocation.state.selectedLocation;

      if (locationAddress && coords) {
        // 주소가 객체인 경우(road, jibun 속성이 있는 경우)와 문자열인 경우 모두 처리
        if (typeof locationAddress === 'object') {
          const roadAddress = locationAddress.road;
          // "현재 위치"가 아닌 경우에만 설정
          if (roadAddress && roadAddress !== '현재 위치') {
            updateAddressInfo(locationAddress);
          } else if (roadAddress === '현재 위치') {
            // 좌표로부터 주소를 조회하는 로직
            fetchAddressFromCoords(coords);
          }
        } else if (locationAddress !== '현재 위치') {
          updateAddressInfo(locationAddress);
        } else {
          // "현재 위치"인 경우 좌표로부터 주소 조회
          fetchAddressFromCoords(coords);
        }

        setCoordinates(coords);
      }
    }
  }, []);

  // 북마크 목록이 변경되면 현재 주소가 북마크되어 있는지 확인
  useEffect(() => {
    if (bookmarks.length > 0 && address.road) {
      // 현재 주소와 같은 주소가 북마크에 있는지 확인
      const matchedBookmark = bookmarks.find(
        (bookmark) =>
          bookmark.address === address.road ||
          (Math.abs(parseFloat(bookmark.lat) - coordinates.latitude) < 0.0001 &&
            Math.abs(parseFloat(bookmark.lon) - coordinates.longitude) < 0.0001)
      );

      if (matchedBookmark && matchedBookmark.csab_idx) {
        setIsBookmarked(true);
        setBookmarkId(matchedBookmark.csab_idx);
      } else {
        setIsBookmarked(false);
        setBookmarkId(null);
      }
    }
  }, [bookmarks, address.road, coordinates]);

  const handleAddBookmark = () => {
    if (!coordinates || !address.road) return;
    // 이미 처리 중이면 중복 실행 방지
    if (bookmarkProcessingRef.current) {
      return;
    }
    if (isBookmarked && bookmarkId) {
      openModal({
        title: '자주 쓰는 주소 삭제',
        message: '이 주소를 자주 쓰는 주소에서 삭제하시겠습니까?',
        onConfirm: () => {
          // 처리 중 플래그 설정
          bookmarkProcessingRef.current = true;

          deleteBookmark(bookmarkId, {
            onSuccess: (response) => {
              // 처리 완료 플래그 해제
              bookmarkProcessingRef.current = false;

              if (response.resultCode === '00') {
                setIsBookmarked(false);
                setBookmarkId(null);
              } else {
                showToast('주소 삭제에 실패했습니다. 다시 시도해주세요.');
              }
            },
            onError: (error) => {
              // 에러 발생 시에도 처리 완료 플래그 해제
              bookmarkProcessingRef.current = false;
              console.error('Failed to delete bookmark:', error);
              showToast('주소 삭제에 실패했습니다. 다시 시도해주세요.');
            }
          });
        }
      });
      return;
    }
    openModal({
      title: '자주 쓰는 주소 등록',
      message: '이 주소를 자주 쓰는 주소로 등록하시겠습니까?',
      onConfirm: () => {
        // 처리 중 플래그 설정
        bookmarkProcessingRef.current = true;

        addBookmark(
          {
            address: address.road,
            lat: coordinates.latitude.toString(),
            lon: coordinates.longitude.toString(),
            name: routeLocation.state?.selectedLocation?.name || ''
          },
          {
            onSuccess: (response) => {
              // 처리 완료 플래그 해제
              bookmarkProcessingRef.current = false;

              if (response.resultCode === '29') {
                showToast('이미 등록된 주소입니다.');
                setIsBookmarked(true);
                return;
              }
              if (response.resultCode === '00') {
                showToast('자주 쓰는 주소로 등록되었습니다.');
                setIsBookmarked(true);
                return;
              }
              showToast('주소 등록에 실패했습니다. 다시 시도해주세요.');
            },
            onError: (error) => {
              // 에러 발생 시에도 처리 완료 플래그 해제
              bookmarkProcessingRef.current = false;
              console.error('Failed to add bookmark:', error);
              showToast('주소 등록에 실패했습니다. 다시 시도해주세요.');
            }
          }
        );
      }
    });
  };

  const handleOpenMap = () => {
    navigate('/branch/location/picker', {
      state: {
        selectedLocation: {
          address: {
            road: address.road,
            jibun: address.jibun
          },
          coords: coordinates
        }
      }
    });
  };

  const handleRegisterAddress = () => {
    if (!coordinates || !address.road) return;
    setLocation({
      address: address.road,
      coords: coordinates
    });
    navigate('/branch', {
      state: {
        selectedLocation: {
          address: {
            road: address.road,
            jibun: address.jibun
          },
          coords: coordinates
        }
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 주소 정보 */}
      <div className="flex flex-col px-5 mt-[64px]">
        {routeLocation.state?.selectedLocation?.name && (
          <div className="font-b text-[18px] text-gray-900 mb-2">{routeLocation.state.selectedLocation.name}</div>
        )}
        <div className="font-b text-[16px] text-gray-900">{address.road}</div>
        {address.jibun && <div className="mt-2 text-[14px] text-gray-500">{address.jibun}</div>}
      </div>
      {/* 자주 쓰는 주소 등록 버튼 */}
      <div
        className={`flex justify-between items-center mx-5 mt-[24px] px-5 h-[56px] rounded-[12px] ${
          isBookmarked ? 'border border-[#F37165]' : 'border border-[#ECECEC]'
        }`}
        onClick={handleAddBookmark}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAddBookmark();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={isBookmarked ? '자주 쓰는 주소에서 삭제' : '자주 쓰는 주소로 등록'}
      >
        <div className={`text-[14px] font-m ${isBookmarked ? 'text-[#F37165]' : 'text-gray-400'}`}>
          자주 쓰는 주소로 등록
        </div>
        {isBookmarked ? (
          <HeartEnabledIcon className="w-5 h-5 text-[#F37165]" />
        ) : (
          <HeartDisabledIcon className="w-5 h-5 text-gray-400" />
        )}
      </div>
      {/* 하단 버튼 영역 */}
      <div className="fixed bottom-0 left-0 right-0 flex flex-col w-full bg-white border-t border-gray-50">
        <div className="flex flex-col gap-2 p-5 pt-6 pb-8">
          <Button variantType="text" sizeType="l" className="w-full" onClick={handleOpenMap}>
            지도에서 위치 확인
          </Button>
          <Button variantType="primary" sizeType="l" className="w-full" onClick={handleRegisterAddress}>
            이 위치로 주소 등록
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddressConfirm;
