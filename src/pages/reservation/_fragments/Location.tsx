import { ReactNode } from 'react';
import PinIcon from '@assets/icons/PinIcon.svg?react';
import PhoneIcon from '@assets/icons/PhoneIcon.svg?react';
import { copyToClipboard } from 'utils/copyUtils';
import MapView from '@components/MapView';
import { Branch } from 'types/Branch';
import { ReservationDetail } from 'queries/useReservationQueries';
import { useOverlay } from 'contexts/ModalContext';

const InfoGroup = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
  <div className={'flex items-start gap-2 font-r text-14px w-full'}>
    <div className={'h-5 content-center'}>{icon}</div>
    {children}
  </div>
);

interface LocationProps {
  reservation: ReservationDetail;
}

const Location = ({ reservation }: LocationProps) => {
  const { showToast } = useOverlay();

  const hasLocation = reservation.latitude && reservation.longitude;
  const hasAddress = !!reservation.address;
  const hasPhone = !!reservation.phone;

  const branchLocation = {
    latitude: reservation.latitude || 0,
    longitude: reservation.longitude || 0
  };

  const branch: Branch = {
    b_idx: reservation.branchId,
    name: reservation.store,
    address: reservation.address || '',
    latitude: branchLocation.latitude,
    longitude: branchLocation.longitude,
    canBookToday: true,
    distanceInMeters: null,
    isFavorite: false,
    brandCode: 'T',
    brand: 'therapist'
  };

  const handleCopyAddress = async () => {
    if (!hasAddress) return;
    await copyToClipboard(branch.address);
    showToast('주소가 복사되었습니다');
  };

  const handleCopyPhone = async () => {
    if (!hasPhone) return;
    await copyToClipboard(reservation.phone || '');
    showToast('전화번호가 복사되었습니다');
  };

  return (
    <div className="flex flex-col gap-[16px] mt-[40px]">
      <p className="font-b">오시는 길</p>
      <div className="aspect-[1.8] relative">
        {hasLocation ? (
          <MapView
            center={branchLocation}
            branches={[branch]}
            useStaticPinIcon={true}
            options={{
              showCurrentLocationButton: false,
              showCurrentLocation: false
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">위치 정보가 없습니다</p>
          </div>
        )}
      </div>
      <div className="flex gap-[12px] flex-col mt-[16px]">
        <InfoGroup icon={<PinIcon />}>
          <div className={'flex w-full flex-row items-start gap-2'}>
            <p className={`flex-1 ${!hasAddress ? 'text-gray-500' : ''}`}>
              {hasAddress ? branch.address : '주소 정보가 없습니다'}
            </p>
            <button
              className={`flex-shrink-0 ${hasAddress ? 'text-tag-blue' : 'text-gray-300 cursor-not-allowed'}`}
              onClick={handleCopyAddress}
              disabled={!hasAddress}
            >
              복사
            </button>
          </div>
        </InfoGroup>
        <InfoGroup icon={<PhoneIcon />}>
          <div className={'flex w-full flex-row items-start gap-2'}>
            <p className={`flex-1 ${!hasPhone ? 'text-gray-500' : ''}`}>
              {hasPhone ? reservation.phone : '전화번호가 없습니다'}
            </p>
            <button
              className={`flex-shrink-0 ${hasPhone ? 'text-tag-blue' : 'text-gray-300 cursor-not-allowed'}`}
              onClick={handleCopyPhone}
              disabled={!hasPhone}
            >
              복사
            </button>
          </div>
        </InfoGroup>
      </div>
    </div>
  );
};

export default Location;
