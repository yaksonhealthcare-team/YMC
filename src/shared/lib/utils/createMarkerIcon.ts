import CurrentLocationPin from '@/assets/icons/pin/CurrentLocationPin.svg?url';
import DaliaActiveBookmarkPin from '@/assets/icons/pin/DaliaActiveBookmarkPin.svg?url';
import DaliaActivePin from '@/assets/icons/pin/DaliaActivePin.svg?url';
import DaliaBookmarkPin from '@/assets/icons/pin/DaliaBookmarkPin.svg?url';
import DaliaPin from '@/assets/icons/pin/DaliaPin.svg?url';
import DietActiveBookmarkPin from '@/assets/icons/pin/DietActiveBookmarkPin.svg?url';
import DietActivePin from '@/assets/icons/pin/DietActivePin.svg?url';
import DietBookmarkPin from '@/assets/icons/pin/DietBookmarkPin.svg?url';
import DietPin from '@/assets/icons/pin/DietPin.svg?url';
import LocationSelectorPin from '@/assets/icons/pin/LocationSelectorPin.svg?url';
import TherapistActiveBookmarkPin from '@/assets/icons/pin/TherapistActiveBookmarkPin.svg?url';
import TherapistActivePin from '@/assets/icons/pin/TherapistActivePin.svg?url';
import TherapistBookmarkPin from '@/assets/icons/pin/TherapistBookmarkPin.svg?url';
import TherapistPin from '@/assets/icons/pin/TherapistPin.svg?url';
import { Branch } from '@/entities/branch/model/Branch';

/**
 * 네이버 지도 마커의 상태를 나타내는 타입.
 * - `current-location`: 현재 위치 표시 마커
 * - `default`: 기본 상태 마커
 * - `active`: 활성화된(선택된) 상태 마커
 * - `bookmark`: 북마크된 상태 마커
 * - `active-bookmark`: 활성화되고 북마크된 상태 마커
 * - `location-selector`: 위치 선택 화면에서 사용되는 마커
 */
export type MarkerState =
  | 'current-location'
  | 'default'
  | 'active'
  | 'bookmark'
  | 'active-bookmark'
  | 'location-selector';

// 브랜드별 마커 아이콘 URL 맵
const BRAND_ICON_MAP = {
  '001': {
    default: TherapistPin,
    active: TherapistActivePin,
    bookmark: TherapistBookmarkPin,
    'active-bookmark': TherapistActiveBookmarkPin
  },
  '002': {
    default: DietPin,
    active: DietActivePin,
    bookmark: DietBookmarkPin,
    'active-bookmark': DietActiveBookmarkPin
  },
  '003': {
    default: DaliaPin,
    active: DaliaActivePin,
    bookmark: DaliaBookmarkPin,
    'active-bookmark': DaliaActiveBookmarkPin
  }
} as const;

type BrandKey = keyof typeof BRAND_ICON_MAP;

/**
 * 지점 정보와 마커 상태에 따라 네이버 지도 마커 아이콘 설정을 생성합니다.
 *
 * @param branch - 지점 정보 객체 (Branch 타입). `state`가 `current-location` 또는 `location-selector`가 아니면 필수.
 * @param state - 생성할 마커의 상태 (MarkerState 타입).
 * @returns 네이버 지도 API에서 사용할 naver.maps.ImageIcon 객체.
 * @throws 지점 정보가 필요하지만 제공되지 않거나, 유효한 아이콘을 찾을 수 없는 경우 에러 발생.
 */
export const createMarkerIcon = (branch: Branch | null | undefined, state: MarkerState): naver.maps.ImageIcon => {
  // 특수 상태 처리 (현재 위치, 위치 선택기)
  if (state === 'current-location') {
    return {
      url: CurrentLocationPin,
      size: new naver.maps.Size(34, 34),
      anchor: new naver.maps.Point(17, 17) // 아이콘 중심점
    };
  }

  if (state === 'location-selector') {
    return {
      url: LocationSelectorPin,
      size: new naver.maps.Size(48, 54),
      anchor: new naver.maps.Point(24, 54) // 아이콘 하단 중앙
    };
  }

  // 일반 지점 마커의 경우 branch 객체가 필수
  if (!branch) {
    console.error('createMarkerIcon: Branch object is required for state:', state);
    throw new Error('Branch object is required for non-special marker states');
  }

  const brandKey = branch.brandCode as BrandKey;
  const brandIcons = BRAND_ICON_MAP[brandKey];

  if (!brandIcons) {
    console.warn(`createMarkerIcon: No icons defined for brand: ${brandKey}, using default therapist icon.`);
    // 기본 아이콘으로 therapist 사용 또는 에러 처리
    const defaultIcon = BRAND_ICON_MAP['001']['default'];
    return {
      url: defaultIcon,
      size: new naver.maps.Size(40, 40),
      anchor: new naver.maps.Point(20, 40) // 기본 아이콘 하단 중앙
    };
  }

  // 상태에 맞는 아이콘 선택 (없으면 default 상태 아이콘 사용)
  const iconUrl = brandIcons[state] || brandIcons['default'];

  // 아이콘 크기 및 앵커 포인트 설정
  let size: { w: number; h: number };
  let anchor: naver.maps.Point;

  if (state === 'active' || state === 'active-bookmark') {
    size = { w: 48, h: 54 };
    anchor = new naver.maps.Point(24, 54); // 활성 상태 아이콘 하단 중앙
  } else {
    size = { w: 40, h: 40 };
    anchor = new naver.maps.Point(20, 40); // 기본 상태 아이콘 하단 중앙
  }

  return {
    url: iconUrl,
    size: new naver.maps.Size(size.w, size.h),
    anchor: anchor
  };
};
