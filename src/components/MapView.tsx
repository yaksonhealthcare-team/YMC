import CrosshairIcon from '@assets/icons/CrosshairIcon.svg?react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNaverMapBranchMarkers } from '../hooks/useNaverMapBranchMarkers.tsx';
import { Branch } from '../types/Branch.ts';
import { Coordinate } from '../types/Coordinate.ts';
import { getCurrentLocation } from '../utils/getCurrentLocation.ts';

interface MapViewProps {
  center: Coordinate;
  branches?: Branch[];
  options?: {
    showCurrentLocationButton?: boolean;
    showCurrentLocation?: boolean;
    onMoveMap?: (coordinate: Coordinate) => void;
    onSelectBranch?: (branch: Branch) => void;
    currentLocationButtonPosition?: string;
    useStaticPinIcon?: boolean;
  };
  useStaticPinIcon?: boolean;
}

const MapView = ({
  center,
  branches = [],
  options = { showCurrentLocationButton: true },
  useStaticPinIcon
}: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any | null>(null);
  const [selectedBranch] = useState<Branch | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const handleClickMarker = useCallback(
    (branch: Branch) => {
      if (!mapInstance.current) return;

      // 지점 선택 이벤트를 먼저 발생시킴
      if (options?.onSelectBranch) {
        options.onSelectBranch(branch);
      }

      // 지도 이동은 이벤트 발생 후에 처리
      const newCenter = new window.naver.maps.LatLng(branch.latitude, branch.longitude);
      mapInstance.current.setCenter(newCenter);
    },
    [options?.onSelectBranch]
  );

  const markerOptions = useMemo(
    () => ({
      showCurrentLocationMarker: options?.showCurrentLocation,
      onClickMarker: handleClickMarker
    }),
    [options?.showCurrentLocation, handleClickMarker]
  );

  const { updateCurrentLocationMarker } = useNaverMapBranchMarkers({
    map: mapInstance.current,
    branches,
    selectedBranchId: selectedBranch?.b_idx ? Number(selectedBranch.b_idx) : null,
    options: {
      ...markerOptions,
      useStaticPinIcon: useStaticPinIcon
    }
  });

  useEffect(() => {
    let mounted = true;

    const initializeMap = () => {
      if (!mapRef.current || !center || mapInstance.current) {
        return;
      }

      try {
        mapInstance.current = new window.naver.maps.Map(mapRef.current, {
          center: new window.naver.maps.LatLng(center.latitude, center.longitude),
          zoom: 14
        });

        if (!mounted) return;
        setIsMapInitialized(true);

        if (options?.onMoveMap && mapInstance.current) {
          const map = mapInstance.current;
          window.naver.maps.Event.addListener(map, 'dragend', () => {
            const currentCenter = map.getCenter();
            options?.onMoveMap?.({
              latitude: currentCenter.y,
              longitude: currentCenter.x
            });
          });
        }

        if (options?.showCurrentLocation) {
          getCurrentLocation({
            onSuccess: (coords) => {
              if (mounted) {
                setCurrentLocation(coords);
              }
            }
          });
        }
      } catch (e) {
        console.error('Failed to initialize map:', e);
      }
    };

    if (!mapInstance.current) {
      if (!mapRef.current) {
        const checkMapRef = setInterval(() => {
          if (mapRef.current) {
            clearInterval(checkMapRef);
            if (mounted) initializeMap();
          }
        }, 100);

        return () => {
          mounted = false;
          clearInterval(checkMapRef);
        };
      } else {
        initializeMap();
      }
    }

    return () => {
      mounted = false;
    };
  }, [center, options]);

  useEffect(() => {
    if (isMapInitialized && mapInstance.current && center) {
      const currentMapCenter = mapInstance.current.getCenter();
      const newCenterLatLng = new window.naver.maps.LatLng(center.latitude, center.longitude);

      if (!currentMapCenter.equals(newCenterLatLng)) {
        mapInstance.current.setCenter(newCenterLatLng);
      }
    }
  }, [center, isMapInitialized]);

  useEffect(() => {
    if (isMapInitialized && currentLocation && mapInstance.current) {
      updateCurrentLocationMarker(currentLocation);
    }
  }, [currentLocation, isMapInitialized, updateCurrentLocationMarker]);

  const handleCurrentLocationClick = () => {
    getCurrentLocation({
      onSuccess: (coords) => {
        setCurrentLocation(coords);
        if (mapInstance.current) {
          mapInstance.current.setCenter(new window.naver.maps.LatLng(coords.latitude, coords.longitude));
        }
      }
    });
  };

  if (!center) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-gray-500">지도를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} id="map" className="w-full h-full" />
      {options?.showCurrentLocationButton && (
        <button
          onClick={handleCurrentLocationClick}
          className={`absolute bottom-10 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 ${options.currentLocationButtonPosition || ''}`}
        >
          <CrosshairIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default MapView;
