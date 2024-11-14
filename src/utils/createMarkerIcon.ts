import { Branch } from "../types/Branch.ts"
import CurrentLocationPin from "@assets/icons/pin/CurrentLocationPin.svg?url"
import DaliaActiveBookmarkPin from "@assets/icons/pin/DaliaActiveBookmarkPin.svg?url"
import DaliaActivePin from "@assets/icons/pin/DaliaActivePin.svg?url"
import DaliaBookmarkPin from "@assets/icons/pin/DaliaBookmarkPin.svg?url"
import DaliaPin from "@assets/icons/pin/DaliaPin.svg?url"
import DietActiveBookmarkPin from "@assets/icons/pin/DietActiveBookmarkPin.svg?url"
import DietActivePin from "@assets/icons/pin/DietActivePin.svg?url"
import DietBookmarkPin from "@assets/icons/pin/DietBookmarkPin.svg?url"
import DietPin from "@assets/icons/pin/DietPin.svg?url"
import LocationSelectorPin from "@assets/icons/pin/LocationSelectorPin.svg?url"
import TherapistActiveBookmarkPin from "@assets/icons/pin/TherapistActiveBookmarkPin.svg?url"
import TherapistActivePin from "@assets/icons/pin/TherapistActivePin.svg?url"
import TherapistBookmarkPin from "@assets/icons/pin/TherapistBookmarkPin.svg?url"
import TherapistPin from "@assets/icons/pin/TherapistPin.svg?url"

type MarkerState =
  | "current-location"
  | "default"
  | "active"
  | "bookmark"
  | "active-bookmark"
  | "location-selector"

interface NaverMapIcon {
  url: string
  size: naver.maps.Size
  anchor: naver.maps.Point
}

export const createMarkerIcon = (
  branch: Branch | null,
  state: MarkerState,
): NaverMapIcon => {
  if (state === "current-location") {
    return {
      url: CurrentLocationPin,
      size: new window.naver.maps.Size(34, 34),
      anchor: new window.naver.maps.Point(17, 17),
    }
  }

  if (state === "location-selector") {
    return {
      url: LocationSelectorPin,
      size: new window.naver.maps.Size(48, 54),
      anchor: new window.naver.maps.Point(24, 54),
    }
  }

  if (!branch) {
    throw new Error("Branch object is required for non-special marker states")
  }

  const iconMap = {
    "dalia": {
      "default": DaliaPin,
      "active": DaliaActivePin,
      "bookmark": DaliaBookmarkPin,
      "active-bookmark": DaliaActiveBookmarkPin,
    },
    "diet": {
      "default": DietPin,
      "active": DietActivePin,
      "bookmark": DietBookmarkPin,
      "active-bookmark": DietActiveBookmarkPin,
    },
    "therapist": {
      "default": TherapistPin,
      "active": TherapistActivePin,
      "bookmark": TherapistBookmarkPin,
      "active-bookmark": TherapistActiveBookmarkPin,
    },
  }

  const icon =
    iconMap[branch.brand]?.[state] || iconMap[branch.brand]?.["default"]

  if (!icon) {
    throw new Error(
      `No icon found for branch type ${branch.brand} and state ${state}`,
    )
  }

  return {
    url: icon,
    size: new window.naver.maps.Size(48, 52),
    anchor: new window.naver.maps.Point(24, 52),
  }
}
