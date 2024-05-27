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
    <div className={cn(className)}>
      {hasCategoryTitle && (
        <div className="mb-4 text-sm font-medium uppercase text-slate-500">
          {categoryTitle}
        </div>
      )}
      <div
        className={cn(
          "group/card cursor-pointer rounded-lg border border-slate-200 bg-white dark:border-neutral-700 dark:bg-gray-800 p-16 hover:border-primary-400",
          className
        )}
      >
        <div className={cn(hasIcon || (hasTitle && "space-y-16"))}>
          {hasTitle && (
            <div
              className={cn(
                "flex w-full flex-col pb-8 justify-center text-sm font-medium !leading-tight tracking-tight text-slate-500 transition dark:text-white md:text-base",
                {
                  "items-center": titleAlign == "center",
                  "items-end": titleAlign == "right",
                  "items-start": !(titleAlign == "left"),
                }
              )}
            >
              {title}
            </div>
          )}
          <div className="flex flex-row items-center justify-between space-x-20">
            <div className="flex w-full flex-row items-center justify-center space-x-20">
              {/*icon start  */}
              {hasIcon &&
                (iconBgVariant == "light" ? (
                  <span
                    className={cn(
                      "inline-flex h-40 items-center rounded-md px-12 py-10",
                      {
                        "bg-green-100 text-green-600 dark:bg-green-200 dark:text-green-600":
                          variant == "success",
                        "bg-rose-100 text-rose-600 dark:bg-rose-200 dark:text-rose-600":
                          variant == "danger",
                      }
                    )}
                  >
                    <Icon iconSize="20px" iconName={iconName} />
                  </span>
                ) : (
                  <span
                    className={cn(
                      "inline-flex h-40 items-center rounded-md px-12 py-10",
                      {
                        "bg-green-500": variant == "success",
                        "bg-rose-500": variant == "danger",
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

              {/*icon end  */}
              <div className={"flex w-full flex-col space-y-8"}>
                <Suspense
                  fallback={
                    <div className="font-normal leading-3 tracking-tight text-warning-500 transition hover:text-primary-600 dark:text-white">
                      Network Error
                    </div>
                  }
                >
                  <h4 className="leading-6 tracking-tight text-primary-500 group-hover/card:text-primary-400 dark:text-white">
                    {subTitle}
                  </h4>
                </Suspense>
              </div>
              {/* title & subTitle end */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CardIndicator;
