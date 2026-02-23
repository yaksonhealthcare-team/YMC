import { ReservationDetailSchema } from '@/entities/reservation/model/reservation.types';
import PhoneIcon from '@/assets/icons/PhoneIcon.svg?react';
import PinIcon from '@/assets/icons/PinIcon.svg?react';
import MapView from '@/shared/ui/map-view/MapView';
import { useOverlay } from '@/shared/ui/modal/ModalContext';
import { Branch } from '@/entities/branch/model/Branch';
import { copyToClipboard } from '@/shared/lib/utils/copyUtils';
import { ReactNode } from 'react';

const InfoGroup = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
  <div className={'flex items-start gap-2 font-r text-14px w-full'}>
    <div className={'h-5 content-center'}>{icon}</div>
    {children}
  </div>
);

interface LocationProps {
  reservation: ReservationDetailSchema;
}

const Location = ({ reservation }: LocationProps) => {
  const { showToast } = useOverlay();
  const { b_lat, b_lon, b_addr, b_tel, b_idx, b_name } = reservation;

  const hasLocation = !!b_lat && !!b_lon;
  const hasAddress = !!b_addr;
  const hasPhone = !!b_tel;

  const branch: Branch = {
    b_idx,
    name: b_name,
    address: b_addr,
    latitude: Number(b_lat) || 0,
    longitude: Number(b_lon) || 0,
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
    await copyToClipboard(reservation.b_tel || '');
    showToast('전화번호가 복사되었습니다');
  };

  return (
    <div className="flex flex-col gap-[16px] mt-[40px]">
      <p className="font-b">오시는 길</p>
      <div className="aspect-[1.8] relative">
        {hasLocation ? (
          <MapView
            center={{ latitude: branch.latitude, longitude: branch.longitude }}
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
              {hasPhone ? reservation.b_tel : '전화번호가 없습니다'}
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
