import { useEffect, useState } from "react"
import { useLayout } from "../../../contexts/LayoutContext.tsx"
import MapView from "@components/MapView.tsx"
import { useGeolocation } from "../../../hooks/useGeolocation.tsx"
import LocationSelectorPin from "@assets/icons/pin/LocationSelectorPin.svg?react"
import { Coordinate } from "../../../types/Coordinate.ts"
import { Button } from "@components/Button.tsx"
import { fetchBranches } from "../../../apis/branch.api.ts"
import { Branch } from "../../../types/Branch.ts"
import { useNavigate } from "react-router-dom"
import { useBranchLocationSelect } from "../../../hooks/useBranchLocationSelect.ts"
import { useAddAddressBookmarkMutation } from "../../../queries/useAddressQueries"
import { useOverlay } from "../../../contexts/ModalContext"

const LocationPickerMap = () => {
  const { naver } = window
  const navigate = useNavigate()
  const { setHeader, setNavigation } = useLayout()
  const { location, loading } = useGeolocation()
  const { setLocation } = useBranchLocationSelect()
  const { mutate: addBookmark } = useAddAddressBookmarkMutation()
  const { openModal, showToast } = useOverlay()
  const [center, setCenter] = useState<Coordinate | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [address, setAddress] = useState({
    jibun: "",
    road: "",
  })

  useEffect(() => {
    setHeader({
      left: "back",
      title: "위치 확인",
      backgroundColor: "bg-white drop-shadow-md",
      display: true,
    })
    setNavigation({ display: false })
  }, [])

  useEffect(() => {
    if (location) {
      setCenter(location)
    }
  }, [location])

  useEffect(() => {
    if (!center) return
    setAddressFromCoords(center)
    fetchBranchesNearby(center)
  }, [center])

  const setAddressFromCoords = (coords: Coordinate) => {
    naver.maps.Service.reverseGeocode(
      {
        coords: new naver.maps.LatLng(coords.latitude, coords.longitude),
        orders: [
          naver.maps.Service.OrderType.ADDR,
          naver.maps.Service.OrderType.ROAD_ADDR,
        ].join(","),
      },
      (_, response) => {
        setAddress({
          jibun: response.v2.address.jibunAddress,
          road: response.v2.address.roadAddress,
        })
      },
    )
  }

  const fetchBranchesNearby = async (coords: Coordinate) => {
    try {
      const result = await fetchBranches({
        page: 1,
        latitude: coords.latitude,
        longitude: coords.longitude,
      })
      setBranches(result.branches)
    } catch (error) {
      console.error("Failed to fetch branches:", error)
    }
  }

  const handleSetLocation = () => {
    if (!center || !address.road) return

    setLocation({
      address: address.road,
      coords: center,
    })
    navigate("/branch", {
      state: {
        selectedLocation: {
          address: address.road,
          coords: center,
        },
      },
    })
  }

  const handleAddBookmark = () => {
    if (!center || !address.road) return

    openModal({
      title: "자주 쓰는 주소 등록",
      message: "이 주소를 자주 쓰는 주소로 등록하시겠습니까?",
      onConfirm: () => {
        addBookmark(
          {
            address: address.road,
            lat: center.latitude.toString(),
            lon: center.longitude.toString(),
          },
          {
            onSuccess: (response) => {
              if (response.resultCode === "29") {
                showToast("이미 등록된 주소입니다.")
                return
              }
              if (response.resultCode === "00") {
                showToast("자주 쓰는 주소로 등록되었습니다.")
                return
              }
              showToast("주소 등록에 실패했습니다. 다시 시도해주세요.")
            },
            onError: (error) => {
              console.error("Failed to add bookmark:", error)
              showToast("주소 등록에 실패했습니다. 다시 시도해주세요.")
            },
          },
        )
      },
    })
  }

  if (loading || !center) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-gray-500">현재 위치를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className={"relative w-full h-full"}>
      <MapView
        center={center}
        branches={branches}
        options={{
          showCurrentLocation: false,
          showCurrentLocationButton: true,
          currentLocationButtonClassName: "!bottom-52",
          onMoveMap: (newCenter) => {
            setCenter(newCenter)
          },
        }}
      />
      <div
        className={
          "absolute top-2 left-5 right-5 bg-gray-700/70 py-2 rounded-md"
        }
      >
        <p className={"text-center text-white font-m text-14px"}>
          {"지도를 움직여 위치를 설정하세요."}
        </p>
      </div>
      <LocationSelectorPin
        className={
          "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[100%] pointer-events-none"
        }
      />
      <div
        className={
          "absolute bottom-0 rounded-t-2xl bg-white w-full z-[300] pt-6 pb-8"
        }
      >
        {address.road.length > 0 && (
          <p className={"px-5 font-b"}>{address.road}</p>
        )}
        {address.jibun.length > 0 && (
          <p className={"px-5 text-14px text-gray-500 mt-2"}>{address.jibun}</p>
        )}
        <div className={"w-full h-[1px] bg-gray-50 mt-6"} />
        <div className={"w-full px-5 mt-3 flex gap-2"}>
          <Button
            variantType={"line"}
            className={"flex-1"}
            onClick={handleAddBookmark}
          >
            {"자주 쓰는 주소로 등록"}
          </Button>
          <Button
            variantType={"primary"}
            className={"flex-1"}
            onClick={handleSetLocation}
          >
            {"이 위치로 설정"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LocationPickerMap
