import type { ComponentPropsWithoutRef } from "react";

import { styled } from "styled-components";
import { theme } from "@/styles/theme";
import { ChevronRight } from "../icons/ChevronRight";

export type BreadcrumbItem = string | { label: string; href: string };

const BreadcrumbsList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  gap: ${theme.space[1]};

  font-weight: 400;
  font-size: ${theme["font-size"].breadcrumbs};
  line-height: 1.4;
  letter-spacing: 0.1px;
`;

const BreadcrumbListItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${theme.space[1]};
`;

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
} & ComponentPropsWithoutRef<"ul">;

export function Breadcrumbs({ items, ...rest }: BreadcrumbsProps) {
  return (
    <BreadcrumbsList {...rest}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <BreadcrumbListItem key={index}>
            {typeof item === "string" ? (
              <span>{item}</span>
            ) : (
              <a href={item.href}>{item.label}</a>
            )}
            {!isLast && <ChevronRight size={8} aria-hidden />}
          </BreadcrumbListItem>
        );
      })}
    </BreadcrumbsList>
  );
}
