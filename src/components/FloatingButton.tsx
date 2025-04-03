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
  search: "/assets/floatingIcons/search.svg",
  reserve: "/assets/floatingIcons/reserve.png",
  membership: "/assets/floatingIcons/membership.png",
} as const

const BUTTON_LABELS = {
  location: "위치 선택",
  top: "맨 위로 이동",
  search: "검색",
  reserve: "예약하기",
  membership: "멤버십",
} as const

const BASE_BUTTON_STYLES = clsx(
  "fixed z-10 bottom-24 right-5",
  "shadow-floatingButton rounded-full",
  "flex items-center justify-center",
  "bg-white hover:bg-gray-50",
  "focus:outline-none focus:ring-2 focus:ring-[#F37165] focus:ring-offset-2",
  "transition-colors duration-200",
)

interface FloatingButtonProps {
  type: keyof typeof BUTTON_STYLES
  onClick: () => void
  className?: string
}

export const FloatingButton = ({
  type,
  onClick,
  className,
}: FloatingButtonProps) => (
  <button
    onClick={onClick}
    className={clsx(BASE_BUTTON_STYLES, BUTTON_STYLES[type], className)}
    aria-label={BUTTON_LABELS[type]}
  >
    <img
      src={BUTTON_ICONS[type]}
      alt=""
      className="w-6 h-6"
      aria-hidden="true"
    />
  </button>
)

FloatingButton.displayName = "FloatingButton"
