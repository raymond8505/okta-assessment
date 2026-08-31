import { IconProps } from "./types";

/**
 * A plus sign with the two sticks separated and named with classes
 * so they can be animated
 */
export function PlusMinusIcon({
  size = 15,
  title = "Plus minus",
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={title}
      {...props}
    >
      <path
        d="M2.5 7.5H12.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
      <path
        className="PlusMinusIcon--vertical"
        // fill-box centers consumer rotations on the bar, not the viewBox.
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        d="M7.5 2.5V12.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  );
}
