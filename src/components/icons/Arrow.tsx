import styled from "styled-components";
import { IconProps } from "./types";

export function ArrowRightIcon({
  size = 15,
  title = "Chevron point right",
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      // use aria-label instead of title because dynamic <title> in an SSR SVG breaks hydration
      aria-label={title}
      {...props}
    >
      <path
        d="M2.3125 7.5L12.3125 7.5"
        stroke="currentColor"
        stroke-width="1.25"
        stroke-linecap="square"
        stroke-linejoin="round"
      />
      <path
        d="M7.91675 2.5L12.9167 7.5L7.91675 12.5"
        stroke="currentColor"
        stroke-width="1.25"
        stroke-linecap="square"
        stroke-linejoin="round"
      />
    </svg>
  );
}

/*
 * The rotated variants would otherwise inherit "Chevron point right" as their
 * accessible name. Function-form attrs so a consumer-passed title still wins
 * (static attrs override props).
 */
export const ArrowDownIcon = styled(ArrowRightIcon).attrs<IconProps>(
  ({ title }) => ({ title: title ?? "Chevron point down" }),
)`
  transform: rotate(90deg);
`;

export const ArrowLeftIcon = styled(ArrowRightIcon).attrs<IconProps>(
  ({ title }) => ({ title: title ?? "Chevron point left" }),
)`
  transform: rotate(180deg);
`;

export const ArrowUpIcon = styled(ArrowRightIcon).attrs<IconProps>(
  ({ title }) => ({ title: title ?? "Chevron point up" }),
)`
  transform: rotate(270deg);
`;
