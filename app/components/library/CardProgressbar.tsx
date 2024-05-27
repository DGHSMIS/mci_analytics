"use client";

import variables from "@variables/variables.module.scss";
import Link from "next/link";
import { memo } from "react";
// @ts-ignore
import SemiCircleProgressBar from "react-progressbar-semicircle";
import { cn } from "tailwind-cn";
import ProgressBar from "./form/ProgressBar";
import Icon, { IconProps } from "./Icon";

export interface CardProgressbarProps {
  className?: string;
  linkURL?: string;
  variant?: "success" | "warning" | "danger";
  hasCategoryTitle?: boolean;
  categoryTitle?: string;
  hasIcon?: boolean;
  iconName?: IconProps["iconName"];
  iconBgVariant?: "dark" | "light";
  hasTitle?: boolean;
  title?: string;
  titleClass?: string;
  subTitle?: string;
  titleAlign?: "left" | "center" | "right";
  hasSubTitle?: boolean;
  hasTrend?: boolean;
  isTrendUp?: boolean;
  hasProgressBar?: boolean;
  isSemiCircleProgressBar?: boolean;
  semiCircleFilledPercentage?: number;
  hasBottomBody?: boolean;
  bottombodyBgVariant?: "gray" | "white";
  showPercentage?: boolean;
  percentageValue?: string;
  bottomBodyTxt?: string;
  bottomIconName?: IconProps["iconName"];
}

/**
 * @name CardProgressbar
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
 * @param {boolean} hasProgressBar Whether to show the progress bar
 * @param {boolean} isSemiCircleProgressBar Whether to show the semi circle progress bar
 * @param {number} semiCircleFilledPercentage Percentage of the semi circle progress bar to be filled
 * @param {boolean} hasBottomBody Whether to show the bottom body
 * @param {string} bottombodyBgVariant Variant of the bottom body
 * @param {boolean} showPercentage Whether to show the percentage
 * @param {string} percentageValue Percentage value to be shown
 * @param {string} bottomBodyTxt Text to be shown in the bottom body
 * @param {string} bottomIconName Name of the icon to be shown in the bottom body
 */

const CardProgressbar = memo(function CardProgressbar({
  className = "",
  linkURL = "",
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
  hasSubTitle = true,
  subTitle = "Registerd farmers",

  hasTrend = true,
  isTrendUp = true,

  showPercentage = true,
  percentageValue = "40",
  hasProgressBar = false,
  isSemiCircleProgressBar = false,
  semiCircleFilledPercentage = 50,
  hasBottomBody = true,
  bottomIconName = "thumbs-down",
  bottomBodyTxt = "of total target",
  bottombodyBgVariant = "gray",
}: CardProgressbarProps) {
  return (
    <div className="altd-card-progressbar">
      {hasCategoryTitle && (
        <div className="mb-4 text-sm font-semibold uppercase text-slate-600">
          {categoryTitle}
        </div>
      )}
      <div
        className={cn(
          "rounded-lg bg-white shadow-md dark:border-gray-700 dark:bg-gray-800",
          className
        )}
      >
        <Link href={linkURL}>
          <div
            className={`${
              hasIcon || hasSubTitle || hasTitle || hasTrend ? "space-y-16" : ""
            }  p-16`}
          >
            <div className="flex flex-row items-center justify-between space-x-20">
              <div className="flex w-full flex-row space-x-20">
                {/*icon start  */}
                {hasIcon &&
                  (iconBgVariant == "light" ? (
                    <span
                      className={`${
                        variant == "success"
                          ? "bg-green-100 text-green-600 dark:bg-green-200 dark:text-green-600"
                          : variant == "danger"
                          ? "bg-rose-100 text-rose-600 dark:bg-rose-200 dark:text-rose-600"
                          : ""
                      } inline-flex h-40 items-center rounded-md px-12 py-10`}
                    >
                      <Icon iconSize="20px" iconName={iconName} />
                    </span>
                  ) : (
                    <span
                      className={`${
                        variant == "success"
                          ? "bg-green-500 "
                          : variant == "danger"
                          ? "bg-rose-500"
                          : ""
                      } inline-flex h-40 items-center rounded-md px-12 py-10`}
                    >
                      <Icon
                        iconSize="20px"
                        iconName={iconName}
                        iconColor="white"
                      />
                    </span>
                  ))}

                {/*icon end  */}
                {/* title & subTitle start */}
                <div
                  className={`flex w-full flex-col ${
                    titleAlign == "center"
                      ? "items-center"
                      : titleAlign == "right"
                      ? "items-end"
                      : "items-start"
                  } space-y-8`}
                >
                  {hasTitle && (
                    <h3
                      className={cn(
                        "font-bold leading-6 tracking-tight text-neutral-500 transition hover:text-primary-600 dark:text-white",
                        titleClass
                      )}
                    >
                      {title}
                    </h3>
                  )}
                  {hasSubTitle && (
                    <p
                      className={`text-sm font-normal leading-4 text-slate-600 dark:text-gray-400 ${
                        titleAlign == "center"
                          ? "text-center"
                          : titleAlign == "right"
                          ? "text-right"
                          : ""
                      }`}
                    >
                      {subTitle}
                    </p>
                  )}
                </div>
                {/* title & subTitle end */}
              </div>

              {hasTrend && (
                <span
                  className={`${
                    variant == "success"
                      ? "text-green-600"
                      : variant == "danger"
                      ? "text-rose-600"
                      : ""
                  }`}
                >
                  <Icon
                    // iconName='trend-up-01'
                    iconName={`${isTrendUp ? "trend-up-01" : "trend-down-01"}`}
                  />
                </span>
              )}
            </div>
            {hasProgressBar &&
              (!isSemiCircleProgressBar ? (
                <div className="my-auto flex min-w-[250px] flex-row items-center justify-center space-x-12">
                  <ProgressBar
                    progressValue={parseFloat(percentageValue)}
                    showPercentage={false}
                    customClass="h-10"
                    loadedColor={`${
                      variant == "success"
                        ? "bg-green-500"
                        : variant == "danger"
                        ? "bg-rose-500"
                        : ""
                    }`}
                    onProgress={function (e: any): void {
                      throw new Error("Function not implemented.");
                    }}
                  />

                  {showPercentage && (
                    <p className="text-sm font-normal leading-3 text-slate-600">
                      {percentageValue}%
                    </p>
                  )}
                </div>
              ) : (
                <div className="relative flex flex-col items-center justify-center">
                  <SemiCircleProgressBar
                    percentage={semiCircleFilledPercentage}
                    showPercentValue={false}
                    diameter={200}
                    stroke={
                      variant == "success"
                        ? variables.success500
                        : variant == "danger"
                        ? variables.danger500
                        : variant == "warning"
                        ? variables.warning500
                        : variables.primary500
                    }
                    strokeWidth={25}
                  />
                  <p className="absolute bottom-0 text-2xl font-semibold text-slate-500">
                    {percentageValue}%
                  </p>
                </div>
              ))}
          </div>
          {hasBottomBody && (
            <div
              className={`${
                bottombodyBgVariant == "gray" ? "bg-neutral-100" : ""
              } px-16`}
            >
              <hr />
              <div
                className={`${
                  variant == "success"
                    ? "text-green-600"
                    : variant == "danger"
                    ? "text-rose-600"
                    : ""
                } flex items-center space-x-8 py-10`}
              >
                <Icon
                  iconName={bottomIconName}
                  // iconSize="20px"
                  // iconStrokeWidth="2px"
                />
                <p className="my-auto text-sm font-medium leading-3">
                  {percentageValue}% {bottomBodyTxt}
                </p>
              </div>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
});

export default CardProgressbar;
