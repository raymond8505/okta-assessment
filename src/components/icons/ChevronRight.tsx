import { IconProps } from "./types";

export function ChevronRight({
  size = 16,
  title = "Chevron point right",
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 6 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      // use aria-label instead of title because dynamic <title> in an SSR SVG breaks hydration
      aria-label={title}
      {...props}
    >
      <path
        d="M0.530331 8.53033L4.53033 4.53033L0.53033 0.530334"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
