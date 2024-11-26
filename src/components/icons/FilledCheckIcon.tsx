import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon"

interface FilledCheckIconProps extends SvgIconProps {
  isActive?: boolean
}

export default function FilledCheckIcon({
  isActive,
  ...props
}: FilledCheckIconProps) {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="21"
        viewBox="0 0 20 21"
        fill="none"
      >
        <path
          d="M10 18C14.1421 18 17.5 14.6421 17.5 10.5C17.5 6.35786 14.1421 3 10 3C5.85786 3 2.5 6.35786 2.5 10.5C2.5 14.6421 5.85786 18 10 18Z"
          fill={
            isActive ? props.color || props.htmlColor || "#F37165" : "#DDDDDD"
          }
          stroke={
            isActive ? props.color || props.htmlColor || "#F37165" : "#DDDDDD"
          }
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M13.4375 8.625L8.85414 13L6.5625 10.8125"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </SvgIcon>
  )
}
