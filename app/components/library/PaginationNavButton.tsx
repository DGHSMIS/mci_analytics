"use client";

import React, { memo, MouseEventHandler } from "react";
import { cn } from "tailwind-cn";

export interface PaginationNavButtonProps {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

/**
 * @name Navigation Button
 * @description
 * *Company - ARITS Ltd. 16th Jan 2023.
 * *This component is used to render a Navigation Button.
 * @param {string} className Custom class Name for the component class
 * @param {React.ReactNode} children React default children node. Whatever element is added in between the component's opening and closing tag will be rendered through this parameter.
 * @param {boolean} disabled Button disabled or enabled state
 * @param {MouseEventHandler<HTMLButtonElement> | undefined} onClick button functionality
 */

const PaginationNavButton = memo(function PaginationNavButton({
  children,
  className = "",
  onClick,
}: PaginationNavButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "relative inline-flex items-center border border-slate-300 bg-white p-4 text-sm font-medium text-slate-500 hover:bg-slate-50",
        className
      )}
    >
      {children}
    </button>
  );
});

export default PaginationNavButton;
