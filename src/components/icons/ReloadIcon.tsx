import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

export default function ReloadIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.7527 9.66663C12.0741 11.7959 10.1304 13.3333 7.83855 13.3333C4.98229 13.3333 2.66683 10.9455 2.66683 7.99996C2.66683 5.05444 4.98229 2.66663 7.83855 2.66663C9.75281 2.66663 11.4242 3.73916 12.3184 5.33329M10.7476 5.99996H13.3335V3.33329"
          stroke={props.color || props.htmlColor || 'black'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgIcon>
  );
}
