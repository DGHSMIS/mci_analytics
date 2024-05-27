import Icon, { IconProps } from "@components/library/Icon";
import Link from "next/link";
import { memo } from "react";
import { cn } from "tailwind-cn";

export interface BadgeIconProps {
  className?: string;
  url?: string;
  target?: string;
  variant?: "primary" | "secondary" | "success" | "danger" | "info" | "ghost";
  icon?: IconProps["iconName"];
  iconColor?: string;
}

/**
 * @name Badgeicon
 * @description
 * *Company - ARITS Ltd. 5th Jan 2023.
 * *This component is used to render a Badge Icon.
 * @param {string} className Custom class Name for the component class
 * @param {string} url URL for the card component
 * @param {string} target Behaviour to handle a link "etc: _blank"
 * @param {string} variant Badge color e.g: primary, secondary etc
 * @param {string} icon Name for the icon inside the badge
 * @param {string} iconColor Color Must be in Hexa color code
 */

const BadgeIcon = memo(function BadgeIcon({
  className = "",
  url = "",
  iconColor = "#e1a95f",
  target = "",
  variant = "primary",
  icon = "check",
}: BadgeIconProps) {
  return (
    <Link
      href={url}
      target={target}
      className={cn("mx-4 inline-flex", className)}
    >
      <span
        className={cn(
          "altd-badge-icon inline-flex items-center rounded-full px-8 pb-4 pt-2",
          variant == "primary"
            ? "bg-primary-100 text-primary-800 dark:bg-primary-200 dark:text-primary-800"
            : variant == "secondary"
            ? "bg-secondary-100 text-secondary-800 dark:bg-secondary-200 dark:text-secondary-800"
            : variant == "success"
            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-200 dark:text-emerald-800"
            : variant == "danger"
            ? "bg-rose-100 text-rose-800 dark:bg-rose-200 dark:text-rose-800"
            : variant == "info"
            ? "bg-sky-100 text-sky-800 dark:bg-sky-200 dark:text-sky-800"
            : variant == "ghost"
            ? "border border-slate-600 p-6 text-slate-600 dark:text-slate-600"
            : ""
        )}
      >
        <Icon
          iconName={icon}
          className="h-20 w-20"
          iconColor={iconColor}
          iconSize="14"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
});

export default BadgeIcon;
