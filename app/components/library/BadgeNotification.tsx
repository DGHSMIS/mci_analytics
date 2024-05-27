import { memo } from "react";
import { cn } from "tailwind-cn";

export interface BadgeNotificationProps {
  count: number;
  className?: string;
}

/**
 * This component is used to render a BadgeNotification with Notification Count.
 *
 * @param {number} count Set the count number on the Badge
 * @param {string} className Pass any additional classes
 * @name BadgeNotification Component
 * @description
 * - Company - ARITS Ltd. 13th March 2023.
 */

const BadgeNotification = memo(function BadgeNotification({
  count,
  className = "",
}: BadgeNotificationProps) {
  // function classNames(...classes: Array<string>) {
  //   return classes.filter(Boolean).join(' ');
  // }
  let fontSizeClass = "w-20";
  if (count > 9) {
    fontSizeClass = "w-auto px-4";
  }

  return (
    <span
      className={cn(
        "altd-badge-notification relative ml-4 inline-flex aspect-square h-20 items-center justify-center truncate rounded-full bg-rose-600 font-mono text-[.65rem] font-semibold leading-0 text-white",
        className,
        fontSizeClass
      )}
    >
      {count}
    </span>
  );
});

export default BadgeNotification;
