/**
* @name StatusBadge Component *
* @description
* Company - ARITS Ltd. 15th Jan 2023.
* This component is used to render a StatusBadge element shaped like a pill
@param {Array<AccordionObject>} items - Items for the accordion with the accordion data and configuration
@param {Function} setActiveIndex — Sets the index of the clicked accordion
@param {string} text — The text that goes in the badge
@param {string} variant — Color variants: primary|secondary|success|warning|danger|info
@param {boolean} outline — If true, element is not filled
@param {string} size — sizes: sm|md|lg
@param {string} iconName — Use icon sprite file: untitled-ui-sprite.svg
@param {string} iconSize — Use pixel values
@param {string} iconPos — Left or right ==> Left by default
@param {string} className — Pass any additional classes
*/

"use client";

import Icon from "@components/library/Icon";
import { ICON_NAMES } from "@library/Icon/names";
import variables from "@variables/variables.module.scss";
import { memo } from "react";

export interface StatusBadgeInterface {
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
  iconName?: (typeof ICON_NAMES)[number];
  iconSize?: string;
  iconPos?: "left" | "right";
  className?: string;
}

const StatusBadge = memo(function StatusBadge({
  text = "badge",
  variant = "neutral",
  outline = true,
  size = "sm",
  iconName = "",
  iconSize = "10",
  iconPos = "left",
  className = "",
}: StatusBadgeInterface) {
  return (
    <>
      {/* // + Sizes */}
      <span
        className={`inline-flex items-center justify-center rounded-full border text-xs
				${size == "sm" && "px-6 py-1"}
				${size == "md" && "px-8 py-2"}
				${size == "lg" && "px-12 py-3"}

				// {/* //+ Variants */}
			${
        variant == "primary"
          ? outline
            ? "border-primary-200 text-primary-500"
            : "border-primary-200 bg-primary-50 text-primary-500"
          : variant == "secondary"
          ? outline
            ? "border-secondary-400 text-secondary-400"
            : "border-secondary-400 bg-secondary-50 text-secondary-400"
          : variant == "success"
          ? outline
            ? "border-teal-300 text-teal-500"
            : "border-teal-300 bg-teal-50 text-teal-500"
          : variant == "danger"
          ? outline
            ? "border-rose-300 text-rose-500"
            : "border-rose-300 bg-rose-50 text-rose-500"
          : variant == "warning"
          ? outline
            ? "border-amber-300 text-amber-500"
            : "border-amber-300 bg-amber-50 text-amber-500"
          : variant == "info"
          ? outline
            ? "border-sky-300 text-sky-500"
            : "border-sky-300 bg-sky-50 text-sky-500"
          : variant == "neutral"
          ? outline
            ? "border-slate-300 text-slate-500"
            : "border-slate-300 bg-slate-50 text-slate-500"
          : ""
      }	

			
			
			${className}`}
      >
        {/* //+ Left Icon */}
        {/* // - Primary */}
        {iconName.length > 0 && iconPos == "left" && variant == "primary" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.primary500}
            // iconStrokeWidth={iconStrokeWidth}
            // className={`mr-6 ${isDisabled && 'hover:cursor-not-allowed'} ${btnIconColor} pointer-events-none`}
            className={`pointer-events-none mr-2`}
          />
        )}
        {/* // - Secondary */}
        {iconName.length > 0 && iconPos == "left" && variant == "secondary" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.secondary400}
            className={`pointer-events-none mr-2`}
          />
        )}
        {/* // - Success */}
        {iconName.length > 0 && iconPos == "left" && variant == "success" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.success500}
            className={`pointer-events-none mr-2`}
          />
        )}
        {/* // - Danger */}
        {iconName.length > 0 && iconPos == "left" && variant == "danger" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.danger500}
            className={`pointer-events-none mr-2`}
          />
        )}
        {/* // - Warning */}
        {iconName.length > 0 && iconPos == "left" && variant == "warning" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.warning500}
            className={`pointer-events-none mr-2`}
          />
        )}
        {/* // - Info */}
        {iconName.length > 0 && iconPos == "left" && variant == "info" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.info500}
            className={`pointer-events-none mr-2`}
          />
        )}
        {/* // - Neutral */}
        {iconName.length > 0 && iconPos == "left" && variant == "neutral" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.slate500}
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
            iconColor={variables.primary500}
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
              iconColor={variables.secondary500}
              className={`pointer-events-none ml-2`}
            />
          )}
        {/* // - Success */}
        {iconName.length > 0 && iconPos == "right" && variant == "success" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.success500}
            className={`pointer-events-none ml-2`}
          />
        )}
        {/* // - Danger */}
        {iconName.length > 0 && iconPos == "right" && variant == "danger" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.danger500}
            className={`pointer-events-none ml-2`}
          />
        )}
        {/* // - Warning */}
        {iconName.length > 0 && iconPos == "right" && variant == "warning" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.warning500}
            className={`pointer-events-none ml-2`}
          />
        )}
        {/* // - Info */}
        {iconName.length > 0 && iconPos == "right" && variant == "info" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.info500}
            className={`pointer-events-none ml-2`}
          />
        )}
        {/* // - Neutral */}
        {iconName.length > 0 && iconPos == "right" && variant == "neutral" && (
          <Icon
            iconName={iconName}
            iconSize={iconSize}
            iconColor={variables.slate500}
            className={`pointer-events-none ml-2`}
          />
        )}
      </span>
    </>
  );
});
export default StatusBadge;
