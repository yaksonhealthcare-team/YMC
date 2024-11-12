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
    search: `px-3 py-2 bg-white`,
  }

  const getIconByType = (type: ButtonType) => {
    switch (type) {
      case "list":
        return <img src="/assets/floatingIcons/list.png" alt={"리스트"} />
      case "search":
        return <img src="/assets/floatingIcons/map.png" alt={"지도"} />
      default:
        return null
    }
  }

  return (
    <>
      <button
        onClick={onClick}
        className={clsx(
          `shadow-floatingButton rounded-full flex items-center justify-center bg-white`,
          buttonStyles[type],
        )}
      >
        {getIconByType(type)}
        <span className="font-m text-14px text-gray-700 ml-1">{title}</span>
      </button>
    </>
  )
}
