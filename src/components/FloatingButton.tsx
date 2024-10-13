import clsx from "clsx"

type ButtonType = "location" | "top" | "search" | "reserve" | "purchase"

interface FloatingButtonProps {
  type: ButtonType
  onClick: () => void
}

export const FloatingButton = (props: FloatingButtonProps) => {
  const { type, onClick } = props

  const buttonStyles = {
    location: `w-10 h-10`,
    top: `w-9 h-9`,
    search: `w-14 h-14`,
    reserve: `w-14 h-14 bg-primary-500`,
    purchase: `w-14 h-14 bg-primary-500`,
  }

  const getIconByType = (type: ButtonType) => {
    switch (type) {
      case "location":
        return <img src="/assets/floatingIcons/location.png" />
      case "top":
        return <img src="/assets/floatingIcons/top.png" />
      case "search":
        return <img src="/assets/floatingIcons/search.png" />
      case "reserve":
        return <img src="/assets/floatingIcons/reserve.png" />
      case "purchase":
        return <img src="/assets/floatingIcons/purchase.png" />
      default:
        return null
    }
  }

  return (
    <>
      <button
        onClick={onClick}
        className={clsx(
          `shadow-floatingButton rounded-full flex items-center justify-center`,
          buttonStyles[type],
        )}
      >
        {getIconByType(type)}
      </button>
    </>
  )
}
