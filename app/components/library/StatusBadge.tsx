"use client";

import Icon, { IconProps } from "@components/library/Icon";
import variables from "@variables/variables.module.scss";
import { memo } from "react";
import { cn } from "tailwind-cn";
import twcolors from "tailwindcss/colors";

export interface StatusBadgeProps {
  text?: string;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral";
  outline?: boolean;
  size?: "sm" | "md" | "lg";
  iconName?: IconProps["iconName"];
  iconSize?: string;
  iconPos?: "left" | "right";
  className?: string;
}

/**
 * @name StatusBadge Component *
 * @description
 * Company - ARITS Ltd. 15th Jan 2023.
 * This component is used to render a StatusBadge element shaped like a pill
 * @param {string} text - The text that goes in the badge.
 * @property {string} variant - Color variant: primary|secondary|success|warning|danger|info.
 * @property {boolean} outline - If true, the element is not filled.
 * @property {string} size - Size options: sm|md|lg.
 * @property {string} iconName - Icon sprite file: untitled-ui-sprite.svg.
 * @property {string} iconSize - Icon size in pixel values.
 * @property {string} iconPos - Icon position: left|right (default: left).
 * @property {string} className - Additional CSS classes to apply.
 */

const StatusBadge = memo(function StatusBadge({
  text = "badge",
  variant = "neutral",
  outline = false,
  size = "sm",
  iconName = "",
  iconSize = "10",
  iconPos = "left",
  className = "",
}: StatusBadgeProps) {
  return (
    <>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full border text-xs font-medium",

          size == "sm" && "px-6 py-1",
          size == "md" && "px-8 py-2",
          size == "lg" && "px-12 py-3",

          variant == "primary"
            ? outline
              ? "border-primary-200 text-primary-500"
              : "border-primary-200 bg-primary-100 text-primary-700"
            : variant == "secondary"
            ? outline
              ? "border-secondary-400 text-secondary-500"
              : "border-secondary-400 bg-secondary-100 text-secondary-700"
            : variant == "success"
            ? outline
              ? "border-teal-300 text-teal-500"
              : "border-teal-300 bg-teal-100 text-teal-700"
            : variant == "danger"
            ? outline
              ? "border-rose-300 text-rose-500"
              : "border-rose-300 bg-rose-100 text-rose-700"
            : variant == "warning"
            ? outline
              ? "border-amber-300 text-amber-500"
              : "border-amber-300 bg-amber-100 text-amber-700"
            : variant == "info"
            ? outline
              ? "border-sky-300 text-sky-500"
              : "border-sky-300 bg-sky-100 text-sky-700"
            : variant == "neutral"
            ? outline
              ? "border-slate-300 text-slate-500"
              : "border-slate-300 bg-slate-100 text-slate-700"
            : "",
          className
        )}
      >
        {/* //+ Left Icon */}
        {/* // - Primary */}
        {iconName.length > 0 && iconPos == "left" && variant == "primary" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.primary800}
            className={`pointer-events-none mr-2`}
          />
        )}
        {/* // - Secondary */}
        {iconName.length > 0 && iconPos == "left" && variant == "secondary" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.secondary700}
            className={`pointer-events-none mr-2`}
          />
        )}
        {/* // - Success */}
        {iconName.length > 0 && iconPos == "left" && variant == "success" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.success800}
            className={`pointer-events-none mr-2`}
          />
        )}
        {/* // - Danger */}
        {iconName.length > 0 && iconPos == "left" && variant == "danger" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.danger800}
            className={`pointer-events-none mr-2`}
          />
        )}
        {/* // - Warning */}
        {iconName.length > 0 && iconPos == "left" && variant == "warning" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.warning800}
            className={`pointer-events-none mr-2`}
          />
        )}
        {/* // - Info */}
        {iconName.length > 0 && iconPos == "left" && variant == "info" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.info800}
            className={`pointer-events-none mr-2`}
          />
        )}
        {/* // - Neutral */}
        {iconName.length > 0 && iconPos == "left" && variant == "neutral" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={twcolors.slate[800]}
            className={`pointer-events-none mr-2`}
          />
        )}
        {/* //+ Badge Text */}
        {text}
        {/* //+ Right Icon */}
        {/* // - Primary */}
        {iconName.length > 0 && iconPos == "right" && variant == "primary" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.primary800}
            className={`pointer-events-none ml-2`}
          />
        )}
        {/* // - Secondary */}
        {iconName.length > 0 &&
          iconPos == "right" &&
          variant == "secondary" && (
            <Icon
              iconName={iconName}
              iconSize={iconSize}
              iconColor={variables.secondary800}
              className={`pointer-events-none ml-2`}
            />
          )}
        {/* // - Success */}
        {iconName.length > 0 && iconPos == "right" && variant == "success" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            // iconColor={variables.success800}
            iconColor={twcolors.emerald[800]}
            className={`pointer-events-none ml-2`}
          />
        )}
        {/* // - Danger */}
        {iconName.length > 0 && iconPos == "right" && variant == "danger" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            // iconColor={variables.danger800}
            iconColor={twcolors.rose[800]}
            className={`pointer-events-none ml-2`}
          />
        )}
        {/* // - Warning */}
        {iconName.length > 0 && iconPos == "right" && variant == "warning" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            // iconColor={variables.warning800}
            iconColor={twcolors.amber[800]}
            className={`pointer-events-none ml-2`}
          />
        )}
        {/* // - Info */}
        {iconName.length > 0 && iconPos == "right" && variant == "info" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            // iconColor={variables.info800}
            iconColor={twcolors.sky[800]}
            className={`pointer-events-none ml-2`}
          />
        )}
        {/* // - Neutral */}
        {iconName.length > 0 && iconPos == "right" && variant == "neutral" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={twcolors.slate[400]}
            className={`pointer-events-none ml-2`}
          />
        )}
      </span>
    </>
  );
});
export default StatusBadge;
