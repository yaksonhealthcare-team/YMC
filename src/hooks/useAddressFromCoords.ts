import { Coordinate } from '@/types/Coordinate';
import { useState } from 'react';

interface AddressInfo {
  jibun: string;
  road: string;
}

export function useAddressFromCoords() {
  const [address, setAddress] = useState<AddressInfo>({
    jibun: '',
    road: ''
  });

  const fetchAddressFromCoords = (coords: Coordinate) => {
    const { naver } = window;
    if (!naver || !naver.maps || !naver.maps.Service) return;

    naver.maps.Service.reverseGeocode(
      {
        coords: new naver.maps.LatLng(coords.latitude, coords.longitude),
        orders: [naver.maps.Service.OrderType.ADDR, naver.maps.Service.OrderType.ROAD_ADDR].join(',')
      },
      (status, response) => {
        if (status === naver.maps.Service.Status.OK) {
          if (response?.v2?.address) {
            setAddress({
              jibun: response.v2.address.jibunAddress || '',
              road: response.v2.address.roadAddress || response.v2.address.jibunAddress || ''
            });
          } else {
            setDefaultAddressError(`주소 정보가 없습니다: ${JSON.stringify(response)}`);
          }
        } else {
          setDefaultAddressError(`주소 검색 실패: ${status}`);
        }
      }
    );
  };

  const setDefaultAddressError = (errorMsg: string) => {
    console.error(errorMsg);
    setAddress({
      jibun: '',
      road: '주소를 찾을 수 없습니다'
    });
  };

  const updateAddressInfo = (locationAddress: AddressInfo | string) => {
    if (!locationAddress) return;

    if (typeof locationAddress === 'object') {
      setAddress({
        road: locationAddress.road || '',
        jibun: locationAddress.jibun || ''
      });
    } else {
      setAddress({
        road: locationAddress,
        jibun: ''
      });
    }

    // 현재 위치일 경우 처리
    const isCurrentLocation =
      (typeof locationAddress === 'object' && locationAddress.road === '현재 위치') || locationAddress === '현재 위치';

    if (isCurrentLocation) {
      setAddress((prev) => ({
        ...prev,
        road: ''
      }));
    }
  };

  return {
    address,
    setAddress,
    fetchAddressFromCoords,
    updateAddressInfo
  };
}

export type { AddressInfo };
