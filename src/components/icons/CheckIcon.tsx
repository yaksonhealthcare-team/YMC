import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon"

export default function CheckIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M16.875 5.62549L8.125 14.3751L3.75 10.0005"
          stroke={props.color || props.htmlColor || "#DDDDDD"}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </SvgIcon>
  )
}
