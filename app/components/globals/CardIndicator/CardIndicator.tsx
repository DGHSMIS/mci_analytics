import { ICON_NAMES } from "@library/Icon/names";
import React, { memo, Suspense } from "react";
import { cn } from "tailwind-cn";
import dynamic from "next/dynamic";

export interface CardIndicatorsProps {
  className?: string;
  variant?: "success" | "warning" | "danger";
  hasCategoryTitle?: boolean;
  categoryTitle?: string;
  hasIcon?: boolean;
  iconName?: (typeof ICON_NAMES)[number];
  iconBgVariant?: "dark" | "light";
  hasTitle?: boolean;
  title?: string;
  titleClass?: string;
  subTitle?: string;
  titleAlign?: "left" | "center" | "right";
}
const Icon = dynamic(() => import("@library/Icon"), { ssr: true });
/**
 * @name CardIndicator
 * @description
 * * Company - ARITS Ltd. 4th Jan 2023.
 * This component is used to render a card.
 * The card can be used to display an image, title, body and a button.
 * The card can be used to link to another page.
 * @param {string} className CSS class name to be applied to the card
 * @param {string} linkURL URL to be linked to when the card is clicked
 * @param {string} variant Variant of the card
 * @param {boolean} hasCategoryTitle Whether to show the category title
 * @param {string} categoryTitle Category title of the card
 * @param {boolean} hasIcon Whether to show the icon
 * @param {string} iconName Name of the icon to be shown
 * @param {boolean} hasTitle Whether to show the title
 * @param {string} title Title of the card
 * @param {string} titleClass CSS class name to be applied to the title
 * @param {boolean} hasSubTitle Whether to show the subtitle
 * @param {string} subTitle Subtitle of the card
 * @param {string} titleAlign Alignment of the title
 * @param {boolean} hasTrend Whether to show the trend
 * @param {boolean} isTrendUp Whether the trend is up or down
 * @param {string} bottombodyBgVariant Variant of the bottom body
 * @param {boolean} showPercentage Whether to show the percentage
 * @param {string} percentageValue Percentage value to be shown
 * @param {string} bottomBodyTxt Text to be shown in the bottom body
 * @param {string} bottomIconName Name of the icon to be shown in the bottom body
 */

const CardIndicator = memo(function CardIndicator({
  className = "",
  variant = "success",

  hasCategoryTitle = false,
  categoryTitle = "Category Title",

  hasIcon = true,
  iconName = "users-01",
  iconBgVariant = "dark",

  hasTitle = true,
  title = "15,000",
  titleAlign = "left",

  titleClass = "",
  subTitle = "Registered farmers",
}: CardIndicatorsProps) {
  return (
    <div className={cn("transition-all duration-300", className)}>
      {hasCategoryTitle && (
        <div className="mb-8 text-12 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {categoryTitle}
        </div>
      )}
      <div
        className="group/card cursor-pointer rounded-12 border border-slate-100 bg-white dark:border-neutral-800 dark:bg-gray-900 p-20 shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md hover:border-primary-300"
      >
        <div className="flex flex-col gap-12">
          {hasTitle && (
            <div
              className={cn(
                "flex w-full flex-col justify-center text-13 font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 transition duration-300 group-hover/card:text-primary-500",
                {
                  "items-center text-center": titleAlign == "center",
                  "items-end text-right": titleAlign == "right",
                  "items-start text-left": titleAlign == "left" || !(titleAlign == "center" || titleAlign == "right"),
                }
              )}
            >
              {title}
            </div>
          )}
          <div className={cn("flex flex-row items-center gap-16", {
            "justify-center": titleAlign === "center",
            "justify-end": titleAlign === "right",
          })}>
            {hasIcon &&
              (iconBgVariant == "light" ? (
                <span
                  className={cn(
                    "inline-flex h-40 w-40 items-center justify-center rounded-8 p-10 transition-transform duration-300 transform group-hover/card:scale-110",
                    {
                      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400":
                        variant == "success",
                      "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400":
                        variant == "danger",
                    }
                  )}
                >
                  <Icon iconSize="20px" iconName={iconName} />
                </span>
              ) : (
                <span
                  className={cn(
                    "inline-flex h-40 w-40 items-center justify-center rounded-8 p-10 transition-transform duration-300 transform group-hover/card:scale-110",
                    {
                      "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm":
                        variant == "success",
                      "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-sm":
                        variant == "danger",
                    }
                  )}
                >
                  <Icon
                    iconSize="20px"
                    iconName={iconName}
                    iconColor="white"
                  />
                </span>
              ))}

            <div className="flex flex-col">
              <Suspense
                fallback={
                  <div className="text-14 font-medium text-warning-500 transition dark:text-white">
                    Loading...
                  </div>
                }
              >
                <h4 className="text-20 font-bold leading-tight text-slate-800 group-hover/card:text-primary dark:text-slate-100 transition-colors duration-300">
                  {subTitle}
                </h4>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CardIndicator;
