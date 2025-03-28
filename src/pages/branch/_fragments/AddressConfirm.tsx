import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useLayout } from "../../../contexts/LayoutContext"
import { Button } from "@components/Button"
import { useBranchLocationSelect } from "../../../hooks/useBranchLocationSelect"
import { useAddAddressBookmarkMutation } from "../../../queries/useAddressQueries"
import { useOverlay } from "../../../contexts/ModalContext"
import HeartDisabledIcon from "@assets/icons/HeartDisabledIcon.svg?react"
import HeartEnabledIcon from "@assets/icons/HeartEnabledIcon.svg?react"

const AddressConfirm = () => {
  const { setHeader, setNavigation } = useLayout()
  const navigate = useNavigate()
  const location = useLocation()
  const { setLocation } = useBranchLocationSelect()
  const { mutate: addBookmark } = useAddAddressBookmarkMutation()
  const { openModal, showToast } = useOverlay()
  const [address, setAddress] = useState({
    road: "",
    jibun: "",
  })
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  })
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    // 헤더 설정
    setHeader({
      left: "back",
      title: "주소 확인",
      backgroundColor: "bg-white",
      display: true,
    })
    setNavigation({ display: false })

    // 이전 화면에서 전달된 주소와 좌표 정보 확인
    if (location.state?.selectedLocation) {
      const { address: locationAddress, coords } = location.state.selectedLocation;
      
      if (locationAddress && coords) {
        // 주소가 객체인 경우(road, jibun 속성이 있는 경우)와 문자열인 경우 모두 처리
        if (typeof locationAddress === 'object') {
          setAddress({
            road: locationAddress.road || '',
            jibun: locationAddress.jibun || '',
          });
        } else {
          setAddress({
            road: locationAddress,
            jibun: '',
          });
        }
        
        setCoordinates(coords);
      }
    }
  }, [])

  const handleAddBookmark = () => {
    if (!coordinates || !address.road) return

    if (isBookmarked) {
      setIsBookmarked(false)
      showToast("자주 쓰는 주소에서 삭제되었습니다.")
      return
    }

    openModal({
      title: "자주 쓰는 주소 등록",
      message: "이 주소를 자주 쓰는 주소로 등록하시겠습니까?",
      onConfirm: () => {
        addBookmark(
          {
            address: address.road,
            lat: coordinates.latitude.toString(),
            lon: coordinates.longitude.toString(),
          },
          {
            onSuccess: (response) => {
              if (response.resultCode === "29") {
                showToast("이미 등록된 주소입니다.")
                setIsBookmarked(true)
                return
              }
              if (response.resultCode === "00") {
                showToast("자주 쓰는 주소로 등록되었습니다.")
                setIsBookmarked(true)
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

  const handleOpenMap = () => {
    navigate("/branch/location/picker", {
      state: {
        selectedLocation: {
          address: {
            road: address.road,
            jibun: address.jibun
          },
          coords: coordinates,
        },
      },
    })
  }

  const handleRegisterAddress = () => {
    if (!coordinates || !address.road) return

    setLocation({
      address: address.road,
      coords: coordinates,
    })
    navigate("/branch", {
      state: {
        selectedLocation: {
          address: {
            road: address.road,
            jibun: address.jibun
          },
          coords: coordinates,
        },
      },
    })
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 주소 정보 */}
      <div className="flex flex-col px-5 mt-[64px]">
        <div className="font-b text-[16px] text-gray-900">{address.road}</div>
        {address.jibun && (
          <div className="mt-2 text-[14px] text-gray-500">{address.jibun}</div>
        )}
      </div>

      {/* 자주 쓰는 주소 등록 버튼 */}
      <div
        className={`flex justify-between items-center mx-5 mt-[24px] px-5 h-[56px] rounded-[12px] ${
          isBookmarked
            ? "border border-[#F37165]"
            : "border border-[#ECECEC]"
        }`}
        onClick={handleAddBookmark}
      >
        <div className={`text-[14px] font-m ${isBookmarked ? "text-[#F37165]" : "text-gray-400"}`}>
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
        <div className="flex flex-col gap-2 p-5">
          <Button
            variantType="text"
            sizeType="l"
            className="w-full"
            onClick={handleOpenMap}
          >
            지도에서 위치 확인
          </Button>
          <Button
            variantType="primary"
            sizeType="l"
            className="w-full"
            onClick={handleRegisterAddress}
          >
            이 위치로 주소 등록
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddressConfirm 