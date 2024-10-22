import clsx from "clsx"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import SearchIcon from "@components/icons/SearchIcon"
import CaretDownIcon from "@assets/icons/CaretDownIcon.svg?react"
import React from "react"

interface HeaderProps {
  type:
    | "location"
    | "back_w"
    | "back_b"
    | "back_title"
    | "back_title_icon"
    | "two_icon"
    | "back_title_text"
    | "title_right_icon"
  title?: string
  textRight?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  onClickLeft?: () => void
  onClickRight?: () => void
  onClickLocation?: () => void
}

export const Header = (props: HeaderProps) => {
  const {
    type,
    title,
    textRight,
    onClickLeft,
    onClickRight,
    onClickLocation,
    iconLeft,
    iconRight,
  } = props

  const divStyles = {
    location: `py-3 px-5 bg-white`,
    back_w: `py-3.5 px-5`,
    back_b: `py-3.5 px-5`,
    back_title: `py-3 px-5`,
    back_title_icon: `py-3 px-5`,
    two_icon: `py-3 px-5`,
    back_title_text: `py-3 px-5`,
    title_right_icon: `py-3 px-5`,
  }

  const modifiedIconLeft =
    iconLeft &&
    React.cloneElement(
      iconRight as React.ReactElement<React.SVGProps<SVGSVGElement>>,
      {
        width: "24px",
        height: "24px",
      },
    )

  const modifiedIconRight =
    iconRight &&
    React.cloneElement(
      iconRight as React.ReactElement<React.SVGProps<SVGSVGElement>>,
      {
        width: "24px",
        height: "24px",
      },
    )

  return (
    <>
      <div
        className={clsx(
          `flex justify-between items-center h-[48px]`,
          divStyles[type],
        )}
      >
        {/* 왼쪽 아이콘 */}
        <button onClick={onClickLeft}>
          {type === "two_icon" ? (
            <>{modifiedIconLeft}</>
          ) : type === "title_right_icon" ? (
            <div className="w-5 h-5"></div>
          ) : (
            <CaretLeftIcon
              className={clsx(
                "w-5 h-5",
                type === "back_w" ? "text-white" : "text-gray-700",
              )}
            />
          )}
        </button>
        {/* 가운데 타이틀 */}
        <div className="flex justify-center gap-2">
          <span
            className={clsx(
              "font-sb text-gray-700",
              type === "location" ? "text-14px" : "text-16px",
            )}
          >
            {title}
          </span>
          {type === "location" && (
            <button onClick={onClickLocation}>
              <CaretDownIcon className="w-4 h-4" />
            </button>
          )}
        </div>
        {/* 오른쪽 아이콘 */}
        {type === "back_w" || type === "back_b" || type === "back_title" ? (
          <div className="w-5 h-5"></div>
        ) : type === "location" ? (
          <button onClick={onClickRight}>
            <SearchIcon className="w-6 h-6" />
          </button>
        ) : type === "back_title_text" ? (
          <button onClick={onClickRight}>
            <span className="font-m text-16px text-gray-500">{textRight}</span>
          </button>
        ) : (
          <button onClick={onClickRight}>{modifiedIconRight}</button>
        )}
      </div>
    </>
  )
}
