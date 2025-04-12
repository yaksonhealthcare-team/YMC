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

export type MarkerState =
  | "current-location"
  | "default"
  | "active"
  | "bookmark"
  | "active-bookmark"
  | "location-selector"

export const createMarkerIcon = (
  branch: Branch | null,
  state: MarkerState,
): naver.maps.ImageIcon => {
  if (state === "current-location") {
    return {
      url: CurrentLocationPin,
      size: new naver.maps.Size(34, 34),
      anchor: new naver.maps.Point(17, 17),
    }
  }

  if (state === "location-selector") {
    return {
      url: LocationSelectorPin,
      size: new naver.maps.Size(48, 54),
      anchor: new naver.maps.Point(24, 54),
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
    "yakson": {
      "default": TherapistPin,
      "active": TherapistActivePin,
      "bookmark": TherapistBookmarkPin,
      "active-bookmark": TherapistActiveBookmarkPin,
    },
    "yerihan": {
      "default": DietPin,
      "active": DietActivePin,
      "bookmark": DietBookmarkPin,
      "active-bookmark": DietActiveBookmarkPin,
    },
    "약손명가": {
      "default": TherapistPin,
      "active": TherapistActivePin,
      "bookmark": TherapistBookmarkPin,
      "active-bookmark": TherapistActiveBookmarkPin,
    },
  } as const

  const brandKey = branch.brand as keyof typeof iconMap
  const icon = iconMap[brandKey]?.[state] || iconMap[brandKey]?.["default"]

  if (!icon) {
    throw new Error(
      `No icon found for branch type ${branch.brand} and state ${state}`,
    )
  }

  const size =
    state === "default" || state === "bookmark"
      ? { w: 40, h: 40 }
      : { w: 48, h: 54 }

  return {
    url: icon,
    size: new naver.maps.Size(size.w, size.h),
  }
}
