import { IconProps } from "./types";

export function SunIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 16 16`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Sun</title>
      <path
        d="M8.00008 0.666672V2.00001M8.00008 14V15.3333M2.81341 2.81334L3.76008 3.76001M12.2401 12.24L13.1867 13.1867M0.666748 8.00001H2.00008M14.0001 8.00001H15.3334M2.81341 13.1867L3.76008 12.24M12.2401 3.76001L13.1867 2.81334M11.3334 8.00001C11.3334 9.84095 9.84103 11.3333 8.00008 11.3333C6.15913 11.3333 4.66675 9.84095 4.66675 8.00001C4.66675 6.15906 6.15913 4.66667 8.00008 4.66667C9.84103 4.66667 11.3334 6.15906 11.3334 8.00001Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
