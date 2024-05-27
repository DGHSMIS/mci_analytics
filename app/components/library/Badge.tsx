import Icon, { IconProps } from "@components/library/Icon";
import Link from "next/link";
import React, { HTMLAttributeAnchorTarget, memo } from "react";
import { cn } from "tailwind-cn";

export interface BadgeProps {
  text: string;
  textClass?: string;
  rounded?: boolean;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "info"
    | "neutral"
    | "warning";
  href?: string | URL;
  target?: HTMLAttributeAnchorTarget;
  iconName?: IconProps["iconName"];
  iconPosition?: "left" | "right";
  iconSvgClass?: string;
  className?: string;
}

/**
 * A Badge component that displays a small piece of information with text and optional icon. The badge can be linked to a URL by passing URL to the `href` param.
 *
 * @param {string} text The text to display on the badge
 * @param {string} [textClass] The class name for the badge text
 * @param {boolean} [rounded] Define if the component renders the rounded-full tw class
 * @param {'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'neutral'} [variant] The visual variant of the badge namely `primary` (default), `secondary`, `success`, `danger`, `info` and `neutral`
 * @param {string} [className] The class name for the badge component
 * @param {string | URL} [href] The URL to link to when badge is clicked, wrapped in a `Link` component
 * @param {string} [target='_self'] The target attribute of the link
 * @param {string} [iconName] The name of the icon to be displayed on the badge
 * @param {'left' | 'right'} [iconPosition='right'] The position of the badge icon rendering on `left` or `right` (default) of the badge text
 * @param {string} [iconSvgClass] The class name for the badge icon SVG element
 *
 * @author ARITS Ltd.
 * @description
 * Company - ARITS Ltd. 12th Mar 2023.
 *
 */

const Badge = memo(function Badge({
  text,
  textClass = "",
  className = "",
  rounded = false,
  variant = "primary",
  href = undefined,
  target = "_self",
  iconName = "",
  iconPosition = "right",
  iconSvgClass = "",
}: BadgeProps) {
  const ConditionalContent = () => (
    <span
      className={cn(
        "altd-badge mx-4 mb-8 inline-flex items-center py-2 text-sm font-medium",

        rounded === true ? "rounded-full" : "rounded",
        variant == "primary"
          ? "border border-primary-200 bg-primary-100 px-8 text-primary-800 dark:bg-primary-200 dark:text-primary-800"
          : variant == "secondary"
          ? "border border-secondary-200 bg-secondary-100 px-8 text-secondary-800 dark:bg-secondary-200 dark:text-secondary-800"
          : variant == "success"
          ? "border border-emerald-200 bg-emerald-100 px-8 text-emerald-800 dark:bg-emerald-200 dark:text-emerald-800"
          : variant == "danger"
          ? "border border-rose-200 bg-rose-100 px-8 text-rose-800 dark:bg-rose-200 dark:text-rose-800"
          : variant == "info"
          ? "border border-sky-200 bg-sky-100 px-8 text-sky-800 dark:bg-sky-200 dark:text-sky-800"
          : variant == "neutral"
          ? "border border-slate-200 bg-slate-100 px-8 text-slate-600 dark:text-slate-600"
          : variant == "warning"
          ? "border border-amber-200 bg-amber-100 px-8 text-amber-600 dark:text-amber-600"
          : "",
        className
      )}
    >
      {iconName && iconPosition === "left" && (
        <Icon
          className={cn("mr-4 h-12 w-12", iconSvgClass)}
          iconName={iconName}
        />
      )}
      <span className={textClass}>{text}</span>
      {iconName && iconPosition === "right" && (
        <Icon
          className={cn("ml-4 h-12 w-12", iconSvgClass)}
          iconName={iconName}
        />
      )}
    </span>
  );

  return href ? (
    <Link href={href} target={target}>
      <ConditionalContent />
    </Link>
  ) : (
    <ConditionalContent />
  );
});

export default Badge;
