import clsx from "clsx"

const BUTTON_STYLES = {
  location: "w-10 h-10",
  top: "w-9 h-9",
  search: "w-14 h-14",
  reserve: "w-14 h-14 bg-primary-500",
  membership: "w-14 h-14 bg-primary-500",
} as const

const BUTTON_ICONS = {
  location: "/assets/floatingIcons/location.png",
  top: "/assets/floatingIcons/top.png",
  search: "/assets/floatingIcons/search.png",
  reserve: "/assets/floatingIcons/reserve.png",
  membership: "/assets/floatingIcons/membership.png",
} as const

const BASE_BUTTON_STYLES =
  "fixed z-10 bottom-24 right-5 shadow-floatingButton rounded-full flex items-center justify-center bg-white"

interface FloatingButtonProps {
  type: keyof typeof BUTTON_STYLES
  onClick: () => void
}

export const FloatingButton = ({ type, onClick }: FloatingButtonProps) => (
  <button
    onClick={onClick}
    className={clsx(BASE_BUTTON_STYLES, BUTTON_STYLES[type])}
  >
    <img src={BUTTON_ICONS[type]} alt={`${type} button`} />
  </button>
)

FloatingButton.displayName = "FloatingButton"
