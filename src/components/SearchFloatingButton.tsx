import clsx from "clsx"

type ButtonType = "list" | "search"

interface SearchFloatingButtonProps {
  type: ButtonType
  title: string
  onClick: () => void
}

export const SearchFloatingButton = (props: SearchFloatingButtonProps) => {
  const { type, title, onClick } = props

  const buttonStyles = {
    list: `px-3 py-2`,
    search: `px-3 py-2`,
  }

  const getIconByType = (type: ButtonType) => {
    switch (type) {
      case "list":
        return <img src="/assets/floatingIcons/list.png" />
      case "search":
        return <img src="/assets/floatingIcons/map.png" />
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
        <span className="font-m text-14px text-gray-700 ml-1">{title}</span>
      </button>
    </>
  )
}
